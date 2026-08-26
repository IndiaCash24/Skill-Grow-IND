import React, { useState } from 'react';
import { Copy, Check, BadgeCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface ProfileCardProps {
  profile: UserProfile;
  onEditProfile: () => void;
  onSelectPackage?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEditProfile }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(profile.referralId);
      setCopied(true);

      // Trigger subtle celebratory confetti burst
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.35 },
        colors: ['#E91E63', '#10B981', '#7C3AED', '#F59E0B'],
      });

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasActivePackage = profile.packageTier && 
    profile.packageTier.toUpperCase() !== 'NO ACTIVE PACKAGE' && 
    profile.packageTier.toUpperCase() !== 'NONE' && 
    profile.packageTier.trim() !== '';

  return (
    <div
      id="profile-hero-card"
      className="relative bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden pt-7 pb-6 px-4 text-center transition-all duration-300"
    >
      {/* 45-Degree Corner Package Ribbon */}
      <div className="absolute top-0 left-0 overflow-hidden w-36 h-36 pointer-events-none z-10">
        <div
          id="package-ribbon"
          className={`absolute transform -rotate-45 text-white text-[9.5px] sm:text-[10.5px] font-extrabold uppercase py-1.5 px-6 left-[-38px] top-[24px] w-[160px] text-center shadow-md tracking-wider border-y ${
            hasActivePackage
              ? 'bg-gradient-to-r from-[#9333EA] via-[#8B5CF6] to-[#7E22CE] border-purple-300/30'
              : 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 border-slate-400/30'
          }`}
        >
          {hasActivePackage ? profile.packageTier : 'NO ACTIVE PACKAGE'}
        </div>
      </div>

      {/* Avatar Container with Mirror Selfie Style */}
      <div className="relative inline-block mx-auto mb-4 group">
        <div
          id="profile-avatar-frame"
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-md cursor-pointer"
          onClick={onEditProfile}
          title="Click to customize profile"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-2 border-white">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Official Verified Badge */}
          <div
            id="profile-verified-badge"
            className="absolute bottom-1 right-1 bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white p-1 rounded-full shadow-md border-2 border-white flex items-center justify-center"
            title="Verified Official Affiliate"
          >
            <BadgeCheck className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Name Bar: Vibrant Magenta Gradient Block */}
      <div className="max-w-[280px] sm:max-w-xs mx-auto mb-3.5">
        <div
          id="profile-name-bar"
          onClick={onEditProfile}
          className="bg-gradient-to-r from-[#D91B77] via-[#C0157B] to-[#9D157F] text-white py-2 px-6 rounded-md shadow-[0_4px_12px_-2px_rgba(217,27,119,0.4)] cursor-pointer active:scale-[0.98] transition-all hover:brightness-105"
          title="Click to change name"
        >
          <h1 className="text-lg sm:text-xl font-bold tracking-widest uppercase truncate drop-shadow-sm">
            {profile.name}
          </h1>
        </div>
      </div>

      {/* Referral ID Row with Cyan/Teal Copy Button */}
      <div className="flex items-center justify-center space-x-2.5">
        <span
          id="profile-referral-id"
          className="text-gray-700 font-semibold tracking-wider text-sm sm:text-base select-all"
        >
          ID: <span className="font-bold text-gray-900">{profile.referralId}</span>
        </span>

        {/* Copy Button (Exact cyan/teal square from the reference image) */}
        <button
          id="copy-id-btn"
          type="button"
          onClick={handleCopyId}
          aria-label="Copy Referral ID"
          className={`relative p-2 rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center ${
            copied
              ? 'bg-emerald-600 text-white scale-105'
              : 'bg-[#10B981] hover:bg-[#059669] active:scale-90 text-white shadow-emerald-500/20'
          }`}
          title="Copy Referral ID"
        >
          {copied ? (
            <Check className="w-4 h-4 text-white stroke-[2.5]" />
          ) : (
            <Copy className="w-4 h-4 text-white stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Copied feedback toast message */}
      {copied && (
        <div className="mt-2.5 inline-flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in font-medium">
          <Check className="w-3 h-3 text-emerald-600" />
          <span>Referral ID copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};
