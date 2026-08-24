import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Eye,
  Filter,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { AdminOrderRecord } from '../../../types';

interface AdminSalesTabProps {
  orders: AdminOrderRecord[];
  onUpdateOrderStatus: (orderId: string, newStatus: AdminOrderRecord['status']) => void;
}

export const AdminSalesTab: React.FC<AdminSalesTabProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [packageFilter, setPackageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectingOrder, setInspectingOrder] = useState<AdminOrderRecord | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const matchSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.sponsorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.sponsorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());

    const matchPkg = packageFilter === 'ALL' || ord.packageTier === packageFilter;
    const matchStatus = statusFilter === 'ALL' || ord.status === statusFilter;

    return matchSearch && matchPkg && matchStatus;
  });

  const totalSales = orders.reduce((s, o) => (o.status === 'Completed' ? s + o.amount : s), 0);
  const totalDirectComm = orders.reduce((s, o) => (o.status === 'Completed' ? s + o.directCommission : s), 0);
  const totalPassiveComm = orders.reduce((s, o) => (o.status === 'Completed' ? s + o.passiveCommission : s), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending Approval').length;

  const exportSalesCsv = () => {
    const headers = 'Order Number,Buyer Name,Buyer Email,Phone,Package,Amount,Sponsor Name,Sponsor Code,Direct Commission,Passive Commission,Payment Method,Transaction Ref,Status,Date\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.buyerName}","${o.buyerEmail}","${o.buyerPhone}","${o.packageName}",${o.amount},"${o.sponsorName}","${o.sponsorCode}",${o.directCommission},${o.passiveCommission},"${o.paymentMethod}","${o.transactionRef}","${o.status}","${o.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillGrow_Sales_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* 4 Financial Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Sales Revenue</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{totalSales.toLocaleString('en-IN')}</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">100% Platform Volume</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Commissions</div>
          <div className="text-2xl font-black text-purple-700 mt-1">₹{totalDirectComm.toLocaleString('en-IN')}</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">70% to Direct Sponsors</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Passive 2nd-Tier</div>
          <div className="text-2xl font-black text-blue-700 mt-1">₹{totalPassiveComm.toLocaleString('en-IN')}</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">15% Leadership pool</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Orders</div>
          <div className="text-2xl font-black text-amber-900 mt-1">{pendingOrders} Orders</div>
          <div className="text-[11px] font-bold text-amber-700 mt-0.5">Manual UPI / QR screenshots</div>
        </div>
      </div>

      {/* Main Order List Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Orders & Enrolments Ledger</h2>
            <p className="text-xs text-slate-500">
              Audit course orders, approve manual QR payments, and track sponsor commission distributions.
            </p>
          </div>

          <button
            onClick={exportSalesCsv}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Orders CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, Buyer, Sponsor, Ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-700 font-semibold"
            >
              <option value="ALL">All Packages</option>
              <option value="PLATINUM">Platinum (₹9,999)</option>
              <option value="DIAMOND">Diamond (₹5,999)</option>
              <option value="GOLD">Gold (₹2,999)</option>
              <option value="SILVER">Silver (₹1,499)</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-700 font-semibold"
            >
              <option value="ALL">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Package & Amount</th>
                  <th className="py-3 px-4">Sponsor (Commissions)</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">{ord.orderNumber}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{ord.createdAt}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{ord.buyerName}</div>
                        <div className="text-[11px] text-slate-400">{ord.buyerEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{ord.packageName}</div>
                        <div className="font-black text-slate-900 text-sm">₹{ord.amount.toLocaleString('en-IN')}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{ord.sponsorName}</div>
                        <div className="text-[11px] font-bold text-emerald-600">
                          ₹{ord.directCommission} (70%) + ₹{ord.passiveCommission} (15%)
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {ord.paymentMethod}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ord.transactionRef}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            ord.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Pending Approval'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {ord.status === 'Pending Approval' && (
                            <>
                              <button
                                onClick={() => onUpdateOrderStatus(ord.id, 'Completed')}
                                title="Approve & Complete Order"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onUpdateOrderStatus(ord.id, 'Failed')}
                                title="Reject Order"
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setInspectingOrder(ord)}
                            title="Inspect Order Details"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: Inspect Order Details */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-fade-in text-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-base">Order Receipt #{inspectingOrder.orderNumber}</h3>
                <p className="text-xs text-slate-300">Recorded: {inspectingOrder.createdAt}</p>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Buyer Details</span>
                  <span className="font-bold text-slate-900 text-sm block">{inspectingOrder.buyerName}</span>
                  <span className="text-slate-600 block">{inspectingOrder.buyerEmail}</span>
                  <span className="text-slate-600 block">{inspectingOrder.buyerPhone}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Sponsor Beneficiary</span>
                  <span className="font-bold text-slate-900 text-sm block">{inspectingOrder.sponsorName}</span>
                  <span className="text-slate-600 block">Code: {inspectingOrder.sponsorCode}</span>
                  <span className="text-emerald-600 font-bold block mt-1">
                    Direct Payout: ₹{inspectingOrder.directCommission}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Course Package:</span>
                  <span className="font-bold text-slate-900">{inspectingOrder.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Price Paid:</span>
                  <span className="font-black text-slate-900 text-sm">
                    ₹{inspectingOrder.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Gateway / Mode:</span>
                  <span className="font-semibold text-slate-800">{inspectingOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Transaction Reference:</span>
                  <span className="font-mono text-slate-800">{inspectingOrder.transactionRef}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-slate-600 font-bold">Order Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    {inspectingOrder.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setInspectingOrder(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold cursor-pointer hover:bg-slate-800"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
