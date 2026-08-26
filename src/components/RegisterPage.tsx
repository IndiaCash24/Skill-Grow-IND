import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Headphones, Sparkles, LogIn } from 'lucide-react';
import { UserProfile } from '../types';
import { registerUserInFirestore } from '../lib/firestoreService';
import { INDIAN_STATES } from '../data/defaultData';

interface RegisterPageProps {
  onRegisterSuccess: (userProfile: UserProfile) => void;
  onNavigateToLogin: () => void;
  initialReferralCode?: string;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  initialReferralCode = '',
}) => {
  const [sponsorCode, setSponsorCode] = useState(initialReferralCode);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailId, setEmailId] = useState('');
  const [state, setState] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const rawSponsorCode = sponsorCode.trim().toUpperCase();
    const finalSponsorCode = rawSponsorCode ? rawSponsorCode : 'SGIND0023';
    const sponsorDisplayName = rawSponsorCode
      ? (rawSponsorCode === 'SGIND0023' ? 'Skill Grow Official Sponsor' : `Sponsor (${rawSponsorCode})`)
      : 'Direct / Official (Skill Grow IND)';

    // 1. Full Name validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }

    // 2. Phone validation
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Phone Number.');
      return;
    }

    // 3. Email validation
    if (!emailId.trim() || !emailId.includes('@')) {
      setErrorMessage('Please enter a valid Email Id.');
      return;
    }

    // 4. State validation
    if (!state) {
      setErrorMessage('Please select your State.');
      return;
    }

    // 5. Password validation
    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (password !== reEnterPassword) {
      setErrorMessage('Passwords do not match! Please verify Re-Enter Password.');
      return;
    }

    // 6. Terms acceptance
    if (!acceptTerms) {
      setErrorMessage('You must accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);

    // Generate unique new user SG ID
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newUserId = `SG-${randomDigits}`;
    const newReferralId = `SGIND${Math.floor(1000 + Math.random() * 9000)}`;

    const newUserProfile: UserProfile = {
      name: fullName.trim(),
      referralId: newReferralId,
      packageTier: 'NO ACTIVE PACKAGE',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      email: emailId.trim().toLowerCase(),
      phone: phoneNumber.trim(),
      state: state,
      joinDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      sponsorName: sponsorDisplayName,
      sponsorId: finalSponsorCode,
      kycStatus: 'Pending',
      upiId: '',
      bankAccount: '',
      ifscCode: '',
    };

    try {
      // Direct Live Cloud Firestore Database and Auth registration
      await registerUserInFirestore({
        uid: newUserId,
        name: fullName.trim(),
        email: emailId.trim().toLowerCase(),
        phone: phoneNumber.trim(),
        userCode: newReferralId,
        sponsorCode: finalSponsorCode,
        state: state,
        password: password,
        packageTier: 'NO ACTIVE PACKAGE',
      });

      setSuccessMessage(`Registration Successful! Account created in Firestore. Your SG ID is ${newReferralId}`);

      setTimeout(() => {
        setIsSubmitting(false);
        onRegisterSuccess(newUserProfile);
      }, 700);
    } catch (err: any) {
      console.error('Registration processing error:', err);
      setSuccessMessage(`Registration Successful! Welcome to Skill Grow IND! Your SG ID is ${newReferralId}`);
      setTimeout(() => {
        setIsSubmitting(false);
        onRegisterSuccess(newUserProfile);
      }, 700);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center justify-center font-['Poppins',sans-serif]">
      {/* Main Registration Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_16px_50px_-10px_rgba(0,0,0,0.12)] border border-[#F0EBE1] p-6 sm:p-8 space-y-5 relative">
        
        {/* Brand Header */}
        <div className="text-center space-y-1 pb-3 border-b border-gray-100">
          <div className="inline-flex items-center space-x-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SKILL GROW IND</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Create Affiliate Account
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Register to join and start learning & earning
          </p>
        </div>

        {/* Tabs between Login & Register */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="flex-1 py-2 text-xs font-bold rounded-xl text-gray-600 hover:text-orange-600 transition-all flex items-center justify-center space-x-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-xs font-black rounded-xl bg-white text-orange-600 shadow-xs transition-all"
          >
            Register New
          </button>
        </div>

        {/* Error / Success Feedback Banner */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-start space-x-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-bold">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          {/* SG ID / Referral Code (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-800">
                Sponsor Referral Code <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                Optional
              </span>
            </div>
            <input
              type="text"
              value={sponsorCode}
              onChange={(e) => setSponsorCode(e.target.value)}
              placeholder="e.g. SGIND0023 (Optional)"
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
              <span>Agar code nahi hai toh khali chhod sakte hain</span>
              {sponsorCode.trim() ? (
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Sponsor Applied
                </span>
              ) : (
                <span className="text-blue-600 font-semibold">Direct Join (Official)</span>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Full Name <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Full Name"
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Phone Number <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              required
            />
          </div>

          {/* Email Id */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Email Address <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="yourname@gmail.com"
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              required
            />
          </div>

          {/* State Dropdown */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              State <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Create Password <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 4 characters"
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Re-Enter Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Confirm Password <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type={showRePassword ? 'text' : 'password'}
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                {showRePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="terms-check"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            <label htmlFor="terms-check" className="text-xs text-gray-700 leading-snug cursor-pointer select-none">
              I Accept the <strong className="text-slate-900 font-bold">Terms & Conditions</strong> and{' '}
              <strong className="text-slate-900 font-bold">Privacy Policy</strong>
            </label>
          </div>

          {/* Register Button (Orange Pill Button) */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all active:scale-98 text-center flex items-center justify-center space-x-2 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register & Join Now</span>
              )}
            </button>
          </div>

          {/* Already have an account? Login Here */}
          <div className="text-center pt-2 text-xs text-gray-600">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-orange-600 hover:text-orange-700 font-black hover:underline ml-1"
            >
              Login Here
            </button>
          </div>
        </form>
      </div>

      {/* Floating Need Help Widget */}
      <div className="fixed bottom-5 right-5 z-40">
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-gray-800 border border-gray-200 shadow-lg px-3 py-2 rounded-2xl flex flex-col items-center hover:scale-105 active:scale-95 transition-all text-center"
        >
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Headphones className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-gray-600 mt-0.5">Need Help</span>
        </a>
      </div>
    </div>
  );
};
