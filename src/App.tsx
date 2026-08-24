import React, { useState, useEffect } from 'react';
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
import { subscribeToUserData, requestWithdrawalInFirestore } from './lib/firestoreService';

export default function App() {
  // Authentication status with localStorage persistence
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('skillgrow_is_logged_in');
    return saved === 'true';
  });

  // Navigation active view with localStorage persistence
  const [activeView, setActiveView] = useState<AppView>(() => {
    const savedView = localStorage.getItem('skillgrow_active_view') as AppView | null;
    const loggedIn = localStorage.getItem('skillgrow_is_logged_in') === 'true';
    if (savedView) {
      if (!loggedIn && savedView !== 'home' && savedView !== 'login' && savedView !== 'register' && savedView !== 'packages') {
        return 'home';
      }
      return savedView;
    }
    return 'home';
  });

  // State management with localStorage fallback
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('skillgrowind_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [earnings, setEarnings] = useState<EarningStats>(() => {
    const saved = localStorage.getItem('skillgrowind_earnings');
    return saved ? JSON.parse(saved) : initialEarnings;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('skillgrowind_transactions');
    return saved ? JSON.parse(saved) : sampleTransactions;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    const saved = localStorage.getItem('skillgrowind_withdrawals');
    return saved ? JSON.parse(saved) : initialWithdrawals;
  });

  const [packages, setPackages] = useState<PackageItem[]>(() => {
    const saved = localStorage.getItem('skillgrowind_packages');
    return saved ? JSON.parse(saved) : allPackages;
  });

  // Admin Data Collections
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>(() => {
    const saved = localStorage.getItem('skillgrowind_admin_users');
    return saved ? JSON.parse(saved) : initialAdminUsers;
  });

  const [adminOrders, setAdminOrders] = useState<AdminOrderRecord[]>(() => {
    const saved = localStorage.getItem('skillgrowind_admin_orders');
    return saved ? JSON.parse(saved) : initialAdminOrders;
  });

  const [adminKycList, setAdminKycList] = useState<AdminKycRecord[]>(() => {
    const saved = localStorage.getItem('skillgrowind_admin_kyc');
    return saved ? JSON.parse(saved) : initialAdminKycList;
  });

  const [platformLinks, setPlatformLinks] = useState<AdminPlatformLinks>(() => {
    const saved = localStorage.getItem('skillgrowind_platform_links');
    return saved ? JSON.parse(saved) : initialPlatformLinks;
  });

  const [adminBanners, setAdminBanners] = useState<AdminBanner[]>(() => {
    const saved = localStorage.getItem('skillgrowind_admin_banners');
    return saved ? JSON.parse(saved) : initialAdminBanners;
  });

  const [adminAnnouncements, setAdminAnnouncements] = useState<AdminAnnouncement[]>(() => {
    const saved = localStorage.getItem('skillgrowind_admin_announcements');
    return saved ? JSON.parse(saved) : initialAdminAnnouncements;
  });

  const [selectedCheckoutPkg, setSelectedCheckoutPkg] = useState<PackageItem>(packages[3] || allPackages[3]);

  // Modal / Drawer state
  const [activeDetailsCard, setActiveDetailsCard] = useState<
    'today' | 'sevenDays' | 'thirtyDays' | 'allTime' | 'passive' | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // View mode: 'mobile-frame' or 'fluid'
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('skillgrow_active_view', activeView);
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem('skillgrow_is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_earnings', JSON.stringify(earnings));
  }, [earnings]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_admin_orders', JSON.stringify(adminOrders));
  }, [adminOrders]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_admin_kyc', JSON.stringify(adminKycList));
  }, [adminKycList]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_platform_links', JSON.stringify(platformLinks));
  }, [platformLinks]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_admin_banners', JSON.stringify(adminBanners));
  }, [adminBanners]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_admin_announcements', JSON.stringify(adminAnnouncements));
  }, [adminAnnouncements]);

  // Firestore Real-Time Sync
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

  // Navigation Gate
  const handleNavigate = (view: AppView) => {
    if (view === 'admin') {
      const isSuperAdmin = profile.email.trim().toLowerCase() === 'surendrabusiness02@gmail.com';
      if (!isSuperAdmin) {
        setActiveView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setActiveView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'home' || view === 'login' || view === 'register' || view === 'packages') {
      setActiveView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!isLoggedIn) {
      setActiveView('login');
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
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSuccess = (userProfile: UserProfile) => {
    setIsLoggedIn(true);
    setProfile(userProfile);
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for modifying profile
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Handler for withdrawal submission
  const handleWithdrawalRequest = (amount: number, method: 'UPI' | 'Bank Transfer', destination: string) => {
    const netAmount = amount * 0.95; // 5% TDS compliance
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
  if (activeView === 'admin') {
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
          {/* Header Component */}
          {activeView !== 'login' && activeView !== 'register' && (
            <Header
              avatarUrl={profile.avatarUrl}
              activeView={activeView}
              isLoggedIn={isLoggedIn}
              userEmail={profile.email}
              onSelectView={handleNavigate}
              onOpenMenu={() => setIsSidebarOpen(true)}
              onOpenProfile={() => handleNavigate('profile')}
              onOpenLogin={() => {
                setActiveView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={handleLogout}
            />
          )}

          {/* 1. LOGIN VIEW */}
          {activeView === 'login' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => {
                setActiveView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCloseOrHome={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 2. REGISTER VIEW */}
          {activeView === 'register' && (
            <RegisterPage
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateToLogin={() => {
                setActiveView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToHome={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              initialReferralCode=""
            />
          )}

          {/* 3. HOME VIEW */}
          {activeView === 'home' && (
            <HomePage
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
              onNavigateToDashboard={() => handleNavigate('dashboard')}
              onOpenCourses={() => handleNavigate('packages')}
              onOpenLeaderboard={() => handleNavigate('leaderboard')}
            />
          )}

          {/* 4. DASHBOARD VIEW (Real Data from State & Firestore) */}
          {activeView === 'dashboard' && (
            <div className="p-3.5 sm:p-6 lg:p-8 pb-10 sm:pb-8 bg-[#F9FAFB] flex-1">
              <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                {/* Top Profile Card with Verified Badge & Edit Trigger */}
                <ProfileCard
                  profile={profile}
                  onEditProfile={() => handleNavigate('profile')}
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
          )}

          {/* 5. PACKAGES & COURSES VIEW */}
          {activeView === 'packages' && (
            <PackagesPage
              profile={profile}
              onSelectPackageForCheckout={handleSelectPackageForCheckout}
              onNavigate={handleNavigate}
            />
          )}

          {/* 6. PACKAGE CHECKOUT & ENROLL VIEW */}
          {activeView === 'checkout' && (
            <PackageCheckoutPage
              initialPackage={selectedCheckoutPkg}
              profile={profile}
              onSuccessfulEnrollment={handleSuccessfulEnrollment}
              onNavigate={handleNavigate}
            />
          )}

          {/* 7. LEADERBOARD VIEW (Today, Weekly, Monthly, All-Time) */}
          {activeView === 'leaderboard' && (
            <LeaderboardPage
              profile={profile}
              onNavigate={handleNavigate}
            />
          )}

          {/* 8. REFERRAL & DOWNLINE TEAM VIEW */}
          {activeView === 'referral' && (
            <ReferralPage
              profile={profile}
              onNavigate={handleNavigate}
            />
          )}

          {/* 9. WITHDRAWAL REQUEST VIEW */}
          {activeView === 'withdrawal' && (
            <WithdrawalPage
              profile={profile}
              earnings={earnings}
              onSubmitWithdrawal={handleWithdrawalRequest}
              onNavigate={handleNavigate}
            />
          )}

          {/* 10. WITHDRAWAL HISTORY VIEW */}
          {activeView === 'withdrawal-history' && (
            <WithdrawalHistoryPage
              withdrawals={withdrawals}
              profile={profile}
              onNavigate={handleNavigate}
            />
          )}

          {/* 11. BANK DETAILS & KYC VIEW */}
          {activeView === 'bank-kyc' && (
            <BankKycPage
              profile={profile}
              onSaveBankKyc={handleUpdateProfile}
              onNavigate={handleNavigate}
            />
          )}

          {/* 12. PROFILE & AVATAR SETTINGS VIEW */}
          {activeView === 'profile' && (
            <ProfilePage
              profile={profile}
              onSaveProfile={handleUpdateProfile}
              onNavigate={handleNavigate}
            />
          )}
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
          setActiveView('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
          onCloseOrHome={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
}
