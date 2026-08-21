import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const referralLink = `https://skillgrowind.com/register?ref=${profile.referralId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.4 },
        colors: ['#6366F1', '#EC4899', '#10B981'],
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `🔥 Earn ₹20,000 - ₹50,000 monthly from home with Skill Grow IND Affiliate Marketing!\n\nJoin my official team and learn high-income digital skills:\n👉 ${referralLink}\n\nReferral Code: *${profile.referralId}* (Use this to get direct sponsorship bonuses!)`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        id="referral-modal-container"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Affiliate Referral Link</h3>
            <p className="text-xs text-indigo-100">Earn up to 90% direct & passive commissions</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Link Box */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Your Unique Registration Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-gray-50 border border-gray-200 text-xs sm:text-sm font-semibold text-gray-800 px-3 py-2.5 rounded-xl focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                type="button"
                className={`p-2.5 rounded-xl font-medium transition-colors flex items-center justify-center shrink-0 ${
                  copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* QR Code Demo */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center space-x-4">
            <div className="w-16 h-16 bg-white p-1 rounded-lg border border-gray-200 flex items-center justify-center">
              <QrCode className="w-12 h-12 text-indigo-900" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-800">Scan & Register QR Code</h5>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Include this in your Instagram stories, YouTube shorts, and WhatsApp status.
              </p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <button
              onClick={shareOnWhatsApp}
              type="button"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp & Social Media</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
