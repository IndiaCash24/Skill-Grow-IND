import React, { useState } from 'react';
import { X, Check, Sparkles, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { avatarPresets } from '../data/defaultData';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string;
  onSelectAvatar: (url: string) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSelectAvatar,
}) => {
  const [selectedUrl, setSelectedUrl] = useState(currentAvatarUrl);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'men' | 'girl'>('ALL');
  const [customInputUrl, setCustomInputUrl] = useState('');

  if (!isOpen) return null;

  const filteredAvatars = avatarPresets.filter((av) => {
    if (genderFilter === 'ALL') return true;
    return av.gender === genderFilter;
  });

  const handleApply = () => {
    if (activeTab === 'custom' && customInputUrl.trim()) {
      onSelectAvatar(customInputUrl.trim());
    } else {
      onSelectAvatar(selectedUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-['Poppins',sans-serif]">
      <div
        id="avatar-picker-modal"
        className="bg-white text-slate-900 w-full max-w-lg rounded-3xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Choose Your Avatar</h3>
              <p className="text-xs text-gray-500">Pick a stylish 3D character or provide a custom photo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode switcher: Presets vs Custom URL */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-gray-100 gap-2">
          <div className="flex p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Characters ({avatarPresets.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Custom URL</span>
            </button>
          </div>

          {activeTab === 'presets' && (
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
              {(
                [
                  { id: 'ALL', label: 'All' },
                  { id: 'men', label: 'Boys (8)' },
                  { id: 'girl', label: 'Girls (8)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setGenderFilter(tab.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    genderFilter === tab.id
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredAvatars.map((av) => {
                const isSelected = selectedUrl === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedUrl(av.url)}
                    className={`group relative flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500 shadow-sm scale-102'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50/70'
                    }`}
                  >
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border border-white shadow-md p-0.5 bg-white group-hover:scale-105 transition-transform">
                      <img
                        src={av.url}
                        alt={av.label}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-2 text-center truncate max-w-full">
                      {av.label}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 uppercase">
                      {av.gender === 'men' ? 'Boy / Man' : 'Girl / Woman'}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Paste Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customInputUrl}
                    onChange={(e) => {
                      setCustomInputUrl(e.target.value);
                      if (e.target.value.trim()) {
                        setSelectedUrl(e.target.value.trim());
                      }
                    }}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  You can paste any online image link (JPG, PNG, WebP, SVG).
                </p>
              </div>

              {/* Preview */}
              {selectedUrl && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-500 bg-white shadow-sm shrink-0">
                    <img
                      src={selectedUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Avatar Preview</h5>
                    <p className="text-[11px] text-gray-500 truncate max-w-xs">{selectedUrl}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 bg-white shrink-0">
              <img
                src={selectedUrl || currentAvatarUrl}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-gray-600 hidden sm:inline">
              Selected avatar ready
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Apply Avatar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
