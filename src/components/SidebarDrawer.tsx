import React from 'react';
import {
  X,
  LayoutDashboard,
  Home,
  Link2,
  Trophy,
  BookOpen,
  CreditCard,
  History,
  Sliders,
  ExternalLink,
  PhoneCall,
  LogOut,
  ShieldCheck,
  RefreshCw,
  Smartphone,
  Maximize2,
  Package,
} from 'lucide-react';
import { UserProfile, EarningStats } from '../types';
import { SkillGrowIndLogo } from './SkillGrowIndLogo';

export type AppView =
  | 'home'
  | 'dashboard'
  | 'courses'
  | 'leaderboard'
  | 'referral'
  | 'payout'
  | 'kyc'
  | 'simulator'
  | 'login'
  | 'register';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: AppView;
  isLoggedIn?: boolean;
  onSelectView: (view: AppView) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  profile: UserProfile;
  earnings: EarningStats;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onResetDefaults: () => void;
  onOpenReferral?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenCourses?: () => void;
  onOpenPayout?: () => void;
  onOpenSimulator?: () => void;
  onOpenKyc?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  isLoggedIn = false,
  onSelectView,
  onOpenLogin,
  onLogout,
  profile,
  earnings,
  isMobileFrame,
  onToggleMobileFrame,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const navigateTo = (view: AppView) => {
    if (view !== 'home' && !isLoggedIn) {
      onClose();
      onOpenLogin();
      return;
    }
    onSelectView(view);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        id="sidebar-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="sidebar-drawer-panel"
          className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between animate-slide-left overflow-y-auto"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="font-['Poppins'] font-black text-lg text-orange-500">Skill</span>
                <span className="font-['Poppins'] font-black text-lg text-slate-900">Grow</span>
                <span className="text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.2 rounded">IND</span>
              </div>
              <span className="text-[8px] text-gray-500 italic font-serif">Earn knowledge ! Earn money</span>
            </div>

            <button
              id="close-sidebar-btn"
              onClick={onClose}
              type="button"
              aria-label="Close sidebar"
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User mini summary */}
          {isLoggedIn ? (
            <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
              <div className="flex items-center space-x-3.5">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm text-white truncate tracking-wide">
                    {profile.name}
                  </h4>
                  <p className="text-[11px] text-orange-200">ID: {profile.referralId}</p>
                  <div className="inline-flex items-center space-x-1 mt-1 bg-orange-500/30 text-orange-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-orange-400/30">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>{profile.packageTier}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-gray-300">Total Earned:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  ₹ {earnings.allTime.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 font-bold text-sm">
                  GK
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

          {/* Menu Items */}
          <div className="p-4 space-y-1.5 flex-1">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Navigation
            </p>

            {/* 1. Home Page Link */}
            <button
              id="menu-home-link"
              onClick={() => navigateTo('home')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors text-left ${
                activeView === 'home'
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-gray-700 hover:bg-gray-100 font-medium'
              }`}
            >
              <Home className={`w-4 h-4 ${activeView === 'home' ? 'text-orange-600' : 'text-slate-600'}`} />
              <span>Home Page (Courses & Summit)</span>
            </button>

            {/* 2. Earning Dashboard Link */}
            <button
              id="menu-dashboard-link"
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors text-left ${
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

            {/* 3. Packages & Courses */}
            <button
              id="menu-courses-link"
              onClick={() => navigateTo('courses')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors text-left ${
                activeView === 'courses'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Packages & Training</span>
            </button>

            {/* 4. Leaderboard */}
            <button
              id="menu-leaderboard-link"
              onClick={() => navigateTo('leaderboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors text-left ${
                activeView === 'leaderboard'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>All India Leaderboard</span>
            </button>

            {/* 5. Affiliate Links & Banners */}
            <button
              id="menu-referral-link"
              onClick={() => navigateTo('referral')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors text-left ${
                activeView === 'referral'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Link2 className="w-4 h-4 text-indigo-600" />
              <span>Affiliate Links & Banners</span>
            </button>

            <p className="px-3 pt-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Finance & Profile
            </p>

            {/* Payouts */}
            <button
              id="menu-payout-link"
              onClick={() => navigateTo('payout')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors text-left ${
                activeView === 'payout'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4 text-purple-600" />
              <span>Payouts & Withdrawals</span>
            </button>

            {/* KYC */}
            <button
              id="menu-kyc-link"
              onClick={() => navigateTo('kyc')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors text-left ${
                activeView === 'kyc'
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

            <p className="px-3 pt-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Dashboard Customizer
            </p>

            {/* Customize Stats Button in Sidebar */}
            <button
              id="menu-simulator-link"
              onClick={() => navigateTo('simulator')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-xs hover:opacity-95 transition-all text-left ${
                activeView === 'simulator'
                  ? 'bg-gradient-to-r from-purple-700 to-pink-700 ring-2 ring-purple-300'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600'
              }`}
            >
              <Sliders className="w-4 h-4 text-white" />
              <div className="flex-1 flex items-center justify-between">
                <span>Customize Stats / Profile</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">Edit</span>
              </div>
            </button>

            {/* Reset Stats to Default in Sidebar */}
            <button
              id="menu-reset-link"
              onClick={() => {
                onResetDefaults();
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-700 font-medium text-xs transition-colors text-left border border-gray-200"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
              <span>Reset to Screenshot Default (₹0)</span>
            </button>

            {/* Toggle Fullscreen / Mobile Mode */}
            <button
              id="menu-toggle-frame-link"
              onClick={() => {
                onToggleMobileFrame();
              }}
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

          {/* Footer with community & logout */}
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

            <button
              onClick={onClose}
              type="button"
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
