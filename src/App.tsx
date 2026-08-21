import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileCard } from './components/ProfileCard';
import { EarningCardsGrid } from './components/EarningCardsGrid';
import { DetailsModal } from './components/DetailsModal';
import { SidebarDrawer } from './components/SidebarDrawer';
import { SimulatorModal } from './components/SimulatorModal';
import { PayoutModal } from './components/PayoutModal';
import { ReferralModal } from './components/ReferralModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { CoursesModal } from './components/CoursesModal';
import { KycModal } from './components/KycModal';
import { PullToRefresh } from './components/PullToRefresh';
import {
  initialProfile,
  initialEarnings,
  sampleTransactions,
  leaderboardData,
  coursesData,
} from './data/defaultData';
import { UserProfile, EarningStats, Transaction } from './types';

export default function App() {
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

  // Swipe refresh counter key (re-triggers count-up animation without wiping data)
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Modal / Drawer state
  const [activeDetailsCard, setActiveDetailsCard] = useState<
    'today' | 'sevenDays' | 'thirtyDays' | 'allTime' | 'passive' | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isKycOpen, setIsKycOpen] = useState(false);

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

  const handleSwipeRefresh = async () => {
    // Simulate real-time sync delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Trigger the smooth 6-second boom count up with the current updated profile & earnings
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-['Poppins',sans-serif] selection:bg-pink-500 selection:text-white">
      {/* Main Content Area */}
      <main className="flex-1 flex justify-center items-start p-0 sm:p-4 md:py-6">
        <div
          id="main-app-container"
          className={`w-full bg-white transition-all duration-300 flex flex-col ${
            isMobileFrame
              ? 'max-w-[430px] h-[92vh] max-h-[900px] sm:rounded-[36px] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] sm:border-[8px] sm:border-slate-800 overflow-hidden'
              : 'max-w-4xl min-h-[85vh] sm:rounded-2xl sm:shadow-lg sm:border border-gray-200 overflow-hidden'
          }`}
        >
          {/* Header Component */}
          <Header
            avatarUrl={profile.avatarUrl}
            onOpenMenu={() => setIsSidebarOpen(true)}
            onOpenProfile={() => setIsSimulatorOpen(true)}
          />

          {/* Pull to Refresh Container */}
          <PullToRefresh onRefresh={handleSwipeRefresh}>
            {/* Main Dashboard Screen View */}
            <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5 bg-[#F9FAFB]">
              {/* Top Profile Card with Ribbon & Copy ID */}
              <ProfileCard
                profile={profile}
                onEditProfile={() => setIsSimulatorOpen(true)}
              />

              {/* 5 Earning Metric Cards Grid */}
              <EarningCardsGrid
                earnings={earnings}
                refreshKey={refreshKey}
                onViewDetails={(cardType) => setActiveDetailsCard(cardType)}
              />
            </div>
          </PullToRefresh>
        </div>
      </main>

      {/* Modals and Drawers */}
      <DetailsModal
        cardType={activeDetailsCard}
        earnings={earnings}
        transactions={transactions}
        onClose={() => setActiveDetailsCard(null)}
        onRequestPayout={() => setIsPayoutOpen(true)}
      />

      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        earnings={earnings}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onResetDefaults={handleResetToScreenshot}
        onRefresh={handleSwipeRefresh}
        onOpenReferral={() => setIsReferralOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenCourses={() => setIsCoursesOpen(true)}
        onOpenPayout={() => setIsPayoutOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenKyc={() => setIsKycOpen(true)}
      />

      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        profile={profile}
        earnings={earnings}
        onUpdateProfile={handleUpdateProfile}
        onUpdateEarnings={handleUpdateEarnings}
        onAddTransaction={handleAddTransaction}
      />

      <PayoutModal
        isOpen={isPayoutOpen}
        onClose={() => setIsPayoutOpen(false)}
        profile={profile}
        earnings={earnings}
        onRequestWithdrawal={handleRequestWithdrawal}
      />

      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        profile={profile}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        users={leaderboardData}
      />

      <CoursesModal
        isOpen={isCoursesOpen}
        onClose={() => setIsCoursesOpen(false)}
        courses={coursesData}
      />

      <KycModal
        isOpen={isKycOpen}
        onClose={() => setIsKycOpen(false)}
        profile={profile}
        onUpdateKyc={handleUpdateKyc}
      />
    </div>
  );
}
