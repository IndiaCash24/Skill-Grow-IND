import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Lock,
  AlertCircle,
  FileCheck,
  QrCode,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface KycPageProps {
  profile: UserProfile;
  onUpdateKyc: (upiId: string, bankAccount: string, ifscCode: string) => void;
  onNavigate: (view: any) => void;
}

export const KycPage: React.FC<KycPageProps> = ({ profile, onUpdateKyc, onNavigate }) => {
  const [upi, setUpi] = useState(profile.upiId);
  const [bank, setBank] = useState(profile.bankAccount);
  const [ifsc, setIfsc] = useState(profile.ifscCode);
  const [accountHolder, setAccountHolder] = useState(profile.name);
  const [bankName, setBankName] = useState('STATE BANK OF INDIA');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateKyc(upi.trim(), bank.trim(), ifsc.trim().toUpperCase());
    setSaved(true);

    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div id="kyc-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <span className="text-[11px] font-bold bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KYC Level 2 Verified</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Bank Details & KYC Verification
            </h1>
            <p className="text-xs sm:text-sm text-blue-100">
              Manage your verified bank account and UPI details for automated, seamless daily earnings payouts.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <span>Govt Verified Partner Account</span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Aadhaar (UIDAI) & PAN verified for <strong>{profile.name}</strong>. Payouts enabled without threshold restrictions.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">PAN Linked</span>
            <p className="text-xs font-mono font-bold text-slate-800">XXXX-XXXX-9842</p>
          </div>
        </div>

        {/* Bank & UPI Form Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Primary Payout Account Details
              </h3>
            </div>

            <span className="text-xs text-gray-400 flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>256-Bit Encrypted</span>
            </span>
          </div>

          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm p-4 rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Bank details & KYC preferences updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Account Holder Full Name
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Primary UPI ID (GPay / PhonePe / Paytm)
                </label>
                <input
                  type="text"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="e.g. roshni@okaxis"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bank IFSC Code
                </label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bank Name & Branch
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                Save & Update Bank Information ➔
              </button>
            </div>
          </form>
        </div>

        {/* KYC Document Verification Guidelines */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            KYC Security & Compliance Guidelines
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Name Match Rule
              </span>
              <p>The bank account name must match your registered Skill Grow affiliate profile name.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Automated Payouts
              </span>
              <p>Approved earnings are directly transferred every evening between 6:00 PM and 10:00 PM IST.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" /> TDS Tax Compliance
              </span>
              <p>Form 16A quarterly TDS certificates can be downloaded anytime from the Payouts page.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
