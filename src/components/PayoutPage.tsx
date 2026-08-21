import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  AlertCircle,
  Building2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Download,
  CreditCard,
  History,
  FileSpreadsheet,
} from 'lucide-react';
import { UserProfile, EarningStats, Transaction } from '../types';
import confetti from 'canvas-confetti';

interface PayoutPageProps {
  profile: UserProfile;
  earnings: EarningStats;
  transactions: Transaction[];
  onRequestWithdrawal: (amount: number, method: string) => void;
  onNavigate: (view: any) => void;
}

export const PayoutPage: React.FC<PayoutPageProps> = ({
  profile,
  earnings,
  transactions,
  onRequestWithdrawal,
  onNavigate,
}) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [downloadedInvoice, setDownloadedInvoice] = useState(false);

  const availableBalance = Math.max(earnings.today + earnings.passiveIncome, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }

    if (withdrawAmount > 100000) {
      setError('Daily instant withdrawal limit is ₹1,00,000.');
      return;
    }

    setError('');
    onRequestWithdrawal(withdrawAmount, method === 'upi' ? profile.upiId : profile.bankAccount);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#10B981', '#3B82F6', '#EC4899'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSubmitted(false);
      setAmount('');
    }, 2800);
  };

  const handleDownloadInvoice = () => {
    setDownloadedInvoice(true);
    setTimeout(() => setDownloadedInvoice(false), 2500);
  };

  return (
    <div id="payout-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Daily Payout Cycle: 6 PM - 10 PM</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Payouts & Bank Settlement
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Instant withdrawal processing directly into your verified bank account or UPI ID.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Wallet Balance & Quick Overview Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Available Withdrawable Balance
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-2">
              <span className="text-emerald-600">₹ {availableBalance.toLocaleString('en-IN')}</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Ready for Transfer
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Includes Today's Direct (₹{earnings.today.toLocaleString('en-IN')}) + Passive Earnings (₹{earnings.passiveIncome.toLocaleString('en-IN')})
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center space-x-3 w-full sm:w-auto">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Verified Destination</p>
              <p className="text-[11px] text-emerald-700">{profile.upiId}</p>
            </div>
          </div>
        </div>

        {/* Withdrawal Form Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Request Withdrawal Transfer</h3>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Payout Request Submitted Successfully!</h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Your withdrawal request of <strong>₹{Number(amount).toLocaleString('en-IN')}</strong> has been queued for immediate bank settlement via IMPS.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Enter Withdrawal Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 2500)"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Transfer Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Payout Channel
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod('upi')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      method === 'upi'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">Instant UPI Transfer</p>
                      <p className="text-[11px] text-gray-500 font-mono">{profile.upiId}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Fastest
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('bank')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      method === 'bank'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">Bank Account (IMPS/NEFT)</p>
                      <p className="text-[11px] text-gray-500 font-mono">A/C: {profile.bankAccount}</p>
                    </div>
                    <Building2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  As per Indian Income Tax Act regulations, 5% TDS will be automatically deducted and credited to your linked PAN card.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all active:scale-98"
              >
                Confirm & Withdraw ₹{amount ? Number(amount).toLocaleString('en-IN') : '0'} ➔
              </button>
            </form>
          )}
        </div>

        {/* Transaction History & Passbook */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <History className="w-4 h-4 text-purple-600" />
                <span>Recent Commission & Payout History</span>
              </h3>
              <p className="text-xs text-gray-500">Live ledger of all credits, passive bonuses, and bank transfers</p>
            </div>

            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadedInvoice ? 'Statement Exported! ✓' : 'Export Statement (CSV)'}</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.type === 'direct' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">{tx.packageName}</h5>
                    <p className="text-[11px] text-gray-500">
                      {tx.date} · {tx.type === 'direct' ? 'Direct Affiliate Bonus' : 'Tier-2 Passive Bonus'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs sm:text-sm font-black text-emerald-600">
                    +₹{tx.amount.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
