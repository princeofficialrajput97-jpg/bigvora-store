import React from 'react';
import { Ban, ShieldAlert } from 'lucide-react';

interface SoldOutBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'banner' | 'overlay';
  text?: string;
}

export const SoldOutBadge: React.FC<SoldOutBadgeProps> = ({ 
  size = 'md', 
  variant = 'badge',
  text = 'SOLD OUT' 
}) => {
  if (variant === 'overlay') {
    return (
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 z-10 rounded-xl border border-red-500/20">
        <div className="px-3.5 py-1.5 bg-red-950/90 border border-red-500/60 rounded-md flex items-center gap-1.5 shadow-lg shadow-red-950/50">
          <Ban className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
          <span className="text-red-300 font-bold tracking-wider text-xs uppercase">{text}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 text-center font-medium">Single License Acquired</p>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="w-full bg-red-950/30 border border-red-500/30 rounded-xl p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-900/40 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold text-sm tracking-wide">SOLD OUT · LICENSE EXHAUSTED</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            This digital asset has reached its licensed purchase capacity or was acquired under an exclusive single-license ownership agreement.
            Checkout and purchases are disabled by the server inventory authority. You can still save it to your wishlist or explore similar available projects below.
          </p>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  return (
    <div className={`inline-flex items-center bg-red-950/80 border border-red-500/50 text-red-300 rounded uppercase tracking-wider ${sizeClasses[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
      <span>{text}</span>
    </div>
  );
};
