import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, Headphones } from 'lucide-react';
import { UserProfile } from '../types';
import { registerUserInFirestore } from '../lib/firestoreService';

interface RegisterPageProps {
  onRegisterSuccess: (userProfile: UserProfile) => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
  initialReferralCode?: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi NCR',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateToHome,
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

  // Validate referral code (Optional: valid if empty or valid code)
  const validateReferralCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return true; // Optional - empty is completely valid
    if (trimmed === 'SGIND0023' || trimmed === 'DIRECT') return true;

    // Check existing stored users or allow valid alphanumeric code
    try {
      const stored = localStorage.getItem('skillgrow_registered_users');
      if (stored) {
        const users = JSON.parse(stored);
        if (Array.isArray(users) && users.some((u) => u.referralId?.toUpperCase() === trimmed || u.id?.toUpperCase() === trimmed)) {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return trimmed.length >= 3;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const rawSponsorCode = sponsorCode.trim().toUpperCase();
    // If referral code is provided, use it. If not provided, fallback to default official sponsor
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

    // Generate unique new user SG ID
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newUserId = `SG-${randomDigits}`;
    const newReferralId = `SGIND${Math.floor(1000 + Math.random() * 9000)}`;

    const newUserProfile: UserProfile = {
      name: fullName.trim(),
      referralId: newReferralId,
      packageTier: 'SILVER PACKAGE',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      email: emailId.trim().toLowerCase(),
      phone: phoneNumber.trim(),
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

    // 1. Write to Live Cloud Firestore Database
    registerUserInFirestore({
      uid: newUserId,
      name: fullName.trim(),
      email: emailId.trim().toLowerCase(),
      phone: phoneNumber.trim(),
      userCode: newReferralId,
      sponsorCode: finalSponsorCode,
      state: state,
      packageTier: 'SILVER PACKAGE',
    }).catch((err) => {
      console.warn('Firestore background write error:', err);
    });

    // 2. Also keep local persistence for offline sync
    try {
      const storedUsersRaw = localStorage.getItem('skillgrow_registered_users');
      const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      registeredUsers.push({
        id: newUserId,
        referralId: newReferralId,
        name: fullName.trim(),
        email: emailId.trim().toLowerCase(),
        phone: phoneNumber.trim(),
        state: state,
        password: password,
        sponsorId: finalSponsorCode,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('skillgrow_registered_users', JSON.stringify(registeredUsers));
    } catch {
      // ignore
    }

    setSuccessMessage(`Registration Successful! Welcome to Skill Grow IND! Your ID is ${newUserId}`);
    setTimeout(() => {
      onRegisterSuccess(newUserProfile);
    }, 900);
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] py-4 sm:py-8 px-3 sm:px-6 flex flex-col items-center justify-start font-['Poppins',sans-serif]">
      {/* Top back button */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 px-1">
        <button
          onClick={onNavigateToHome}
          type="button"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={onNavigateToLogin}
          type="button"
          className="text-xs font-bold text-orange-600 hover:underline"
        >
          Login
        </button>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_10px_35px_-8px_rgba(0,0,0,0.08)] border border-[#F0EBE1] p-6 sm:p-8 space-y-5 relative">
        
        {/* Title and Subtitle */}
        <div className="space-y-1.5 text-left">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#D97706] tracking-tight">
            Become Skill Grow IND Member
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed font-normal">
            Top instructors from around the world teach millions of students on Skill Grow IND
          </p>
        </div>

        {/* Error / Success Feedback Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start space-x-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          {/* SG ID / Referral Code (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-800">
                SG ID / Referral Code <span className="text-xs text-gray-400 font-normal">(Optional)</span>
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
              className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
              <span>Agar referral code nahi hai toh khali chhod sakte hain</span>
              {sponsorCode.trim() ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Sponsor Applied
                </span>
              ) : (
                <span className="text-blue-600 font-medium">Direct Join (Official)</span>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-800">
              Full Name <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Full Name"
              className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-800">
              Phone Number <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="91xxxxxxxxxx"
              className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Email Id */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-800">
              Email Id <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Your Email"
              className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* State Dropdown */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-800">
              State <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all appearance-none cursor-pointer"
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
            <label className="block text-xs font-semibold text-gray-800">
              Password <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Re-Enter Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-800">
              Re-Enter Password <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type={showRePassword ? 'text' : 'password'}
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
                placeholder="Re-Enter Password"
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
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
          <div className="pt-3 flex justify-center">
            <button
              type="submit"
              className="w-full max-w-[200px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm sm:text-base py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 text-center"
            >
              Register
            </button>
          </div>

          {/* Already have an account? Login Here */}
          <div className="text-center pt-2 text-xs text-gray-600">
            <span>Already have an account ? </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-[#D97706] hover:text-[#B45309] font-bold hover:underline"
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
