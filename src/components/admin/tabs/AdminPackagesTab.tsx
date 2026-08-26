import React, { useState } from 'react';
import {
  Package,
  Edit3,
  Plus,
  Check,
  X,
  Layers,
  Zap,
  BookOpen,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { PackageItem, CourseModule } from '../../../types';

interface AdminPackagesTabProps {
  packages: PackageItem[];
  onUpdatePackage: (pkg: PackageItem) => void;
  onAddNewPackage: (pkg: PackageItem) => void;
}

export const AdminPackagesTab: React.FC<AdminPackagesTabProps> = ({
  packages,
  onUpdatePackage,
  onAddNewPackage,
}) => {
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newPkgData, setNewPkgData] = useState<Partial<PackageItem>>({
    name: '',
    tagline: '',
    price: 1999,
    originalPrice: 4999,
    directCommission: 1400,
    passiveCommission: 300,
    modulesCount: 5,
    hoursContent: 20,
    features: ['High-income digital skills', 'WhatsApp mentorship group', 'Completion certificate'],
  });

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    onUpdatePackage(editingPkg);
    setEditingPkg(null);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgData.name || !newPkgData.price) return;

    const newPackage: PackageItem = {
      id: `pkg-${Date.now()}`,
      name: newPkgData.name,
      tier: 'MASTER',
      tagline: newPkgData.tagline || 'Master Advanced Digital Monetization',
      price: Number(newPkgData.price),
      originalPrice: Number(newPkgData.originalPrice || newPkgData.price * 2.5),
      directCommission: Number(newPkgData.directCommission || Math.round(newPkgData.price * 0.7)),
      passiveCommission: Number(newPkgData.passiveCommission || Math.round(newPkgData.price * 0.15)),
      color: '#4F46E5',
      gradient: 'from-indigo-600 via-indigo-800 to-indigo-950',
      badge: 'Premium Edition',
      modulesCount: Number(newPkgData.modulesCount) || 6,
      hoursContent: Number(newPkgData.hoursContent) || 24,
      features: newPkgData.features || ['Exclusive Live Masterclasses', 'Dedicated Mentor Support'],
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          title: 'Foundational Masterclass',
          duration: '4h 30m',
          lessonsCount: 8,
          topics: ['Core fundamentals', 'Monetization frameworks'],
        },
      ],
    };

    onAddNewPackage(newPackage);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Course Packages & Commission Setup</h2>
          <p className="text-xs text-slate-500">
            Control selling prices, direct affiliate commissions (70%), and passive pool payouts for every course bundle.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const directPercent = Math.round((pkg.directCommission / pkg.price) * 100);
          const passivePercent = Math.round((pkg.passiveCommission / pkg.price) * 100);

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Top Banner */}
              <div className={`p-5 bg-gradient-to-r ${pkg.gradient} text-white relative`}>
                {pkg.badge && (
                  <span className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {pkg.badge}
                  </span>
                )}
                <div className="text-xs font-bold opacity-80 uppercase tracking-wider">{pkg.tier} TIER</div>
                <h3 className="text-xl font-black mt-1 tracking-tight">{pkg.name}</h3>
                <p className="text-xs text-slate-200 mt-1 line-clamp-1">{pkg.tagline}</p>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 text-xs flex-1 flex flex-col justify-between">
                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Selling Price</span>
                    <span className="text-base font-black text-slate-900">₹{pkg.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] line-through text-slate-400 block">₹{pkg.originalPrice}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Direct (70%)</span>
                    <span className="text-base font-black text-emerald-600">
                      ₹{pkg.directCommission.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 block">({directPercent}%)</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Passive (15%)</span>
                    <span className="text-base font-black text-blue-600">
                      ₹{pkg.passiveCommission.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 block">({passivePercent}%)</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 block text-[11px]">Included Modules & Perks:</span>
                  <ul className="space-y-1 text-slate-600">
                    {pkg.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Edit Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 font-semibold">
                    {pkg.modulesCount} Modules • {pkg.hoursContent} Hours Content
                  </div>

                  <button
                    onClick={() => setEditingPkg(pkg)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Pricing & Commissions</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Edit Package */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-fade-in text-xs max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-base">Edit Package: {editingPkg.name}</h3>
                <p className="text-xs text-slate-300">Set real pricing and direct/passive affiliate commissions</p>
              </div>
              <button
                onClick={() => setEditingPkg(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Package Title</label>
                <input
                  type="text"
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={editingPkg.tagline}
                  onChange={(e) => setEditingPkg({ ...editingPkg, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Live Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingPkg.price}
                    onChange={(e) => {
                      const newPrice = Number(e.target.value);
                      setEditingPkg({
                        ...editingPkg,
                        price: newPrice,
                        directCommission: Math.round(newPrice * 0.7),
                        passiveCommission: Math.round(newPrice * 0.15),
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-black text-sm text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (Strikethrough ₹)</label>
                  <input
                    type="number"
                    value={editingPkg.originalPrice}
                    onChange={(e) => setEditingPkg({ ...editingPkg, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-emerald-800 block mb-1">Direct Commission (₹)</label>
                  <input
                    type="number"
                    value={editingPkg.directCommission}
                    onChange={(e) => setEditingPkg({ ...editingPkg, directCommission: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-black text-emerald-600 bg-white"
                    required
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5">Credited to direct sponsor</span>
                </div>
                <div>
                  <label className="font-bold text-blue-800 block mb-1">Passive Tier 2 (₹)</label>
                  <input
                    type="number"
                    value={editingPkg.passiveCommission}
                    onChange={(e) => setEditingPkg({ ...editingPkg, passiveCommission: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-black text-blue-600 bg-white"
                    required
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5">Credited to sponsor's sponsor</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingPkg.badge || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}
                    placeholder="e.g. Best Seller / Popular"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Hours of Content</label>
                  <input
                    type="number"
                    value={editingPkg.hoursContent}
                    onChange={(e) => setEditingPkg({ ...editingPkg, hoursContent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Save Package Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add New Package */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-fade-in text-xs max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-base">Create New Course Package</h3>
                <p className="text-xs text-slate-300">Expand curriculum offerings with tailored commissions</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Package Name</label>
                <input
                  type="text"
                  value={newPkgData.name}
                  onChange={(e) => setNewPkgData({ ...newPkgData, name: e.target.value })}
                  placeholder="e.g. Master Package / VIP Freedom Club"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={newPkgData.tagline}
                  onChange={(e) => setNewPkgData({ ...newPkgData, tagline: e.target.value })}
                  placeholder="e.g. Master High-Ticket Client Acquisition & Scaling"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={newPkgData.price}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setNewPkgData({
                        ...newPkgData,
                        price: p,
                        directCommission: Math.round(p * 0.7),
                        passiveCommission: Math.round(p * 0.15),
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-black text-sm text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newPkgData.originalPrice}
                    onChange={(e) => setNewPkgData({ ...newPkgData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-emerald-800 block mb-1">Direct Commission (₹)</label>
                  <input
                    type="number"
                    value={newPkgData.directCommission}
                    onChange={(e) => setNewPkgData({ ...newPkgData, directCommission: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-black text-emerald-600 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-blue-800 block mb-1">Passive Tier 2 (₹)</label>
                  <input
                    type="number"
                    value={newPkgData.passiveCommission}
                    onChange={(e) => setNewPkgData({ ...newPkgData, passiveCommission: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-black text-blue-600 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
