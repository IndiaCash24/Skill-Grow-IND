import React, { useState } from 'react';
import { X, Wallet, CheckCircle, Clock, ArrowDownLeft, AlertCircle, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, EarningStats } from '../types';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  earnings: EarningStats;
  onRequestWithdrawal: (amount: number, method: string) => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({
  isOpen,
  onClose,
  profile,
  earnings,
  onRequestWithdrawal,
}) => {
  if (!isOpen) return null;

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const currentAvailable = Math.max(earnings.today + earnings.passiveIncome, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }

    if (withdrawAmount > 100000) {
      setError('Daily withdrawal limit is ₹1,00,000.');
      return;
    }

    setError('');
    onRequestWithdrawal(withdrawAmount, method === 'upi' ? profile.upiId : profile.bankAccount);
    setSubmitted(true);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#10B981', '#3B82F6', '#EC4899'],
    });

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        id="payout-modal-container"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Wallet className="w-6 h-6 text-emerald-200" />
            <div>
              <h3 className="font-bold text-lg">Instant Payout Request</h3>
              <p className="text-xs text-emerald-100">Same-day bank settlement via NEFT / IMPS / UPI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Payout Request Approved!</h4>
            <p className="text-xs text-gray-600">
              ₹{Number(amount).toLocaleString('en-IN')} has been queued for payout to{' '}
              {method === 'upi' ? profile.upiId : 'Verified Bank Account'}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Balance Overview */}
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">
                  Available for Payout
                </span>
                <p className="text-xl font-extrabold text-emerald-950">
                  ₹ {earnings.allTime > 0 ? earnings.allTime.toLocaleString('en-IN') : '0'}
                </p>
              </div>
              <span className="text-xs bg-emerald-200/80 text-emerald-900 font-bold px-2.5 py-1 rounded-md">
                KYC Active
              </span>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Enter Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl text-base font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Transfer method */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Payout Destination
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    method === 'upi'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-xs font-bold text-gray-900">UPI Instant</span>
                  <span className="text-[11px] text-gray-500 truncate block mt-0.5">
                    {profile.upiId}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    method === 'bank'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-xs font-bold text-gray-900">Bank Transfer</span>
                  <span className="text-[11px] text-gray-500 truncate block mt-0.5">
                    SBI (•• 4921)
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Note */}
            <p className="text-[11px] text-gray-500">
              * Skill Grow IND processes automated payouts daily between 6:00 PM and 9:00 PM IST directly to
              verified affiliate accounts with 0% gateway deductions.
            </p>

            {/* Submit */}
            <button
              id="submit-payout-btn"
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Confirm & Withdraw Now</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
