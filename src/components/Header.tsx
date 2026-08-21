import React from 'react';
import { SkillGrowIndLogo } from './SkillGrowIndLogo';

interface HeaderProps {
  avatarUrl: string;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ avatarUrl, onOpenMenu, onOpenProfile }) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]"
    >
      {/* Brand Logo */}
      <div className="flex items-center">
        <SkillGrowIndLogo size="md" />
      </div>

      {/* Right Controls: Mini Avatar + Hamburger Icon */}
      <div className="flex items-center space-x-3.5">
        <button
          id="header-profile-btn"
          onClick={onOpenProfile}
          type="button"
          aria-label="View Profile"
          className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-pink-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 active:scale-95 transition-transform"
        >
          <img
            src={avatarUrl}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // fallback if network image fails
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
            }}
          />
        </button>

        {/* Hamburger Menu Button */}
        <button
          id="header-hamburger-btn"
          onClick={onOpenMenu}
          type="button"
          aria-label="Open Navigation Menu"
          className="p-1.5 rounded-lg text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none"
        >
          <div className="w-6 h-5 flex flex-col justify-between items-center py-0.5">
            <span className="w-full h-[2.5px] bg-gray-800 rounded-full"></span>
            <span className="w-full h-[2.5px] bg-gray-800 rounded-full"></span>
            <span className="w-full h-[2.5px] bg-gray-800 rounded-full"></span>
          </div>
        </button>
      </div>
    </header>
  );
};
