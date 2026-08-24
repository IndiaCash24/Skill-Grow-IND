import React, { useState } from 'react';
import {
  Link2,
  ExternalLink,
  Save,
  Check,
  Video,
  Send,
  MessageCircle,
  Youtube,
  Instagram,
  Mail,
  Phone,
  Clock,
  Globe,
  FileText,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { AdminPlatformLinks } from '../../../types';

interface CustomLinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
}

interface AdminLinksTabProps {
  platformLinks: AdminPlatformLinks;
  onSaveLinks: (links: AdminPlatformLinks) => void;
}

export const AdminLinksTab: React.FC<AdminLinksTabProps> = ({
  platformLinks,
  onSaveLinks,
}) => {
  const [formData, setFormData] = useState<AdminPlatformLinks>(platformLinks);
  const [isSaved, setIsSaved] = useState(false);

  const [customLinks, setCustomLinks] = useState<CustomLinkItem[]>([
    {
      id: 'cl-1',
      title: 'Skill Grow IND Official Presentation Plan (PDF)',
      url: 'https://drive.google.com/file/d/SkillGrowINDPresentationDeck/view',
      description: 'Downloadable PDF business plan for WhatsApp sharing',
    },
    {
      id: 'cl-2',
      title: 'Audio Sales Training & Objection Handling (Drive)',
      url: 'https://drive.google.com/drive/folders/SkillGrowAudioMastery',
      description: 'Audio recordings of top sales calls & closing scripts',
    },
  ]);

  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [newCustomDesc, setNewCustomDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLinks(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTitle || !newCustomUrl) return;

    const newItem: CustomLinkItem = {
      id: `cl-${Date.now()}`,
      title: newCustomTitle,
      url: newCustomUrl,
      description: newCustomDesc,
    };

    setCustomLinks([...customLinks, newItem]);
    setNewCustomTitle('');
    setNewCustomUrl('');
    setNewCustomDesc('');
  };

  const handleDeleteCustomLink = (id: string) => {
    setCustomLinks(customLinks.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Official Community & Social Links</h2>
          <p className="text-xs text-slate-500">
            Control all platform links shown to users in the app, referral hub, daily webinar alerts, and support desk.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Platform Links Updated Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Live Masterclass & Webinars */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-black text-sm pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3>Daily Live Training & Masterclass Schedule</h3>
              <p className="text-xs text-slate-400 font-normal">
                This link is accessed by all affiliates for evening skill sessions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Live Zoom / Webinar Meeting Link</label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.liveTrainingZoom}
                  onChange={(e) => setFormData({ ...formData, liveTrainingZoom: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="w-full pl-3 pr-10 py-2.5 border border-slate-200 rounded-xl font-mono focus:border-orange-500"
                  required
                />
                <a
                  href={formData.liveTrainingZoom}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Training Timing & Frequency</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.trainingTime}
                  onChange={(e) => setFormData({ ...formData, trainingTime: e.target.value })}
                  placeholder="e.g. Everyday 08:30 PM IST (Mon-Sun)"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:border-orange-500 font-semibold"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Official Groups & Social Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-black text-sm pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3>Official Community Groups & Channels</h3>
              <p className="text-xs text-slate-400 font-normal">
                Direct invite links for WhatsApp groups, Telegram, and YouTube
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Official Community Group</label>
              <input
                type="url"
                value={formData.whatsappCommunity}
                onChange={(e) => setFormData({ ...formData, whatsappCommunity: e.target.value })}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Telegram Official Broadcast Channel</label>
              <input
                type="url"
                value={formData.telegramChannel}
                onChange={(e) => setFormData({ ...formData, telegramChannel: e.target.value })}
                placeholder="https://t.me/..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">YouTube Channel & Video Playlists</label>
              <input
                type="url"
                value={formData.youtubePlaylist}
                onChange={(e) => setFormData({ ...formData, youtubePlaylist: e.target.value })}
                placeholder="https://youtube.com/@..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Instagram Official Page Handle</label>
              <input
                type="url"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono focus:border-orange-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Support Contact & Legal */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-black text-sm pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3>Support Helpdesk & Legal Policies</h3>
              <p className="text-xs text-slate-400 font-normal">
                Direct phone helpline, email, and terms & conditions URLs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Support WhatsApp / Calling Number</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-semibold focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                placeholder="support@skillgrowind.com"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-semibold focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Terms & Conditions URL</label>
              <input
                type="url"
                value={formData.termsUrl}
                onChange={(e) => setFormData({ ...formData, termsUrl: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Privacy Policy URL</label>
              <input
                type="url"
                value={formData.privacyUrl}
                onChange={(e) => setFormData({ ...formData, privacyUrl: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Primary Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Official Links</span>
          </button>
        </div>
      </form>

      {/* Section 4: Custom Drive & Resource Links */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-slate-900">Custom Training Resources & Drive Links</h3>
            <p className="text-xs text-slate-500">Add downloadable PDFs, PPTs, and audio libraries for affiliates</p>
          </div>
        </div>

        {/* List of Custom Links */}
        <div className="space-y-3">
          {customLinks.map((link) => (
            <div
              key={link.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <span>{link.title}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-slate-500 mt-0.5">{link.description}</p>
                <span className="font-mono text-[11px] text-slate-400 block mt-1">{link.url}</span>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteCustomLink(link.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Custom Link Form */}
        <form onSubmit={handleAddCustomLink} className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/40 space-y-3 text-xs">
          <span className="font-bold text-slate-800 block text-xs">+ Add New Resource Link</span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Resource Title</label>
              <input
                type="text"
                value={newCustomTitle}
                onChange={(e) => setNewCustomTitle(e.target.value)}
                placeholder="e.g. 50+ High Converting WhatsApp Follow-up Scripts"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target URL</label>
              <input
                type="url"
                value={newCustomUrl}
                onChange={(e) => setNewCustomUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Short Description</label>
            <input
              type="text"
              value={newCustomDesc}
              onChange={(e) => setNewCustomDesc(e.target.value)}
              placeholder="e.g. Ready-to-copy text templates for WhatsApp chat closing"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
            >
              Add Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
