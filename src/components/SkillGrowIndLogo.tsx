import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SkillGrowIndLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const badgeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-[11px] sm:text-xs px-2 py-0.5',
    lg: 'text-xs sm:text-sm px-2.5 py-1',
  };

  return (
    <div
      id="skill-grow-ind-brand"
      className={`inline-flex items-center space-x-1.5 select-none font-['Poppins',sans-serif] ${className}`}
    >
      {/* Brand Name Text: "Skill Grow" */}
      <div className={`font-black tracking-tight flex items-center leading-none ${sizeClasses[size]}`}>
        <span className="text-slate-900 drop-shadow-xs">Skill</span>
        <span className="text-emerald-600 ml-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Grow
        </span>
      </div>

      {/* Modern High-End IND Badge with Tricolor Accent */}
      <div
        className={`inline-flex items-center space-x-1 font-extrabold rounded-md bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xs tracking-wider leading-none border border-slate-700/40 ${badgeClasses[size]}`}
      >
        <span>IND</span>
        {/* Subtle dual-color accent dots */}
        <span className="flex flex-col space-y-[2px] justify-center items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </span>
      </div>
    </div>
  );
};
