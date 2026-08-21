import React from 'react';
import { X, Trophy, Medal, Award, Flame } from 'lucide-react';
import { LeaderboardUser } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: LeaderboardUser[];
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, users }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        id="leaderboard-modal-container"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Trophy className="w-6 h-6 text-yellow-100" />
            <div>
              <h3 className="font-bold text-lg">RichIND Leaderboard</h3>
              <p className="text-xs text-amber-100">Top earning affiliate partners across India</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Podium for top 3 */}
        <div className="p-4 bg-slate-50 border-b border-gray-100 flex items-end justify-center space-x-3 pt-6 pb-4">
          {/* Rank 2 */}
          {users[1] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={users[1].avatar}
                  alt={users[1].name}
                  className="w-12 h-12 rounded-full border-2 border-slate-300 object-cover shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-slate-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </div>
              <p className="text-[11px] font-bold text-gray-800 mt-1 truncate max-w-[70px]">
                {users[1].name}
              </p>
              <p className="text-[10px] font-bold text-slate-700">₹{(users[1].earnings / 1000).toFixed(0)}k</p>
            </div>
          )}

          {/* Rank 1 */}
          {users[0] && (
            <div className="flex flex-col items-center -translate-y-2">
              <div className="relative">
                <Flame className="w-5 h-5 text-amber-500 mx-auto -mb-1 animate-bounce" />
                <img
                  src={users[0].avatar}
                  alt={users[0].name}
                  className="w-14 h-14 rounded-full border-2 border-amber-400 ring-2 ring-amber-300 object-cover shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  1
                </span>
              </div>
              <p className="text-xs font-extrabold text-gray-900 mt-1 truncate max-w-[80px]">
                {users[0].name}
              </p>
              <p className="text-xs font-bold text-amber-600">₹{(users[0].earnings / 1000).toFixed(0)}k</p>
            </div>
          )}

          {/* Rank 3 */}
          {users[2] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={users[2].avatar}
                  alt={users[2].name}
                  className="w-12 h-12 rounded-full border-2 border-amber-700 object-cover shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
              <p className="text-[11px] font-bold text-gray-800 mt-1 truncate max-w-[70px]">
                {users[2].name}
              </p>
              <p className="text-[10px] font-bold text-amber-800">₹{(users[2].earnings / 1000).toFixed(0)}k</p>
            </div>
          )}
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {users.map((user) => (
            <div
              key={user.rank}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 text-center font-extrabold text-xs text-gray-500">
                  #{user.rank}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h5 className="text-xs font-bold text-gray-900">{user.name}</h5>
                  <p className="text-[10px] text-gray-500">
                    {user.package} • {user.state}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-600">
                ₹ {user.earnings.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
