import React, { useState } from 'react';
import { X, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateKyc: (upiId: string, bankAccount: string, ifscCode: string) => void;
}

export const KycModal: React.FC<KycModalProps> = ({ isOpen, onClose, profile, onUpdateKyc }) => {
  if (!isOpen) return null;

  const [upi, setUpi] = useState(profile.upiId);
  const [bank, setBank] = useState(profile.bankAccount);
  const [ifsc, setIfsc] = useState(profile.ifscCode);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateKyc(upi, bank, ifsc);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        id="kyc-modal-container"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-6 h-6 text-blue-200" />
            <div>
              <h3 className="font-bold text-lg">Bank Account & KYC</h3>
              <p className="text-xs text-blue-100">Linked destination for automated daily payouts</p>
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

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs sm:text-sm">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Aadhaar & PAN Verification Verified</p>
              <p className="text-[11px] text-emerald-700">Account status: Active Affiliate Tier 1</p>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Primary UPI ID (Google Pay / PhonePe / Paytm)</label>
            <input
              type="text"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Bank Account Number</label>
            <input
              type="text"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Bank IFSC Code</label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium uppercase"
              required
            />
          </div>

          {saved && (
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg flex items-center space-x-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bank & KYC details saved successfully!</span>
            </div>
          )}

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors"
            >
              Update Bank Details
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
