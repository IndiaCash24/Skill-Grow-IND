import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Copy,
  Check,
  Download,
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  X,
  Send,
  Zap,
} from 'lucide-react';
import { WithdrawalRecord } from '../../../types';

interface AdminPayoutsTabProps {
  withdrawals: WithdrawalRecord[];
  onApprovePayout: (payoutId: string, utrNumber: string) => void;
  onRejectPayout: (payoutId: string, reason: string) => void;
  onBatchApproveAll: () => void;
}

export const AdminPayoutsTab: React.FC<AdminPayoutsTabProps> = ({
  withdrawals,
  onApprovePayout,
  onRejectPayout,
  onBatchApproveAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Approve modal
  const [approvingItem, setApprovingItem] = useState<WithdrawalRecord | null>(null);
  const [utrInput, setUtrInput] = useState('');

  // Reject modal
  const [rejectingItem, setRejectingItem] = useState<WithdrawalRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingList = withdrawals.filter((w) => w.status === 'Pending');
  const pendingTotal = pendingList.reduce((sum, w) => sum + w.amount, 0);

  const completedList = withdrawals.filter((w) => w.status === 'Completed');
  const completedTotal = completedList.reduce((sum, w) => sum + w.amount, 0);

  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchSearch =
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.utrNumber && w.utrNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingItem) return;
    const finalUtr = utrInput.trim() || `IMPS${Date.now().toString().slice(-8)}`;
    onApprovePayout(approvingItem.id, finalUtr);
    setApprovingItem(null);
    setUtrInput('');
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;
    onRejectPayout(rejectingItem.id, rejectReason || 'Bank account details invalid / verification failed');
    setRejectingItem(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-amber-500 text-white p-5 rounded-2xl shadow-lg shadow-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-100">Pending Settlements</span>
            <Clock className="w-5 h-5 text-amber-200" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">₹{pendingTotal.toLocaleString('en-IN')}</div>
          <div className="text-xs font-bold text-amber-100 mt-1">{pendingList.length} Affiliate requests waiting</div>
        </div>

        <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-lg shadow-emerald-600/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-100">Settled Payouts</span>
            <CheckCircle className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">₹{completedTotal.toLocaleString('en-IN')}</div>
          <div className="text-xs font-bold text-emerald-100 mt-1">{completedList.length} Successful payouts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">TDS Compliance (5%)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{Math.round(completedTotal * 0.05).toLocaleString('en-IN')}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Auto-deducted for Tax Filing</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bulk Payout Settlement</div>
            <div className="text-xs text-slate-600 mt-1">Approve and settle all {pendingList.length} pending payouts in 1-click.</div>
          </div>
          <button
            onClick={onBatchApproveAll}
            disabled={pendingList.length === 0}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all mt-2 cursor-pointer ${
              pendingList.length > 0
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Batch Approve All ({pendingList.length})</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Withdrawal Requests Queue</h2>
            <p className="text-xs text-slate-500">
              Process affiliate bank and UPI withdrawal requests with UTR transaction verification.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Destination, UPI, UTR number, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-700 font-semibold"
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending Only ({pendingList.length})</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Payout ID & Date</th>
                  <th className="py-3 px-4">Requested Amount</th>
                  <th className="py-3 px-4">Net Payout (Post 5% TDS)</th>
                  <th className="py-3 px-4">Method & Account Destination</th>
                  <th className="py-3 px-4">UTR Number</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No withdrawal records match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredWithdrawals.map((w) => {
                    const netAmount = Math.round(w.amount * 0.95);
                    return (
                      <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-900">{w.id}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{w.requestedAt}</div>
                        </td>

                        <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                          ₹{w.amount.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
                          ₹{netAmount.toLocaleString('en-IN')}
                          <span className="block text-[10px] font-normal text-slate-400">TDS: -₹{w.amount - netAmount}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {w.payoutMethod}
                            </span>
                            <span className="font-mono text-slate-700 font-bold">{w.destination}</span>
                            <button
                              onClick={() => handleCopy(w.destination, w.id)}
                              title="Copy Destination"
                              className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                            >
                              {copiedId === w.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                          {w.utrNumber || <span className="text-slate-400 italic">Pending Assignment</span>}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              w.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : w.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {w.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {w.status === 'Pending' ? (
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => {
                                  setApprovingItem(w);
                                  setUtrInput(`UTR${Date.now().toString().slice(-8)}`);
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer"
                              >
                                Approve & Pay
                              </button>
                              <button
                                onClick={() => setRejectingItem(w)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                                title="Reject and Refund"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400">Processed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: Approve with UTR */}
      {approvingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-fade-in text-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-base">Approve & Settle Payout</h3>
                <p className="text-xs text-slate-300">ID: {approvingItem.id}</p>
              </div>
              <button
                onClick={() => setApprovingItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApproval} className="p-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-bold">Gross Amount:</span>
                  <span className="font-bold text-slate-900">₹{approvingItem.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-black text-sm">
                  <span>Net Payable Post 5% TDS:</span>
                  <span>₹{Math.round(approvingItem.amount * 0.95).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-600">Destination:</span>
                  <span className="font-mono font-bold text-slate-800">{approvingItem.destination}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Bank / IMPS / UPI Reference UTR Number
                </label>
                <input
                  type="text"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="e.g. UTR240824991823 or IMPS0029102"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm font-bold focus:border-orange-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  This UTR will appear instantly on the affiliate's withdrawal receipt & SMS alert.
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setApprovingItem(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Confirm & Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reject Payout */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-fade-in text-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-900 text-white">
              <div>
                <h3 className="font-black text-base">Reject Withdrawal Request</h3>
                <p className="text-xs text-rose-200">Amount will be refunded back to affiliate wallet</p>
              </div>
              <button
                onClick={() => setRejectingItem(null)}
                className="p-1.5 text-rose-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRejection} className="p-5 space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Rejection</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Bank IFSC code incorrect or Beneficiary name mismatch with KYC document."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:border-rose-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  Reject & Refund Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
