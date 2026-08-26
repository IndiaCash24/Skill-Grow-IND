import React from 'react';
import {
  TrendingUp,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Award,
  DollarSign,
  Package,
  Layers,
  Zap,
  ExternalLink,
  ChevronRight,
  Activity,
  AlertCircle,
  FileText,
} from 'lucide-react';
import {
  AdminUserRecord,
  AdminOrderRecord,
  AdminKycRecord,
  WithdrawalRecord,
  AdminTabType,
} from '../../../types';

interface AdminOverviewTabProps {
  users: AdminUserRecord[];
  orders: AdminOrderRecord[];
  kycList: AdminKycRecord[];
  withdrawals: WithdrawalRecord[];
  onSwitchTab: (tab: AdminTabType) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  users,
  orders,
  kycList,
  withdrawals,
  onSwitchTab,
}) => {
  // Calculated platform metrics
  const totalRevenue = orders.reduce((sum, ord) => (ord.status === 'Completed' ? sum + ord.amount : sum), 0);
  const totalDirectCommission = orders.reduce(
    (sum, ord) => (ord.status === 'Completed' ? sum + ord.directCommission : sum),
    0
  );
  const totalPassiveCommission = orders.reduce(
    (sum, ord) => (ord.status === 'Completed' ? sum + ord.passiveCommission : sum),
    0
  );
  const totalWithdrawnAmount = withdrawals.reduce(
    (sum, w) => (w.status === 'Completed' ? sum + w.amount : sum),
    0
  );
  const pendingPayoutsCount = withdrawals.filter((w) => w.status === 'Pending').length;
  const pendingPayoutsAmount = withdrawals
    .filter((w) => w.status === 'Pending')
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingKycCount = kycList.filter((k) => k.status === 'Pending').length;
  const verifiedKycCount = kycList.filter((k) => k.status === 'Verified').length;

  const todayOrders = orders.filter((o) => o.createdAt.includes('24 Aug') || o.createdAt.includes('Today'));
  const todaySalesAmount = todayOrders.reduce((sum, o) => sum + o.amount, 0);

  const activeUsersCount = users.filter((u) => u.status === 'active').length;

  // Package distribution calculation
  const pkgSalesCount: Record<string, number> = {
    PLATINUM: 0,
    DIAMOND: 0,
    GOLD: 0,
    SILVER: 0,
  };
  orders.forEach((ord) => {
    if (pkgSalesCount[ord.packageTier] !== undefined) {
      pkgSalesCount[ord.packageTier]++;
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-black tracking-wider uppercase flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Executive Command Center</span>
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
                Live System 100% Operational
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Skill Grow IND Platform Analytics
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal">
              Real-time administrative overview across course sales, affiliate downlines, instant withdrawal settlements, and KYC compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSwitchTab('sales')}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-orange-500/30 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Manage Orders</span>
            </button>
            <button
              onClick={() => onSwitchTab('payouts')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Pending Payouts ({pendingPayoutsCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Revenue */}
        <div
          onClick={() => onSwitchTab('sales')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Gross Sales</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>+₹{todaySalesAmount.toLocaleString('en-IN')} today</span>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div
          onClick={() => onSwitchTab('users')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Affiliates</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{users.length} Users</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              {activeUsersCount} Active accounts
            </div>
          </div>
        </div>

        {/* Direct Commissions Distributed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commissions Paid</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{(totalDirectCommission + totalPassiveCommission).toLocaleString('en-IN')}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              70% Direct + 15% Passive Tier
            </div>
          </div>
        </div>

        {/* Pending Payout Queue */}
        <div
          onClick={() => onSwitchTab('payouts')}
          className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Payouts</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-900">
              ₹{pendingPayoutsAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-xs font-bold text-amber-700 mt-1">
              {pendingPayoutsCount} Requests waiting action →
            </div>
          </div>
        </div>

        {/* Total Settled Withdrawals */}
        <div
          onClick={() => onSwitchTab('payouts')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Settled Payouts</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{totalWithdrawnAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-1">
              Direct IMPS & UPI transfers
            </div>
          </div>
        </div>

        {/* KYC Verifications Pending */}
        <div
          onClick={() => onSwitchTab('kyc')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">KYC Pending</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{pendingKycCount} Queue</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              {verifiedKycCount} Verified users
            </div>
          </div>
        </div>

        {/* Total Course Enrollments */}
        <div
          onClick={() => onSwitchTab('sales')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolments</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{orders.length} Orders</div>
            <div className="text-xs font-semibold text-indigo-600 mt-1">
              Avg Order Value: ₹{orders.length ? Math.round(totalRevenue / orders.length) : 0}
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Ratio</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">84.6%</div>
            <div className="text-xs font-semibold text-teal-600 mt-1">
              High-converting landing funnels
            </div>
          </div>
        </div>
      </div>

      {/* Package Sales Breakdown & Real-Time Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Live Package Enrolments</h2>
              <p className="text-xs text-slate-500">Real-time student checkout & sponsor commissions</p>
            </div>
            <button
              onClick={() => onSwitchTab('sales')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Orders ({orders.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Student / Buyer</th>
                  <th className="pb-3">Package</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Sponsor (Direct 70%)</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="font-bold text-slate-900">{order.buyerName}</div>
                      <div className="text-[11px] text-slate-400">{order.buyerEmail}</div>
                    </td>
                    <td className="py-3.5 pr-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800">
                        {order.packageName}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 font-black text-slate-900">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 pr-2">
                      <div className="font-semibold text-slate-800">{order.sponsorName}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">
                        +₹{order.directCommission} commission
                      </div>
                    </td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          order.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Package Distribution & Quick Action Center */}
        <div className="space-y-6">
          {/* Package Sales Tier Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-black text-slate-900 mb-1">Package Tier Demand</h2>
            <p className="text-xs text-slate-500 mb-4">Enrollment distribution by course tier</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-purple-700">Platinum Package (₹9,999)</span>
                  <span className="text-slate-900">{pkgSalesCount['PLATINUM'] || 0} sales</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-blue-700">Diamond Package (₹5,999)</span>
                  <span className="text-slate-900">{pkgSalesCount['DIAMOND'] || 0} sales</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-[30%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-amber-700">Gold Package (₹2,999)</span>
                  <span className="text-slate-900">{pkgSalesCount['GOLD'] || 0} sales</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-[15%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Silver Package (₹1,499)</span>
                  <span className="text-slate-900">{pkgSalesCount['SILVER'] || 0} sales</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full rounded-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-center space-x-2 text-orange-400 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-extrabold uppercase tracking-wider">Quick Admin Tools</span>
            </div>
            <h3 className="font-bold text-sm mb-3">Common Management Tasks</h3>

            <div className="space-y-2">
              <button
                onClick={() => onSwitchTab('links')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Update WhatsApp & Zoom Links</span>
                <ChevronRight className="w-4 h-4 text-orange-400" />
              </button>
              <button
                onClick={() => onSwitchTab('broadcasts')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Send Platform Announcement</span>
                <ChevronRight className="w-4 h-4 text-orange-400" />
              </button>
              <button
                onClick={() => onSwitchTab('packages')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Adjust Course Prices & Commissions</span>
                <ChevronRight className="w-4 h-4 text-orange-400" />
              </button>
              <button
                onClick={() => onSwitchTab('banners')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Upload Story & Promo Banners</span>
                <ChevronRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
