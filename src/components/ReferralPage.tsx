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
  TrendingUp,
  Percent,
} from 'lucide-react';
import { UserProfile, TeamMember } from '../types';
import { initialTeamMembers } from '../data/defaultData';
import confetti from 'canvas-confetti';

interface ReferralPageProps {
  profile: UserProfile;
  teamMembers?: TeamMember[];
  onNavigate: (view: any) => void;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({
  profile,
  teamMembers = initialTeamMembers,
  onNavigate,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadedBanner, setDownloadedBanner] = useState<string | null>(null);
  const [teamTab, setTeamTab] = useState<'ALL' | 'Tier 1' | 'Tier 2'>('ALL');

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

  const filteredTeam = teamMembers.filter((m) => {
    if (teamTab === 'Tier 1') return m.tier.includes('Tier 1');
    if (teamTab === 'Tier 2') return m.tier.includes('Tier 2');
    return true;
  });

  const totalTeamCommission = teamMembers.reduce((sum, m) => sum + m.commissionEarned, 0);

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
      description: 'Header banner for Telegram and WhatsApp community groups highlighting up to 70% direct commissions.',
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
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <span className="text-[11px] font-bold bg-pink-500 text-white px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Up to 70% Direct Commission</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center space-x-2">
              <span>Affiliate Referral Hub & My Team</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100">
              Share your custom tracking link, scan QR codes, download promo posters, and manage your active downline team.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Referral Link & Quick Actions Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Your Official Affiliate Tracking Link</h3>
              <p className="text-xs text-gray-500">Every student who enrolls through this link gives you instant commission</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 font-bold">Your Sponsor Code:</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="bg-purple-100 text-purple-800 font-mono font-black text-xs px-2.5 py-1 rounded-lg hover:bg-purple-200 transition-colors flex items-center space-x-1"
              >
                <span>{profile.referralId}</span>
                {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Link Box */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-gray-50 border border-gray-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 select-all outline-hidden"
              />
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 ${
                copiedLink
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={shareOnWhatsApp}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          {/* QR Code & In-person Referral Box */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold tracking-wider uppercase text-pink-400">
                In-Person & Live Seminar QR Code
              </span>
              <h4 className="font-bold text-sm sm:text-base">Scan to Enroll Directly in Your Downline</h4>
              <p className="text-xs text-gray-300 max-w-md">
                Show this dynamic QR code to prospects in colleges, seminars, or offline meetings for instant onboarding.
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-2xl shadow-lg shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(referralLink)}`}
                alt="Affiliate QR Code"
                className="w-20 h-20 sm:w-24 sm:h-24"
              />
            </div>
          </div>
        </div>

        {/* Section 2: My Referred Team & Downlines */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>My Active Team & Downline ({teamMembers.length} Members)</span>
              </h3>
              <p className="text-xs text-gray-500">Total Team Commission Earned: <span className="font-bold text-emerald-600">₹{totalTeamCommission.toLocaleString('en-IN')}</span></p>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
              {(['ALL', 'Tier 1', 'Tier 2'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTeamTab(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    teamTab === tab
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'ALL' ? 'All Members' : tab === 'Tier 1' ? 'Direct (Tier 1)' : 'Passive (Tier 2)'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredTeam.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{member.name}</h4>
                    <p className="text-[11px] text-gray-500">
                      {member.package} • <span className="font-semibold text-purple-700">{member.tier}</span> • Joined {member.joinedDate}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-emerald-600 block">
                    + ₹ {member.commissionEarned.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Commission Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: High-Converting Marketing Kits & Banners */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Official Skill Grow IND Promo Kits</span>
            </h3>
            <span className="text-xs text-gray-500">High-Converting Creatives</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {marketingBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className={`p-6 bg-gradient-to-br ${banner.bgGradient} text-white space-y-3 relative`}>
                  <span className="text-[9px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full inline-block">
                    {banner.ratio}
                  </span>
                  <div className="font-black text-sm sm:text-base leading-tight">
                    {banner.title}
                  </div>
                  <div className="text-[10px] text-gray-300 font-mono">
                    Sponsor Code: {profile.referralId}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-[11px] text-gray-600 line-clamp-2">{banner.description}</p>
                  <button
                    type="button"
                    onClick={() => handleDownloadBanner(banner.id)}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadedBanner === banner.id ? 'Downloaded!' : 'Download Banner'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
