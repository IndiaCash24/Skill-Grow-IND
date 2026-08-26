import React from 'react';
import {
  X,
  Home,
  LayoutDashboard,
  BookOpen,
  Trophy,
  Link2,
  CreditCard,
  History,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  Smartphone,
  LogOut,
  User,
  ArrowDownLeft,
  ShoppingBag,
  Users,
  CheckCircle2,
  Award,
  ShieldAlert,
  Flame,
  Crown,
} from 'lucide-react';
import { UserProfile, EarningStats, AppView } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  earnings: EarningStats;
  activeView: AppView;
  isLoggedIn?: boolean;
  isMobileFrame: boolean;
  onSelectView: (view: AppView) => void;
  onToggleMobileFrame: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  earnings,
  activeView,
  isLoggedIn = true,
  isMobileFrame,
  onSelectView,
  onToggleMobileFrame,
  onOpenLogin,
  onLogout,
}) => {
  if (!isOpen) return null;

  const isAdmin = profile?.email?.trim().toLowerCase() === 'surendrabusiness02@gmail.com';

  const navigateTo = (view: AppView) => {
    onSelectView(view);
    onClose();
  };

  const hasActivePackage = profile?.packageTier && 
    profile.packageTier.toUpperCase() !== 'NO ACTIVE PACKAGE' && 
    profile.packageTier.toUpperCase() !== 'NONE' && 
    profile.packageTier.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Poppins',sans-serif]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Right-Side Sliding Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-10 pointer-events-auto">
        <div className="w-80 sm:w-88 bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-all duration-300 ease-in-out border-l border-gray-100 animate-slide-in-right">
          
          {/* Header Brand */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center space-x-2">
              <div className="font-['Poppins'] font-black text-lg sm:text-xl tracking-tight leading-none">
                <span className="text-orange-500">Skill</span>
                <span className="text-white ml-1">Grow</span>
              </div>
              <span className="text-[10px] font-extrabold bg-orange-500 text-white px-1.5 py-0.5 rounded shadow-xs">
                IND
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Card in Drawer */}
          {isLoggedIn ? (
            <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
              <div className="flex items-center space-x-3">
                <div
                  onClick={() => navigateTo('profile')}
                  className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-indigo-500 cursor-pointer shrink-0"
                  title="Click to edit profile"
                >
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white bg-indigo-900"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&clothing=blazerAndShirt&facialHair=beardLight';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-bold text-sm text-white truncate">{profile.name}</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">ID: {profile.referralId}</p>
                  {hasActivePackage ? (
                    <span className="inline-block mt-0.5 text-[9px] font-extrabold bg-purple-500/30 text-purple-300 border border-purple-400/30 px-2 py-0.2 rounded-full">
                      {profile.packageTier}
                    </span>
                  ) : (
                    <span className="inline-block mt-0.5 text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.2 rounded-full">
                      No Active Package
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-gray-300">Wallet Balance:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  ₹ {earnings.walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 font-bold text-sm">
                  SG
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Guest Visitor</h4>
                  <p className="text-[11px] text-gray-400">Join 5.25L+ Skill Grow Students</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold py-2 rounded-xl text-center shadow-md active:scale-95 transition-all"
              >
                Login / Register Now
              </button>
            </div>
          )}

          {/* Clean Navigation Menu Items */}
          <div className="p-4 space-y-1.5 flex-1">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Main Dashboard
            </p>

            {/* 1. Home Link */}
            <button
              id="menu-home-link"
              onClick={() => navigateTo('home')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors text-left ${
                activeView === 'home'
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-gray-700 hover:bg-gray-100 font-medium'
              }`}
            >
              <Home className={`w-4 h-4 ${activeView === 'home' ? 'text-orange-600' : 'text-slate-600'}`} />
              <span>Home Page</span>
            </button>

            {/* Flash Hub Link */}
            <button
              id="menu-flash-link"
              onClick={() => navigateTo('flash')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors text-left ${
                activeView === 'flash'
                  ? 'bg-amber-50 text-amber-700 border border-amber-300'
                  : 'text-amber-900 bg-amber-50/60 hover:bg-amber-100/80'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <div className="flex-1 flex items-center justify-between">
                <span>Flash Hub (Fast-Track)</span>
                <span className="text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-black uppercase">
                  Hot
                </span>
              </div>
            </button>

            {/* 2. Earning Dashboard Link */}
            <button
              id="menu-dashboard-link"
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors text-left ${
                activeView === 'dashboard'
                  ? 'bg-pink-50 text-pink-600 border border-pink-200 shadow-xs'
                  : 'text-gray-800 hover:bg-pink-50/70 hover:text-pink-600 font-bold bg-pink-50/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-pink-600" />
              <div className="flex-1 flex items-center justify-between">
                <span>Earning Dashboard</span>
                <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold">
                  Live
                </span>
              </div>
            </button>

            <p className="px-3 pt-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Courses & Affiliates
            </p>

            {/* 3. Packages & Courses */}
            <button
              id="menu-packages-link"
              onClick={() => navigateTo('packages')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors text-left ${
                activeView === 'packages'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>All Packages & Details</span>
            </button>

            {/* 4. Checkout & Enroll */}
            <button
              id="menu-checkout-link"
              onClick={() => navigateTo('checkout')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors text-left ${
                activeView === 'checkout'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-purple-600" />
              <span>Enroll / Checkout</span>
            </button>

            {/* 5. Referrals & Team */}
            <button
              id="menu-referral-link"
              onClick={() => navigateTo('referral')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors text-left ${
                activeView === 'referral'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Link2 className="w-4 h-4 text-indigo-600" />
              <span>Referral Link & My Team</span>
            </button>

            {/* 6. Leaderboard */}
            <button
              id="menu-leaderboard-link"
              onClick={() => navigateTo('leaderboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors text-left ${
                activeView === 'leaderboard'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>All India Leaderboard</span>
            </button>

            <p className="px-3 pt-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Finance & Profile
            </p>

            {/* 7. Request Withdrawal */}
            <button
              id="menu-withdrawal-link"
              onClick={() => navigateTo('withdrawal')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors text-left ${
                activeView === 'withdrawal'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              <span>Request Withdrawal</span>
            </button>

            {/* 8. Withdrawal History */}
            <button
              id="menu-withdrawal-history-link"
              onClick={() => navigateTo('withdrawal-history')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors text-left ${
                activeView === 'withdrawal-history'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4 text-purple-600" />
              <span>Withdrawal History</span>
            </button>

            {/* 9. Bank & KYC */}
            <button
              id="menu-bank-kyc-link"
              onClick={() => navigateTo('bank-kyc')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors text-left ${
                activeView === 'bank-kyc'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <div className="flex-1 flex items-center justify-between">
                <span>Bank Details & KYC</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full flex items-center space-x-0.5">
                  <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                </span>
              </div>
            </button>

            {/* 10. Profile Settings */}
            <button
              id="menu-profile-link"
              onClick={() => navigateTo('profile')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors text-left ${
                activeView === 'profile'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4 text-orange-600" />
              <span>My Profile & Picture</span>
            </button>

            {/* 11. Admin Panel Control - Strictly for surendrabusiness02@gmail.com */}
            {isAdmin && (
              <button
                id="menu-admin-link"
                onClick={() => navigateTo('admin')}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer border ${
                  activeView === 'admin'
                    ? 'bg-slate-950 text-amber-300 border-amber-400/50 shadow-md ring-2 ring-amber-400/30'
                    : 'text-white bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 hover:from-black hover:to-amber-900 border-amber-500/40 shadow-sm'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <div className="font-black text-amber-300">Admin Control Suite</div>
                    <div className="text-[9.5px] text-slate-300 font-normal">Super Admin Command Center</div>
                  </div>
                  <span className="text-[9px] bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full font-black uppercase shadow-xs">
                    Admin
                  </span>
                </div>
              </button>
            )}

            {/* Switch Layout */}
            <div className="pt-2">
              <button
                id="menu-toggle-frame-link"
                onClick={onToggleMobileFrame}
                className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-gray-600 hover:bg-slate-100 font-medium text-xs transition-colors text-left border border-gray-200"
              >
                {isMobileFrame ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Switch to Fullscreen Layout</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Switch to Mobile Frame Layout</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/80 space-y-2">
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Skill Grow Official WhatsApp</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                type="button"
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                type="button"
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 rotate-180" />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
