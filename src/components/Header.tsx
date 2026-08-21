import React from 'react';
import { ShoppingCart, LayoutDashboard, Home } from 'lucide-react';
import { AppView } from './SidebarDrawer';

interface HeaderProps {
  avatarUrl: string;
  activeView: AppView;
  cartCount?: number;
  onSelectView: (view: AppView) => void;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  avatarUrl,
  activeView,
  cartCount = 0,
  onSelectView,
  onOpenMenu,
  onOpenProfile,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-white border-b border-gray-100 px-3.5 sm:px-5 py-2.5 flex items-center justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]"
    >
      {/* Left: Brand Logo */}
      <div
        onClick={() => onSelectView('home')}
        className="flex flex-col cursor-pointer select-none group"
      >
        <div className="flex items-center space-x-1.5">
          <div className="font-['Poppins'] font-black text-xl sm:text-2xl tracking-tight leading-none">
            <span className="text-orange-500">Skill</span>
            <span className="text-slate-900 ml-1">Grow</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-extrabold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-xs">
            IND
          </span>
        </div>
        <span className="text-[8.5px] sm:text-[9.5px] text-gray-500 italic font-serif tracking-tight leading-none mt-0.5">
          Earn knowledge ! Earn money
        </span>
      </div>

      {/* Right Controls: Quick View Switch + Cart (0) + Avatar + Hamburger Icon */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        
        {/* Quick View Switch Button */}
        {activeView !== 'dashboard' ? (
          <button
            id="nav-to-dashboard-btn"
            onClick={() => onSelectView('dashboard')}
            type="button"
            className="hidden sm:inline-flex items-center space-x-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        ) : (
          <button
            id="nav-to-home-btn"
            onClick={() => onSelectView('home')}
            type="button"
            className="hidden sm:inline-flex items-center space-x-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Page</span>
          </button>
        )}

        {/* Circular Emblem / Avatar */}
        <button
          id="header-profile-btn"
          onClick={onOpenProfile}
          type="button"
          aria-label="View Profile"
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-orange-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-95 transition-transform"
        >
          <img
            src={avatarUrl}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
            }}
          />
        </button>

        {/* Cart Icon with badge "0" (from Screenshot 1, 2, 3, 4, 5) */}
        <button
          id="header-cart-btn"
          onClick={() => onSelectView('home')}
          type="button"
          aria-label="Shopping Cart"
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform"
        >
          <ShoppingCart className="w-4 h-4 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
            {cartCount}
          </span>
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
            <span className="w-full h-[2.5px] bg-slate-800 rounded-full"></span>
            <span className="w-full h-[2.5px] bg-slate-800 rounded-full"></span>
            <span className="w-full h-[2.5px] bg-slate-800 rounded-full"></span>
          </div>
        </button>
      </div>
    </header>
  );
};
