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
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { db, auth } from './firebase';
import { UserProfile, EarningStats } from '../types';

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
// 3. REAL-TIME USER WALLET & PROFILE LISTENER
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

export function subscribeToUserData(
  userCode: string,
  onProfileUpdate: (profile: Partial<UserProfile>) => void,
  onEarningsUpdate: (earnings: Partial<EarningStats>) => void
): () => void {
  try {
    const userRef = doc(db, 'users', userCode);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as FirestoreUser;
          if (data) {
            onProfileUpdate({
              name: data.name,
              email: data.email,
              phone: data.phone,
              avatarUrl: data.avatarUrl,
              packageTier: data.activePackage,
              kycStatus: data.kyc?.status === 'verified' ? 'Verified' : 'Pending',
            });
            if (data.wallet) {
              onEarningsUpdate({
                today: data.wallet.todayEarnings || 0,
                sevenDays: data.wallet.last7Days || 0,
                thirtyDays: data.wallet.last30Days || 0,
                allTime: data.wallet.allTimeEarnings || 0,
                walletBalance: data.wallet.availableForPayout || 0,
                totalWithdrawn: data.wallet.paidOutTotal || 0,
              });
            }
          }
        }
      },
      (err) => {
        console.warn('Firestore subscription notice (using local sync):', err);
      }
    );
    return unsubscribe;
  } catch {
    return () => {};
  }
}

// -------------------------------------------------------------
// 4. PAGINATED READS FOR LARGE SCALE
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

// -------------------------------------------------------------
// 5. ATOMIC COMMISSION & TRANSACTION ENGINE
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

  const directComm = Math.round(packagePrice * 0.70);
  const passiveComm = Math.round(packagePrice * 0.15);

  try {
    await runTransaction(db, async (transaction) => {
      const usersCol = collection(db, 'users');
      const sponsorQuery = query(usersCol, where('userCode', '==', sponsorCode), limit(1));
      const sponsorSnap = await getDocs(sponsorQuery);

      if (!sponsorSnap.empty) {
        const sponsorDoc = sponsorSnap.docs[0];
        const sponsorRef = sponsorDoc.ref;
        const sponsorData = sponsorDoc.data() as FirestoreUser;

        transaction.update(sponsorRef, {
          'wallet.allTimeEarnings': increment(directComm),
          'wallet.todayEarnings': increment(directComm),
          'wallet.last7Days': increment(directComm),
          'wallet.last30Days': increment(directComm),
          'wallet.availableForPayout': increment(directComm),
          updatedAt: serverTimestamp(),
        });

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

        const directTxCol = doc(collection(db, 'users', sponsorDoc.id, 'transactions'));
        transaction.set(directTxCol, {
          type: 'commission_direct',
          amount: directComm,
          status: 'completed',
          description: `Tier 1 Referral: ${buyerName} enrolled in ${packageId.toUpperCase()}`,
          referenceId: buyerUid,
          timestamp: serverTimestamp(),
        });

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

    incrementShardedCounter('global_course_sales', 1);
    incrementShardedCounter(`sales_${packageId}`, 1);

    return { success: true, directCommission: directComm, passiveCommission: passiveComm };
  } catch (error) {
    console.warn('[Firestore Transaction] Purchase atomic error:', error);
    return { success: false, directCommission: 0, passiveCommission: 0 };
  }
}

// -------------------------------------------------------------
// 6. REAL AUTHENTICATION & USER LIFECYCLE
// -------------------------------------------------------------
export async function registerUserInFirestore(params: {
  uid: string;
  name: string;
  email: string;
  phone: string;
  userCode: string;
  sponsorCode: string;
  state: string;
  password?: string;
  packageTier?: string;
}): Promise<FirestoreUser> {
  const { uid, name, email, phone, userCode, sponsorCode, state, packageTier = 'NO ACTIVE PACKAGE' } = params;

  // 1. Optionally attempt Firebase Auth sign-up / anonymous fallback
  let authUid = uid;
  try {
    if (!auth.currentUser && email && params.password) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email.toLowerCase(), params.password);
        if (userCred.user) {
          authUid = userCred.user.uid;
        }
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-in-use') {
          const userCred = await signInWithEmailAndPassword(auth, email.toLowerCase(), params.password).catch(() => null);
          if (userCred?.user) authUid = userCred.user.uid;
        } else {
          // If email/password provider is not yet enabled in user's Firebase console, fallback to anonymous auth
          const anonCred = await signInAnonymously(auth).catch(() => null);
          if (anonCred?.user) authUid = anonCred.user.uid;
        }
      }
    } else if (!auth.currentUser) {
      const anonCred = await signInAnonymously(auth).catch(() => null);
      if (anonCred?.user) authUid = anonCred.user.uid;
    } else if (auth.currentUser) {
      authUid = auth.currentUser.uid;
    }
  } catch (authError) {
    console.warn('[Firebase Auth] Notice during registration:', authError);
  }

  const newUserDoc: FirestoreUser = {
    uid: authUid,
    userCode,
    name,
    email: email.toLowerCase(),
    phone,
    role: 'affiliate',
    sponsorId: sponsorCode,
    sponsorCode,
    activePackage: packageTier,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    wallet: {
      allTimeEarnings: 0,
      todayEarnings: 0,
      last7Days: 0,
      last30Days: 0,
      availableForPayout: 0,
      paidOutTotal: 0,
    },
    kyc: {
      status: 'pending',
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    // Write document to /users/{uid}
    const userRef = doc(db, 'users', authUid);
    await setDoc(userRef, newUserDoc, { merge: true });

    // Also write document to /users/{userCode} if different (ensures instant lookup and visible SG referral ID in console)
    if (userCode && userCode !== authUid) {
      const codeRef = doc(db, 'users', userCode);
      await setDoc(codeRef, newUserDoc, { merge: true });
    }

    // Also write by user custom ID if different (e.g. SG-123456)
    if (uid && uid !== authUid && uid !== userCode) {
      const customRef = doc(db, 'users', uid);
      await setDoc(customRef, newUserDoc, { merge: true });
    }

    incrementShardedCounter('global_registered_affiliates', 1);
    console.log('[Firestore] User document successfully written to "users" collection:', authUid, userCode);
  } catch (error) {
    console.error('[Firestore] Error saving user to Firestore collection:', error);
    // If persistent local cache is active, document is cached and queued
  }

  return newUserDoc;
}

/**
 * Seeds and bootstraps initial Firestore collections (users, leaderboard, stats)
 * so that the Firestore console immediately displays all root collections.
 */
export async function seedInitialFirestoreCollections() {
  try {
    // 1. Seed Official Admin/Sponsor in 'users' collection
    const sponsorRef = doc(db, 'users', 'SGIND0023');
    await setDoc(
      sponsorRef,
      {
        uid: 'SGIND0023',
        userCode: 'SGIND0023',
        name: 'Skill Grow IND Official',
        email: 'admin@skillgrowind.com',
        phone: '+91 98765 43210',
        role: 'admin',
        sponsorId: 'DIRECT',
        sponsorCode: 'DIRECT',
        activePackage: 'PLATINUM PACKAGE',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SkillGrowOfficial',
        wallet: {
          allTimeEarnings: 0,
          todayEarnings: 0,
          last7Days: 0,
          last30Days: 0,
          passiveIncome: 0,
          availableForPayout: 0,
          paidOutTotal: 0,
        },
        kyc: {
          status: 'verified',
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // 2. Seed leaderboard collection
    const leaderboardRef = doc(db, 'leaderboard', 'today');
    await setDoc(
      leaderboardRef,
      {
        period: 'today',
        updatedAt: serverTimestamp(),
        topAffiliates: [
          { rank: 1, userId: 'SGIND0023', name: 'Surendra Kumar', earnings: 14500 },
          { rank: 2, userId: 'SGIND9912', name: 'Rahul Sharma', earnings: 11200 },
          { rank: 3, userId: 'SGIND5521', name: 'Pooja Verma', earnings: 8900 },
        ],
      },
      { merge: true }
    );

    console.log('[Firestore] Default collections and user seeded successfully in Firestore.');
  } catch (err) {
    console.warn('[Firestore] Notice during initial collection seeding:', err);
  }
}

export async function fetchUserByCredential(identifier: string): Promise<FirestoreUser | null> {
  const clean = identifier.trim();
  try {
    const usersRef = collection(db, 'users');

    if (clean.includes('@')) {
      const qEmail = query(usersRef, where('email', '==', clean.toLowerCase()), limit(1));
      const snap = await getDocs(qEmail);
      if (!snap.empty) {
        return snap.docs[0].data() as FirestoreUser;
      }
    }

    const qCode = query(usersRef, where('userCode', '==', clean.toUpperCase()), limit(1));
    const snapCode = await getDocs(qCode);
    if (!snapCode.empty) {
      return snapCode.docs[0].data() as FirestoreUser;
    }

    const qPhone = query(usersRef, where('phone', '==', clean), limit(1));
    const snapPhone = await getDocs(qPhone);
    if (!snapPhone.empty) {
      return snapPhone.docs[0].data() as FirestoreUser;
    }

    const directDoc = await getDoc(doc(db, 'users', clean));
    if (directDoc.exists()) {
      return directDoc.data() as FirestoreUser;
    }

    return null;
  } catch (error) {
    console.warn('[Firestore] fetchUserByCredential error:', error);
    return null;
  }
}

export async function submitKycToFirestore(
  userIdOrData:
    | string
    | {
        userId: string;
        userName?: string;
        panNumber?: string;
        aadhaarNumber?: string;
        bankAccount?: string;
        ifscCode?: string;
        bankName?: string;
        upiId?: string;
      },
  kycDataArg?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    panNumber?: string;
    aadhaarNumber?: string;
  }
): Promise<boolean> {
  try {
    let targetUserId = '';
    let bankName = '';
    let accountNumber = '';
    let ifscCode = '';
    let upiId = '';
    let panNumber = '';
    let aadhaarNumber = '';

    if (typeof userIdOrData === 'string') {
      targetUserId = userIdOrData;
      bankName = kycDataArg?.bankName || '';
      accountNumber = kycDataArg?.accountNumber || '';
      ifscCode = kycDataArg?.ifscCode || '';
      upiId = kycDataArg?.upiId || '';
      panNumber = kycDataArg?.panNumber || '';
      aadhaarNumber = kycDataArg?.aadhaarNumber || '';
    } else {
      targetUserId = userIdOrData.userId;
      bankName = userIdOrData.bankName || '';
      accountNumber = userIdOrData.bankAccount || '';
      ifscCode = userIdOrData.ifscCode || '';
      upiId = userIdOrData.upiId || '';
      panNumber = userIdOrData.panNumber || '';
      aadhaarNumber = userIdOrData.aadhaarNumber || '';
    }

    const userRef = doc(db, 'users', targetUserId);
    await updateDoc(userRef, {
      'kyc.bankName': bankName,
      'kyc.accountNumber': accountNumber,
      'kyc.ifscCode': ifscCode,
      'kyc.upiId': upiId,
      'kyc.panNumber': panNumber,
      'kyc.aadhaarNumber': aadhaarNumber,
      'kyc.status': 'verified',
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.warn('[Firestore] submitKyc error:', error);
    return false;
  }
}

export async function requestWithdrawalInFirestore(
  userId: string,
  amount: number,
  method: 'UPI' | 'Bank Transfer' | 'IMPS_BANK',
  destination: string
): Promise<boolean> {
  try {
    const payoutRef = doc(collection(db, 'payoutRequests'));
    await setDoc(payoutRef, {
      payoutId: payoutRef.id,
      userId,
      amount,
      payoutMethod: method,
      destination,
      status: 'completed',
      requestedAt: serverTimestamp(),
      completedAt: serverTimestamp(),
    });

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'wallet.availableForPayout': increment(-amount),
      'wallet.paidOutTotal': increment(amount),
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.warn('[Firestore] requestWithdrawal error:', error);
    return false;
  }
}

export async function createPayoutRequestInFirestore(params: {
  userId: string;
  userName: string;
  userCode: string;
  amount: number;
  payoutMethod: string;
  destination: string;
}): Promise<boolean> {
  return requestWithdrawalInFirestore(
    params.userId || params.userCode,
    params.amount,
    params.payoutMethod as any,
    params.destination
  );
}

/**
 * Admin utility: Directly updates all metrics of a user's Earning Dashboard in Firestore
 * including today, 7 days, 30 days, all time, passive, wallet balance and total withdrawn.
 */
export async function updateUserEarningsInFirestore(
  identifier: string,
  walletUpdates: {
    todayEarnings?: number;
    last7Days?: number;
    last30Days?: number;
    allTimeEarnings?: number;
    passiveIncome?: number;
    availableForPayout?: number;
    paidOutTotal?: number;
  }
): Promise<boolean> {
  const clean = identifier.trim();
  try {
    const usersRef = collection(db, 'users');
    const updatePayload: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (walletUpdates.todayEarnings !== undefined) updatePayload['wallet.todayEarnings'] = Number(walletUpdates.todayEarnings);
    if (walletUpdates.last7Days !== undefined) updatePayload['wallet.last7Days'] = Number(walletUpdates.last7Days);
    if (walletUpdates.last30Days !== undefined) updatePayload['wallet.last30Days'] = Number(walletUpdates.last30Days);
    if (walletUpdates.allTimeEarnings !== undefined) updatePayload['wallet.allTimeEarnings'] = Number(walletUpdates.allTimeEarnings);
    if (walletUpdates.passiveIncome !== undefined) updatePayload['wallet.passiveIncome'] = Number(walletUpdates.passiveIncome);
    if (walletUpdates.availableForPayout !== undefined) updatePayload['wallet.availableForPayout'] = Number(walletUpdates.availableForPayout);
    if (walletUpdates.paidOutTotal !== undefined) updatePayload['wallet.paidOutTotal'] = Number(walletUpdates.paidOutTotal);

    // Try direct document update
    const directDoc = doc(db, 'users', clean);
    const snap = await getDoc(directDoc);
    if (snap.exists()) {
      await updateDoc(directDoc, updatePayload);
      console.log('[Firestore] User wallet updated directly:', clean);
      return true;
    }

    // Try finding by userCode or email
    const qCode = query(usersRef, where('userCode', '==', clean.toUpperCase()), limit(1));
    const snapCode = await getDocs(qCode);
    if (!snapCode.empty) {
      await updateDoc(snapCode.docs[0].ref, updatePayload);
      console.log('[Firestore] User wallet updated by userCode:', clean);
      return true;
    }

    if (clean.includes('@')) {
      const qEmail = query(usersRef, where('email', '==', clean.toLowerCase()), limit(1));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        await updateDoc(snapEmail.docs[0].ref, updatePayload);
        console.log('[Firestore] User wallet updated by email:', clean);
        return true;
      }
    }

    // If doc doesn't exist yet, create it with these wallet values
    await setDoc(directDoc, {
      uid: clean,
      userCode: clean,
      wallet: {
        todayEarnings: walletUpdates.todayEarnings || 0,
        last7Days: walletUpdates.last7Days || 0,
        last30Days: walletUpdates.last30Days || 0,
        allTimeEarnings: walletUpdates.allTimeEarnings || 0,
        passiveIncome: walletUpdates.passiveIncome || 0,
        availableForPayout: walletUpdates.availableForPayout || 0,
        paidOutTotal: walletUpdates.paidOutTotal || 0,
      },
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return true;
  } catch (err) {
    console.warn('[Firestore] updateUserEarnings error:', err);
    return false;
  }
}

