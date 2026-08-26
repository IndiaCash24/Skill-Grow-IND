import React, { useState } from 'react';
import {
  Bell,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radio,
  Clock,
  Check,
} from 'lucide-react';
import { AdminAnnouncement } from '../../../types';

interface AdminBroadcastsTabProps {
  announcements: AdminAnnouncement[];
  onAddAnnouncement: (announcement: AdminAnnouncement) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const AdminBroadcastsTab: React.FC<AdminBroadcastsTabProps> = ({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AdminAnnouncement['type']>('bonus');
  const [targetAudience, setTargetAudience] = useState<AdminAnnouncement['targetAudience']>('all');
  const [linkUrl, setLinkUrl] = useState('');
  const [isSentNotice, setIsSentNotice] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const item: AdminAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      message,
      type,
      targetAudience,
      linkUrl: linkUrl || undefined,
      createdAt: 'Just now',
      isActive: true,
    };

    onAddAnnouncement(item);
    setTitle('');
    setMessage('');
    setLinkUrl('');
    setIsSentNotice(true);
    setTimeout(() => setIsSentNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Platform Broadcasts & Push Alerts</h2>
          <p className="text-xs text-slate-500">
            Publish real-time announcements, webinar reminders, and leaderboard contests across the affiliate network.
          </p>
        </div>

        {isSentNotice && (
          <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Broadcast Sent to All Affiliates!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Broadcast Composer */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 text-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Radio className="w-5 h-5 text-orange-500 animate-pulse" />
            <h3 className="font-black text-sm text-slate-900">Compose Network Broadcast</h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Broadcast Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 🏆 Today Night 9:00 PM: Mega Leaderboard Reward Distribution!"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold focus:border-orange-500 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Broadcast Message Body</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail instructions, webinar credentials, or bonus qualification criteria..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium focus:border-orange-500 text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Broadcast Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-semibold bg-white"
                >
                  <option value="bonus">🎁 Bonus & Contest Carnival</option>
                  <option value="webinar">🎥 Live Webinar / Masterclass</option>
                  <option value="urgent">⚡ Urgent / Important Alert</option>
                  <option value="info">ℹ️ General Info / System Update</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-semibold bg-white"
                >
                  <option value="all">All Registered Users & Affiliates</option>
                  <option value="affiliates">Active Affiliates Only</option>
                  <option value="mentors">Mentors & Top Leaders Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Action Button Link (Optional)</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. leaderboard or packages or https://zoom.us/..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Broadcast Network Push</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Active & Recent Broadcasts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-sm text-slate-900">Broadcast History ({announcements.length})</h3>
            <span className="text-[10px] font-bold text-slate-400">Live Network Feed</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
            {announcements.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No active broadcasts.</div>
            ) : (
              announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-3.5 rounded-xl border space-y-2 relative transition-all ${
                    ann.type === 'bonus'
                      ? 'border-purple-200 bg-purple-50/30'
                      : ann.type === 'webinar'
                      ? 'border-blue-200 bg-blue-50/30'
                      : ann.type === 'urgent'
                      ? 'border-rose-200 bg-rose-50/30'
                      : 'border-slate-200 bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        ann.type === 'bonus'
                          ? 'bg-purple-100 text-purple-800'
                          : ann.type === 'webinar'
                          ? 'bg-blue-100 text-blue-800'
                          : ann.type === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {ann.type}
                    </span>

                    <button
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Broadcast"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-black text-slate-900 text-xs">{ann.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{ann.message}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>{ann.createdAt}</span>
                    <span className="font-bold text-slate-500">Audience: {ann.targetAudience}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
