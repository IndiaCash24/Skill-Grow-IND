import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Package,
  Link2,
  Image,
  Radio,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Bell,
} from 'lucide-react';
import {
  AdminTabType,
  AdminUserRecord,
  AdminOrderRecord,
  AdminKycRecord,
  AdminPlatformLinks,
  AdminBanner,
  AdminAnnouncement,
  PackageItem,
  WithdrawalRecord,
} from '../../types';

import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminUsersTab } from './tabs/AdminUsersTab';
import { AdminSalesTab } from './tabs/AdminSalesTab';
import { AdminPayoutsTab } from './tabs/AdminPayoutsTab';
import { AdminKycTab } from './tabs/AdminKycTab';
import { AdminPackagesTab } from './tabs/AdminPackagesTab';
import { AdminLinksTab } from './tabs/AdminLinksTab';
import { AdminBannersTab } from './tabs/AdminBannersTab';
import { AdminBroadcastsTab } from './tabs/AdminBroadcastsTab';

interface AdminPageProps {
  initialTab?: AdminTabType;
  users: AdminUserRecord[];
  orders: AdminOrderRecord[];
  withdrawals: WithdrawalRecord[];
  kycList: AdminKycRecord[];
  packages: PackageItem[];
  platformLinks: AdminPlatformLinks;
  banners: AdminBanner[];
  announcements: AdminAnnouncement[];
  onNavigateHome: () => void;
  // Updaters
  onUpdateUser: (u: AdminUserRecord) => void;
  onAddUser: (u: AdminUserRecord) => void;
  onUpdateOrderStatus: (orderId: string, status: AdminOrderRecord['status']) => void;
  onApprovePayout: (payoutId: string, utr: string) => void;
  onRejectPayout: (payoutId: string, reason: string) => void;
  onBatchApproveAllPayouts: () => void;
  onApproveKyc: (kycId: string) => void;
  onRejectKyc: (kycId: string, reason: string) => void;
  onUpdatePackage: (pkg: PackageItem) => void;
  onAddPackage: (pkg: PackageItem) => void;
  onSaveLinks: (links: AdminPlatformLinks) => void;
  onUpdateBanner: (b: AdminBanner) => void;
  onAddBanner: (b: AdminBanner) => void;
  onDeleteBanner: (id: string) => void;
  onAddAnnouncement: (a: AdminAnnouncement) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  initialTab = 'overview',
  users,
  orders,
  withdrawals,
  kycList,
  packages,
  platformLinks,
  banners,
  announcements,
  onNavigateHome,
  onUpdateUser,
  onAddUser,
  onUpdateOrderStatus,
  onApprovePayout,
  onRejectPayout,
  onBatchApproveAllPayouts,
  onApproveKyc,
  onRejectKyc,
  onUpdatePackage,
  onAddPackage,
  onSaveLinks,
  onUpdateBanner,
  onAddBanner,
  onDeleteBanner,
  onAddAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabType>(initialTab);

  const pendingPayoutsCount = withdrawals.filter((w) => w.status === 'Pending').length;
  const pendingKycCount = kycList.filter((k) => k.status === 'Pending').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending Approval').length;

  const tabsConfig = [
    {
      id: 'overview' as AdminTabType,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'users' as AdminTabType,
      label: 'Users & Affiliates',
      icon: Users,
      badge: users.length,
    },
    {
      id: 'sales' as AdminTabType,
      label: 'Orders & Sales',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'payouts' as AdminTabType,
      label: 'Withdrawal Hub',
      icon: CreditCard,
      badge: pendingPayoutsCount > 0 ? `${pendingPayoutsCount}` : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'kyc' as AdminTabType,
      label: 'KYC & Bank Verification',
      icon: ShieldCheck,
      badge: pendingKycCount > 0 ? `${pendingKycCount}` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'packages' as AdminTabType,
      label: 'Packages & Commissions',
      icon: Package,
      badge: null,
    },
    {
      id: 'links' as AdminTabType,
      label: 'Platform Links',
      icon: Link2,
      badge: null,
    },
    {
      id: 'banners' as AdminTabType,
      label: 'Marketing Banners',
      icon: Image,
      badge: banners.length,
    },
    {
      id: 'broadcasts' as AdminTabType,
      label: 'Push Broadcasts',
      icon: Radio,
      badge: announcements.length,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Admin Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            {/* Left Brand & Back Action */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 transition-all cursor-pointer flex items-center space-x-2 text-xs font-bold shrink-0 shadow-sm"
                title="Return to Affiliate App"
              >
                <ArrowLeft className="w-4 h-4 text-orange-400" />
                <span className="hidden sm:inline">Back to Website</span>
              </button>

              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-md shadow-orange-500/20 shrink-0">
                  SG
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-white text-sm sm:text-base tracking-tight truncate">Skill Grow IND</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 border border-orange-500/30 text-orange-400 font-extrabold text-[10px] uppercase shrink-0">
                      Super Admin
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                      Master Control Suite
                    </span>
                    <span className="inline-flex items-center space-x-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Live Firebase</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Badges & Admin User Badge */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {pendingPayoutsCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('payouts')}
                  className="px-2.5 sm:px-3 py-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 rounded-xl text-[11px] sm:text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="View Pending Withdrawals"
                >
                  <CreditCard className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden md:inline">{pendingPayoutsCount} Pending Payouts</span>
                  <span className="md:hidden font-black text-rose-300">{pendingPayoutsCount} Payouts</span>
                </button>
              )}

              {pendingKycCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('kyc')}
                  className="px-2.5 sm:px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 rounded-xl text-[11px] sm:text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="View KYC Requests"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">{pendingKycCount} KYC Requests</span>
                  <span className="md:hidden font-black text-amber-300">{pendingKycCount} KYC</span>
                </button>
              )}

              {/* Admin Profile Box */}
              <div className="flex items-center space-x-2 pl-1 sm:pl-2 border-l border-slate-800">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/60 flex items-center justify-center text-xs font-black text-orange-400 shadow-xs">
                  SA
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-200">Surendra (Admin)</span>
                  <span className="text-[10px] text-slate-400">surendrabusiness02@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex space-x-1.5 py-2.5">
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/90'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== null && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        tab.badgeColor || (isActive ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-300')
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && (
          <AdminOverviewTab
            users={users}
            orders={orders}
            withdrawals={withdrawals}
            kycList={kycList}
            onSelectTab={(t) => setActiveTab(t)}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsersTab
            users={users}
            onUpdateUser={onUpdateUser}
            onAddUser={onAddUser}
          />
        )}

        {activeTab === 'sales' && (
          <AdminSalesTab
            orders={orders}
            onUpdateOrderStatus={onUpdateOrderStatus}
          />
        )}

        {activeTab === 'payouts' && (
          <AdminPayoutsTab
            withdrawals={withdrawals}
            onApprovePayout={onApprovePayout}
            onRejectPayout={onRejectPayout}
            onBatchApproveAll={onBatchApproveAllPayouts}
          />
        )}

        {activeTab === 'kyc' && (
          <AdminKycTab
            kycList={kycList}
            onApproveKyc={onApproveKyc}
            onRejectKyc={onRejectKyc}
          />
        )}

        {activeTab === 'packages' && (
          <AdminPackagesTab
            packages={packages}
            onUpdatePackage={onUpdatePackage}
            onAddNewPackage={onAddPackage}
          />
        )}

        {activeTab === 'links' && (
          <AdminLinksTab
            platformLinks={platformLinks}
            onSaveLinks={onSaveLinks}
          />
        )}

        {activeTab === 'banners' && (
          <AdminBannersTab
            banners={banners}
            onUpdateBanner={onUpdateBanner}
            onAddBanner={onAddBanner}
            onDeleteBanner={onDeleteBanner}
          />
        )}

        {activeTab === 'broadcasts' && (
          <AdminBroadcastsTab
            announcements={announcements}
            onAddAnnouncement={onAddAnnouncement}
            onDeleteAnnouncement={onDeleteAnnouncement}
          />
        )}
      </main>
    </div>
  );
};
