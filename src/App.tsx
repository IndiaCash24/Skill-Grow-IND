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
import {
  initialProfile,
  initialEarnings,
  sampleTransactions,
  leaderboardData,
  coursesData,
} from './data/defaultData';
import { UserProfile, EarningStats, Transaction } from './types';

export default function App() {
  // Navigation active view: 'home' | 'dashboard' | 'courses' | 'leaderboard' | 'referral' | 'payout' | 'kyc' | 'simulator'
  const [activeView, setActiveView] = useState<AppView>('home');

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

  // View mode: 'mobile-frame' or 'fluid'
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('skillgrowind_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_earnings', JSON.stringify(earnings));
  }, [earnings]);

  useEffect(() => {
    localStorage.setItem('skillgrowind_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Handlers
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
              : 'max-w-4xl sm:rounded-2xl sm:shadow-lg sm:border border-gray-200 overflow-hidden'
          }`}
        >
          {/* Header Component */}
          <Header
            avatarUrl={profile.avatarUrl}
            activeView={activeView}
            onSelectView={(view) => {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenMenu={() => setIsSidebarOpen(true)}
            onOpenProfile={() => {
              setActiveView('simulator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Conditional View Rendering */}
          {activeView === 'home' && (
            <HomePage
              onNavigateToDashboard={() => {
                setActiveView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCourses={() => {
                setActiveView('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenLeaderboard={() => {
                setActiveView('leaderboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeView === 'dashboard' && (
            <div className="p-3.5 sm:p-5 pb-10 sm:pb-8 space-y-4 sm:space-y-5 bg-[#F9FAFB] flex-1">
              {/* Top Profile Card with Verified Badge & Copy ID */}
              <ProfileCard
                profile={profile}
                onEditProfile={() => {
                  setActiveView('simulator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* 5 Earning Metric Cards Grid */}
              <EarningCardsGrid
                earnings={earnings}
                onViewDetails={(cardType) => setActiveDetailsCard(cardType)}
              />
            </div>
          )}

          {activeView === 'courses' && (
            <CoursesPage
              courses={coursesData}
              profile={profile}
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeView === 'leaderboard' && (
            <LeaderboardPage
              users={leaderboardData}
              profile={profile}
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeView === 'referral' && (
            <ReferralPage
              profile={profile}
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeView === 'payout' && (
            <PayoutPage
              profile={profile}
              earnings={earnings}
              transactions={transactions}
              onRequestWithdrawal={handleRequestWithdrawal}
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeView === 'kyc' && (
            <KycPage
              profile={profile}
              onUpdateKyc={handleUpdateKyc}
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeView === 'simulator' && (
            <SimulatorPage
              profile={profile}
              earnings={earnings}
              onUpdateProfile={handleUpdateProfile}
              onUpdateEarnings={handleUpdateEarnings}
              onAddTransaction={handleAddTransaction}
              onResetDefaults={handleResetToScreenshot}
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
          setActiveView('payout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        earnings={earnings}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onResetDefaults={handleResetToScreenshot}
      />
    </div>
  );
}
