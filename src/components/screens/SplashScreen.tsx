import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BigVoraLogo } from '../common/BigVoraLogo';
import { Sparkles, Shield, Cpu } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigateTo, user } = useApp();
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing BigVora Engine...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(55);
      setStatusText('Syncing Digital Market & Inventory...');
    }, 800);

    const t2 = setTimeout(() => {
      setProgress(90);
      setStatusText('Verifying Security Credentials...');
    }, 1600);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready.');
      if (user) {
        navigateTo('home');
      } else {
        navigateTo('login');
      }
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigateTo, user]);

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-[100dvh] flex flex-col items-center justify-between p-6 sm:p-10 bg-[#05070D] overflow-hidden select-none"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)',
      }}
    >
      
      {/* Background ambient neon glow circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Subtle particle grid dots */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#A855F7 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top subtle badge */}
      <div className="z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono tracking-wider shadow-lg shadow-purple-950/40">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>BIGVORA OFFICIAL ENGINE v3.4</span>
        </div>
      </div>

      {/* Center Logo & Tagline Reveal */}
      <div className="flex flex-col items-center text-center z-10 max-w-sm px-4">
        <BigVoraLogo size="2xl" variant="full" className="glow-purple-lg" />
        <p className="mt-4 text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
          India's Premier Digital Marketplace for Apps & Websites
        </p>
      </div>

      {/* Bottom Progress Bar & Status */}
      <div className="w-full max-w-xs z-10">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2 px-1">
          <span className="truncate">{statusText}</span>
          <span className="text-purple-400 font-bold ml-2">{progress}%</span>
        </div>

        <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden p-[1px] border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-violet-400 to-indigo-400 rounded-full transition-all duration-500 ease-out glow-purple-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Verified Production Source Code</span>
        </div>
      </div>

    </div>
  );
};
