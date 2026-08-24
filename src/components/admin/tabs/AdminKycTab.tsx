import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Building,
  CreditCard,
  X,
} from 'lucide-react';
import { AdminKycRecord } from '../../../types';

interface AdminKycTabProps {
  kycList: AdminKycRecord[];
  onApproveKyc: (kycId: string) => void;
  onRejectKyc: (kycId: string, reason: string) => void;
}

export const AdminKycTab: React.FC<AdminKycTabProps> = ({
  kycList,
  onApproveKyc,
  onRejectKyc,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reject modal state
  const [rejectingItem, setRejectingItem] = useState<AdminKycRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('Bank account name does not match PAN details. Please re-enter correct name.');

  const pendingCount = kycList.filter((k) => k.status === 'Pending').length;
  const verifiedCount = kycList.filter((k) => k.status === 'Verified').length;
  const rejectedCount = kycList.filter((k) => k.status === 'Rejected').length;

  const filteredKyc = kycList.filter((k) => {
    const matchSearch =
      k.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.userCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.panNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.bankAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.ifscCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || k.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;
    onRejectKyc(rejectingItem.id, rejectReason);
    setRejectingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-500 text-white p-5 rounded-2xl shadow-lg shadow-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-100">Pending Review</span>
            <Clock className="w-5 h-5 text-amber-200" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">{pendingCount} Verifications</div>
          <div className="text-xs font-semibold text-amber-100 mt-1">Requires admin approval</div>
        </div>

        <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-lg shadow-emerald-600/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-100">Verified Affiliates</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">{verifiedCount} Affiliates</div>
          <div className="text-xs font-semibold text-emerald-100 mt-1">Full payout clearance enabled</div>
        </div>

        <div className="bg-rose-600 text-white p-5 rounded-2xl shadow-lg shadow-rose-600/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-rose-100">Rejected KYC</span>
            <XCircle className="w-5 h-5 text-rose-200" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">{rejectedCount} Submissions</div>
          <div className="text-xs font-semibold text-rose-100 mt-1">Pending user correction</div>
        </div>
      </div>

      {/* KYC Table Container */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">KYC & Bank Compliance Hub</h2>
          <p className="text-xs text-slate-500">
            Verify submitted PAN Card, Aadhaar Card, and Bank Account records prior to issuing payout clearances.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Name, Code, PAN, Bank Account, IFSC..."
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
              <option value="ALL">All KYC Status</option>
              <option value="Pending">Pending Only ({pendingCount})</option>
              <option value="Verified">Verified ({verifiedCount})</option>
              <option value="Rejected">Rejected ({rejectedCount})</option>
            </select>
          </div>
        </div>

        {/* KYC Cards / Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredKyc.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-slate-400">
              No KYC records match your criteria.
            </div>
          ) : (
            filteredKyc.map((kyc) => (
              <div
                key={kyc.id}
                className={`p-5 rounded-2xl border transition-all text-xs space-y-3 ${
                  kyc.status === 'Pending'
                    ? 'border-amber-200 bg-amber-50/30 shadow-xs'
                    : kyc.status === 'Verified'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-xs">
                      {kyc.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm">{kyc.userName}</div>
                      <div className="text-[10px] text-slate-500">
                        Code: <span className="font-mono font-bold">{kyc.userCode}</span> • {kyc.submittedAt}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      kyc.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : kyc.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {kyc.status}
                  </span>
                </div>

                {/* Bank & Tax Details */}
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Bank Name</span>
                    <span className="font-bold text-slate-900">{kyc.bankName || 'N/A'}</span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Account Holder</span>
                    <span className="font-bold text-slate-900">{kyc.bankHolderName || kyc.userName}</span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Account Number</span>
                    <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                      <span>{kyc.bankAccount}</span>
                      <button
                        onClick={() => handleCopy(kyc.bankAccount, `acc-${kyc.id}`)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {copiedId === `acc-${kyc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">IFSC Code</span>
                    <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                      <span>{kyc.ifscCode}</span>
                      <button
                        onClick={() => handleCopy(kyc.ifscCode, `ifsc-${kyc.id}`)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {copiedId === `ifsc-${kyc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">PAN Card</span>
                    <span className="font-mono font-bold text-slate-900">{kyc.panNumber || 'N/A'}</span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">UPI ID</span>
                    <span className="font-mono font-bold text-slate-900">{kyc.upiId || 'N/A'}</span>
                  </div>
                </div>

                {/* Rejection notice if present */}
                {kyc.rejectionReason && (
                  <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-rose-800 text-[11px]">
                    <span className="font-bold block">Rejection Remark:</span>
                    {kyc.rejectionReason}
                  </div>
                )}

                {/* Action buttons */}
                {kyc.status === 'Pending' && (
                  <div className="pt-2 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setRejectingItem(kyc)}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-all cursor-pointer"
                    >
                      Reject with Reason
                    </button>
                    <button
                      onClick={() => onApproveKyc(kyc.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
                    >
                      Verify & Approve KYC
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: Reject KYC */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-fade-in text-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-900 text-white">
              <div>
                <h3 className="font-black text-base">Reject KYC Verification</h3>
                <p className="text-xs text-rose-200">{rejectingItem.userName} ({rejectingItem.userCode})</p>
              </div>
              <button
                onClick={() => setRejectingItem(null)}
                className="p-1.5 text-rose-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-5 space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Quick Select Preset Reason</label>
                <select
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold bg-white mb-2"
                >
                  <option value="Bank account name does not match PAN details. Please re-enter correct name.">
                    Name mismatch between Bank & PAN
                  </option>
                  <option value="Invalid IFSC code provided. Please verify bank branch code.">
                    Invalid IFSC Code
                  </option>
                  <option value="Invalid PAN Number format. Please enter 10-character alphanumeric PAN.">
                    Invalid PAN Number
                  </option>
                  <option value="Account number length incorrect. Please recheck your passbook/cheque.">
                    Account number incorrect
                  </option>
                </select>

                <label className="font-bold text-slate-700 block mb-1">Custom Message Shown to User</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
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
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
