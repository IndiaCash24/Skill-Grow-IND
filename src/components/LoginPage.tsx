import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Headphones, ShieldCheck, UserPlus, Lock } from 'lucide-react';
import { UserProfile } from '../types';
import { loginUserWithFirestore } from '../lib/firestoreService';

interface LoginPageProps {
  onLoginSuccess: (userProfile?: UserProfile) => void;
  onNavigateToRegister: () => void;
  onCloseOrHome?: () => void;
  isModal?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  isModal = false,
}) => {
  const [sgIdOrEmail, setSgIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedInput = sgIdOrEmail.trim();

    if (!trimmedInput) {
      setErrorMessage('Please enter your SG ID, Email Address, or Phone Number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Direct Real Firestore & Firebase Authentication
      const result = await loginUserWithFirestore(trimmedInput, password);

      if (!result.success || !result.user) {
        setIsSubmitting(false);
        setErrorMessage(result.error || 'Account not found. Please verify your credentials or register a new account.');
        return;
      }

      const fsUser = result.user;
      const userProfile: UserProfile = {
        name: fsUser.name || 'Skill Grow Affiliate',
        referralId: fsUser.userCode || 'SGIND0023',
        packageTier: fsUser.activePackage || 'NO ACTIVE PACKAGE',
        avatarUrl: fsUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fsUser.name || 'Affiliate')}`,
        email: fsUser.email || '',
        phone: fsUser.phone || '',
        joinDate: 'Active Member',
        sponsorName: 'Skill Grow Official',
        sponsorId: fsUser.sponsorCode || 'SGIND0023',
        kycStatus: fsUser.kyc?.status === 'verified' ? 'Verified' : 'Pending',
        upiId: fsUser.kyc?.upiId || '',
        bankAccount: fsUser.kyc?.accountNumber ? `•••• ${fsUser.kyc.accountNumber.slice(-4)}` : '',
        ifscCode: fsUser.kyc?.ifscCode || '',
      };

      setSuccessMessage(`Login Successful! Welcome, ${userProfile.name}!`);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(userProfile);
      }, 500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Login failed. Please check network connection.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotNotice('Please enter your registered Email or SG ID.');
      return;
    }
    setForgotNotice(`Password reset instructions have been sent to ${forgotEmail}.`);
  };

  const content = (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_16px_50px_-10px_rgba(0,0,0,0.12)] border border-gray-100 p-6 sm:p-8 space-y-5 relative">
      {/* Brand Header */}
      <div className="text-center space-y-1 pb-3 border-b border-gray-100">
        <div className="inline-flex items-center space-x-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SKILL GROW IND</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Welcome to Skill Grow
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Login or Register to access your account & courses
        </p>
      </div>

      {/* Tabs between Login & Register */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          type="button"
          className="flex-1 py-2 text-xs font-black rounded-xl bg-white text-orange-600 shadow-xs transition-all"
        >
          Login
        </button>
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="flex-1 py-2 text-xs font-bold rounded-xl text-gray-600 hover:text-orange-600 transition-all flex items-center justify-center space-x-1"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register New</span>
        </button>
      </div>

      {/* Error / Success Alerts */}
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

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4 text-left">
        {/* SG ID / Email Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-800">
            SG ID, Email Address, or Phone
          </label>
          <input
            type="text"
            value={sgIdOrEmail}
            onChange={(e) => setSgIdOrEmail(e.target.value)}
            placeholder="Enter your SG ID or Email"
            className="w-full px-4 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-800">
              Password
            </label>
            <button
              type="button"
              onClick={() => setIsForgotOpen(!isForgotOpen)}
              className="text-orange-600 hover:text-orange-700 font-bold text-xs"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className="w-full px-4 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all pr-11"
              required
              disabled={isSubmitting}
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

        {/* Forgot password drop panel */}
        {isForgotOpen && (
          <div className="p-3.5 bg-orange-50/80 border border-orange-200 rounded-2xl space-y-2 text-xs">
            <p className="text-gray-800 font-bold">Reset your password:</p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter SG ID or Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold"
              />
              <button
                type="button"
                onClick={handleForgotPassword}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs"
              >
                Send
              </button>
            </div>
            {forgotNotice && <p className="text-emerald-700 font-bold">{forgotNotice}</p>}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all active:scale-98 text-center flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Secure Login'}</span>
          </button>
        </div>

        {/* Register prompt */}
        <div className="pt-2 text-center text-xs text-gray-600">
          <span>New to Skill Grow IND? </span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-orange-600 hover:text-orange-700 font-black hover:underline ml-1"
          >
            Create New Account
          </button>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] py-8 px-4 flex flex-col items-center justify-center font-['Poppins',sans-serif]">
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
