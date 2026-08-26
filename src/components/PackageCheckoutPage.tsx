import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  QrCode,
  CreditCard,
  Building2,
  Percent,
  Check,
  AlertCircle,
  Tag,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { PackageItem, UserProfile } from '../types';
import { allPackages } from '../data/defaultData';
import confetti from 'canvas-confetti';

interface PackageCheckoutPageProps {
  initialPackage?: PackageItem;
  profile: UserProfile;
  onSuccessfulEnrollment: (pkg: PackageItem) => void;
  onNavigate: (view: any) => void;
}

export const PackageCheckoutPage: React.FC<PackageCheckoutPageProps> = ({
  initialPackage = allPackages[3], // Platinum by default
  profile,
  onSuccessfulEnrollment,
  onNavigate,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<PackageItem>(initialPackage);
  const [sponsorCode, setSponsorCode] = useState(profile.sponsorId || 'SGIND0001');
  const [sponsorVerified, setSponsorVerified] = useState(true);
  const [sponsorName, setSponsorName] = useState(profile.sponsorName || 'Skill Grow IND Founder Network');
  const [paymentMode, setPaymentMode] = useState<'qr' | 'upi' | 'card'>('qr');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [studentName, setStudentName] = useState(profile.name || '');
  const [studentEmail, setStudentEmail] = useState(profile.email || '');
  const [studentPhone, setStudentPhone] = useState(profile.phone || '');

  // Referral discount logic
  const discountAmount = sponsorVerified ? 200 : 0;
  const finalPrice = Math.max(selectedPkg.price - discountAmount, 999);

  const handleVerifySponsor = () => {
    if (sponsorCode.trim().length >= 4) {
      setSponsorVerified(true);
      setSponsorName(
        sponsorCode.toUpperCase().includes('0023')
          ? 'Surendra Kumar (Verified Top Sponsor)'
          : 'Skill Grow IND Official Sponsor'
      );
    } else {
      setSponsorVerified(false);
    }
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setCompletedSuccess(true);
      onSuccessfulEnrollment(selectedPkg);

      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#9333EA', '#F59E0B', '#10B981', '#EC4899'],
        });
      } catch {
        // ignore
      }
    }, 1500);
  };

  return (
    <div id="package-checkout-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('packages')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Packages Catalog</span>
            </button>

            <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center space-x-2">
              <span>Enroll & Package Checkout</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              Complete your enrollment, get instant access to courses, training webinars, and start earning up to 70% direct commissions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {completedSuccess ? (
          /* Success Screen */
          <div className="bg-white rounded-3xl border border-emerald-300 p-6 sm:p-10 shadow-lg text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Enrollment Activated
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Welcome to {selectedPkg.name}!
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                Congratulations! Your account has been upgraded to <span className="font-bold text-slate-900">{selectedPkg.name}</span>. You can now access all {selectedPkg.modulesCount} course modules and start sharing your affiliate link to earn commissions.
              </p>
            </div>

            <div className="bg-gray-50 max-w-md mx-auto p-4 rounded-2xl border border-gray-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800">TXN-SG{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-bold text-emerald-600">₹ {finalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Direct Commission Unlocked:</span>
                <span className="font-bold text-purple-700">₹ {selectedPkg.directCommission.toLocaleString('en-IN')} / sale</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-105"
              >
                Go to Earning Dashboard
              </button>
              <button
                type="button"
                onClick={() => onNavigate('referral')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
              >
                Get My Affiliate Link
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Package Selection & Student Details (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Package Switcher */}
              <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  1. Select Package
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allPackages.map((pkg) => {
                    const isSelected = selectedPkg.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-extrabold text-sm text-slate-900">{pkg.name}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{pkg.tagline}</p>
                        <div className="mt-2 flex items-baseline justify-between">
                          <span className="text-base font-black text-slate-900">
                            ₹ {pkg.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            ₹{pkg.directCommission} Comm.
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sponsor Verification */}
              <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-500" />
                  <span>2. Sponsor / Referral Discount Code</span>
                </h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sponsorCode}
                    onChange={(e) => {
                      setSponsorCode(e.target.value);
                      setSponsorVerified(false);
                    }}
                    placeholder="Enter Sponsor ID (e.g. SGIND0023)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold uppercase tracking-wider focus:ring-2 focus:ring-purple-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleVerifySponsor}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Verify Sponsor
                  </button>
                </div>

                {sponsorVerified && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold">Sponsor Verified:</span> {sponsorName}
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      -₹{discountAmount} Discount Applied
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Student Info */}
              <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  3. Student Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Student Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-gray-700">WhatsApp / Contact Number</label>
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Instant Payment Gateway (1 Col) */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs border-b border-gray-100 pb-4">
                  <div className="flex justify-between text-slate-700">
                    <span>{selectedPkg.name}</span>
                    <span className="font-semibold">₹ {selectedPkg.price.toLocaleString('en-IN')}</span>
                  </div>
                  {sponsorVerified && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Sponsor Referral Discount</span>
                      <span>- ₹ {discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>GST (18% Included)</span>
                    <span className="text-emerald-700 font-bold">Inclusive</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-extrabold text-slate-900 text-sm">Total Payable</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹ {finalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Choose Payment Gateway
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('qr')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        paymentMode === 'qr'
                          ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <QrCode className="w-4 h-4 mx-auto mb-1" />
                      <span>UPI QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('upi')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        paymentMode === 'upi'
                          ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Zap className="w-4 h-4 mx-auto mb-1" />
                      <span>UPI Apps</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('card')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        paymentMode === 'card'
                          ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1" />
                      <span>Card / Net</span>
                    </button>
                  </div>

                  {paymentMode === 'qr' && (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-center space-y-2">
                      <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto border border-gray-200 shadow-xs flex items-center justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=skillgrowind@icici&pn=SkillGrowIND&am=${finalPrice}&cu=INR`}
                          alt="UPI Payment QR Code"
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Scan with GPay, PhonePe, Paytm, or BHIM to pay instantly
                      </p>
                    </div>
                  )}

                  {paymentMode === 'upi' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        placeholder="yourname@okaxis or mobile@upi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleCompletePayment}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <span>Processing Secure Payment...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{finalPrice.toLocaleString('en-IN')} & Enroll Now</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-gray-400">
                  Instant activation • 100% Secure • Skill Grow IND Official Gateway
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
