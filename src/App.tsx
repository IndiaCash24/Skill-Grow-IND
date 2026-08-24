import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProfileCard } from './components/ProfileCard';
import { EarningCardsGrid } from './components/EarningCardsGrid';
import { DetailsModal } from './components/DetailsModal';
import { SidebarDrawer, AppView } from './components/SidebarDrawer';
import { CoursesPage } from './components/CoursesPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ReferralPage } from './components/ReferralPage';
import { PayoutPage } from './components/PayoutPage';
import { KycPage } from './components/KycPage';
import { SimulatorPage } from './components/SimulatorPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import {
  initialProfile,
  initialEarnings,
  sampleTransactions,
  leaderboardData,
  coursesData,
} from './data/defaultData';
import { UserProfile, EarningStats, Transaction } from './types';

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
      // If user is guest and saved view is protected, fallback to 'home' or 'login'
      if (!loggedIn && savedView !== 'home' && savedView !== 'login' && savedView !== 'register') {
        return 'home';
      }
      return savedView;
    }
    return 'home';
  });

  // State management with localStorage fallback
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('skillgrowind_profile') || localStorage.getItem('richind_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [earnings, setEarnings] = useState<EarningStats>(() => {
    const saved = localStorage.getItem('skillgrowind_earnings') || localStorage.getItem('richind_earnings');
    return saved ? JSON.parse(saved) : initialEarnings;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('skillgrowind_transactions') || localStorage.getItem('richind_transactions');
    return saved ? JSON.parse(saved) : sampleTransactions;
  });

  // Modal / Drawer state
  const [activeDetailsCard, setActiveDetailsCard] = useState<
    'today' | 'sevenDays' | 'thirtyDays' | 'allTime' | 'passive' | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // View mode: 'mobile-frame' or 'fluid' (Default to fluid for responsive desktop/laptop views)
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Seed default registered users & referral code SGIND0023 if not yet initialized
  useEffect(() => {
    try {
      const existing = localStorage.getItem('skillgrow_registered_users');
      if (!existing) {
        const defaultUsers = [
          {
            id: 'GK-154893',
            referralId: 'SGIND0023',
            name: 'Skill Grow Leader',
            email: 'admin@skillgrow.com',
            phone: '9876543210',
            state: 'Delhi NCR',
            password: 'password123',
            sponsorId: 'SGIND0001',
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem('skillgrow_registered_users', JSON.stringify(defaultUsers));
      }
    } catch {
      // ignore
    }
  }, []);

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

  // Protected View Gate
  const handleNavigate = (view: AppView) => {
    if (view === 'home' || view === 'login' || view === 'register') {
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

  // Handlers for modifying profile/earnings
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateEarnings = (updated: Partial<EarningStats>) => {
    setEarnings((prev) => ({ ...prev, ...updated }));
  };

  const handleAddTransaction = (amount: number, packageName: string, isPassive = false) => {
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      leadName: isPassive ? 'Downline Partner Sale' : 'Direct Referral Sale',
      packageName: packageName,
      amount: amount,
      type: isPassive ? 'PASSIVE_TIER_1' : 'DIRECT_COMMISSION',
      date: 'Just now',
      status: 'Completed',
    };

    setTransactions((prev) => [newTxn, ...prev]);

    setEarnings((prev) => ({
      ...prev,
      today: prev.today + amount,
      sevenDays: prev.sevenDays + amount,
      thirtyDays: prev.thirtyDays + amount,
      allTime: prev.allTime + amount,
      passiveIncome: isPassive ? prev.passiveIncome + amount : prev.passiveIncome,
      walletBalance: prev.walletBalance + amount,
    }));
  };

  const handleRequestWithdrawal = (amount: number) => {
    const newTxn: Transaction = {
      id: `WD-${Math.floor(10000 + Math.random() * 90000)}`,
      leadName: 'Self Withdrawal',
      packageName: 'Bank Payout',
      amount: amount,
      type: 'WITHDRAWAL',
      date: 'Just now',
      status: 'Completed',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setEarnings((prev) => ({
      ...prev,
      totalWithdrawn: prev.totalWithdrawn + amount,
    }));
  };

  const handleUpdateKyc = (upiId: string, bankAccount: string, ifscCode: string) => {
    setProfile((prev) => ({
      ...prev,
      upiId,
      bankAccount,
      ifscCode,
      kycStatus: 'Verified',
    }));
  };

  const handleResetToScreenshot = () => {
    setProfile(initialProfile);
    setEarnings(initialEarnings);
    setTransactions(sampleTransactions);
  };

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
          {/* Header Component (Visible across views except standalone register/login if preferred, or shown everywhere) */}
          {activeView !== 'login' && activeView !== 'register' && (
            <Header
              avatarUrl={profile.avatarUrl}
              activeView={activeView}
              isLoggedIn={isLoggedIn}
              onSelectView={handleNavigate}
              onOpenMenu={() => setIsSidebarOpen(true)}
              onOpenProfile={() => {
                handleNavigate('simulator');
              }}
              onOpenLogin={() => {
                setActiveView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 1. LOGIN VIEW (Screenshots 3) */}
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

          {/* 2. REGISTER VIEW (Screenshots 1 & 2) */}
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
              initialReferralCode="SGIND0023"
            />
          )}

          {/* 3. HOME VIEW (Public: Anyone can explore) */}
          {activeView === 'home' && (
            <HomePage
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
              onNavigateToDashboard={() => {
                handleNavigate('dashboard');
              }}
              onOpenCourses={() => {
                handleNavigate('courses');
              }}
              onOpenLeaderboard={() => {
                handleNavigate('leaderboard');
              }}
            />
          )}

          {/* 4. DASHBOARD VIEW (Protected) */}
          {activeView === 'dashboard' && (
            <div className="p-3.5 sm:p-6 lg:p-8 pb-10 sm:pb-8 bg-[#F9FAFB] flex-1">
              <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                {/* Top Profile Card with Verified Badge & Copy ID */}
                <ProfileCard
                  profile={profile}
                  onEditProfile={() => {
                    handleNavigate('simulator');
                  }}
                />

                {/* 5 Earning Metric Cards Grid */}
                <EarningCardsGrid
                  earnings={earnings}
                  onViewDetails={(cardType) => setActiveDetailsCard(cardType)}
                />
              </div>
            </div>
          )}

          {/* 5. COURSES VIEW (Protected) */}
          {activeView === 'courses' && (
            <CoursesPage
              courses={coursesData}
              profile={profile}
              onNavigate={handleNavigate}
            />
          )}

          {/* 6. LEADERBOARD VIEW (Protected) */}
          {activeView === 'leaderboard' && (
            <LeaderboardPage
              users={leaderboardData}
              profile={profile}
              onNavigate={handleNavigate}
            />
          )}

          {/* 7. REFERRAL VIEW (Protected) */}
          {activeView === 'referral' && (
            <ReferralPage
              profile={profile}
              onNavigate={handleNavigate}
            />
          )}

          {/* 8. PAYOUT VIEW (Protected) */}
          {activeView === 'payout' && (
            <PayoutPage
              profile={profile}
              earnings={earnings}
              transactions={transactions}
              onRequestWithdrawal={handleRequestWithdrawal}
              onNavigate={handleNavigate}
            />
          )}

          {/* 9. KYC VIEW (Protected) */}
          {activeView === 'kyc' && (
            <KycPage
              profile={profile}
              onUpdateKyc={handleUpdateKyc}
              onNavigate={handleNavigate}
            />
          )}

          {/* 10. SIMULATOR / PROFILE EDIT VIEW (Protected) */}
          {activeView === 'simulator' && (
            <SimulatorPage
              profile={profile}
              earnings={earnings}
              onUpdateProfile={handleUpdateProfile}
              onUpdateEarnings={handleUpdateEarnings}
              onAddTransaction={handleAddTransaction}
              onResetDefaults={handleResetToScreenshot}
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
          handleNavigate('payout');
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
        onResetDefaults={handleResetToScreenshot}
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

