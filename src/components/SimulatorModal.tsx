import React, { useState } from 'react';
import { X, Sliders, RefreshCw, PlusCircle, CheckCircle2, User, Image, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, EarningStats } from '../types';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  earnings: EarningStats;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onUpdateEarnings: (updated: Partial<EarningStats>) => void;
  onAddTransaction: (amount: number, packageName: string, isPassive?: boolean) => void;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  profile,
  earnings,
  onUpdateProfile,
  onUpdateEarnings,
  onAddTransaction,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [referralId, setReferralId] = useState(profile.referralId);
  const [packageTier, setPackageTier] = useState(profile.packageTier);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  const [today, setToday] = useState(earnings.today.toString());
  const [sevenDays, setSevenDays] = useState(earnings.sevenDays.toString());
  const [thirtyDays, setThirtyDays] = useState(earnings.thirtyDays.toString());
  const [allTime, setAllTime] = useState(earnings.allTime.toString());
  const [passiveIncome, setPassiveIncome] = useState(earnings.passiveIncome.toString());

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
    onClose();
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
      setThirtyDays('185000');
      setAllTime('495000');
      setPassiveIncome('82500');
    }
  };

  const handleSimulateSale = (amount: number, pkg: string, isPassive = false) => {
    onAddTransaction(amount, pkg, isPassive);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#E91E63', '#10B981', '#F59E0B', '#6366F1'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        id="simulator-modal-container"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">Dashboard Customizer & Simulator</h3>
              <p className="text-[11px] text-pink-100">Set exact numbers or simulate real commissions</p>
            </div>
          </div>
          <button
            id="close-simulator-btn"
            onClick={onClose}
            type="button"
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-gray-100 flex items-center justify-between overflow-x-auto gap-2">
          <span className="text-[11px] font-semibold text-gray-500 uppercase shrink-0">Presets:</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => applyPreset('zero')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 transition-colors"
            >
              Exact Photo (₹0)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('rising')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-colors"
            >
              ₹52k Active Earner
            </button>
            <button
              type="button"
              onClick={() => applyPreset('top')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
            >
              ₹4.95 Lakh Leader
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {/* Profile Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-pink-600" />
              <span>User Profile Details</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Name Bar</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none uppercase font-bold"
                  placeholder="e.g. ROSHNI"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Referral ID</label>
                <input
                  type="text"
                  value={referralId}
                  onChange={(e) => setReferralId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none uppercase font-bold"
                  placeholder="e.g. RINDIZSPBF"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Corner Ribbon Tier</label>
                <select
                  value={packageTier}
                  onChange={(e) => setPackageTier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-semibold"
                >
                  <option value="EXPERT PACKAGE">EXPERT PACKAGE</option>
                  <option value="MASTER PACKAGE">MASTER PACKAGE</option>
                  <option value="INTERMEDIATE PACKAGE">INTERMEDIATE PACKAGE</option>
                  <option value="STARTER PACKAGE">STARTER PACKAGE</option>
                  <option value="VIP DIAMOND">VIP DIAMOND</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Avatar Image URL</label>
                <div className="flex space-x-1.5">
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="flex-1 px-2.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none truncate"
                    placeholder="Image URL"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Earning Amounts */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Earnings Customizer (₹)</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-pink-700 mb-1">Today's Earning</label>
                <input
                  type="number"
                  min="0"
                  value={today}
                  onChange={(e) => setToday(e.target.value)}
                  className="w-full px-3 py-2 border border-pink-200 bg-pink-50/30 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-purple-700 mb-1">7 Days Earning</label>
                <input
                  type="number"
                  min="0"
                  value={sevenDays}
                  onChange={(e) => setSevenDays(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 bg-purple-50/30 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-blue-700 mb-1">30 Days Earning</label>
                <input
                  type="number"
                  min="0"
                  value={thirtyDays}
                  onChange={(e) => setThirtyDays(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 bg-blue-50/30 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-indigo-700 mb-1">All Time Earning</label>
                <input
                  type="number"
                  min="0"
                  value={allTime}
                  onChange={(e) => setAllTime(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-200 bg-indigo-50/30 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-orange-700 mb-1">Passive Income (Royalties)</label>
              <input
                type="number"
                min="0"
                value={passiveIncome}
                onChange={(e) => setPassiveIncome(e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 bg-orange-50/30 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Instant Commission Trigger */}
          <div className="pt-3 border-t border-gray-100 bg-slate-50 p-3 rounded-xl">
            <span className="text-[11px] font-bold uppercase text-gray-700 block mb-2">
              Trigger Instant Test Sale:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSimulateSale(1750, 'Expert Package', false)}
                className="px-2.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center space-x-1 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ ₹1,750 (Direct Expert)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSimulateSale(500, 'Master Package', true)}
                className="px-2.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center space-x-1 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ ₹500 (Passive Team)</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              id="save-simulator-changes-btn"
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:brightness-105 transition-all flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply to Dashboard</span>
            </button>
            <button
              id="cancel-simulator-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
