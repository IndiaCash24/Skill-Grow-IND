import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Medal,
  Award,
  Crown,
  Search,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Share2,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { LeaderboardUser, UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface LeaderboardPageProps {
  users: LeaderboardUser[];
  profile: UserProfile;
  onNavigate: (view: any) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ users, profile, onNavigate }) => {
  const [timeframe, setTimeframe] = useState<'today' | '7days' | '30days' | 'alltime'>('alltime');
  const [searchQuery, setSearchQuery] = useState('');
  const [cheeredUser, setCheeredUser] = useState<string | null>(null);

  // Multipliers for different timeframes to give realistic dynamic figures
  const getMultiplier = (tf: string) => {
    switch (tf) {
      case 'today': return 0.08;
      case '7days': return 0.28;
      case '30days': return 0.65;
      default: return 1.0;
    }
  };

  const currentMultiplier = getMultiplier(timeframe);

  const displayedUsers = users
    .map((u) => ({
      ...u,
      adjustedEarnings: Math.round(u.earnings * currentMultiplier),
    }))
    .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const top1 = displayedUsers[0];
  const top2 = displayedUsers[1];
  const top3 = displayedUsers[2];
  const restUsers = displayedUsers.slice(3);

  const handleCheer = (name: string) => {
    setCheeredUser(name);
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#10B981'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCheeredUser(null), 2500);
  };

  return (
    <div id="leaderboard-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-bold">
              <Crown className="w-3.5 h-3.5 text-yellow-300" />
              <span>Skill Grow Hall of Fame</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center space-x-2">
              <span>All India Leaderboard</span>
              <Flame className="w-5 h-5 text-yellow-200 animate-bounce" />
            </h1>
            <p className="text-xs sm:text-sm text-orange-100">
              Honoring India's top performing affiliate champions making daily high-ticket commissions.
            </p>
          </div>

          {/* Timeframe Selectors */}
          <div className="flex space-x-2 pt-2 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'today', label: "Today's Earnings" },
                { id: '7days', label: 'Last 7 Days' },
                { id: '30days', label: 'Last 30 Days' },
                { id: 'alltime', label: 'All-Time Champions' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  timeframe === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Top 3 Podium Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-1 mb-6">
            <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
              Top 3 Achievers
            </span>
            <h3 className="text-lg font-black tracking-tight">National Podium Winners</h3>
          </div>

          <div className="flex items-end justify-center space-x-2 sm:space-x-6 pt-6 pb-2">
            
            {/* Rank 2 - Silver */}
            {top2 && (
              <div className="flex flex-col items-center flex-1 max-w-[110px] sm:max-w-[130px]">
                <div className="relative mb-2">
                  <img
                    src={top2.avatar}
                    alt={top2.name}
                    className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-3 border-slate-300 object-cover shadow-lg"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-slate-300 text-slate-900 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                    2
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-full text-center">
                  {top2.name}
                </h4>
                <p className="text-[11px] font-extrabold text-slate-300">
                  ₹{top2.adjustedEarnings.toLocaleString('en-IN')}
                </p>
                <div className="w-full bg-slate-800/80 rounded-t-xl py-2 mt-2 text-center border-t border-slate-700 text-[10px] font-bold text-slate-400">
                  Silver Tier
                </div>
              </div>
            )}

            {/* Rank 1 - Gold Champion */}
            {top1 && (
              <div className="flex flex-col items-center flex-1 max-w-[130px] sm:max-w-[160px] -translate-y-4">
                <Crown className="w-7 h-7 text-amber-400 animate-pulse mb-1" />
                <div className="relative mb-2">
                  <img
                    src={top1.avatar}
                    alt={top1.name}
                    className="w-18 h-18 sm:w-22 sm:h-22 rounded-full border-4 border-amber-400 ring-4 ring-amber-400/30 object-cover shadow-2xl"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                    1
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-white truncate max-w-full text-center">
                  {top1.name}
                </h4>
                <p className="text-xs sm:text-sm font-black text-amber-400">
                  ₹{top1.adjustedEarnings.toLocaleString('en-IN')}
                </p>
                <div className="w-full bg-gradient-to-t from-amber-600/40 to-amber-500/20 rounded-t-xl py-3 mt-2 text-center border-t border-amber-400 text-[11px] font-black text-amber-300 shadow">
                  🏆 Champion
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {top3 && (
              <div className="flex flex-col items-center flex-1 max-w-[110px] sm:max-w-[130px]">
                <div className="relative mb-2">
                  <img
                    src={top3.avatar}
                    alt={top3.name}
                    className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-3 border-amber-700 object-cover shadow-lg"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-700 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                    3
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-full text-center">
                  {top3.name}
                </h4>
                <p className="text-[11px] font-extrabold text-amber-200">
                  ₹{top3.adjustedEarnings.toLocaleString('en-IN')}
                </p>
                <div className="w-full bg-amber-950/60 rounded-t-xl py-2 mt-2 text-center border-t border-amber-800 text-[10px] font-bold text-amber-500">
                  Bronze Tier
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Search and User Rank Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-slate-900">
              National Leaderboard Rankings
            </h3>
            <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
              Live Sync
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by affiliate name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Roshni's Current Position Card */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shrink-0">
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black uppercase tracking-wide">{profile.name}</span>
                <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">YOU</span>
              </div>
              <p className="text-[11px] text-pink-100">National Affiliate Rank: #14</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-pink-100 font-medium">Your Total Earnings</p>
            <p className="text-sm sm:text-base font-black text-white">
              ₹{profile.earnings.allTime.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* All Remaining Affiliates List */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs divide-y divide-gray-100 overflow-hidden">
          {displayedUsers.map((user, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={user.id}
                className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-7 text-center font-black text-sm ${
                      rank === 1
                        ? 'text-amber-500'
                        : rank === 2
                        ? 'text-slate-400'
                        : rank === 3
                        ? 'text-amber-700'
                        : 'text-gray-400'
                    }`}
                  >
                    #{rank}
                  </span>

                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>{user.name}</span>
                      {rank <= 5 && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Skill Grow IND Partner · {user.package}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-extrabold text-emerald-600">
                      ₹{user.adjustedEarnings.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium">Earned</span>
                  </div>

                  <button
                    onClick={() => handleCheer(user.name)}
                    className="hidden sm:inline-flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{cheeredUser === user.name ? 'Cheered! 🎉' : 'Cheer 👏'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
