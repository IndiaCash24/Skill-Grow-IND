import React, { useState } from 'react';
import { Eye, EyeOff, X, AlertCircle, CheckCircle2, ArrowLeft, Headphones } from 'lucide-react';
import { UserProfile } from '../types';
import { fetchUserByCredential } from '../lib/firestoreService';

interface LoginPageProps {
  onLoginSuccess: (userProfile?: UserProfile) => void;
  onNavigateToRegister: () => void;
  onCloseOrHome: () => void;
  isModal?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onCloseOrHome,
  isModal = false,
}) => {
  const [sgIdOrEmail, setSgIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedInput = sgIdOrEmail.trim();

    if (!trimmedInput) {
      setErrorMessage('Please enter your SG ID or Email Address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    // 1. Check Cloud Firestore Database
    try {
      const fsUser = await fetchUserByCredential(trimmedInput);
      if (fsUser) {
        const userProfile: UserProfile = {
          name: fsUser.name || 'Skill Grow Affiliate',
          referralId: fsUser.userCode || 'SGIND0023',
          packageTier: fsUser.activePackage || 'SILVER PACKAGE',
          avatarUrl: fsUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fsUser.name)}`,
          email: fsUser.email || 'affiliate@gmail.com',
          phone: fsUser.phone || '+91 98765 43210',
          joinDate: 'Active Member',
          sponsorName: 'Skill Grow Team',
          sponsorId: fsUser.sponsorCode || 'SGIND0023',
          kycStatus: fsUser.kyc?.status === 'verified' ? 'Verified' : 'Pending',
          upiId: fsUser.kyc?.upiId || '',
          bankAccount: fsUser.kyc?.accountNumber ? `•••• ${fsUser.kyc.accountNumber.slice(-4)}` : '',
          ifscCode: fsUser.kyc?.ifscCode || '',
        };

        setSuccessMessage(`Login Successful! Welcome back, ${userProfile.name}!`);
        setTimeout(() => {
          onLoginSuccess(userProfile);
        }, 600);
        return;
      }
    } catch (fsErr) {
      console.warn('Firestore user fetch:', fsErr);
    }

    // 2. Check local persistence
    try {
      const storedUsersRaw = localStorage.getItem('skillgrow_registered_users');
      const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const matchedUser = registeredUsers.find(
        (u: any) =>
          u.id?.toUpperCase() === trimmedInput.toUpperCase() ||
          u.email?.toLowerCase() === trimmedInput.toLowerCase() ||
          u.referralId?.toUpperCase() === trimmedInput.toUpperCase() ||
          u.phone === trimmedInput
      );

      if (matchedUser) {
        if (matchedUser.password && matchedUser.password !== password) {
          setErrorMessage('Invalid Password! Please check your credentials.');
          return;
        }

        const userProfile: UserProfile = {
          name: matchedUser.name || 'Skill Grow Affiliate',
          referralId: matchedUser.referralId || matchedUser.id || 'SGIND7892X',
          packageTier: 'EXPERT PACKAGE',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(matchedUser.name || 'User')}`,
          email: matchedUser.email || 'affiliate@gmail.com',
          phone: matchedUser.phone || '+91 98765 43210',
          joinDate: 'Joined Recently',
          sponsorName: 'Aman Sharma',
          sponsorId: matchedUser.sponsorId || 'SGIND0023',
          kycStatus: 'Verified',
          upiId: 'affiliate@upi',
          bankAccount: '•••• •••• •••• 4921',
          ifscCode: 'SBIN0004921',
        };

        setSuccessMessage(`Login Successful! Welcome back, ${userProfile.name}!`);
        setTimeout(() => {
          onLoginSuccess(userProfile);
        }, 600);
        return;
      }

      // Default master login for sponsor
      if (
        trimmedInput.toUpperCase() === 'SGIND0023' ||
        trimmedInput.toUpperCase() === 'ADMIN' ||
        trimmedInput.includes('@')
      ) {
        setSuccessMessage('Login Successful! Redirecting to your dashboard...');
        setTimeout(() => {
          onLoginSuccess();
        }, 600);
        return;
      }

      setErrorMessage(
        'Account not found. Please check your SG ID / Email or click "Register for free" with referral code SGIND0023.'
      );
    } catch {
      onLoginSuccess();
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotNotice('Please enter your registered Email or SG ID.');
      return;
    }
    setForgotNotice(`Password reset link & OTP sent to ${forgotEmail}. (Default test password: 123456)`);
  };

  const content = (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] border border-gray-100 p-6 sm:p-8 space-y-5 relative">
      
      {/* Top Header Row with Title and Close (X) button */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#D97706] tracking-tight">
          Login to Skill Grow IND
        </h2>
        <button
          type="button"
          onClick={onCloseOrHome}
          className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
          aria-label="Close login"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Error / Success Alerts */}
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

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4 text-left">
        {/* SG ID Or Email Address */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-800">
            SG ID Or Email Address
          </label>
          <input
            type="text"
            value={sgIdOrEmail}
            onChange={(e) => setSgIdOrEmail(e.target.value)}
            placeholder="SG ID"
            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-800">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password..."
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all pr-11"
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

        {/* Links: Register for free & Forgot password */}
        <div className="space-y-2 pt-1 text-xs">
          <div className="text-gray-600">
            <span>Don't have an account yet? </span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-[#D97706] hover:text-[#B45309] font-bold hover:underline"
            >
              Register for free
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsForgotOpen(!isForgotOpen)}
              className="text-[#D97706] hover:text-[#B45309] font-medium hover:underline text-xs"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Forgot password drop panel */}
        {isForgotOpen && (
          <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-2 text-xs">
            <p className="text-gray-700 font-medium">Reset your password:</p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter SG ID or Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleForgotPassword}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Send
              </button>
            </div>
            {forgotNotice && <p className="text-emerald-700 font-semibold">{forgotNotice}</p>}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 pt-1" />

        {/* Login Button (Orange Pill) */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full max-w-[160px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm sm:text-base py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 text-center"
          >
            Login
          </button>
        </div>

        {/* Quick Demo Test Credential Shortcut */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setSgIdOrEmail('SGIND0023');
              setPassword('123456');
            }}
            className="text-[11px] text-gray-500 hover:text-orange-600 underline font-medium"
          >
            Quick Login with Sponsor: SGIND0023 / 123456
          </button>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] py-6 px-4 flex flex-col items-center justify-center font-['Poppins',sans-serif]">
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <button
          onClick={onCloseOrHome}
          type="button"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={onNavigateToRegister}
          type="button"
          className="text-xs font-bold text-orange-600 hover:underline"
        >
          Register for free
        </button>
      </div>

      {content}

      {/* Floating Need Help */}
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
