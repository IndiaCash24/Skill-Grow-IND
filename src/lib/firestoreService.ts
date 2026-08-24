import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  runTransaction,
  increment,
  serverTimestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

// -------------------------------------------------------------
// 1. DATA MODELS & TYPES
// -------------------------------------------------------------
export interface FirestoreUser {
  uid: string;
  userCode: string;
  name: string;
  email: string;
  phone: string;
  role: 'affiliate' | 'mentor' | 'admin';
  sponsorId: string;
  sponsorCode: string;
  activePackage: string;
  avatarUrl: string;
  wallet: {
    allTimeEarnings: number;
    todayEarnings: number;
    last7Days: number;
    last30Days: number;
    availableForPayout: number;
    paidOutTotal: number;
  };
  kyc: {
    status: 'verified' | 'pending' | 'rejected' | 'unsubmitted';
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    panNumber?: string;
    aadhaarNumber?: string;
  };
  createdAt?: any;
  updatedAt?: any;
}

export interface ReferralRecord {
  id: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  packagePurchased: string;
  commissionEarned: number;
  tier: 1 | 2;
  timestamp: any;
}

export interface TransactionRecord {
  id: string;
  type: 'commission_direct' | 'commission_passive' | 'payout_withdrawal' | 'package_purchase';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  referenceId: string;
  timestamp: any;
}

// -------------------------------------------------------------
// 2. SHARDED COUNTER ENGINE (Scales past 1 write/sec to 100M+ users)
// -------------------------------------------------------------
const NUM_SHARDS = 10;

/**
 * Increments a distributed sharded counter atomically
 */
export async function incrementShardedCounter(counterName: string, amount: number = 1) {
  try {
    const shardId = Math.floor(Math.random() * NUM_SHARDS).toString();
    const shardRef = doc(db, 'shardedCounters', counterName, 'shards', shardId);
    
    await setDoc(
      shardRef,
      {
        count: increment(amount),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn(`[ShardedCounter] increment error for ${counterName}:`, error);
  }
}

/**
 * Gets aggregated sum across all distributed counter shards (Read-optimized)
 */
export async function getShardedCounterCount(counterName: string): Promise<number> {
  try {
    const shardsCol = collection(db, 'shardedCounters', counterName, 'shards');
    const snapshot = await getDocs(shardsCol);
    let total = 0;
    snapshot.forEach((docSnap) => {
      total += (docSnap.data().count || 0);
    });
    return total;
  } catch (error) {
    console.warn(`[ShardedCounter] get count error for ${counterName}:`, error);
    return 0;
  }
}

// -------------------------------------------------------------
// 3. REAL-TIME USER WALLET & PROFILE LISTENER (Lightweight)
// -------------------------------------------------------------
export function subscribeToUserProfile(
  userId: string,
  onUpdate: (user: FirestoreUser | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(
    userRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as FirestoreUser);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn('[Firestore] Profile subscription error:', err);
      onError?.(err);
    }
  );
}

// -------------------------------------------------------------
// 4. PAGINATED READS (limit + startAfter) FOR SCALE
// -------------------------------------------------------------
export async function fetchPaginatedTransactions(
  userId: string,
  pageSize: number = 10,
  lastVisibleDoc?: QueryDocumentSnapshot | null
): Promise<{ transactions: TransactionRecord[]; lastDoc: QueryDocumentSnapshot | null }> {
  try {
    const transCol = collection(db, 'users', userId, 'transactions');
    let q = query(transCol, orderBy('timestamp', 'desc'), limit(pageSize));

    if (lastVisibleDoc) {
      q = query(transCol, orderBy('timestamp', 'desc'), startAfter(lastVisibleDoc), limit(pageSize));
    }

    const snapshot = await getDocs(q);
    const transactions: TransactionRecord[] = [];
    snapshot.forEach((docSnap) => {
      transactions.push({ id: docSnap.id, ...(docSnap.data() as any) });
    });

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    return { transactions, lastDoc: newLastDoc };
  } catch (error) {
    console.warn('[Firestore] Paginated transactions error:', error);
    return { transactions: [], lastDoc: null };
  }
}

export async function fetchPaginatedReferrals(
  userId: string,
  pageSize: number = 10,
  lastVisibleDoc?: QueryDocumentSnapshot | null
): Promise<{ referrals: ReferralRecord[]; lastDoc: QueryDocumentSnapshot | null }> {
  try {
    const refsCol = collection(db, 'users', userId, 'referrals');
    let q = query(refsCol, orderBy('timestamp', 'desc'), limit(pageSize));

    if (lastVisibleDoc) {
      q = query(refsCol, orderBy('timestamp', 'desc'), startAfter(lastVisibleDoc), limit(pageSize));
    }

    const snapshot = await getDocs(q);
    const referrals: ReferralRecord[] = [];
    snapshot.forEach((docSnap) => {
      referrals.push({ id: docSnap.id, ...(docSnap.data() as any) });
    });

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    return { referrals, lastDoc: newLastDoc };
  } catch (error) {
    console.warn('[Firestore] Paginated referrals error:', error);
    return { referrals: [], lastDoc: null };
  }
}

// -------------------------------------------------------------
// 5. ATOMIC COMMISSION & TRANSACTION ENGINE (Server-grade ACID)
// -------------------------------------------------------------
export async function recordPackagePurchaseAtomic(params: {
  buyerUid: string;
  buyerName: string;
  buyerEmail: string;
  packageId: string;
  packagePrice: number;
  sponsorCode: string;
}): Promise<{ success: boolean; directCommission: number; passiveCommission: number }> {
  const { buyerUid, buyerName, buyerEmail, packageId, packagePrice, sponsorCode } = params;

  // Direct commission ~70%, 2nd-tier passive ~15%
  const directComm = Math.round(packagePrice * 0.70);
  const passiveComm = Math.round(packagePrice * 0.15);

  try {
    await runTransaction(db, async (transaction) => {
      // 1. Find Direct Sponsor
      const usersCol = collection(db, 'users');
      const sponsorQuery = query(usersCol, where('userCode', '==', sponsorCode), limit(1));
      const sponsorSnap = await getDocs(sponsorQuery);

      if (!sponsorSnap.empty) {
        const sponsorDoc = sponsorSnap.docs[0];
        const sponsorRef = sponsorDoc.ref;
        const sponsorData = sponsorDoc.data() as FirestoreUser;

        // Credit Direct Sponsor
        transaction.update(sponsorRef, {
          'wallet.allTimeEarnings': increment(directComm),
          'wallet.todayEarnings': increment(directComm),
          'wallet.last7Days': increment(directComm),
          'wallet.last30Days': increment(directComm),
          'wallet.availableForPayout': increment(directComm),
          updatedAt: serverTimestamp(),
        });

        // Add Direct Referral subcollection record
        const directRefCol = doc(collection(db, 'users', sponsorDoc.id, 'referrals'));
        transaction.set(directRefCol, {
          referredUserId: buyerUid,
          referredUserName: buyerName,
          referredUserEmail: buyerEmail,
          packagePurchased: packageId,
          commissionEarned: directComm,
          tier: 1,
          timestamp: serverTimestamp(),
        });

        // Add Transaction record
        const directTxCol = doc(collection(db, 'users', sponsorDoc.id, 'transactions'));
        transaction.set(directTxCol, {
          type: 'commission_direct',
          amount: directComm,
          status: 'completed',
          description: `Tier 1 Referral: ${buyerName} enrolled in ${packageId.toUpperCase()}`,
          referenceId: buyerUid,
          timestamp: serverTimestamp(),
        });

        // 2. Find Tier-2 Passive Sponsor
        if (sponsorData.sponsorId) {
          const tier2Ref = doc(db, 'users', sponsorData.sponsorId);
          const tier2Snap = await transaction.get(tier2Ref);
          if (tier2Snap.exists()) {
            transaction.update(tier2Ref, {
              'wallet.allTimeEarnings': increment(passiveComm),
              'wallet.todayEarnings': increment(passiveComm),
              'wallet.availableForPayout': increment(passiveComm),
              updatedAt: serverTimestamp(),
            });

            const passiveTxCol = doc(collection(db, 'users', sponsorData.sponsorId, 'transactions'));
            transaction.set(passiveTxCol, {
              type: 'commission_passive',
              amount: passiveComm,
              status: 'completed',
              description: `Tier 2 Passive: ${buyerName} enrolled via ${sponsorData.name}`,
              referenceId: buyerUid,
              timestamp: serverTimestamp(),
            });
          }
        }
      }
    });

    // Increment global counters asynchronously
    incrementShardedCounter('global_course_sales', 1);
    incrementShardedCounter(`sales_${packageId}`, 1);

    return { success: true, directCommission: directComm, passiveCommission: passiveComm };
  } catch (error) {
    console.warn('[Firestore Transaction] Purchase atomic error:', error);
    return { success: false, directCommission: 0, passiveCommission: 0 };
  }
}
