import React from 'react';
import {
  ShoppingCart,
  LayoutDashboard,
  Home,
  LogIn,
  GraduationCap,
  Trophy,
  Share2,
  Wallet,
  ShieldCheck,
  UserPlus,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { AppView } from './SidebarDrawer';

interface HeaderProps {
  avatarUrl: string;
  activeView: AppView;
  isLoggedIn?: boolean;
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
  cartCount = 0,
  onSelectView,
  onOpenMenu,
  onOpenProfile,
  onOpenLogin,
  onLogout,
}) => {
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
    onOpenProfile();
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      onOpenLogin();
      return;
    }
    onSelectView('home');
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)]"
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
          onClick={() => onSelectView('courses')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeView === 'courses'
              ? 'bg-orange-50 text-orange-600 font-extrabold'
              : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-500" />
          <span>Courses & Packages</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('leaderboard')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeView === 'leaderboard'
              ? 'bg-orange-50 text-orange-600 font-extrabold'
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
                  ? 'bg-purple-50 text-purple-700 font-extrabold'
                  : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-purple-600" />
              <span>Affiliate Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('referral')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'referral'
                  ? 'bg-blue-50 text-blue-600 font-extrabold'
                  : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-4 h-4 text-blue-500" />
              <span>Referral Tool</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('payout')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'payout'
                  ? 'bg-amber-50 text-amber-700 font-extrabold'
                  : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-4 h-4 text-amber-600" />
              <span>Payouts</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('kyc')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'kyc'
                  ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                  : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>KYC</span>
            </button>
          </>
        )}
      </nav>

      {/* Right Controls: Quick View Switch + Cart (0) + Avatar + Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        
        {/* Quick View Switch / Login / Register Buttons */}
        {!isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <button
              id="nav-to-login-btn"
              onClick={onOpenLogin}
              type="button"
              className="inline-flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-orange-600" />
              <span>Login</span>
            </button>

            <button
              id="nav-to-register-btn"
              onClick={() => onSelectView('register')}
              type="button"
              className="hidden sm:inline-flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Free</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {activeView !== 'dashboard' ? (
              <button
                id="nav-to-dashboard-btn"
                onClick={handleDashboardClick}
                type="button"
                className="hidden sm:inline-flex items-center space-x-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                id="nav-to-home-btn"
                onClick={() => onSelectView('home')}
                type="button"
                className="hidden sm:inline-flex items-center space-x-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home Page</span>
              </button>
            )}

            {onLogout && (
              <button
                id="header-logout-btn"
                onClick={onLogout}
                type="button"
                title="Sign Out"
                className="hidden md:inline-flex items-center space-x-1 p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Circular Emblem / Avatar */}
        <button
          id="header-profile-btn"
          onClick={handleProfileClick}
          type="button"
          aria-label="View Profile"
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-orange-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-95 transition-transform bg-orange-50 flex items-center justify-center cursor-pointer"
        >
          {isLoggedIn ? (
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
              }}
            />
          ) : (
            <span className="font-extrabold text-xs text-orange-600">GK</span>
          )}
        </button>

        {/* Cart Icon with badge "0" */}
        <button
          id="header-cart-btn"
          onClick={handleCartClick}
          type="button"
          aria-label="Shopping Cart"
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
            {cartCount}
          </span>
        </button>

        {/* Hamburger Menu Button */}
        <button
          id="header-hamburger-btn"
          onClick={onOpenMenu}
          type="button"
          aria-label="Open Navigation Menu"
          className="p-2 rounded-xl text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none cursor-pointer"
        >
          <div className="w-6 h-5 flex flex-col justify-between items-center py-0.5">
            <span className="w-full h-[2.5px] bg-slate-800 rounded-full"></span>
            <span className="w-full h-[2.5px] bg-slate-800 rounded-full"></span>
            <span className="w-full h-[2.5px] bg-slate-800 rounded-full"></span>
          </div>
        </button>
      </div>
    </header>
  );
};
