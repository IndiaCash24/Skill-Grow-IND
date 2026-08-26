import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProfileCard } from './components/ProfileCard';
import { EarningCardsGrid } from './components/EarningCardsGrid';
import { DetailsModal } from './components/DetailsModal';
import { SidebarDrawer } from './components/SidebarDrawer';
import { ProfilePage } from './components/ProfilePage';
import { WithdrawalPage } from './components/WithdrawalPage';
import { WithdrawalHistoryPage } from './components/WithdrawalHistoryPage';
import { PackagesPage } from './components/PackagesPage';
import { PackageCheckoutPage } from './components/PackageCheckoutPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ReferralPage } from './components/ReferralPage';
import { BankKycPage } from './components/BankKycPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { AdminPage } from './components/admin/AdminPage';
import { FlashPage } from './components/FlashPage';
import {
  initialProfile,
  initialEarnings,
  sampleTransactions,
  initialWithdrawals,
  allPackages,
  initialAdminUsers,
  initialAdminOrders,
  initialAdminKycList,
  initialPlatformLinks,
  initialAdminBanners,
  initialAdminAnnouncements,
} from './data/defaultData';
import {
  UserProfile,
  EarningStats,
  Transaction,
  WithdrawalRecord,
  PackageItem,
  AppView,
  AdminUserRecord,
  AdminOrderRecord,
  AdminKycRecord,
  AdminPlatformLinks,
  AdminBanner,
  AdminAnnouncement,
} from './types';
import {
  subscribeToUserData,
  requestWithdrawalInFirestore,
  seedInitialFirestoreCollections,
  updateUserEarningsInFirestore,
  fetchUserByCredential,
  logoutUserFromFirebase,
} from './lib/firestoreService';

export default function App() {
  // Pure Real-Database Authentication State (No localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<AppView>('login');
  const [isAuthInitializing, setIsAuthInitializing] = useState<boolean>(true);

  // Application Data States
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [earnings, setEarnings] = useState<EarningStats>(initialEarnings);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(initialWithdrawals);
  const [packages, setPackages] = useState<PackageItem[]>(allPackages);

  // Admin Data Collections
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>(initialAdminUsers);
  const [adminOrders, setAdminOrders] = useState<AdminOrderRecord[]>(initialAdminOrders);
  const [adminKycList, setAdminKycList] = useState<AdminKycRecord[]>(initialAdminKycList);
  const [platformLinks, setPlatformLinks] = useState<AdminPlatformLinks>(initialPlatformLinks);
  const [adminBanners, setAdminBanners] = useState<AdminBanner[]>(initialAdminBanners);
  const [adminAnnouncements, setAdminAnnouncements] = useState<AdminAnnouncement[]>(initialAdminAnnouncements);

  const [selectedCheckoutPkg, setSelectedCheckoutPkg] = useState<PackageItem>(allPackages[3]);

  // Modal / Drawer state
  const [activeDetailsCard, setActiveDetailsCard] = useState<
    'today' | 'sevenDays' | 'thirtyDays' | 'allTime' | 'passive' | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // View mode: 'mobile-frame' or 'fluid'
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // 1. Seed initial Firestore collections and official accounts on startup
  useEffect(() => {
    seedInitialFirestoreCollections();
  }, []);

  // 2. Firebase Auth State Listener & Real Database Profile Fetch
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userIdentifier = firebaseUser.email || firebaseUser.uid;
          const fsUser = await fetchUserByCredential(userIdentifier);

          if (fsUser) {
            const liveProfile: UserProfile = {
              name: fsUser.name || 'Skill Grow Affiliate',
              referralId: fsUser.userCode || 'SGIND0023',
              packageTier: fsUser.activePackage || 'NO ACTIVE PACKAGE',
              avatarUrl: fsUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fsUser.name || 'Affiliate')}`,
              email: fsUser.email || firebaseUser.email || '',
              phone: fsUser.phone || '',
              joinDate: 'Active Member',
              sponsorName: 'Skill Grow Team',
              sponsorId: fsUser.sponsorCode || 'SGIND0023',
              kycStatus: fsUser.kyc?.status === 'verified' ? 'Verified' : 'Pending',
              upiId: fsUser.kyc?.upiId || '',
              bankAccount: fsUser.kyc?.accountNumber ? `•••• ${fsUser.kyc.accountNumber.slice(-4)}` : '',
              ifscCode: fsUser.kyc?.ifscCode || '',
            };

            setProfile(liveProfile);

            if (fsUser.wallet) {
              setEarnings({
                today: fsUser.wallet.todayEarnings || 0,
                sevenDays: fsUser.wallet.last7Days || 0,
                thirtyDays: fsUser.wallet.last30Days || 0,
                allTime: fsUser.wallet.allTimeEarnings || 0,
                passiveIncome: fsUser.wallet.passiveIncome || 0,
                walletBalance: fsUser.wallet.availableForPayout || 0,
                totalWithdrawn: fsUser.wallet.paidOutTotal || 0,
              });
            }

            setIsLoggedIn(true);
            setActiveView((prev) => (prev === 'login' || prev === 'register' ? 'home' : prev));
          } else {
            // Document not found yet, wait for explicit user login
            setIsLoggedIn(false);
            setActiveView('login');
          }
        } catch (err) {
          console.warn('[Firebase Auth] Error fetching live user profile:', err);
          setIsLoggedIn(false);
          setActiveView('login');
        }
      } else {
        setIsLoggedIn(false);
        setActiveView('login');
      }
      setIsAuthInitializing(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // 3. Firestore Real-Time Listener for User Profile & Wallet Updates
  useEffect(() => {
    if (isLoggedIn && profile.referralId) {
      const unsubscribe = subscribeToUserData(
        profile.referralId,
        (dbProfile) => {
          setProfile((prev) => ({ ...prev, ...dbProfile }));
        },
        (dbEarnings) => {
          setEarnings((prev) => ({ ...prev, ...dbEarnings }));
        }
      );
      return () => unsubscribe();
    }
  }, [isLoggedIn, profile.referralId]);

  // Strict Navigation Gate: Unauthenticated users CANNOT visit Home, Dashboard, or any protected pages
  const handleNavigate = (view: AppView) => {
    // If not logged in, only allow 'login' or 'register'
    if (!isLoggedIn) {
      if (view === 'register') {
        setActiveView('register');
      } else {
        setActiveView('login');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Admin view permission gate
    if (view === 'admin') {
      const cleanEmail = (profile.email || '').trim().toLowerCase();
      const cleanRef = (profile.referralId || '').trim().toUpperCase();
      const isSuperAdmin =
        cleanEmail === 'surendrabusiness02@gmail.com' ||
        cleanEmail === 'admin@skillgrowind.com' ||
        cleanEmail.includes('surendrabusiness02') ||
        cleanRef === 'SGIND0023';

      if (!isSuperAdmin) {
        setActiveView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setActiveView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequireLogin = () => {
    setActiveView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userProfile?: UserProfile) => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    if (userProfile) {
      setProfile(userProfile);
    }
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSuccess = (userProfile: UserProfile) => {
    setIsLoggedIn(true);
    setProfile(userProfile);
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logoutUserFromFirebase();
    setIsLoggedIn(false);
    setProfile(initialProfile);
    setEarnings(initialEarnings);
    setActiveView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for modifying profile
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Handler for withdrawal submission
  const handleWithdrawalRequest = (amount: number, method: 'UPI' | 'Bank Transfer', destination: string) => {
    const newRecord: WithdrawalRecord = {
      id: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: amount,
      status: 'Pending',
      requestedAt: 'Today, Just now',
      payoutMethod: method,
      destination: destination,
    };

    const newTxn: Transaction = {
      id: `TXN-WD-${Math.floor(10000 + Math.random() * 90000)}`,
      leadName: 'Direct Bank Settlement',
      packageName: `${method} Payout`,
      amount: amount,
      type: 'WITHDRAWAL',
      date: 'Just now',
      status: 'Pending',
    };

    setWithdrawals((prev) => [newRecord, ...prev]);
    setTransactions((prev) => [newTxn, ...prev]);

    setEarnings((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - amount),
    }));

    // Submit to Firestore
    requestWithdrawalInFirestore(profile.referralId || 'SGIND0023', amount, method, destination).catch((err) => {
      console.warn('Firestore withdrawal sync error:', err);
    });
  };

  // Handler for package checkout select
  const handleSelectPackageForCheckout = (pkg: PackageItem) => {
    setSelectedCheckoutPkg(pkg);
    handleNavigate('checkout');
  };

  // Handler for successful enrollment
  const handleSuccessfulEnrollment = (pkg: PackageItem) => {
    setProfile((prev) => ({
      ...prev,
      packageTier: pkg.name,
    }));

    const newTxn: Transaction = {
      id: `TXN-ENR-${Math.floor(10000 + Math.random() * 90000)}`,
      leadName: 'Self Course Enrollment',
      packageName: pkg.name,
      amount: pkg.price,
      type: 'DIRECT_COMMISSION',
      date: 'Just now',
      status: 'Completed',
    };

    setTransactions((prev) => [newTxn, ...prev]);
  };

  // Admin Mutations Handlers
  const handleAdminUpdateUser = (updatedUser: AdminUserRecord) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    // If currently logged-in user earnings were changed, update real-time earning dashboard
    if (
      profile.referralId?.toUpperCase() === updatedUser.userCode?.toUpperCase() ||
      profile.email?.toLowerCase() === updatedUser.email?.toLowerCase()
    ) {
      setEarnings((prev) => ({
        ...prev,
        today: updatedUser.todayEarnings !== undefined ? updatedUser.todayEarnings : prev.today,
        sevenDays: updatedUser.sevenDaysEarnings !== undefined ? updatedUser.sevenDaysEarnings : prev.sevenDays,
        thirtyDays: updatedUser.thirtyDaysEarnings !== undefined ? updatedUser.thirtyDaysEarnings : prev.thirtyDays,
        allTime: updatedUser.allTimeEarnings !== undefined ? updatedUser.allTimeEarnings : prev.allTime,
        passiveIncome: updatedUser.passiveIncome !== undefined ? updatedUser.passiveIncome : prev.passiveIncome,
        walletBalance: updatedUser.walletBalance !== undefined ? updatedUser.walletBalance : prev.walletBalance,
        totalWithdrawn: updatedUser.totalWithdrawn !== undefined ? updatedUser.totalWithdrawn : prev.totalWithdrawn,
      }));
    }

    // Sync directly with Firestore
    updateUserEarningsInFirestore(updatedUser.userCode || updatedUser.id, {
      todayEarnings: updatedUser.todayEarnings,
      last7Days: updatedUser.sevenDaysEarnings,
      last30Days: updatedUser.thirtyDaysEarnings,
      allTimeEarnings: updatedUser.allTimeEarnings,
      passiveIncome: updatedUser.passiveIncome,
      availableForPayout: updatedUser.walletBalance,
      paidOutTotal: updatedUser.totalWithdrawn,
    });
  };

  const handleAdminAddUser = (newUser: AdminUserRecord) => {
    setAdminUsers((prev) => [newUser, ...prev]);
  };

  const handleAdminUpdateOrderStatus = (orderId: string, newStatus: AdminOrderRecord['status']) => {
    setAdminOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handleAdminApprovePayout = (payoutId: string, utrNumber: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === payoutId
          ? {
              ...w,
              status: 'Completed',
              completedAt: 'Today, Just now',
              utrNumber,
            }
          : w
      )
    );
  };

  const handleAdminRejectPayout = (payoutId: string, reason: string) => {
    const target = withdrawals.find((w) => w.id === payoutId);
    if (target) {
      setEarnings((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + target.amount,
      }));
    }

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === payoutId
          ? {
              ...w,
              status: 'Rejected',
            }
          : w
      )
    );
  };

  const handleAdminBatchApproveAllPayouts = () => {
    const nowUtr = `IMPS${Date.now().toString().slice(-8)}`;
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.status === 'Pending'
          ? {
              ...w,
              status: 'Completed',
              completedAt: 'Today, Settled Batch',
              utrNumber: nowUtr,
            }
          : w
      )
    );
  };

  const handleAdminApproveKyc = (kycId: string) => {
    setAdminKycList((prev) =>
      prev.map((k) => (k.id === kycId ? { ...k, status: 'Verified', rejectionReason: undefined } : k))
    );
  };

  const handleAdminRejectKyc = (kycId: string, reason: string) => {
    setAdminKycList((prev) =>
      prev.map((k) => (k.id === kycId ? { ...k, status: 'Rejected', rejectionReason: reason } : k))
    );
  };

  const handleAdminUpdatePackage = (pkg: PackageItem) => {
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? pkg : p)));
  };

  const handleAdminAddPackage = (pkg: PackageItem) => {
    setPackages((prev) => [...prev, pkg]);
  };

  const handleAdminSaveLinks = (links: AdminPlatformLinks) => {
    setPlatformLinks(links);
  };

  const handleAdminUpdateBanner = (banner: AdminBanner) => {
    setAdminBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
  };

  const handleAdminAddBanner = (banner: AdminBanner) => {
    setAdminBanners((prev) => [banner, ...prev]);
  };

  const handleAdminDeleteBanner = (bannerId: string) => {
    setAdminBanners((prev) => prev.filter((b) => b.id !== bannerId));
  };

  const handleAdminAddAnnouncement = (ann: AdminAnnouncement) => {
    setAdminAnnouncements((prev) => [ann, ...prev]);
  };

  const handleAdminDeleteAnnouncement = (annId: string) => {
    setAdminAnnouncements((prev) => prev.filter((a) => a.id !== annId));
  };

  // If in dedicated admin view
  if (isLoggedIn && activeView === 'admin') {
    return (
      <AdminPage
        users={adminUsers}
        orders={adminOrders}
        withdrawals={withdrawals}
        kycList={adminKycList}
        packages={packages}
        platformLinks={platformLinks}
        banners={adminBanners}
        announcements={adminAnnouncements}
        onNavigateHome={() => handleNavigate('home')}
        onUpdateUser={handleAdminUpdateUser}
        onAddUser={handleAdminAddUser}
        onUpdateOrderStatus={handleAdminUpdateOrderStatus}
        onApprovePayout={handleAdminApprovePayout}
        onRejectPayout={handleAdminRejectPayout}
        onBatchApproveAllPayouts={handleAdminBatchApproveAllPayouts}
        onApproveKyc={handleAdminApproveKyc}
        onRejectKyc={handleAdminRejectKyc}
        onUpdatePackage={handleAdminUpdatePackage}
        onAddPackage={handleAdminAddPackage}
        onSaveLinks={handleAdminSaveLinks}
        onUpdateBanner={handleAdminUpdateBanner}
        onAddBanner={handleAdminAddBanner}
        onDeleteBanner={handleAdminDeleteBanner}
        onAddAnnouncement={handleAdminAddAnnouncement}
        onDeleteAnnouncement={handleAdminDeleteAnnouncement}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] sm:bg-[#EAEDF2] flex flex-col font-['Poppins',sans-serif] selection:bg-orange-500 selection:text-white">
      {/* Main Content Container */}
      <main className="flex-1 flex justify-center items-start p-0 sm:p-4 md:py-6">
        <div
          id="main-app-container"
          className={`w-full bg-[#FFFFFF] transition-all duration-300 flex flex-col ${
            isMobileFrame
              ? 'max-w-[430px] sm:min-h-[840px] sm:rounded-[36px] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] sm:border-[8px] sm:border-slate-800 overflow-hidden'
              : 'max-w-7xl sm:rounded-2xl sm:shadow-xl sm:border border-gray-200/80 overflow-hidden min-h-[90vh]'
          }`}
        >
          {/* Header Component - Displayed for Authenticated Users */}
          {isLoggedIn && activeView !== 'login' && activeView !== 'register' && (
            <Header
              avatarUrl={profile.avatarUrl}
              activeView={activeView}
              isLoggedIn={isLoggedIn}
              userEmail={profile.email}
              onSelectView={handleNavigate}
              onOpenMenu={() => setIsSidebarOpen(true)}
              onOpenProfile={() => handleNavigate('profile')}
              onOpenLogin={() => handleNavigate('login')}
              onLogout={handleLogout}
            />
          )}

          {/* 1. LOGIN VIEW (Authentication Gate) */}
          {(!isLoggedIn && activeView !== 'register') || activeView === 'login' ? (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => {
                setActiveView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : activeView === 'register' ? (
            /* 2. REGISTER VIEW */
            <RegisterPage
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateToLogin={() => {
                setActiveView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              initialReferralCode=""
            />
          ) : activeView === 'home' ? (
            /* 3. HOME VIEW (Protected - only for registered/logged in users) */
            <HomePage
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
              onNavigateToDashboard={() => handleNavigate('dashboard')}
              onOpenCourses={() => handleNavigate('packages')}
              onOpenLeaderboard={() => handleNavigate('leaderboard')}
            />
          ) : activeView === 'flash' ? (
            /* FLASH PAGE VIEW (Fast-Track Hub & Featured Packages) */
            <FlashPage
              profile={profile}
              earnings={earnings}
              onNavigate={handleNavigate}
              onSelectPackageForCheckout={handleSelectPackageForCheckout}
            />
          ) : activeView === 'dashboard' ? (
            /* 4. DASHBOARD VIEW (Real Data from Live Firestore) */
            <div className="p-3.5 sm:p-6 lg:p-8 pb-10 sm:pb-8 bg-[#F9FAFB] flex-1">
              <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                {/* Top Profile Card with Verified Badge & Edit Trigger */}
                <ProfileCard
                  profile={profile}
                  onEditProfile={() => handleNavigate('profile')}
                  onNavigateToAdmin={() => handleNavigate('admin')}
                />

                {/* 5 Earning Metric Cards Grid */}
                <EarningCardsGrid
                  earnings={earnings}
                  onViewDetails={(cardType) => setActiveDetailsCard(cardType)}
                />

                {/* Fast Action Shortcuts Banner */}
                <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-black text-slate-900 text-sm sm:text-base">
                      Affiliate Quick Actions
                    </h3>
                    <p className="text-xs text-gray-500">
                      Request payouts, view curriculum packages, or copy your sponsor link.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavigate('withdrawal')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Request Withdrawal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigate('referral')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      My Referral Link
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigate('packages')}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      View Packages
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeView === 'packages' ? (
            /* 5. PACKAGES & COURSES VIEW */
            <PackagesPage
              profile={profile}
              onSelectPackageForCheckout={handleSelectPackageForCheckout}
              onNavigate={handleNavigate}
            />
          ) : activeView === 'checkout' ? (
            /* 6. PACKAGE CHECKOUT & ENROLL VIEW */
            <PackageCheckoutPage
              initialPackage={selectedCheckoutPkg}
              profile={profile}
              onSuccessfulEnrollment={handleSuccessfulEnrollment}
              onNavigate={handleNavigate}
            />
          ) : activeView === 'leaderboard' ? (
            /* 7. LEADERBOARD VIEW */
            <LeaderboardPage
              profile={profile}
              onNavigate={handleNavigate}
            />
          ) : activeView === 'referral' ? (
            /* 8. REFERRAL & DOWNLINE TEAM VIEW */
            <ReferralPage
              profile={profile}
              onNavigate={handleNavigate}
            />
          ) : activeView === 'withdrawal' ? (
            /* 9. WITHDRAWAL REQUEST VIEW */
            <WithdrawalPage
              profile={profile}
              earnings={earnings}
              onSubmitWithdrawal={handleWithdrawalRequest}
              onNavigate={handleNavigate}
            />
          ) : activeView === 'withdrawal-history' ? (
            /* 10. WITHDRAWAL HISTORY VIEW */
            <WithdrawalHistoryPage
              withdrawals={withdrawals}
              profile={profile}
              onNavigate={handleNavigate}
            />
          ) : activeView === 'bank-kyc' ? (
            /* 11. BANK DETAILS & KYC VIEW */
            <BankKycPage
              profile={profile}
              onSaveBankKyc={handleUpdateProfile}
              onNavigate={handleNavigate}
            />
          ) : activeView === 'profile' ? (
            /* 12. PROFILE & AVATAR SETTINGS VIEW */
            <ProfilePage
              profile={profile}
              onSaveProfile={handleUpdateProfile}
              onNavigate={handleNavigate}
            />
          ) : null}
        </div>
      </main>

      {/* Modals and Drawers */}
      <DetailsModal
        cardType={activeDetailsCard}
        earnings={earnings}
        transactions={transactions}
        onClose={() => setActiveDetailsCard(null)}
        onRequestPayout={() => {
          setActiveDetailsCard(null);
          handleNavigate('withdrawal');
        }}
      />

      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        isLoggedIn={isLoggedIn}
        onSelectView={handleNavigate}
        onOpenLogin={() => {
          setIsSidebarOpen(false);
          handleNavigate('login');
        }}
        onLogout={handleLogout}
        profile={profile}
        earnings={earnings}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Optional Login Modal Overlay */}
      {isLoginModalOpen && (
        <LoginPage
          isModal
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => {
            setIsLoginModalOpen(false);
            setActiveView('register');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
