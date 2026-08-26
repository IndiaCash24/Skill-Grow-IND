import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Wallet,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface HomeBannerCarouselProps {
  isLoggedIn: boolean;
  onNavigateToDashboard: () => void;
  onOpenLogin: () => void;
  onScrollToPackages: () => void;
}

export const HomeBannerCarousel: React.FC<HomeBannerCarouselProps> = ({
  onScrollToPackages,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const banners = [
    {
      id: 'banner-payout',
      badge: 'INDIA’S HIGHEST COMMISSION',
      badgeIcon: Wallet,
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
      titlePrefix: 'INSTANT SAME-DAY',
      titleHighlight: 'DAILY PAYOUTS',
      titleSuffix: 'UP TO 90% COMMISSION',
      tagline: 'Direct UPI & Bank Transfers Every Single Day',
      bgGradient: 'from-[#2B0E04] via-[#4A1608] to-[#1F0A2B]',
      accentColor: 'from-amber-400 via-orange-400 to-rose-400',
    },
    {
      id: 'banner-meetup',
      badge: 'ANNUAL MEGA SUMMIT 2026',
      badgeIcon: Trophy,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      titlePrefix: 'SKILL GROW',
      titleHighlight: 'MEGA MEETUP',
      titleSuffix: '& LEADERSHIP SUMMIT',
      tagline: 'Celebrating 5.25L+ Affiliates & Achievers Across India',
      bgGradient: 'from-[#0B0F19] via-[#1E1B4B] to-[#311042]',
      accentColor: 'from-orange-400 via-amber-300 to-yellow-400',
    },
    {
      id: 'banner-courses',
      badge: 'TOP ACCREDITED COURSES',
      badgeIcon: GraduationCap,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      titlePrefix: 'MASTER HIGH-INCOME',
      titleHighlight: 'DIGITAL SKILLS',
      titleSuffix: '& MONETIZE DAILY',
      tagline: '50+ In-Depth Video Courses with Verified Certifications',
      bgGradient: 'from-[#062419] via-[#0B3B2C] to-[#0A2540]',
      accentColor: 'from-emerald-300 via-teal-300 to-cyan-400',
    },
  ];

  // Auto slide effect
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Touch Swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const currentBanner = banners[currentIndex];
  const BadgeIcon = currentBanner.badgeIcon;

  return (
    <div
      id="home-banner-carousel"
      className="w-full relative overflow-hidden bg-slate-950 select-none border-b border-orange-500/30 cursor-pointer"
      onClick={onScrollToPackages}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`w-full bg-gradient-to-r ${currentBanner.bgGradient} text-white relative px-4 sm:px-8 py-7 sm:py-9`}
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-3 sm:space-y-4 relative z-10">
            {/* Top Brand Label & Event Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center space-x-1 text-xs sm:text-sm font-semibold text-gray-300">
                <span>Skill</span>
                <span className="text-orange-400 font-bold">Grow</span>
                <span className="text-[10px] sm:text-xs bg-white/20 text-white px-1.5 py-0.5 rounded font-bold">
                  IND
                </span>
              </div>
              <span className="text-gray-400 text-xs hidden sm:inline">·</span>
              <div
                className={`inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${currentBanner.badgeColor}`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{currentBanner.badge}</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2 max-w-2xl sm:max-w-3xl">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase drop-shadow-md leading-tight">
                {currentBanner.titlePrefix}{' '}
                <span
                  className={`bg-gradient-to-r ${currentBanner.accentColor} bg-clip-text text-transparent`}
                >
                  {currentBanner.titleHighlight}
                </span>{' '}
                {currentBanner.titleSuffix}
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-200 font-normal max-w-xl mx-auto drop-shadow-xs">
                {currentBanner.tagline}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next Arrows */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Previous banner"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-xs flex items-center justify-center transition-all border border-white/10 shadow-md cursor-pointer z-20"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Next banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-xs flex items-center justify-center transition-all border border-white/10 shadow-md cursor-pointer z-20"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all rounded-full ${
              currentIndex === idx
                ? 'w-5 h-1.5 bg-gradient-to-r from-orange-400 to-amber-400'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

