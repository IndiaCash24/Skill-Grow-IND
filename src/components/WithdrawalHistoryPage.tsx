import React, { useState } from 'react';
import {
  History,
  ArrowLeft,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Filter,
  FileSpreadsheet,
  Building2,
  ArrowDownLeft,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { WithdrawalRecord, UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface WithdrawalHistoryPageProps {
  withdrawals: WithdrawalRecord[];
  profile: UserProfile;
  onNavigate: (view: any) => void;
}

export const WithdrawalHistoryPage: React.FC<WithdrawalHistoryPageProps> = ({
  withdrawals,
  profile,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Completed' | 'Processing' | 'Pending'>('ALL');
  const [downloadedInvoiceId, setDownloadedInvoiceId] = useState<string | null>(null);

  const filteredWithdrawals = withdrawals.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.utrNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalWithdrawnAmount = withdrawals
    .filter((w) => w.status === 'Completed')
    .reduce((sum, w) => sum + w.amount, 0);

  const handleDownloadInvoice = (id: string) => {
    setDownloadedInvoiceId(id);
    try {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#10B981', '#3B82F6'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setDownloadedInvoiceId(null), 2500);
  };

  return (
    <div id="withdrawal-history-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('withdrawal')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Withdrawal Request</span>
            </button>

            <span className="text-[11px] font-bold bg-white/20 text-purple-200 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Tax Compliant (GST & TDS)</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center space-x-2">
              <span>Withdrawal & Payout History</span>
            </h1>
            <p className="text-xs sm:text-sm text-purple-200">
              Complete archive of past bank settlements, UTR transaction receipts, and payout statements.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Total Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Successfully Paid
            </span>
            <div className="text-2xl font-black text-emerald-600">
              ₹ {totalWithdrawnAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-gray-400">All-time settled into bank account</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Payout Requests
            </span>
            <div className="text-2xl font-black text-indigo-700">
              {withdrawals.length} Batches
            </div>
            <p className="text-[10px] text-gray-400">Processed through automated IMPS</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Average Settlement Time
            </span>
            <div className="text-2xl font-black text-slate-900">
              ~2.5 Hours
            </div>
            <p className="text-[10px] text-emerald-600 font-medium">Daily 6:00 PM – 10:00 PM</p>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search UTR, ID, or Bank..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex space-x-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {(['ALL', 'Completed', 'Processing', 'Pending'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === tab
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'ALL' ? 'All Records' : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Withdrawal Records List */}
        <div className="space-y-3">
          {filteredWithdrawals.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-gray-200 text-center space-y-2">
              <History className="w-8 h-8 text-gray-400 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Payout Records Found</h4>
              <p className="text-xs text-gray-500">Try adjusting your search query or status filter.</p>
            </div>
          ) : (
            filteredWithdrawals.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      <ArrowDownLeft className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-black text-slate-900 text-sm">{record.id}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                            record.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : record.status === 'Processing'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {record.status === 'Completed' && <CheckCircle2 className="w-3 h-3 mr-0.5" />}
                          {record.status === 'Processing' && <Clock className="w-3 h-3 mr-0.5" />}
                          <span>{record.status}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        Requested: {record.requestedAt}
                        {record.completedAt && ` • Settled: ${record.completedAt}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-lg font-black text-slate-900">
                      ₹ {record.amount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      {record.payoutMethod} Transfer
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-500">Destination:</span>{' '}
                      <span className="font-bold text-slate-800">{record.destination}</span>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-500">Bank UTR / Ref No:</span>{' '}
                      <span className="font-mono font-bold text-indigo-700">{record.utrNumber}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(record.id)}
                    className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl transition-colors self-end sm:self-auto"
                  >
                    <Download className="w-3 h-3" />
                    <span>{downloadedInvoiceId === record.id ? 'Receipt Downloaded!' : 'Download Receipt'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
