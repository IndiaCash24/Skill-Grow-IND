import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Heart,
  Crown,
  Trophy,
} from 'lucide-react';
import { LeaderboardUser, UserProfile } from '../types';
import {
  leaderboardToday,
  leaderboardWeekly,
  leaderboardMonthly,
  leaderboardAllTime,
} from '../data/defaultData';
import confetti from 'canvas-confetti';

interface LeaderboardPageProps {
  users?: LeaderboardUser[];
  profile: UserProfile;
  onNavigate: (view: any) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ profile, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'monthly'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [cheeredUser, setCheeredUser] = useState<string | null>(null);

  // Tab data mapping
  const getLeaderboardData = () => {
    switch (activeTab) {
      case 'today':
        return leaderboardToday;
      case 'weekly':
        return leaderboardWeekly;
      case 'monthly':
        return leaderboardMonthly;
      default:
        return leaderboardWeekly;
    }
  };

  const getDateRangeText = () => {
    switch (activeTab) {
      case 'today':
        return 'Today, 25 Aug 2026';
      case 'weekly':
        return '19 Aug 2026 - 25 Aug 2026';
      case 'monthly':
        return '01 Aug 2026 - 31 Aug 2026';
      default:
        return '19 Aug 2026 - 25 Aug 2026';
    }
  };

  const getPeriodLabel = () => {
    switch (activeTab) {
      case 'today':
        return 'Today';
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      default:
        return 'This Week';
    }
  };

  const currentUsers = getLeaderboardData();

  const filteredUsers = currentUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.package && u.package.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.state && u.state.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const top1 = currentUsers.find((u) => u.rank === 1) || currentUsers[0];
  const top2 = currentUsers.find((u) => u.rank === 2) || currentUsers[1];
  const top3 = currentUsers.find((u) => u.rank === 3) || currentUsers[2];
  
  // List for items from Rank 4 downwards
  const listUsers = filteredUsers.filter((u) => u.rank >= 4);

  const handleCheer = (name: string) => {
    setCheeredUser(name);
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#FFA500', '#22C55E', '#3B82F6'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCheeredUser(null), 2000);
  };

  return (
    <div
      id="leaderboard-page"
      className="w-full bg-[#F8FAFC] min-h-screen text-slate-900 pb-20 font-['Poppins',sans-serif] selection:bg-orange-500 selection:text-white"
    >
      {/* Top Header / App Bar (Clean White Theme) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 pt-3 pb-0 max-w-lg mx-auto shadow-2xs">
        <div className="relative flex items-center justify-center py-2.5">
          <button
            onClick={() => onNavigate('dashboard')}
            className="absolute left-0 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
            Leaderboard
          </h1>
        </div>

        {/* Tab Navigation: Today | This Week | This Month */}
        <div className="flex items-center justify-around pt-2">
          {(
            [
              { id: 'today', label: 'Today' },
              { id: 'weekly', label: 'This Week' },
              { id: 'monthly', label: 'This Month' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 pb-3 text-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#EA580C] font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#EA580C] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        {/* Title & Date Range Section */}
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#EA580C] tracking-tight">
            Top Earners
          </h2>
          <p className="text-sm font-bold text-slate-800">
            {getPeriodLabel()}
          </p>
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            {getDateRangeText()}
          </p>
        </div>

        {/* Top 3 Podium Card in White Theme */}
        <div className="relative pt-4 pb-2">
          <div className="relative z-10 flex items-end justify-center gap-2 sm:gap-4">
            
            {/* Rank #2 (Left) */}
            {top2 && (
              <div className="flex flex-col items-center flex-1 max-w-[115px] sm:max-w-[130px]">
                <div className="relative mb-2">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-white shadow-md">
                    <img
                      src={top2.avatar}
                      alt={top2.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  {/* Rank Badge #2 */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-md border-2 border-white">
                    #2
                  </div>
                </div>

                <div className="w-full bg-white border border-gray-200/90 rounded-2xl pt-3 pb-3 px-1 text-center shadow-xs">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate px-1">
                    {top2.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-extrabold text-[#EA580C] mt-0.5">
                    ₹{top2.earnings.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}

            {/* Rank #1 (Center, Prominent) */}
            {top1 && (
              <div className="flex flex-col items-center flex-1 max-w-[135px] sm:max-w-[155px] -translate-y-3">
                <div className="relative mb-2">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-orange-500 ring-4 ring-orange-100 bg-white shadow-xl">
                    <img
                      src={top1.avatar}
                      alt={top1.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  {/* Rank Badge #1 */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white font-black text-xs px-3 py-0.5 rounded-full shadow-md border-2 border-white">
                    #1
                  </div>
                </div>

                <div className="w-full bg-gradient-to-b from-orange-50/70 via-white to-white border border-orange-200/90 rounded-2xl pt-3.5 pb-3.5 px-1 text-center shadow-md">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate px-1">
                    {top1.name}
                  </h3>
                  <p className="text-sm sm:text-base font-black text-[#EA580C] mt-0.5">
                    ₹{top1.earnings.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}

            {/* Rank #3 (Right) */}
            {top3 && (
              <div className="flex flex-col items-center flex-1 max-w-[115px] sm:max-w-[130px]">
                <div className="relative mb-2">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-white shadow-md">
                    <img
                      src={top3.avatar}
                      alt={top3.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  {/* Rank Badge #3 */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-md border-2 border-white">
                    #3
                  </div>
                </div>

                <div className="w-full bg-white border border-gray-200/90 rounded-2xl pt-3 pb-3 px-1 text-center shadow-xs">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate px-1">
                    {top3.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#EA580C] mt-0.5">
                    ₹{top3.earnings.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar in White Theme */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search affiliates by name, state, or package..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-2xs transition-all"
          />
        </div>

        {/* Ranked Card List for Rank #4 and above */}
        <div className="space-y-3 pt-1">
          {listUsers.map((user) => {
            const isCheered = cheeredUser === user.name;
            return (
              <div
                key={user.rank}
                onClick={() => handleCheer(user.name)}
                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-orange-50/40 border border-gray-200/90 hover:border-orange-300 transition-all shadow-2xs hover:shadow-sm cursor-pointer"
              >
                {/* Left: Avatar + Badge + Name + Package */}
                <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 pr-2">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full overflow-hidden bg-slate-100 border border-gray-200">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    {/* Small Orange Badge on Avatar */}
                    <div className="absolute -bottom-1 -right-1 bg-[#FF6B00] text-white font-black text-[10px] sm:text-[10.5px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                      #{user.rank}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                      {user.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                      {user.package || 'PREMIUM PACKAGE'}
                    </p>
                  </div>
                </div>

                {/* Right: Earning + Status/Prime */}
                <div className="text-right shrink-0">
                  <div className="text-sm sm:text-base font-black text-[#EA580C] tracking-tight">
                    ₹{user.earnings.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-0.5">
                    <span>Prime</span>
                  </div>
                </div>

                {isCheered && (
                  <div className="absolute inset-0 bg-orange-500/10 border border-orange-400 rounded-2xl flex items-center justify-center backdrop-blur-2xs animate-fade-in pointer-events-none">
                    <span className="text-xs font-bold text-orange-700 bg-white px-3 py-1.5 rounded-full border border-orange-300 shadow-lg flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>Cheered!</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {listUsers.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching affiliates found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
