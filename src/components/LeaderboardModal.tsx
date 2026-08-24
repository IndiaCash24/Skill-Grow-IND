import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { LeaderboardUser } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: LeaderboardUser[];
  onViewFull?: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  users,
  onViewFull,
}) => {
  if (!isOpen) return null;

  const top1 = users.find((u) => u.rank === 1) || users[0];
  const top2 = users.find((u) => u.rank === 2) || users[1];
  const top3 = users.find((u) => u.rank === 3) || users[2];
  const restUsers = users.filter((u) => u.rank >= 4).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-['Poppins',sans-serif]">
      <div
        id="leaderboard-modal-container"
        className="bg-white text-slate-900 w-full max-w-md rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 via-white to-white">
          <div className="text-left">
            <h3 className="font-extrabold text-base text-slate-900">Leaderboard</h3>
            <p className="text-[11px] text-[#EA580C] font-bold">Top Weekly Earners</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Podium for top 3 in White Theme */}
        <div className="p-4 bg-slate-50 border-b border-gray-100 flex items-end justify-center gap-2 pt-5 pb-4">
          {/* Rank 2 */}
          {top2 && (
            <div className="flex flex-col items-center flex-1 max-w-[100px] text-center">
              <div className="relative mb-1.5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 bg-white shadow-xs">
                  <img
                    src={top2.avatar}
                    alt={top2.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white">
                  #2
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-800 truncate max-w-[90px]">
                {top2.name}
              </p>
              <p className="text-[11px] font-extrabold text-[#EA580C]">₹{top2.earnings.toLocaleString('en-IN')}</p>
            </div>
          )}

          {/* Rank 1 */}
          {top1 && (
            <div className="flex flex-col items-center flex-1 max-w-[120px] text-center -translate-y-2">
              <div className="relative mb-1.5">
                <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-orange-500 ring-2 ring-orange-100 bg-white shadow-md">
                  <img
                    src={top1.avatar}
                    alt={top1.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[10px] font-black px-2 py-0.2 rounded-full border border-white">
                  #1
                </span>
              </div>
              <p className="text-xs font-black text-slate-900 truncate max-w-[100px]">
                {top1.name}
              </p>
              <p className="text-xs font-black text-[#EA580C]">₹{top1.earnings.toLocaleString('en-IN')}</p>
            </div>
          )}

          {/* Rank 3 */}
          {top3 && (
            <div className="flex flex-col items-center flex-1 max-w-[100px] text-center">
              <div className="relative mb-1.5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 bg-white shadow-xs">
                  <img
                    src={top3.avatar}
                    alt={top3.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white">
                  #3
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-800 truncate max-w-[90px]">
                {top3.name}
              </p>
              <p className="text-[11px] font-extrabold text-[#EA580C]">₹{top3.earnings.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>

        {/* List in White Theme */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {restUsers.map((user) => (
            <div
              key={user.rank}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-200 shadow-2xs hover:border-orange-300 transition-colors"
            >
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-[#FF6B00] text-white text-[8px] font-black px-1 rounded-full border border-white">
                    #{user.rank}
                  </span>
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-900 truncate">{user.name}</h5>
                  <p className="text-[9.5px] text-slate-500 uppercase font-medium truncate">
                    {user.package}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-[#EA580C] block">
                  ₹{user.earnings.toLocaleString('en-IN')}
                </span>
                <span className="text-[9.5px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.2 rounded-full inline-block">Prime</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {onViewFull && (
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => {
                onClose();
                onViewFull();
              }}
              className="w-full py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <span>View Full Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
