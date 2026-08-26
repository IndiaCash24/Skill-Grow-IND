import React from 'react';
import {
  LayoutDashboard,
  Home,
  LogIn,
  BookOpen,
  Trophy,
  Share2,
  Wallet,
  ShieldCheck,
  UserPlus,
  LogOut,
  ShoppingBag,
  History,
  CreditCard,
  User,
  ArrowDownLeft,
  ShieldAlert,
  Flame,
  Crown,
} from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  avatarUrl: string;
  activeView: AppView;
  isLoggedIn?: boolean;
  userEmail?: string;
  cartCount?: number;
  onSelectView: (view: AppView) => void;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  avatarUrl,
  activeView,
  isLoggedIn = false,
  userEmail,
  cartCount = 0,
  onSelectView,
  onOpenMenu,
  onOpenProfile,
  onOpenLogin,
  onLogout,
}) => {
  const cleanEmail = (userEmail || '').trim().toLowerCase();
  const isAdmin =
    cleanEmail === 'surendrabusiness02@gmail.com' ||
    cleanEmail === 'admin@skillgrowind.com' ||
    cleanEmail.includes('surendrabusiness02');
  const handleDashboardClick = () => {
    if (!isLoggedIn) {
      onOpenLogin();
      return;
    }
    onSelectView('dashboard');
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      onOpenLogin();
      return;
    }
    onSelectView('profile');
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] font-['Poppins',sans-serif]"
    >
      {/* Left: Brand Logo & Tagline */}
      <div
        onClick={() => onSelectView('home')}
        className="flex items-center space-x-3 cursor-pointer select-none group"
      >
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <div className="font-['Poppins'] font-black text-xl sm:text-2xl lg:text-3xl tracking-tight leading-none">
              <span className="text-orange-500">Skill</span>
              <span className="text-slate-900 ml-1">Grow</span>
            </div>
            <span className="text-[10px] sm:text-xs font-extrabold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-xs">
              IND
            </span>
          </div>
          <span className="text-[8.5px] sm:text-[10px] text-gray-500 italic font-serif tracking-tight leading-none mt-0.5">
            Earn knowledge ! Earn money
          </span>
        </div>
      </div>

      {/* Center: Desktop Navigation Links (Visible on Laptop / Desktop `lg:` screens) */}
      <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs font-bold text-slate-700">
        <button
          type="button"
          onClick={() => onSelectView('home')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeView === 'home'
              ? 'bg-orange-50 text-orange-600 font-extrabold'
              : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4 text-orange-500" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('flash')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeView === 'flash'
              ? 'bg-amber-50 text-amber-700 font-extrabold border border-amber-300'
              : 'hover:bg-amber-50/60 text-slate-700 hover:text-amber-700'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <span>Flash Hub</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('packages')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeView === 'packages'
              ? 'bg-emerald-50 text-emerald-700 font-extrabold'
              : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>Packages</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('checkout')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeView === 'checkout'
              ? 'bg-purple-50 text-purple-700 font-extrabold'
              : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-purple-600" />
          <span>Enroll</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('leaderboard')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeView === 'leaderboard'
              ? 'bg-amber-50 text-amber-700 font-extrabold'
              : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Leaderboard</span>
        </button>

        {isLoggedIn && (
          <>
            <button
              type="button"
              onClick={handleDashboardClick}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-pink-50 text-pink-700 font-extrabold'
                  : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-pink-600" />
              <span>Affiliate Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('referral')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'referral'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>My Team</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('withdrawal')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'withdrawal'
                  ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                  : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              <span>Withdrawal</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => onSelectView('admin')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-slate-900 text-white font-extrabold shadow-sm'
                    : 'hover:bg-slate-100 text-slate-900 font-extrabold border border-slate-200/80 bg-slate-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-orange-500" />
                <span>Admin Panel</span>
              </button>
            )}
          </>
        )}
      </nav>

      {/* Right: Actions, Profile Avatar & Mobile Hamburger */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {isLoggedIn ? (
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Go to Dashboard Button on Desktop */}
            <button
              type="button"
              onClick={handleDashboardClick}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Affiliate Dashboard</span>
            </button>

            {/* Profile Avatar Button */}
            <div
              id="header-profile-avatar-btn"
              onClick={handleProfileClick}
              className="relative cursor-pointer group flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="My Profile & Settings"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-sm">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border border-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            </div>

            {/* Quick Mobile Admin Button */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => onSelectView('admin')}
                className="lg:hidden flex items-center space-x-1 bg-slate-900 text-amber-300 text-[10px] font-black px-2.5 py-1.5 rounded-xl border border-amber-400/40 shadow-xs cursor-pointer active:scale-95"
                title="Super Admin Panel"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenLogin}
            className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login / Register</span>
          </button>
        )}

        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          id="menu-toggle-btn"
          type="button"
          onClick={onOpenMenu}
          aria-label="Open Navigation Menu"
          className="p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200 shadow-2xs"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className="w-full h-0.5 bg-slate-800 rounded-full"></span>
            <span className="w-full h-0.5 bg-slate-800 rounded-full"></span>
            <span className="w-full h-0.5 bg-slate-800 rounded-full"></span>
          </div>
        </button>
      </div>
    </header>
  );
};
