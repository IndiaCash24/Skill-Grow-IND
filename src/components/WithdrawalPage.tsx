import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  AlertCircle,
  Building2,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  History,
  ArrowRight,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { UserProfile, EarningStats, Transaction } from '../types';
import confetti from 'canvas-confetti';
import { createPayoutRequestInFirestore } from '../lib/firestoreService';

interface WithdrawalPageProps {
  profile: UserProfile;
  earnings: EarningStats;
  onRequestWithdrawal: (amount: number, method: string) => void;
  onNavigate: (view: any) => void;
}

export const WithdrawalPage: React.FC<WithdrawalPageProps> = ({
  profile,
  earnings,
  onRequestWithdrawal,
  onNavigate,
}) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [lastRequestAmount, setLastRequestAmount] = useState(0);

  const availableBalance = earnings.walletBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount < 500) {
      setError('Minimum withdrawal amount is ₹500.');
      return;
    }

    if (withdrawAmount > availableBalance) {
      setError(`Insufficient wallet balance. You have ₹${availableBalance.toLocaleString('en-IN')} available.`);
      return;
    }

    if (withdrawAmount > 100000) {
      setError('Maximum daily instant withdrawal limit is ₹1,00,000.');
      return;
    }

    setError('');
    const targetDest = method === 'upi'
      ? (profile.upiId || 'affiliate@oksbi')
      : `${profile.bankName || 'Bank'} (${profile.bankAccount || '•••• 4921'})`;
    
    onRequestWithdrawal(withdrawAmount, targetDest);

    // Sync payout request to Cloud Firestore
    createPayoutRequestInFirestore({
      userId: profile.referralId || 'user',
      userName: profile.name,
      userCode: profile.referralId || 'SGIND0023',
      amount: withdrawAmount,
      payoutMethod: method === 'upi' ? 'UPI' : 'IMPS_BANK',
      destination: targetDest,
    }).catch((err) => {
      console.warn('Firestore payout request error:', err);
    });

    setLastRequestAmount(withdrawAmount);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#10B981', '#3B82F6', '#EC4899', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    setAmount('');
  };

  return (
    <div id="withdrawal-request-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('withdrawal-history')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 px-3.5 py-1.5 rounded-full transition-all shadow-xs"
            >
              <History className="w-3.5 h-3.5" />
              <span>View Withdrawal History</span>
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center space-x-2">
              <span>Request Payout / Withdrawal</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Withdraw your affiliate commissions directly into your verified bank account or UPI ID with same-day settlement.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Available Balance Header Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Available Withdrawable Balance
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-2">
              <span className="text-emerald-600">₹ {availableBalance.toLocaleString('en-IN')}</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Ready to Payout
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Minimum withdrawal: ₹500 | Max instant limit: ₹1,00,000 / day
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('bank-kyc')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Bank / KYC</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('withdrawal-history')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Payouts</span>
            </button>
          </div>
        </div>

        {/* Withdrawal Success Banner */}
        {submitted && (
          <div className="bg-emerald-50 border-2 border-emerald-400 p-5 rounded-3xl text-emerald-900 space-y-2 animate-fade-in shadow-md">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <h4 className="font-extrabold text-base">Withdrawal Request Submitted Successfully!</h4>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your payout request for <span className="font-bold">₹{lastRequestAmount.toLocaleString('en-IN')}</span> has been registered into the queue. The payout will be processed to your {method === 'upi' ? 'UPI' : 'Bank Account'} during the daily settlement window (6:00 PM – 10:00 PM IST).
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('withdrawal-history')}
                className="inline-flex items-center space-x-1 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl transition-colors shadow-xs"
              >
                <span>Track in Withdrawal History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Payout Request Form Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Enter Withdrawal Amount</h3>
              <p className="text-xs text-gray-500">Commissions are sent automatically via IMPS / UPI 24x7</p>
            </div>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center space-x-1">
              <Clock className="w-3 h-3 mr-0.5" /> 6 PM - 10 PM Batch
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3.5 rounded-2xl flex items-center space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Withdrawal Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min={500}
                  max={100000}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full pl-9 pr-24 py-3.5 rounded-2xl border border-gray-300 text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-hidden bg-gray-50/50"
                />
                <button
                  type="button"
                  onClick={() => setAmount(String(availableBalance))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-extrabold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Withdraw All
                </button>
              </div>

              {/* Quick Amount Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[500, 1000, 2000, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    disabled={availableBalance < preset}
                    onClick={() => setAmount(String(preset))}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                      amount === String(preset)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : availableBalance >= preset
                        ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                        : 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200'
                    }`}
                  >
                    + ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Method Selection */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Destination Account
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* UPI ID Option */}
                <div
                  onClick={() => setMethod('upi')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    method === 'upi'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        UPI
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">Instant UPI VPA</span>
                    </div>
                    {method === 'upi' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {profile.upiId || 'surendra@oksbi'}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block mt-1.5">
                    Fastest (0% Fee)
                  </span>
                </div>

                {/* Bank Account Option */}
                <div
                  onClick={() => setMethod('bank')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    method === 'bank'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">IMPS Bank Account</span>
                    </div>
                    {method === 'bank' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {profile.bankName || 'State Bank of India'} ({profile.bankAccount || '•••• 4921'})
                  </p>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-100/80 px-2 py-0.5 rounded-full inline-block mt-1.5">
                    IFSC: {profile.ifscCode || 'SBIN0004921'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payout Terms & Policy Info */}
            <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl text-amber-900 text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Skill Grow IND Payout Rules</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800/90 pl-1">
                <li>Withdrawal requests are processed every evening between 6:00 PM and 10:00 PM IST.</li>
                <li>TDS @ 5% as per Govt. of India guidelines is deducted on affiliate payouts.</li>
                <li>Ensure your KYC and Bank details match your PAN card to avoid rejection.</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={availableBalance < 500}
              className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
                availableBalance >= 500
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.98]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Confirm & Request ₹{Number(amount) > 0 ? Number(amount).toLocaleString('en-IN') : 'Payout'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
