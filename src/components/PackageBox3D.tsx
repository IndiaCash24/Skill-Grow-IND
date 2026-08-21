import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCw, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { CoursePackage } from '../data/coursesData';

interface PackageBox3DProps {
  pkg: CoursePackage;
  interactive?: boolean;
}

export const PackageBox3D: React.FC<PackageBox3DProps> = ({ pkg, interactive = true }) => {
  const [rotateY, setRotateY] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Styling themes for each package 3D box
  const themeStyles = {
    orange: {
      accentBanner: 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600',
      spineBanner: 'bg-orange-600',
      tagText: 'SILVER',
      subtitle: 'GRAPHIC DESIGNING MASTERY',
      shadowColor: 'rgba(249, 115, 22, 0.35)',
      glowRing: 'ring-orange-400/30',
      illustrationBg: 'bg-gradient-to-b from-orange-50/80 via-white to-orange-50/40',
      badgeColor: 'bg-orange-500 text-white',
    },
    amber: {
      accentBanner: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600',
      spineBanner: 'bg-amber-600',
      tagText: 'GOLD',
      subtitle: 'SOFT SKILLS MASTERY',
      shadowColor: 'rgba(245, 158, 11, 0.35)',
      glowRing: 'ring-amber-400/30',
      illustrationBg: 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40',
      badgeColor: 'bg-amber-500 text-slate-900',
    },
    blue: {
      accentBanner: 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500',
      spineBanner: 'bg-blue-700',
      tagText: 'DIAMOND',
      subtitle: 'DIGITAL MARKETING MASTERY',
      shadowColor: 'rgba(2, 132, 199, 0.35)',
      glowRing: 'ring-blue-400/30',
      illustrationBg: 'bg-gradient-to-b from-blue-50/80 via-white to-blue-50/40',
      badgeColor: 'bg-blue-600 text-white',
    },
    purple: {
      accentBanner: 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600',
      spineBanner: 'bg-purple-700',
      tagText: 'PLATINUM',
      subtitle: 'STOCK TRADING MASTERY',
      shadowColor: 'rgba(147, 51, 234, 0.35)',
      glowRing: 'ring-purple-400/30',
      illustrationBg: 'bg-gradient-to-b from-purple-50/80 via-white to-purple-50/40',
      badgeColor: 'bg-purple-600 text-white',
    },
    emerald: {
      accentBanner: 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700',
      spineBanner: 'bg-emerald-700',
      tagText: 'PREMIUM PLUS',
      subtitle: 'AI & HIGH-TICKET MASTERY',
      shadowColor: 'rgba(16, 185, 129, 0.35)',
      glowRing: 'ring-emerald-400/30',
      illustrationBg: 'bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/40',
      badgeColor: 'bg-emerald-600 text-white',
    },
  }[pkg.colorTheme] || {
    accentBanner: 'bg-gradient-to-r from-orange-500 to-amber-500',
    spineBanner: 'bg-orange-600',
    tagText: 'PACKAGE',
    subtitle: 'COURSE MASTERY',
    shadowColor: 'rgba(249, 115, 22, 0.35)',
    glowRing: 'ring-orange-400/30',
    illustrationBg: 'bg-orange-50',
    badgeColor: 'bg-orange-500 text-white',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isSpinning) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleSpinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSpinning(true);
    setRotateY((prev) => prev + 360);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className="w-full flex flex-col justify-center items-center py-5 sm:py-7 px-2 select-none perspective-[1000px]"
    >
      {/* 3D Box Perspective Wrapper with Floating Motion */}
      <motion.div
        animate={{
          y: isHovered ? -6 : [0, -8, 0],
          rotateX: isHovered ? -mousePos.y * 18 : 0,
          rotateY: rotateY + (isHovered ? mousePos.x * 24 : 0),
          scale: isHovered ? 1.04 : 1,
        }}
        transition={{
          y: isHovered ? { duration: 0.2 } : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
          rotateX: { type: 'spring', stiffness: 260, damping: 20 },
          rotateY: isSpinning
            ? { duration: 0.9, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 260, damping: 20 },
          scale: { duration: 0.25 },
        }}
        className="relative group max-w-[280px] sm:max-w-[320px] w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Dynamic Glowing Aura behind the 3D Box */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.7 : 0.35,
            scale: isHovered ? 1.15 : [1, 1.05, 1],
          }}
          transition={{
            scale: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
            opacity: { duration: 0.3 },
          }}
          className="absolute -inset-2 rounded-3xl blur-xl pointer-events-none transition-opacity"
          style={{ backgroundColor: themeStyles.shadowColor }}
        />

        {/* Dynamic Floor Shadow under box */}
        <motion.div
          animate={{
            scaleX: isHovered ? 1.1 : [1, 0.92, 1],
            opacity: isHovered ? 0.25 : 0.16,
          }}
          transition={{
            scaleX: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
            opacity: { duration: 0.2 },
          }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-7 bg-black blur-md rounded-full pointer-events-none"
        />

        {/* 3D Box Body */}
        <div className="relative flex justify-center items-stretch drop-shadow-2xl">
          
          {/* Main Front Face of 3D Box */}
          <div className="relative w-[210px] sm:w-[240px] bg-white rounded-r-xl border border-gray-200/90 shadow-xl overflow-hidden flex flex-col justify-between z-10">
            
            {/* Shimmer / Light Beam Animation across the front face */}
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                repeat: Infinity,
                repeatDelay: 3,
                duration: 1.8,
                ease: 'easeInOut',
              }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none z-20"
            />

            {/* Box Header Branding */}
            <div className="pt-3.5 pb-2 px-3 text-center border-b border-gray-100 bg-gradient-to-b from-slate-50/90 to-white relative">
              <div className="flex items-center justify-center space-x-1">
                <span className="font-extrabold text-sm tracking-tight text-slate-800 font-['Poppins']">
                  Skill<span className="text-orange-500 font-black">Grow</span>
                </span>
                <span className="text-[9px] font-bold bg-slate-900 text-white px-1 py-0.2 rounded text-center">IND</span>
              </div>
              <p className="text-[8.5px] text-gray-500 italic mt-0.5 tracking-tight font-serif text-center">
                Earn knowledge ! Earn money
              </p>
            </div>

            {/* Orange / Colored Accent Banner on Front */}
            <div className={`${themeStyles.accentBanner} text-white py-1.5 px-3 text-center shadow-xs relative overflow-hidden`}>
              <h4 className="font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs flex items-center justify-center gap-1">
                <span>{themeStyles.tagText}</span>
              </h4>
              <p className="text-[8.5px] sm:text-[9.5px] font-bold tracking-tight opacity-95">
                {themeStyles.subtitle}
              </p>
            </div>

            {/* Central Graphic Illustration */}
            <div className={`p-4 sm:p-5 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] ${themeStyles.illustrationBg} relative overflow-hidden`}>
              
              {/* Background ambient orbs */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/60 blur-xs" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/40 blur-xs" />

              {/* Animated Floating Graphic Center */}
              <motion.div
                animate={{
                  scale: isHovered ? 1.06 : 1,
                  rotate: isHovered ? [0, -1, 1, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                {pkg.colorTheme === 'orange' && (
                  <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="85" fill="#FED7AA" fillOpacity="0.6"/>
                    <rect x="50" y="70" width="100" height="70" rx="8" fill="#FFFFFF" stroke="#F97316" strokeWidth="4"/>
                    <path d="M70 115L90 95L110 110L130 90" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="75" cy="90" r="8" fill="#FBBF24"/>
                    <circle cx="100" cy="60" r="18" fill="#FB923C"/>
                    <path d="M80 140H120" stroke="#9A3412" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M100 140V155" stroke="#9A3412" strokeWidth="4"/>
                    <rect x="75" y="155" width="50" height="6" rx="3" fill="#9A3412"/>
                  </svg>
                )}

                {pkg.colorTheme === 'amber' && (
                  <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="85" fill="#FEF08A" fillOpacity="0.6"/>
                    <circle cx="100" cy="70" r="22" fill="#F59E0B"/>
                    <path d="M60 140C60 115 80 105 100 105C120 105 140 115 140 140" fill="#FBBF24"/>
                    <circle cx="140" cy="70" r="14" fill="#FDE047" stroke="#D97706" strokeWidth="3"/>
                    <path d="M135 70L145 70M140 65L140 75" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M40 90C45 80 60 85 65 95" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M160 90C155 80 140 85 135 95" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="100" cy="160" r="12" fill="#D97706"/>
                  </svg>
                )}

                {pkg.colorTheme === 'blue' && (
                  <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="85" fill="#BAE6FD" fillOpacity="0.6"/>
                    <rect x="45" y="55" width="110" height="75" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="4"/>
                    <path d="M60 105L85 80L110 95L135 70" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="135" cy="70" r="5" fill="#38BDF8"/>
                    <path d="M55 145H145" stroke="#0369A1" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M100 130V150" stroke="#0369A1" strokeWidth="4"/>
                  </svg>
                )}

                {pkg.colorTheme === 'purple' && (
                  <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="85" fill="#E9D5FF" fillOpacity="0.6"/>
                    <path d="M40 140L75 100L110 120L155 60" stroke="#7E22CE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M135 60H155V80" stroke="#7E22CE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="50" y="130" width="15" height="30" rx="3" fill="#A855F7"/>
                    <rect x="80" y="110" width="15" height="50" rx="3" fill="#C084FC"/>
                    <rect x="110" y="90" width="15" height="70" rx="3" fill="#9333EA"/>
                    <rect x="140" y="70" width="15" height="90" rx="3" fill="#7E22CE"/>
                  </svg>
                )}

                {pkg.colorTheme === 'emerald' && (
                  <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="85" fill="#A7F3D0" fillOpacity="0.6"/>
                    <path d="M60 90L100 55L140 90L125 135H75L60 90Z" fill="#FFFFFF" stroke="#059669" strokeWidth="4"/>
                    <circle cx="100" cy="95" r="16" fill="#10B981"/>
                    <path d="M100 70V120M75 95H125" stroke="#047857" strokeWidth="2.5"/>
                    <circle cx="100" cy="55" r="7" fill="#F59E0B"/>
                    <circle cx="60" cy="90" r="6" fill="#F59E0B"/>
                    <circle cx="140" cy="90" r="6" fill="#F59E0B"/>
                  </svg>
                )}
              </motion.div>

            </div>

            {/* Bottom Footer on Front Face */}
            <div className="py-2 px-3 text-center bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[8.5px] text-gray-500 font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-slate-700" />
                <span>ISO 9001:2015</span>
              </span>
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>100% Certified</span>
              </span>
            </div>
          </div>

          {/* 3D Side Spine (Book/Box Edge) */}
          <div className="relative w-[34px] sm:w-[40px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 rounded-l-md border-y border-l border-gray-300 shadow-md flex flex-col justify-between items-center py-3 overflow-hidden origin-right transform -skew-y-6">
            
            {/* Top Spine Logo */}
            <div className="text-[7px] font-black text-slate-800 uppercase tracking-tighter writing-mode-vertical rotate-180">
              Skill Grow
            </div>

            {/* Spine Title Accent */}
            <div className={`${themeStyles.spineBanner} w-full py-2 text-center my-auto shadow-inner`}>
              <span className="text-white text-[8px] font-extrabold uppercase tracking-widest block transform -rotate-90 whitespace-nowrap">
                {themeStyles.tagText}
              </span>
            </div>

            {/* Bottom Spine Badge */}
            <div className="text-[6px] font-bold text-gray-600 uppercase transform -rotate-90">
              IND
            </div>
          </div>

        </div>

        {/* 3D Interactive Rotate Button badge on top right */}
        {interactive && (
          <button
            type="button"
            onClick={handleSpinClick}
            title="Spin 3D Box 360°"
            className="absolute -top-2 -right-2 z-30 bg-white/90 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-md border border-gray-200/80 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 flex items-center space-x-1"
          >
            <RotateCw className={`w-3.5 h-3.5 text-orange-500 ${isSpinning ? 'animate-spin' : ''}`} />
            <span className="text-[9px] font-bold text-slate-600 pr-0.5">3D</span>
          </button>
        )}
      </motion.div>
    </div>
  );
};
