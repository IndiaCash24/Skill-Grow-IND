import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  Award,
  Calendar,
  Save,
  Sparkles,
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Layers,
  Check,
  ShoppingBag,
  ArrowRight,
  Edit3,
} from 'lucide-react';
import { UserProfile } from '../types';
import { INDIAN_STATES } from '../data/defaultData';
import { AvatarPickerModal } from './AvatarPickerModal';
import confetti from 'canvas-confetti';

interface ProfilePageProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onNavigate: (view: any) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onSaveProfile,
  onNavigate,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [customAvatarUrl, setCustomAvatarUrl] = useState(profile.avatarUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const handleSelectAvatarFromModal = (newUrl: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: newUrl }));
    setCustomAvatarUrl(newUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...formData,
      avatarUrl: customAvatarUrl.trim() || formData.avatarUrl,
    });

    setSavedSuccess(true);
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#6366F1', '#EC4899', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const hasActivePackage = formData.packageTier && 
    formData.packageTier.toUpperCase() !== 'NO ACTIVE PACKAGE' && 
    formData.packageTier.toUpperCase() !== 'NONE' && 
    formData.packageTier.trim() !== '';

  return (
    <div id="profile-settings-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Account: {formData.referralId}</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center space-x-2">
              <span>My Profile & Account Settings</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              Manage your personal info, change cartoon character avatar, and view membership details.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Success Alert */}
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center space-x-3 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs sm:text-sm font-semibold">
              Profile updated successfully! Your details and cartoon avatar picture have been saved.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Streamlined Cartoon Character Avatar Header Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div 
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="relative group cursor-pointer"
                  title="Click to change avatar"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-md group-hover:scale-105 transition-transform">
                    <img
                      src={customAvatarUrl || formData.avatarUrl}
                      alt={formData.name}
                      className="w-full h-full rounded-full object-cover bg-indigo-50 border-2 border-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-indigo-600 group-hover:bg-indigo-700 text-white p-2 rounded-full border-2 border-white shadow-md transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{formData.name || 'Your Name'}</h3>
                    {hasActivePackage ? (
                      <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {formData.packageTier}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onNavigate('packages')}
                        className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full hover:bg-amber-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>No Active Package</span>
                        <ArrowRight className="w-2.5 h-2.5 text-amber-700" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Affiliate ID: <span className="font-bold text-slate-800">{formData.referralId}</span> | Joined: {formData.joinDate}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">
                    Sponsor: {formData.sponsorName} ({formData.sponsorId})
                  </p>
                </div>
              </div>

              {/* 1-Click Open Avatar Window Button */}
              <div className="w-full sm:w-auto flex sm:flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Choose Avatar (16 Characters)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Information Form */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Personal & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">WhatsApp / Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* State / City (Exhaustive All 28 States & 8 UTs) */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">
                  State / Region <span className="text-[10px] text-indigo-600 font-normal">(All 36 States & UTs)</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.state || 'Delhi (NCR)'}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bio / Tagline */}
            <div className="space-y-1 pt-2">
              <label className="block text-xs font-semibold text-gray-700">Affiliate Bio / Tagline</label>
              <textarea
                rows={2}
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Digital Entrepreneur & Affiliate at Skill Grow IND"
                className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {/* Section 3: Read-Only System Details Card */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Official Skill Grow IND Membership Data</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px] font-bold uppercase">Affiliate ID</span>
                <span className="font-extrabold text-slate-900 text-sm">{formData.referralId}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px] font-bold uppercase">Package Tier</span>
                {hasActivePackage ? (
                  <span className="font-extrabold text-purple-700 text-sm block truncate">
                    {formData.packageTier}
                  </span>
                ) : (
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-bold text-gray-500 text-xs">None</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('packages')}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
                    >
                      Buy Package
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px] font-bold uppercase">Sponsor ID</span>
                <span className="font-extrabold text-slate-900 text-sm">{formData.sponsorId}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px] font-bold uppercase">KYC Status</span>
                <span className="font-extrabold text-emerald-600 text-sm">{formData.kycStatus}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </form>

        {/* 1-Click Avatar Selection Modal */}
        <AvatarPickerModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          currentAvatarUrl={customAvatarUrl || formData.avatarUrl}
          onSelectAvatar={handleSelectAvatarFromModal}
        />
      </div>
    </div>
  );
};

