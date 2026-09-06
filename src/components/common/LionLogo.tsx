import React from 'react';

interface LionLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const LionLogo: React.FC<LionLogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 select-none cursor-pointer group ${className}`}>
      {/* 3D Isometric Red Cube Logo Icon matching the mockup */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        >
          {/* Top Face */}
          <polygon
            points="20,4 35,12 20,20 5,12"
            fill="#FF2B20"
          />
          {/* Left Face */}
          <polygon
            points="5,12 20,20 20,36 5,28"
            fill="#B30500"
          />
          {/* Right Face */}
          <polygon
            points="20,20 35,12 35,28 20,36"
            fill="#E10600"
          />
          {/* Isometric Inner Detail (Den Lion Accent) */}
          <polygon
            points="20,10 27,14 20,18 13,14"
            fill="#FFFFFF"
            fillOpacity="0.85"
          />
          <path
            d="M20,24 L20,32"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className={`font-sans font-bold tracking-tight leading-none flex items-center ${textSizes[size]}`}>
          <span className="text-white">Lion's Den</span>
          <span className="text-brand-red ml-0.5">3D</span>
        </div>
      )}
    </div>
  );
};
