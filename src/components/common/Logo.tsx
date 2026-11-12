import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-[15px] sm:text-lg lg:text-xl',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 group select-none py-1">
      {/* Authentic NNS Sarva Dharma Lotus Emblem */}
      <div
        className={`${iconSizes[size]} shrink-0 relative rounded-full flex items-center justify-center p-0.5 transition-transform duration-300 group-hover:scale-105 shadow-xs overflow-hidden ${
          isLight
            ? 'bg-[#FFFDF7] border border-[#C49A45]/40'
            : 'bg-white border border-[#C49A45]/50'
        }`}
      >
        <img
          src="/assets/aistudio/image_81b81f34.png"
          alt="Nitya Narayana Seva Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex flex-col text-left justify-center min-w-0">
        {/* Title: whitespace-nowrap and leading-snug with pt-0.5 prevents top letter clipping */}
        <span
          className={`font-serif font-bold tracking-tight leading-snug whitespace-nowrap pt-0.5 ${titleSizes[size]} ${
            isLight ? 'text-white' : 'text-[#45382F]'
          }`}
        >
          Nitya Narayana Seva
        </span>
        {showTagline && (
          <span
            className={`text-[9.5px] sm:text-[11px] font-sans font-medium tracking-normal whitespace-nowrap leading-tight mt-0.5 ${
              isLight ? 'text-white/80' : 'text-[#45382F]/75'
            }`}
          >
            A Little Help. A Lot of Humanity.
          </span>
        )}
      </div>
    </div>
  );
};
