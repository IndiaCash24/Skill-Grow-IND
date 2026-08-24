import React, { useState } from 'react';
import {
  Image,
  Plus,
  Trash2,
  Check,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AdminBanner } from '../../../types';

interface AdminBannersTabProps {
  banners: AdminBanner[];
  onUpdateBanner: (banner: AdminBanner) => void;
  onAddBanner: (banner: AdminBanner) => void;
  onDeleteBanner: (bannerId: string) => void;
}

export const AdminBannersTab: React.FC<AdminBannersTabProps> = ({
  banners,
  onUpdateBanner,
  onAddBanner,
  onDeleteBanner,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState<Partial<AdminBanner>>({
    title: '',
    tagline: '',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    linkUrl: 'packages',
    placement: 'home_carousel',
    isActive: true,
  });

  const presetImages = [
    {
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
      label: 'Leadership Carnival',
    },
    {
      url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&auto=format&fit=crop&q=80',
      label: 'Fast Daily Payouts',
    },
    {
      url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&auto=format&fit=crop&q=80',
      label: 'Instagram Reel Growth',
    },
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      label: 'Affiliate Blueprint',
    },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.imageUrl) return;

    const item: AdminBanner = {
      id: `ban-${Date.now()}`,
      title: newBanner.title,
      tagline: newBanner.tagline || '',
      imageUrl: newBanner.imageUrl,
      linkUrl: newBanner.linkUrl || 'packages',
      placement: newBanner.placement || 'home_carousel',
      isActive: true,
      order: banners.length + 1,
    };

    onAddBanner(item);
    setIsAddModalOpen(false);
    setNewBanner({
      title: '',
      tagline: '',
      imageUrl: presetImages[0].url,
      linkUrl: 'packages',
      placement: 'home_carousel',
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Marketing Banners & Story Creatives</h2>
          <p className="text-xs text-slate-500">
            Control the visual banners featured on the homepage carousel, affiliate dashboard, and referral media center.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            {/* Image Preview */}
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden group">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white">
                  {banner.placement.replace('_', ' ')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                    banner.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {banner.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="font-black text-sm drop-shadow-md line-clamp-1">{banner.title}</h4>
                <p className="text-[11px] text-slate-200 drop-shadow-xs line-clamp-1">{banner.tagline}</p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-[11px] font-mono text-slate-500">Target: /{banner.linkUrl}</span>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateBanner({ ...banner, isActive: !banner.isActive })}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    banner.isActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500'
                  }`}
                  title={banner.isActive ? 'Hide from users' : 'Make Active'}
                >
                  {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteBanner(banner.id)}
                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Add Banner */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-fade-in text-xs max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-base">Add Platform Banner</h3>
                <p className="text-xs text-slate-300">Publish high-converting visual creative</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Banner Title</label>
                <input
                  type="text"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  placeholder="e.g. 🚀 Special 80% Discount Marathon"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={newBanner.tagline}
                  onChange={(e) => setNewBanner({ ...newBanner, tagline: e.target.value })}
                  placeholder="e.g. Enroll today and unlock VIP Telegram access"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Preset Image Selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Pick Curated Poster or Enter Custom URL</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {presetImages.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => setNewBanner({ ...newBanner, imageUrl: p.url })}
                      className={`p-2 rounded-xl border cursor-pointer flex items-center space-x-2 transition-all ${
                        newBanner.imageUrl === p.url
                          ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <img src={p.url} alt="" className="w-10 h-7 rounded object-cover" />
                      <span className="font-bold text-slate-800 text-[11px] line-clamp-1">{p.label}</span>
                    </div>
                  ))}
                </div>

                <input
                  type="url"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Placement Location</label>
                  <select
                    value={newBanner.placement}
                    onChange={(e) => setNewBanner({ ...newBanner, placement: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold bg-white"
                  >
                    <option value="home_carousel">Home Page Carousel</option>
                    <option value="dashboard_top">Affiliate Dashboard Top</option>
                    <option value="referral_hub">Referral Creatives Hub</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Action View</label>
                  <select
                    value={newBanner.linkUrl}
                    onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold bg-white"
                  >
                    <option value="packages">Course Packages Page</option>
                    <option value="withdrawal">Withdrawal Page</option>
                    <option value="referral">Referral Hub</option>
                    <option value="leaderboard">Leaderboard</option>
                  </select>
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
                  Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
