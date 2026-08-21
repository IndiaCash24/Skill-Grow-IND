import React from 'react';
import {
  X,
  LayoutDashboard,
  Link2,
  Trophy,
  BookOpen,
  CreditCard,
  History,
  Sliders,
  Sparkles,
  ExternalLink,
  PhoneCall,
  LogOut,
  ShieldCheck,
  RefreshCw,
  Smartphone,
  Maximize2,
} from 'lucide-react';
import { UserProfile, EarningStats } from '../types';
import { SkillGrowIndLogo } from './SkillGrowIndLogo';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  earnings: EarningStats;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onResetDefaults: () => void;
  onRefresh?: () => void;
  onOpenReferral: () => void;
  onOpenLeaderboard: () => void;
  onOpenCourses: () => void;
  onOpenPayout: () => void;
  onOpenSimulator: () => void;
  onOpenKyc: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  earnings,
  isMobileFrame,
  onToggleMobileFrame,
  onResetDefaults,
  onRefresh,
  onOpenReferral,
  onOpenLeaderboard,
  onOpenCourses,
  onOpenPayout,
  onOpenSimulator,
  onOpenKyc,
}) => {
  if (!isOpen) return null;

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
            <SkillGrowIndLogo size="sm" />
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
          <div className="p-5 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white">
            <div className="flex items-center space-x-3.5">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-pink-400 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-white truncate tracking-wide">
                  {profile.name}
                </h4>
                <p className="text-[11px] text-purple-200">ID: {profile.referralId}</p>
                <div className="inline-flex items-center space-x-1 mt-1 bg-pink-500/30 text-pink-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-pink-400/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{profile.packageTier}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-purple-200">Total Earned:</span>
              <span className="font-bold text-emerald-400 text-sm">
                ₹ {earnings.allTime.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-1.5 flex-1">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Navigation
            </p>

            <button
              id="menu-dashboard-link"
              onClick={onClose}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-pink-50 text-pink-600 font-semibold text-sm transition-colors text-left"
            >
              <LayoutDashboard className="w-4 h-4 text-pink-600" />
              <span>Dashboard</span>
            </button>

            <button
              id="menu-referral-link"
              onClick={() => {
                onClose();
                onOpenReferral();
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors text-left"
            >
              <Link2 className="w-4 h-4 text-indigo-600" />
              <span>Affiliate Links & Banners</span>
            </button>

            <button
              id="menu-leaderboard-link"
              onClick={() => {
                onClose();
                onOpenLeaderboard();
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors text-left"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>All India Leaderboard</span>
            </button>

            <button
              id="menu-courses-link"
              onClick={() => {
                onClose();
                onOpenCourses();
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors text-left"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>My Courses / Training</span>
            </button>

            <p className="px-3 pt-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Finance & Profile
            </p>

            <button
              id="menu-payout-link"
              onClick={() => {
                onClose();
                onOpenPayout();
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors text-left"
            >
              <History className="w-4 h-4 text-purple-600" />
              <span>Payouts & Withdrawals</span>
            </button>

            <button
              id="menu-kyc-link"
              onClick={() => {
                onClose();
                onOpenKyc();
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors text-left"
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
              onClick={() => {
                onClose();
                onOpenSimulator();
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm shadow-xs hover:opacity-95 transition-all text-left"
            >
              <Sliders className="w-4 h-4 text-white" />
              <div className="flex-1 flex items-center justify-between">
                <span>Customize Stats / Profile</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">Edit</span>
              </div>
            </button>

            {/* Refresh Live Counting in Sidebar */}
            {onRefresh && (
              <button
                id="menu-refresh-data-link"
                onClick={() => {
                  onClose();
                  onRefresh();
                }}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors text-left border border-emerald-200"
              >
                <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                <span>Refresh Live Earnings (6s Count)</span>
              </button>
            )}

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
                <span>Skill Grow IND Official WhatsApp</span>
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

