import React, { useState, useEffect } from 'react';
import {
  Zap,
  TrendingUp,
  Award,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  Users,
  Wallet,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  Share2,
  Crown,
  Building2,
  Flame,
} from 'lucide-react';
import { UserProfile, EarningStats, PackageItem, AppView } from '../types';
import { allPackages } from '../data/defaultData';
import confetti from 'canvas-confetti';

interface FlashPageProps {
  profile: UserProfile;
  earnings: EarningStats;
  onNavigate: (view: AppView) => void;
  onSelectPackageForCheckout: (pkg: PackageItem) => void;
}

export const FlashPage: React.FC<FlashPageProps> = ({
  profile,
  earnings,
  onNavigate,
  onSelectPackageForCheckout,
}) => {
  const isAdmin = profile.email?.trim().toLowerCase() === 'surendrabusiness02@gmail.com';

  // Live Flash Countdown Timer for daily flash rewards
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F97316', '#F59E0B', '#10B981', '#6366F1'],
      });
    } catch {
      // ignore
    }
  };

  const flashFeaturedPackages = allPackages.slice(1, 5); // Gold, Diamond, Platinum, Master

  return (
    <div id="main-flash-page" className="w-full bg-[#FDFBF7] min-h-screen text-slate-900 font-['Poppins',sans-serif] pb-16">
      
      {/* 1. Super Admin VIP Banner if logged in as Admin */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-3.5 sm:p-4 border-b border-amber-500/30">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Super Admin Console Active
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.2 rounded-full">
                    {profile.email}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Full command control over users, commission settlements, packages & payouts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <span>Launch Admin Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Flash Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle background glow circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span>SKILL GROW IND • FLASH HUB</span>
            </div>

            {/* Flash Live Countdown */}
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-4 py-1.5 rounded-2xl text-xs font-mono">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-gray-400 font-sans text-[11px]">Daily Fast-Track Ends In:</span>
              <span className="font-black text-amber-400">
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
              Fast-Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">Skill Grow Earnings</span> Today
            </h1>
            <p className="text-slate-300 text-xs sm:text-base font-medium leading-relaxed">
              India's premier digital affiliate platform. Learn in-demand high-income digital skills, earn up to 70% direct commissions, and receive real-time same-day bank payouts.
            </p>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <span className="text-gray-400 text-[11px] block font-semibold uppercase">Total Paid Out</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">₹ 15.8 Crore+</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <span className="text-gray-400 text-[11px] block font-semibold uppercase">Active Learners</span>
              <span className="text-lg sm:text-xl font-black text-amber-400">5,25,000+</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <span className="text-gray-400 text-[11px] block font-semibold uppercase">Direct Commission</span>
              <span className="text-lg sm:text-xl font-black text-pink-400">Up to 70%</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <span className="text-gray-400 text-[11px] block font-semibold uppercase">Payout Speed</span>
              <span className="text-lg sm:text-xl font-black text-indigo-300">Same-Day IMPS</span>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open My Earning Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('packages')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold rounded-2xl backdrop-blur-xs transition-all flex items-center space-x-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Browse All Skill Packages</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('withdrawal')}
              className="px-6 py-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Request Fast Payout (₹{earnings.walletBalance.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Flash Fast-Navigation Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Dashboard */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-pink-600 transition-colors">
              Earning Dashboard
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Live earnings: <span className="font-bold text-emerald-600">₹{earnings.allTime.toLocaleString('en-IN')}</span>
            </p>
          </div>

          {/* Card 2: Packages */}
          <div
            onClick={() => onNavigate('packages')}
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
              Course Packages
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              6 Certified Skill Bundles
            </p>
          </div>

          {/* Card 3: Team / Referral */}
          <div
            onClick={() => onNavigate('referral')}
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
              Referral Hub
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              ID: <span className="font-bold text-slate-800">{profile.referralId}</span>
            </p>
          </div>

          {/* Card 4: Leaderboard */}
          <div
            onClick={() => onNavigate('leaderboard')}
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
              Top Leaderboard
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Top Affiliates of the Month
            </p>
          </div>

        </div>
      </div>

      {/* 4. Trending High-Ticket Packages Flash Showcase */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Highest Converting Bundles</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
              Flash Featured Packages
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('packages')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 hover:underline cursor-pointer"
          >
            <span>View All 6 Packages</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {flashFeaturedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase bg-slate-900 text-white px-2.5 py-0.5 rounded-full">
                    {pkg.badge}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ₹{pkg.directCommission} Direct
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {pkg.tagline}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-black text-slate-900">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{pkg.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium">
                    Passive: <span className="font-bold text-purple-700">₹{pkg.passiveCommission}</span> / sale
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50/80 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    triggerConfetti();
                    onSelectPackageForCheckout(pkg);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Enroll Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Official Trust & Guarantee Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine ISO-Aligned Digital Academy</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase">
              Start Learning & Earning in Minutes
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Access HD video courses, live Q&A sessions, dedicated mentorship groups, and 24x7 customer support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="px-6 py-3 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-md hover:bg-gray-100 transition-colors text-center cursor-pointer"
            >
              My Profile Settings
            </button>
            <button
              type="button"
              onClick={() => onNavigate('bank-kyc')}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors text-center cursor-pointer"
            >
              Verify KYC Bank Details
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
