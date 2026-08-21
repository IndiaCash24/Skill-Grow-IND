import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  User,
  Image,
  DollarSign,
  ArrowLeft,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserProfile, EarningStats } from '../types';
import confetti from 'canvas-confetti';

interface SimulatorPageProps {
  profile: UserProfile;
  earnings: EarningStats;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onUpdateEarnings: (updated: Partial<EarningStats>) => void;
  onAddTransaction: (amount: number, packageName: string, isPassive?: boolean) => void;
  onResetDefaults: () => void;
  onNavigate: (view: any) => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  profile,
  earnings,
  onUpdateProfile,
  onUpdateEarnings,
  onAddTransaction,
  onResetDefaults,
  onNavigate,
}) => {
  const [name, setName] = useState(profile.name);
  const [referralId, setReferralId] = useState(profile.referralId);
  const [packageTier, setPackageTier] = useState(profile.packageTier);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  const [today, setToday] = useState(earnings.today.toString());
  const [sevenDays, setSevenDays] = useState(earnings.sevenDays.toString());
  const [thirtyDays, setThirtyDays] = useState(earnings.thirtyDays.toString());
  const [allTime, setAllTime] = useState(earnings.allTime.toString());
  const [passiveIncome, setPassiveIncome] = useState(earnings.passiveIncome.toString());

  const [saved, setSaved] = useState(false);
  const [simAmount, setSimAmount] = useState('2000');
  const [simPackage, setSimPackage] = useState('Expert Package');

  const avatarOptions = [
    { label: 'Roshni (Original)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    { label: 'Pooja', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
    { label: 'Rahul', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
    { label: 'Ananya', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim().toUpperCase() || 'ROSHNI',
      referralId: referralId.trim().toUpperCase() || 'RINDIZSPBF',
      packageTier: packageTier || 'EXPERT PACKAGE',
      avatarUrl: avatarUrl.trim() || profile.avatarUrl,
    });
    onUpdateEarnings({
      today: Number(today) || 0,
      sevenDays: Number(sevenDays) || 0,
      thirtyDays: Number(thirtyDays) || 0,
      allTime: Number(allTime) || 0,
      passiveIncome: Number(passiveIncome) || 0,
    });

    setSaved(true);
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSaved(false);
      onNavigate('dashboard');
    }, 1500);
  };

  const applyPreset = (type: 'zero' | 'rising' | 'top') => {
    if (type === 'zero') {
      setName('ROSHNI');
      setReferralId('RINDIZSPBF');
      setPackageTier('EXPERT PACKAGE');
      setToday('0');
      setSevenDays('0');
      setThirtyDays('0');
      setAllTime('0');
      setPassiveIncome('0');
    } else if (type === 'rising') {
      setName('ROSHNI');
      setReferralId('RINDIZSPBF');
      setPackageTier('EXPERT PACKAGE');
      setToday('3500');
      setSevenDays('14200');
      setThirtyDays('38500');
      setAllTime('52000');
      setPassiveIncome('7800');
    } else if (type === 'top') {
      setName('ROSHNI');
      setReferralId('RINDIZSPBF');
      setPackageTier('MASTER PACKAGE');
      setToday('12500');
      setSevenDays('68000');
      setThirtyDays('195000');
      setAllTime('285000');
      setPassiveIncome('42000');
    }
  };

  const handleSimulateSale = () => {
    const val = Number(simAmount) || 1000;
    onAddTransaction(val, simPackage);
    setToday((prev) => (Number(prev) + val).toString());
    setSevenDays((prev) => (Number(prev) + val).toString());
    setThirtyDays((prev) => (Number(prev) + val).toString());
    setAllTime((prev) => (Number(prev) + val).toString());

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#EC4899', '#3B82F6', '#10B981'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div id="simulator-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <span className="text-[11px] font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Live Customizer Engine</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Dashboard Customizer & Settings
            </h1>
            <p className="text-xs sm:text-sm text-purple-100">
              Personalize partner name, referral ID, package tiers, and simulate earning numbers in real time.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Quick Presets Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Quick 1-Click Earning Presets</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => applyPreset('zero')}
              className="p-3.5 rounded-2xl border border-gray-200 hover:border-gray-400 bg-slate-50 text-left transition-all space-y-1"
            >
              <span className="text-xs font-bold text-slate-900">Original Screenshot Default</span>
              <p className="text-[11px] text-gray-500">₹0 Across all cards (Pure Start State)</p>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('rising')}
              className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-50 text-left transition-all space-y-1"
            >
              <span className="text-xs font-bold text-indigo-900">Rising Star Earner</span>
              <p className="text-[11px] text-indigo-700">₹3,500 Today · ₹52,000 All-Time</p>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('top')}
              className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-50 text-left transition-all space-y-1"
            >
              <span className="text-xs font-bold text-amber-900">Top Champion Earner</span>
              <p className="text-[11px] text-amber-700">₹12,500 Today · ₹2,85,000 All-Time</p>
            </button>
          </div>
        </div>

        {/* Customizer Form */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Profile Details Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-extrabold text-slate-900">Profile Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Affiliate Partner Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Sponsor Referral ID
                </label>
                <input
                  type="text"
                  value={referralId}
                  onChange={(e) => setReferralId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Enrolled Package Tier
                </label>
                <select
                  value={packageTier}
                  onChange={(e) => setPackageTier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="EXPERT PACKAGE">EXPERT PACKAGE</option>
                  <option value="MASTER PACKAGE">MASTER PACKAGE</option>
                  <option value="LEADERSHIP PACKAGE">LEADERSHIP PACKAGE</option>
                  <option value="PRO PACKAGE">PRO PACKAGE</option>
                  <option value="STARTER PACKAGE">STARTER PACKAGE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Avatar Photo URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Quick Avatar Pickers */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Quick Avatar Selection:
              </label>
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(opt.url)}
                    className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 transition-colors"
                  >
                    <img src={opt.url} alt={opt.label} className="w-5 h-5 rounded-full object-cover" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Earning Stats Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-slate-900">Earning Statistics Values</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-pink-600 uppercase tracking-wider mb-1">
                  Today's Earning (₹)
                </label>
                <input
                  type="number"
                  value={today}
                  onChange={(e) => setToday(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  Last 7 Days (₹)
                </label>
                <input
                  type="number"
                  value={sevenDays}
                  onChange={(e) => setSevenDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                  Last 30 Days (₹)
                </label>
                <input
                  type="number"
                  value={thirtyDays}
                  onChange={(e) => setThirtyDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  All Time Earning (₹)
                </label>
                <input
                  type="number"
                  value={allTime}
                  onChange={(e) => setAllTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                  Passive Income (₹)
                </label>
                <input
                  type="number"
                  value={passiveIncome}
                  onChange={(e) => setPassiveIncome(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Simulate Real-Time Sale Box */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
            <div>
              <h4 className="text-sm font-bold flex items-center space-x-2 text-amber-300">
                <PlusCircle className="w-4 h-4" />
                <span>Simulate Instant Direct Sale</span>
              </h4>
              <p className="text-xs text-purple-200 mt-0.5">
                Test how the dashboard updates when a student enrolls under your link right now.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="number"
                value={simAmount}
                onChange={(e) => setSimAmount(e.target.value)}
                placeholder="Commission Amount"
                className="bg-white/10 border border-white/20 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              <select
                value={simPackage}
                onChange={(e) => setSimPackage(e.target.value)}
                className="bg-white/10 border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="Expert Package" className="text-slate-900">Expert Package (₹2,000)</option>
                <option value="Master Package" className="text-slate-900">Master Package (₹4,000)</option>
                <option value="Leadership Package" className="text-slate-900">Leadership Package (₹7,500)</option>
              </select>

              <button
                type="button"
                onClick={handleSimulateSale}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                + Trigger Sale 🎉
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saved ? 'Saved & Applying...' : 'Save & Open Live Dashboard'}</span>
            </button>

            <button
              type="button"
              onClick={onResetDefaults}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition-colors flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
