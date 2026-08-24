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
  Zap,
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
  const [timeframe, setTimeframe] = useState<'today' | 'weekly' | 'monthly' | 'alltime'>('alltime');
  const [searchQuery, setSearchQuery] = useState('');
  const [cheeredUser, setCheeredUser] = useState<string | null>(null);

  // Get current active leaderboard list based on timeframe
  const getLeaderboardList = () => {
    switch (timeframe) {
      case 'today':
        return leaderboardToday;
      case 'weekly':
        return leaderboardWeekly;
      case 'monthly':
        return leaderboardMonthly;
      case 'alltime':
      default:
        return leaderboardAllTime;
    }
  };

  const rawUsers = getLeaderboardList();

  const displayedUsers = rawUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top1 = displayedUsers.find((u) => u.rank === 1) || displayedUsers[0];
  const top2 = displayedUsers.find((u) => u.rank === 2) || displayedUsers[1];
  const top3 = displayedUsers.find((u) => u.rank === 3) || displayedUsers[2];
  const restUsers = displayedUsers.filter((u) => u.rank > 3);

  // Find user's rank in current period
  const userRankEntry = rawUsers.find((u) => u.name.includes('(You)') || u.name.toLowerCase().includes(profile.name.toLowerCase()));

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
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-bold">
              <Crown className="w-3.5 h-3.5 text-yellow-300" />
              <span>Skill Grow Hall of Fame</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center space-x-2">
              <span>All India National Leaderboard</span>
              <Flame className="w-5 h-5 text-yellow-200 animate-bounce" />
            </h1>
            <p className="text-xs sm:text-sm text-orange-100">
              Real-time rankings of top earners across India for Today, Weekly, Monthly, and All-Time.
            </p>
          </div>

          {/* Timeframe Selectors */}
          <div className="flex space-x-2 pt-2 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'today', label: "Today's Rank", icon: Flame },
                { id: 'weekly', label: 'Last 7 Days (Weekly)', icon: Zap },
                { id: 'monthly', label: 'Last 30 Days (Monthly)', icon: TrendingUp },
                { id: 'alltime', label: 'All-Time Champions', icon: Trophy },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTimeframe(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                    timeframe === tab.id
                      ? 'bg-white text-orange-600 shadow-sm scale-105'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* User's Live Position Banner in current timeframe */}
        {userRankEntry && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-indigo-500/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md shrink-0">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-sm text-white">{profile.name} (Your Rank)</h4>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    Rank #{userRankEntry.rank}
                  </span>
                </div>
                <p className="text-xs text-indigo-200">
                  Timeframe: <span className="font-bold text-white uppercase">{timeframe}</span> | State: {profile.state || 'Delhi NCR'}
                </p>
              </div>
            </div>

            <div className="text-right flex items-center gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Earned in this Period</span>
                <span className="text-xl font-black text-amber-400">
                  ₹ {userRankEntry.earnings.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-1 mb-6">
            <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
              Top 3 Achievers • {timeframe.toUpperCase()}
            </span>
            <h3 className="text-lg font-black tracking-tight">National Podium Champions</h3>
          </div>

          <div className="flex items-end justify-center space-x-2 sm:space-x-6 pt-6 pb-2">
            {/* Rank 2 - Silver */}
            {top2 && (
              <div className="flex flex-col items-center flex-1 max-w-[130px] sm:max-w-[160px] text-center space-y-2">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-slate-400 via-gray-200 to-slate-400 shadow-md">
                    <img
                      src={top2.avatar}
                      alt={top2.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 bg-slate-300 text-slate-900 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                    2
                  </div>
                </div>

                <div className="space-y-0.5 w-full">
                  <h4 className="font-bold text-xs truncate">{top2.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{top2.state}</p>
                  <div className="bg-white/10 px-2 py-1 rounded-lg text-xs font-black text-slate-200">
                    ₹ {top2.earnings.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="w-full bg-slate-800/80 rounded-t-2xl h-20 sm:h-24 flex items-center justify-center border-t border-slate-700">
                  <Medal className="w-6 h-6 text-slate-300" />
                </div>
              </div>
            )}

            {/* Rank 1 - Gold (Center, Taller) */}
            {top1 && (
              <div className="flex flex-col items-center flex-1 max-w-[150px] sm:max-w-[180px] text-center space-y-2 relative -top-3">
                <div className="relative">
                  <Crown className="w-8 h-8 text-yellow-400 absolute -top-7 left-1/2 -translate-x-1/2 animate-bounce" />
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-lg ring-4 ring-amber-400/30">
                    <img
                      src={top1.avatar}
                      alt={top1.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 font-black text-sm w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                    1
                  </div>
                </div>

                <div className="space-y-0.5 w-full">
                  <h4 className="font-black text-xs sm:text-sm text-yellow-300 truncate">{top1.name}</h4>
                  <p className="text-[10px] text-amber-200 truncate">{top1.state}</p>
                  <div className="bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black text-yellow-300">
                    ₹ {top1.earnings.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="w-full bg-gradient-to-b from-amber-600/60 to-amber-700/80 rounded-t-2xl h-28 sm:h-36 flex items-center justify-center border-t border-amber-400/50 shadow-inner">
                  <Trophy className="w-8 h-8 text-yellow-300" />
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {top3 && (
              <div className="flex flex-col items-center flex-1 max-w-[130px] sm:max-w-[160px] text-center space-y-2">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-800 shadow-md">
                    <img
                      src={top3.avatar}
                      alt={top3.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 bg-amber-600 text-white font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                    3
                  </div>
                </div>

                <div className="space-y-0.5 w-full">
                  <h4 className="font-bold text-xs truncate">{top3.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{top3.state}</p>
                  <div className="bg-white/10 px-2 py-1 rounded-lg text-xs font-black text-amber-400">
                    ₹ {top3.earnings.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="w-full bg-slate-800/80 rounded-t-2xl h-16 sm:h-20 flex items-center justify-center border-t border-slate-700">
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search & List for Ranks 4+ */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              National Rankings (4 – 20)
            </h3>
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or state..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-500 outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            {restUsers.map((user) => {
              const isCurrentUser = user.name.includes('(You)');
              return (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isCurrentUser
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200'
                      : 'bg-white hover:bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="w-7 text-center font-black text-slate-500 text-xs sm:text-sm">
                      #{user.rank}
                    </span>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center space-x-1.5">
                        <span>{user.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {user.package} • {user.state}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-slate-900 block">
                      ₹ {user.earnings.toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCheer(user.name)}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 inline-flex items-center space-x-0.5"
                    >
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                      <span>{cheeredUser === user.name ? 'Cheered! 🎉' : 'Cheer 👏'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
