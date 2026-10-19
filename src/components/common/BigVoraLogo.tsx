import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'horizontal' | 'icon-only' | 'stacked';
  showText?: boolean;
  className?: string;
}

export const BigVoraLogo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'horizontal',
  showText = true, 
  className = '' 
}) => {
  // Dimensions mapping
  const iconPixelSizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 84,
    '2xl': 140,
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
  };

  const px = iconPixelSizes[size];

  // The 3D Emblem with Folded Ribbon "B", Orbital Ring, and Star
  const renderEmblem = (w: number, h: number) => (
    <div 
      className="relative flex items-center justify-center shrink-0"
      style={{ width: w, height: h }}
    >
      {/* Ambient background bloom matching the uploaded cosmic branding */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 via-purple-600/40 to-fuchsia-500/30 blur-md pointer-events-none" 
        style={{ transform: 'scale(1.15)' }}
      />
      
      <svg 
        viewBox="0 0 360 360" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full relative z-10 drop-shadow-xl"
      >
        <defs>
          {/* Main 3D Ribbon Blue-Violet Gradient */}
          <linearGradient id="bvRibbonBluePurple" x1="80" y1="60" x2="280" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="25%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="75%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Top Loop Soft Violet-Lilac Gradient */}
          <linearGradient id="bvTopLoop" x1="120" y1="50" x2="260" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="30%" stopColor="#6366F1" />
            <stop offset="70%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          {/* Bottom Loop Radiant Magenta-Purple */}
          <linearGradient id="bvBottomLoop" x1="120" y1="160" x2="280" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#581C87" />
            <stop offset="40%" stopColor="#7E22CE" />
            <stop offset="75%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>

          {/* Ribbon Fold Diagonal Face (Dark-to-Light 3D Shadow) */}
          <linearGradient id="bvFoldFace" x1="110" y1="260" x2="230" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="35%" stopColor="#312E81" />
            <stop offset="70%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#A21CAF" />
          </linearGradient>

          {/* Glowing Planetary Orbital Ring Gradient */}
          <linearGradient id="bvRingGrad" x1="30" y1="180" x2="330" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#C084FC" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#F472B6" stopOpacity="1" />
            <stop offset="100%" stopColor="#E879F9" stopOpacity="0.5" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="bvRingGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Star Sparkle Glow */}
          <radialGradient id="bvStarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E9D5FF" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- 1. BACK PORTION OF ORBITAL RING (Passes behind top right curve) --- */}
        <g transform="rotate(-27 180 175)">
          <path
            d="M 35 175 A 145 35 0 0 1 325 175"
            stroke="url(#bvRingGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>

        {/* --- 2. 3D FOLDED "B" SHAPE --- */}

        {/* Vertical Left Spine / Back Rib */}
        <path
          d="M 115 55 
             L 155 55 
             L 155 285 
             L 115 285 
             Z"
          fill="url(#bvRibbonBluePurple)"
        />

        {/* Top Loop Outer & Inner Form */}
        <path
          d="M 155 55 
             C 215 55, 260 75, 260 120 
             C 260 155, 225 172, 175 175 
             L 155 175 
             L 155 125
             C 175 125, 215 125, 215 115
             C 215 95, 185 88, 155 88
             Z"
          fill="url(#bvTopLoop)"
        />

        {/* Lower Loop Outer & Inner Form */}
        <path
          d="M 155 175 
             C 215 175, 275 190, 275 230 
             C 275 272, 225 285, 160 285 
             L 115 285 
             L 155 250
             L 175 250
             C 215 250, 230 242, 230 228
             C 230 212, 205 208, 165 208
             L 155 208
             Z"
          fill="url(#bvBottomLoop)"
        />

        {/* 3D Ribbon Diagonal Fold Facet (Cuts across the waist) */}
        <path
          d="M 115 285 
             L 225 175 
             L 175 175 
             L 115 240 
             Z"
          fill="url(#bvFoldFace)"
          opacity="0.95"
        />

        {/* Inner Top Cut Fold (Upper Diagonal Shadow) */}
        <path
          d="M 115 55 
             L 155 88 
             L 155 175 
             L 115 135 
             Z"
          fill="#1E1B4B"
          opacity="0.65"
        />

        {/* Top Bevel Highlight Edge */}
        <path
          d="M 115 55 C 160 55, 215 58, 255 100"
          stroke="#C084FC"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Bottom Curve Highlight Edge */}
        <path
          d="M 160 285 C 220 285, 275 265, 275 230"
          stroke="#F472B6"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* --- 3. FOUR-POINT STAR SPARKLE (In upper loop) --- */}
        <g transform="translate(195, 115)">
          {/* Star Radial Glow */}
          <circle cx="0" cy="0" r="14" fill="url(#bvStarGlow)" />
          {/* Star Shape */}
          <path
            d="M 0 -13 
               Q 0 0 -13 0 
               Q 0 0 0 13 
               Q 0 0 13 0 
               Q 0 0 0 -13 
               Z"
            fill="#FFFFFF"
          />
          <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
        </g>

        {/* --- 4. FRONT PORTION OF LUMINOUS ORBITAL RING --- */}
        <g transform="rotate(-27 180 175)">
          {/* Soft Neon Glow Underlayer */}
          <path
            d="M 325 175 A 145 35 0 0 1 35 175"
            stroke="#D946EF"
            strokeWidth="11"
            strokeLinecap="round"
            filter="url(#bvRingGlow)"
            opacity="0.55"
          />
          {/* Crisp Primary Neon Ring */}
          <path
            d="M 325 175 A 145 35 0 0 1 35 175"
            stroke="url(#bvRingGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Bright Inner Core */}
          <path
            d="M 290 188 A 145 35 0 0 1 70 188"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      </svg>
    </div>
  );

  // 1. ICON ONLY VARIANT
  if (variant === 'icon-only' || !showText) {
    return (
      <div className={`select-none inline-flex items-center justify-center ${className}`}>
        {renderEmblem(px, px)}
      </div>
    );
  }

  // 2. FULL BRAND MARK (Matching the user's exact uploaded 1024x1024 graphic)
  if (variant === 'full' || variant === 'stacked') {
    const emblemSize = size === '2xl' ? 180 : size === 'xl' ? 130 : size === 'lg' ? 90 : 70;

    return (
      <div className={`select-none flex flex-col items-center justify-center text-center ${className}`}>
        {/* Large 3D B Emblem */}
        {renderEmblem(emblemSize, emblemSize)}

        {/* BigVora Title */}
        <div className={`mt-3 font-extrabold tracking-tight leading-none ${textSizes[size]}`}>
          <span className="text-white">Big</span>
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300 bg-clip-text text-transparent">Vora</span>
        </div>

        {/* —— STORE —— with accent lines */}
        <div className="flex items-center justify-center gap-3 w-full max-w-[220px] mt-2">
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-purple-400" />
          <span className="text-white font-black tracking-[0.35em] text-[11px] uppercase font-mono">
            STORE
          </span>
          <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-purple-500 to-purple-400" />
        </div>

        {/* Tagline: Find. Buy. Build. */}
        <div className="mt-1.5 text-xs text-purple-200/90 font-medium tracking-[0.2em]">
          Find. Buy. Build.
        </div>
      </div>
    );
  }

  // 3. HORIZONTAL HEADER VARIANT (Compact & elegant for top navbar)
  return (
    <div className={`select-none inline-flex items-center gap-2.5 ${className}`}>
      {renderEmblem(px, px)}
      
      <div className="flex flex-col leading-none">
        <div className={`font-extrabold tracking-tight ${textSizes[size]}`}>
          <span className="text-white">Big</span>
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-violet-300 bg-clip-text text-transparent">Vora</span>
          <span className="text-purple-300 font-bold ml-1.5 text-[0.75em] tracking-wider uppercase font-mono">
            Store
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 tracking-wider uppercase font-medium mt-0.5">
          <span>Find</span>
          <span className="text-purple-400">·</span>
          <span>Buy</span>
          <span className="text-purple-400">·</span>
          <span>Build</span>
        </div>
      </div>
    </div>
  );
};
