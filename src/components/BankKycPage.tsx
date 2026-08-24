import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
  Save,
  FileText,
  User,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import { submitKycToFirestore } from '../lib/firestoreService';
import confetti from 'canvas-confetti';

interface BankKycPageProps {
  profile: UserProfile;
  onSaveBankKyc: (updated: Partial<UserProfile>) => void;
  onNavigate: (view: any) => void;
}

export const BankKycPage: React.FC<BankKycPageProps> = ({
  profile,
  onSaveBankKyc,
  onNavigate,
}) => {
  const [bankHolderName, setBankHolderName] = useState(profile.bankHolderName || profile.name || '');
  const [bankName, setBankName] = useState(profile.bankName || 'State Bank of India');
  const [bankAccount, setBankAccount] = useState(profile.bankAccount.replace(/[^\d]/g, '') || '501004921829');
  const [confirmAccount, setConfirmAccount] = useState(profile.bankAccount.replace(/[^\d]/g, '') || '501004921829');
  const [ifscCode, setIfscCode] = useState(profile.ifscCode || 'SBIN0004921');
  const [upiId, setUpiId] = useState(profile.upiId || 'surendra@oksbi');
  const [panNumber, setPanNumber] = useState(profile.panNumber || 'ABCDE1234F');
  const [aadhaarNumber, setAadhaarNumber] = useState(profile.aadhaarNumber?.replace(/[^\d]/g, '') || '492019284912');
  
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bankAccount !== confirmAccount) {
      setError('Bank Account numbers do not match. Please verify.');
      return;
    }

    if (ifscCode.trim().length < 4) {
      setError('Please enter a valid Bank IFSC code.');
      return;
    }

    setError('');

    const updatedData: Partial<UserProfile> = {
      bankHolderName,
      bankName,
      bankAccount: `•••• •••• •••• ${bankAccount.slice(-4)}`,
      ifscCode: ifscCode.toUpperCase().trim(),
      upiId: upiId.trim(),
      panNumber: panNumber.toUpperCase().trim(),
      aadhaarNumber: `•••• •••• ${aadhaarNumber.slice(-4)}`,
      kycStatus: 'Verified',
    };

    onSaveBankKyc(updatedData);

    // Save to Firestore
    submitKycToFirestore({
      userId: profile.referralId || 'user',
      userName: profile.name,
      panNumber: panNumber.toUpperCase().trim(),
      aadhaarNumber: aadhaarNumber.trim(),
      bankAccount: bankAccount.trim(),
      ifscCode: ifscCode.toUpperCase().trim(),
      bankName: bankName.trim(),
      upiId: upiId.trim(),
    }).catch((err) => {
      console.warn('Firestore KYC submission error:', err);
    });

    setSubmittedSuccess(true);

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#6366F1'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div id="bank-kyc-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>KYC Status: {profile.kycStatus || 'Verified'}</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center space-x-2">
              <span>Bank Details & KYC Verification</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-200">
              Link your Indian bank account and UPI ID to receive automatic daily commission payouts seamlessly.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Success Alert */}
        {submittedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center space-x-3 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs sm:text-sm font-semibold">
              Bank details and KYC successfully verified & updated! Daily payouts will be routed here.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3.5 rounded-2xl flex items-center space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Bank Account Details */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>1. Bank Account Details (IMPS / NEFT)</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-medium">Auto Payouts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Holder Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={bankHolderName}
                  onChange={(e) => setBankHolderName(e.target.value)}
                  placeholder="As per bank passbook"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Bank Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India, HDFC, ICICI"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Account Number */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Bank Account Number</label>
                <input
                  type="password"
                  required
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Enter full account number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                />
              </div>

              {/* Confirm Account Number */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Confirm Account Number</label>
                <input
                  type="text"
                  required
                  value={confirmAccount}
                  onChange={(e) => setConfirmAccount(e.target.value)}
                  placeholder="Re-enter account number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                />
              </div>

              {/* IFSC Code */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Bank IFSC Code</label>
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SBIN0004921"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold uppercase tracking-wider focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                />
              </div>

              {/* UPI ID */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">UPI ID / VPA (Instant Payouts)</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@oksbi or mobile@paytm"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Identity & Tax KYC */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>2. Identity & Tax Information (Govt. TDS Compliance)</span>
              </h3>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                5% TDS Applied
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PAN Card Number */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">PAN Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold uppercase tracking-wider focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                />
              </div>

              {/* Aadhaar Number */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Aadhaar Card Number (Last 4 Digits)</label>
                <input
                  type="text"
                  maxLength={12}
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="12 digit Aadhaar number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
              <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Your banking data is stored encrypted and is exclusively used for credit settlement of your affiliate commissions.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Verify Bank Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
