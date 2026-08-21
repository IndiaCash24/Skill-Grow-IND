import React, { useState } from 'react';
import {
  Link2,
  Copy,
  Check,
  Share2,
  QrCode,
  Download,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Eye,
  Users,
  CheckCircle2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface ReferralPageProps {
  profile: UserProfile;
  onNavigate: (view: any) => void;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({ profile, onNavigate }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadedBanner, setDownloadedBanner] = useState<string | null>(null);

  const referralLink = `https://skillgrowind.com/register?ref=${profile.referralId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#6366F1', '#EC4899', '#10B981'],
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile.referralId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `🔥 *Skill Grow IND Affiliate Program* 🔥\n\nStart earning ₹1,500 to ₹5,000 daily from your smartphone with high-income digital skills!\n\n👉 *Join My Official Team:* ${referralLink}\n\n🏷️ *Sponsor / Referral Code:* ${profile.referralId}\n\n✅ 100% Legal & Govt Registered (Skill Grow IND)\n✅ Same-Day Bank Payouts`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleDownloadBanner = (bannerName: string) => {
    setDownloadedBanner(bannerName);
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    setTimeout(() => setDownloadedBanner(null), 2500);
  };

  const marketingBanners = [
    {
      id: 'story-1',
      title: 'Instagram & WhatsApp Story Banner',
      ratio: '9:16 Story Format',
      description: 'High-converting vertical promo banner featuring daily earning proof and direct sponsor link.',
      bgGradient: 'from-purple-900 via-indigo-900 to-slate-950',
    },
    {
      id: 'post-1',
      title: 'Skill Grow Mega Meetup Promo Poster',
      ratio: '1:1 Square Feed Format',
      description: 'Official promotional poster inviting students and professionals to join the national live event.',
      bgGradient: 'from-amber-600 via-orange-600 to-slate-900',
    },
    {
      id: 'banner-1',
      title: 'WhatsApp Group Invitation Banner',
      ratio: '16:9 Landscape Format',
      description: 'Header banner for Telegram and WhatsApp community groups highlighting up to 90% commissions.',
      bgGradient: 'from-emerald-700 via-teal-800 to-slate-950',
    },
  ];

  return (
    <div id="referral-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <span className="text-[11px] font-bold bg-pink-500 text-white px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Up to 90% Commission</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Affiliate Links & Marketing Kit
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100">
              Share your custom tracking link, scan QR codes, and download ready-to-post banners for social media.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Referral Link & Quick Actions Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Your Unique Affiliate Link</h3>
              <p className="text-xs text-gray-500">Every signup through this URL automatically credits commission to you.</p>
            </div>
          </div>

          {/* Link Box */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate select-all">
                  {referralLink}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shrink-0 ml-2">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={shareOnWhatsApp}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Referral Code Quick Copy Box */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-orange-300 font-semibold uppercase tracking-wider">
                Direct Referral Code
              </p>
              <h4 className="text-xl font-black tracking-widest text-white mt-0.5">
                {profile.referralId}
              </h4>
            </div>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center justify-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Code Copied!' : 'Copy Referral ID'}</span>
            </button>
          </div>
        </div>

        {/* QR Code & Scan to Register Box */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-36 h-36 bg-white p-3 rounded-2xl border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center shadow-xs shrink-0">
            <QrCode className="w-24 h-24 text-indigo-950" />
            <span className="text-[9px] font-bold text-gray-500 uppercase mt-1 tracking-wider">
              {profile.referralId}
            </span>
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                Instant Scan & Register QR Code
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Save this QR code and paste it on your promotional YouTube shorts, Instagram highlights, and personal business cards.
              </p>
            </div>

            <button
              onClick={() => handleDownloadBanner('qr-code')}
              className="inline-flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{downloadedBanner === 'qr-code' ? 'QR Code Saved! ✓' : 'Save QR Code (PNG)'}</span>
            </button>
          </div>
        </div>

        {/* Promotional Marketing Posters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Official Marketing Creative Banners
              </h3>
              <p className="text-xs text-gray-500">HD Ready graphics with your tracking ID</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              3 Templates Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {marketingBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className={`p-6 bg-gradient-to-br ${banner.bgGradient} text-white flex flex-col justify-between h-44 relative overflow-hidden`}>
                  <div className="flex justify-between items-start">
                    <span className="font-['Poppins'] font-black text-sm">
                      <span className="text-orange-400">Skill</span>Grow IND
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                      {banner.ratio}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] text-amber-300 font-bold tracking-wider uppercase">
                      Earn with Skill Grow
                    </p>
                    <p className="text-xs font-black text-white leading-tight">
                      Start Your Digital Income Today!
                    </p>
                    <p className="text-[9px] text-gray-300">Ref Code: {profile.referralId}</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{banner.title}</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{banner.description}</p>
                  </div>

                  <button
                    onClick={() => handleDownloadBanner(banner.id)}
                    className="w-full inline-flex items-center justify-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {downloadedBanner === banner.id ? 'Banner Downloaded! ✓' : 'Download Graphic'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate Commission Breakdown Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Affiliate Commission Structure
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase">Direct Commission</span>
                <span className="text-lg font-black text-emerald-600">Up to 80%</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Directly earned on every course enrollment made with your sponsor referral ID.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase">Passive Commission</span>
                <span className="text-lg font-black text-purple-600">Up to 15%</span>
              </div>
              <p className="text-[11px] text-purple-700">
                Tier-2 team performance bonus credited automatically when your direct team members close enrollments.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
