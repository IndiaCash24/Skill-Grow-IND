import React from 'react';

interface WatermarkProps {
  variant?: 'magenta' | 'purple' | 'blue' | 'indigo' | 'orange';
  className?: string;
}

export const GeometricWatermark: React.FC<WatermarkProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none opacity-25 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 200 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Wireframe Triangle 1 (large floating right) */}
        <polygon
          points="160,15 190,85 130,75"
          stroke="white"
          strokeWidth="1.75"
          fill="white"
          fillOpacity="0.08"
        />
        <line x1="160" y1="15" x2="160" y2="78" stroke="white" strokeWidth="1" strokeOpacity="0.4" />

        {/* Small solid/hollow triangle top right */}
        <polygon
          points="145,55 160,30 175,55"
          fill="white"
          fillOpacity="0.2"
        />

        {/* Floating triangle middle left */}
        <polygon
          points="65,75 85,115 45,110"
          stroke="white"
          strokeWidth="1.25"
          fill="white"
          fillOpacity="0.06"
        />

        {/* Small angled triangle */}
        <polygon
          points="110,25 125,50 95,45"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />

        {/* Subtle hatched lines on right side */}
        <g stroke="white" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round">
          <line x1="150" y1="130" x2="175" y2="90" />
          <line x1="158" y1="133" x2="183" y2="93" />
          <line x1="166" y1="136" x2="191" y2="96" />
          <line x1="174" y1="139" x2="199" y2="99" />
          <line x1="182" y1="142" x2="205" y2="105" />
        </g>

        {/* Faint circle glow */}
        <circle cx="170" cy="80" r="32" stroke="white" strokeWidth="0.75" strokeOpacity="0.2" fill="none" />
      </svg>
    </div>
  );
};
