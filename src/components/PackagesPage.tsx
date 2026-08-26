import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Video,
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { allPackages } from '../data/defaultData';
import { PackageItem, UserProfile } from '../types';

interface PackagesPageProps {
  profile: UserProfile;
  onSelectPackageForCheckout: (pkg: PackageItem) => void;
  onNavigate: (view: any) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({
  profile,
  onSelectPackageForCheckout,
  onNavigate,
}) => {
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>('platinum-pkg');

  const toggleExpand = (id: string) => {
    setExpandedPackageId(expandedPackageId === id ? null : id);
  };

  return (
    <div id="packages-catalog-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Top Banner Header */}
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

            <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Up to 70% Direct Commission</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center space-x-2">
              <span>Skill Grow IND Packages & Curriculum</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              Government recognized high-income skill courses with maximum affiliate earning potential.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Packages Grid */}
        <div className="grid grid-cols-1 gap-6">
          {allPackages.map((pkg) => {
            const isExpanded = expandedPackageId === pkg.id;
            const isCurrentPackage = profile.packageTier.toUpperCase().includes(pkg.tier);

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl border-2 transition-all shadow-sm overflow-hidden ${
                  pkg.tier === 'PLATINUM'
                    ? 'border-purple-500 ring-2 ring-purple-200 shadow-purple-500/10'
                    : 'border-gray-200'
                }`}
              >
                {/* Header Strip with Gradient */}
                <div className={`p-5 sm:p-6 bg-gradient-to-r ${pkg.gradient} text-white relative overflow-hidden`}>
                  {pkg.badge && (
                    <span className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                      {pkg.badge}
                    </span>
                  )}

                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight">{pkg.name}</h3>
                      {isCurrentPackage && (
                        <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">
                          Your Active Tier
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed font-medium">{pkg.tagline}</p>

                    <div className="flex items-baseline space-x-3 pt-2">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        ₹ {pkg.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-white/70 line-through">
                        ₹ {pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                        Save {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Earnings Commission Highlights Box */}
                  <div className="bg-orange-50/80 border border-orange-200/90 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase">Affiliate Referral Payout</h4>
                        <p className="text-xs text-gray-600">Earn every time someone joins with your link</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs font-bold">
                      <div>
                        <span className="text-gray-500 block text-[10px]">Direct Commission</span>
                        <span className="text-emerald-700 font-extrabold text-sm">
                          ₹ {pkg.directCommission.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Passive Tier 1</span>
                        <span className="text-indigo-700 font-extrabold text-sm">
                          ₹ {pkg.passiveCommission.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Features Bullet List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Included Skills & Benefits
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modules Accordion */}
                  <div className="border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => toggleExpand(pkg.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors py-1"
                    >
                      <span className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span>View Detailed Curriculum & Chapters ({pkg.modules.length} Modules)</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-3 pt-3">
                        {pkg.modules.map((mod) => (
                          <div key={mod.id} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-slate-900">{mod.title}</h5>
                              <span className="text-[10px] text-gray-500 flex items-center space-x-1 font-semibold">
                                <Clock className="w-3 h-3" />
                                <span>{mod.duration} • {mod.lessonsCount} lessons</span>
                              </span>
                            </div>
                            <ul className="list-disc list-inside space-y-0.5 text-gray-600 pl-1 text-[11px]">
                              {mod.topics.map((top, tIdx) => (
                                <li key={tIdx}>{top}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Govt. MSME & ISO 9001:2015 Certified Curriculum</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectPackageForCheckout(pkg)}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Enroll / Upgrade to {pkg.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
