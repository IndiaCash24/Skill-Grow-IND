import React from 'react';
import { ChevronRight } from 'lucide-react';
import { GeometricWatermark } from './GeometricWatermark';
import { EarningStats } from '../types';
import { useCountUp } from '../hooks/useCountUp';

interface EarningCardsGridProps {
  earnings: EarningStats;
  refreshKey?: number;
  onViewDetails: (cardType: 'today' | 'sevenDays' | 'thirtyDays' | 'allTime' | 'passive') => void;
}

export const EarningCardsGrid: React.FC<EarningCardsGridProps> = ({ earnings, refreshKey = 0, onViewDetails }) => {
  // Smooth 6-second count-up animations for each earning metric
  const animatedToday = useCountUp(earnings.today, 6000, refreshKey);
  const animatedSevenDays = useCountUp(earnings.sevenDays, 6000, refreshKey);
  const animatedThirtyDays = useCountUp(earnings.thirtyDays, 6000, refreshKey);
  const animatedAllTime = useCountUp(earnings.allTime, 6000, refreshKey);
  const animatedPassiveIncome = useCountUp(earnings.passiveIncome, 6000, refreshKey);

  return (
    <div id="earning-cards-section" className="space-y-3.5 sm:space-y-4">
      {/* 2x2 Grid for the top 4 metric cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Card 1: Today's Earning (Magenta / Hot Pink Gradient) */}
        <div
          id="card-today-earning"
          onClick={() => onViewDetails('today')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onViewDetails('today')}
          className="relative group bg-gradient-to-br from-[#D81B60] via-[#C2185B] to-[#9D157F] rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-pink-900/15 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
        >
          <GeometricWatermark variant="magenta" />

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[105px] sm:min-h-[120px]">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                  ₹ {Math.round(animatedToday).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-pink-50/95 mt-1 tracking-wide">
                Today's Earning
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] sm:text-xs text-pink-100 group-hover:text-white transition-colors">
              <span className="font-light">View details</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 2: 7 Days Earning (Deep Indigo / Violet Purple Gradient) */}
        <div
          id="card-7days-earning"
          onClick={() => onViewDetails('sevenDays')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onViewDetails('sevenDays')}
          className="relative group bg-gradient-to-br from-[#6D28D9] via-[#5B21B6] to-[#4C1D95] rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-purple-900/15 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
        >
          <GeometricWatermark variant="purple" />

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[105px] sm:min-h-[120px]">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                  ₹ {Math.round(animatedSevenDays).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-purple-100/95 mt-1 tracking-wide">
                7 Days Earning
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] sm:text-xs text-purple-200 group-hover:text-white transition-colors">
              <span className="font-light">View details</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 3: 30 Days Earning (Royal Cobalt Blue Gradient) */}
        <div
          id="card-30days-earning"
          onClick={() => onViewDetails('thirtyDays')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onViewDetails('thirtyDays')}
          className="relative group bg-gradient-to-br from-[#1E40AF] via-[#1E3A8A] to-[#172554] rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-blue-900/15 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
        >
          <GeometricWatermark variant="blue" />

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[105px] sm:min-h-[120px]">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                  ₹ {Math.round(animatedThirtyDays).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-blue-100/95 mt-1 tracking-wide">
                30 Days Earning
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] sm:text-xs text-blue-200 group-hover:text-white transition-colors">
              <span className="font-light">View details</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 4: All Time Earning (Vibrant Purple Gradient) */}
        <div
          id="card-alltime-earning"
          onClick={() => onViewDetails('allTime')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onViewDetails('allTime')}
          className="relative group bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#581C87] rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-indigo-900/15 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
        >
          <GeometricWatermark variant="indigo" />

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[105px] sm:min-h-[120px]">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                  ₹ {Math.round(animatedAllTime).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-purple-100/95 mt-1 tracking-wide">
                All Time Earning
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] sm:text-xs text-purple-200 group-hover:text-white transition-colors">
              <span className="font-light">View details</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 5: Passive Income (Full-Width Radiant Orange Gradient Card) */}
      <div
        id="card-passive-income"
        onClick={() => onViewDetails('passive')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onViewDetails('passive')}
        className="relative group bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#D97706] rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-orange-900/15 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200"
      >
        <GeometricWatermark variant="orange" />

        <div className="relative z-10 flex flex-col justify-between min-h-[90px] sm:min-h-[100px]">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                ₹ {Math.round(animatedPassiveIncome).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-orange-100/95 mt-1 tracking-wide">
              Passive Income
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] sm:text-xs text-orange-100 group-hover:text-white transition-colors">
            <span className="font-light">View details</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
