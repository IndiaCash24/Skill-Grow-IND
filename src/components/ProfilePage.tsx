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
} from 'lucide-react';
import { UserProfile } from '../types';
import { avatarPresets } from '../data/defaultData';
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
  const [avatarTab, setAvatarTab] = useState<'presets' | 'url'>('presets');

  const handleSelectPresetAvatar = (url: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
    setCustomAvatarUrl(url);
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setFormData((prev) => ({ ...prev, avatarUrl: customAvatarUrl.trim() }));
    }
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

  return (
    <div id="profile-settings-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
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
              Manage your personal info, change your avatar picture with preset icons or custom photo URLs.
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
              Profile updated successfully! Your real profile details and picture have been saved.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Avatar Customization Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-gray-100 pb-5">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-md">
                  <img
                    src={customAvatarUrl || formData.avatarUrl}
                    alt={formData.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h3 className="text-lg font-bold text-slate-900">{formData.name || 'Your Name'}</h3>
                  <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {formData.packageTier}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Affiliate ID: <span className="font-bold text-slate-800">{formData.referralId}</span> | Joined: {formData.joinDate}
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  Sponsor: {formData.sponsorName} ({formData.sponsorId})
                </p>
              </div>
            </div>

            {/* Avatar Selector Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Choose Profile Picture
                </span>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAvatarTab('presets')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      avatarTab === 'presets'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Curated Avatars
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarTab('url')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      avatarTab === 'url'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Custom Photo URL
                  </button>
                </div>
              </div>

              {avatarTab === 'presets' ? (
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 pt-2">
                  {avatarPresets.map((av) => {
                    const isSelected = (customAvatarUrl || formData.avatarUrl) === av.url;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(av.url)}
                        className={`relative rounded-full aspect-square overflow-hidden p-0.5 transition-all ${
                          isSelected
                            ? 'ring-3 ring-indigo-600 scale-105 shadow-md'
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={av.label}
                      >
                        <img
                          src={av.url}
                          alt={av.label}
                          className="w-full h-full rounded-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Paste Image / Photo Direct URL (HTTPS link from Unsplash, Imgur, Cloudinary, etc.)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        placeholder="https://example.com/my-photo.jpg"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-hidden"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Apply URL
                    </button>
                  </div>
                </div>
              )}
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

              {/* State / City */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">State / Region</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.state || 'Delhi NCR'}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
                  >
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Other">Other State</option>
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
                <span className="font-extrabold text-purple-700 text-sm">{formData.packageTier}</span>
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
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
