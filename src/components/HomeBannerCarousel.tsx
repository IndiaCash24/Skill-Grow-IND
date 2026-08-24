import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogIn,
  GraduationCap,
  PlayCircle,
} from 'lucide-react';

interface HomeBannerCarouselProps {
  isLoggedIn: boolean;
  onNavigateToDashboard: () => void;
  onOpenLogin: () => void;
  onScrollToPackages: () => void;
}

export const HomeBannerCarousel: React.FC<HomeBannerCarouselProps> = ({
  isLoggedIn,
  onNavigateToDashboard,
  onOpenLogin,
  onScrollToPackages,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const banners = [
    {
      id: 'banner-meetup',
      badge: 'ANNUAL MEGA SUMMIT 2026',
      badgeIcon: Sparkles,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      titlePrefix: 'Skill Grow',
      titleHighlight: 'Mega Meetup',
      titleSuffix: '& Leadership Summit',
      tagline: "Celebrating 5.25L+ Affiliates & Achievers Across India",
      description:
        "Connect directly with India's top earning mentors, celebrate record-breaking growth, and unlock exclusive high-ticket sales strategies.",
      features: [
        { icon: Zap, label: 'Powerful Sessions', sub: 'Learn. Apply. Grow.' },
        { icon: Users, label: 'Meet & Network', sub: 'Connect with Leaders' },
        { icon: Award, label: 'Recognition', sub: 'Trophy & Certificates' },
        { icon: TrendingUp, label: 'Future Roadmap', sub: 'New 2026 Bonuses' },
      ],
      bgGradient: 'from-[#0B0F19] via-[#1E1B4B] to-[#311042]',
      accentColor: 'from-orange-400 via-amber-300 to-yellow-400',
      primaryBtnText: 'Explore All Packages',
      primaryBtnAction: onScrollToPackages,
      secondaryBtnTextLoggedIn: 'Affiliate Dashboard',
      secondaryBtnTextGuest: 'Login to Join',
    },
    {
      id: 'banner-courses',
      badge: 'TOP ACCREDITED COURSES',
      badgeIcon: GraduationCap,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      titlePrefix: 'Master High-Income',
      titleHighlight: 'Digital Skills',
      titleSuffix: '& Monetize Daily',
      tagline: "50+ In-Depth Video Courses with Verified Certifications",
      description:
        'Learn high-converting Performance Ads, AI Automation Tools, Video Editing, Social Media Growth, and Affiliate Selling Secrets.',
      features: [
        { icon: PlayCircle, label: '1,000+ Videos', sub: 'HD Step-by-Step' },
        { icon: BookOpen, label: 'Practical Skills', sub: 'Zero Theory Fluff' },
        { icon: CheckCircle2, label: 'Live Q&A Support', sub: 'Daily Mentorship' },
        { icon: Award, label: 'Certificate', sub: 'Industry Recognized' },
      ],
      bgGradient: 'from-[#062419] via-[#0B3B2C] to-[#0A2540]',
      accentColor: 'from-emerald-300 via-teal-300 to-cyan-400',
      primaryBtnText: 'View Course Packages',
      primaryBtnAction: onScrollToPackages,
      secondaryBtnTextLoggedIn: 'Affiliate Dashboard',
      secondaryBtnTextGuest: 'Register to Start',
    },
    {
      id: 'banner-payout',
      badge: 'INDIA’S HIGHEST COMMISSION',
      badgeIcon: Wallet,
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
      titlePrefix: 'Instant Same-Day',
      titleHighlight: 'Daily Payouts',
      titleSuffix: 'Up to 90% Commission',
      tagline: "Direct UPI & Bank Transfers Every Single Day",
      description:
        'Earn up to ₹3,000+ per referral with 2-tier passive income and zero delay. Real-time transparent dashboard tracking!',
      features: [
        { icon: Zap, label: 'Daily Bank Credit', sub: 'Automatic Same Day' },
        { icon: TrendingUp, label: '2-Tier Passive', sub: 'Multi-Level Income' },
        { icon: ShieldCheck, label: '100% Safe', sub: 'RBI Compliant UPI' },
        { icon: Users, label: '5.25L+ Members', sub: 'Trusted Community' },
      ],
      bgGradient: 'from-[#2B0E04] via-[#4A1608] to-[#1F0A2B]',
      accentColor: 'from-amber-400 via-orange-400 to-rose-400',
      primaryBtnText: 'Get Started Today',
      primaryBtnAction: onScrollToPackages,
      secondaryBtnTextLoggedIn: 'Affiliate Dashboard',
      secondaryBtnTextGuest: 'Login / Register',
    },
  ];

  // Auto slide effect
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
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
      className="w-full relative overflow-hidden bg-slate-950 select-none border-b border-orange-500/30"
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
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className={`w-full bg-gradient-to-r ${currentBanner.bgGradient} text-white relative px-4 py-7 sm:py-9`}
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-6 relative z-10 py-2 sm:py-4">
            
            {/* Top Brand Label & Event Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center space-x-1 text-xs sm:text-sm font-semibold text-gray-300">
                <span>Skill</span>
                <span className="text-orange-400 font-bold">Grow</span>
                <span className="text-[10px] sm:text-xs bg-white/20 text-white px-1.5 py-0.5 rounded font-bold">IND</span>
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
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md leading-tight">
                {currentBanner.titlePrefix}{' '}
                <span
                  className={`bg-gradient-to-r ${currentBanner.accentColor} bg-clip-text text-transparent`}
                >
                  {currentBanner.titleHighlight}
                </span>{' '}
                {currentBanner.titleSuffix}
              </h1>
              <p className="text-xs sm:text-base text-gray-200 font-medium max-w-2xl mx-auto">
                {currentBanner.tagline}
              </p>
              <p className="text-[11px] sm:text-sm text-gray-300 max-w-2xl mx-auto font-normal pt-1 leading-relaxed hidden sm:block">
                {currentBanner.description}
              </p>
            </div>

            {/* 4 Feature Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-3xl pt-1 sm:pt-2">
              {currentBanner.features.map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center transition-all shadow-xs"
                  >
                    <FeatIcon className="w-5 h-5 text-amber-300 mb-1.5" />
                    <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {feat.label}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-300 mt-0.5">{feat.sub}</span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons: STRICT INTENT: Affiliate Dashboard ONLY for Logged In Users */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <button
                type="button"
                onClick={currentBanner.primaryBtnAction}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-7 py-3 rounded-full shadow-lg transition-transform active:scale-95 flex items-center space-x-2 cursor-pointer"
              >
                <span>{currentBanner.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isLoggedIn ? (
                /* ONLY SHOWN TO REGISTERED / LOGGED-IN USERS */
                <button
                  type="button"
                  id="home-affiliate-dashboard-btn"
                  onClick={onNavigateToDashboard}
                  className="bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-full border border-white/20 transition-all flex items-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-pink-300" />
                  <span>{currentBanner.secondaryBtnTextLoggedIn} ➔</span>
                </button>
              ) : (
                /* GUEST ALTERNATIVE: LOGIN / SIGN UP */
                <button
                  type="button"
                  id="home-guest-login-btn"
                  onClick={onOpenLogin}
                  className="bg-white/15 hover:bg-white/25 text-amber-200 hover:text-white font-semibold px-6 py-3 rounded-full border border-white/20 transition-all flex items-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>{currentBanner.secondaryBtnTextGuest}</span>
                </button>
              )}
            </div>

            {/* Bottom Slogan */}
            <div className="text-[10px] text-amber-300/90 font-semibold tracking-wider uppercase pt-1">
              ONE TEAM · ONE VISION · ONE CELEBRATION · BE THERE, BE PROUD!
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous banner"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-xs flex items-center justify-center transition-all border border-white/10 shadow-md cursor-pointer z-20"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-xs flex items-center justify-center transition-all border border-white/10 shadow-md cursor-pointer z-20"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all rounded-full ${
              currentIndex === idx
                ? 'w-6 h-2 bg-gradient-to-r from-orange-400 to-amber-400'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
