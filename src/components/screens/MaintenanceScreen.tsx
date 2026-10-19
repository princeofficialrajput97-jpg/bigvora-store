import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Wrench, RefreshCw, Lock, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

export const MaintenanceScreen: React.FC = () => {
  const { maintenanceMode, navigateTo } = useApp();

  return (
    <div className="relative w-full h-full min-h-screen bg-[#070A12] text-slate-100 flex flex-col items-center justify-between p-6 overflow-y-auto selection:bg-amber-500/20">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Branding */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 p-[1.5px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center font-black text-amber-400 text-sm">
              BV
            </div>
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            BigVora <span className="text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 ml-1">Store</span>
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Maintenance Mode</span>
        </div>
      </div>

      {/* Center Hero Card */}
      <div className="relative z-10 w-full max-w-md my-auto py-8 flex flex-col items-center text-center">
        {/* Animated Icon Cluster */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-b from-amber-500/20 to-purple-500/10 border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
            <Wrench className="w-11 h-11 text-amber-400 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-9 h-9 rounded-2xl bg-[#0F172A] border border-purple-500/40 flex items-center justify-center shadow-lg">
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
          {maintenanceMode.title || 'Platform Upgrades in Progress'}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-sm">
          {maintenanceMode.message || 'We are currently deploying high-speed encrypted download CDN nodes and upgrading our payment architecture. Browsing and checkout are temporarily paused.'}
        </p>

        {/* ETA & Status Pill */}
        <div className="w-full bg-[#0D1322]/80 border border-slate-800 rounded-2xl p-4 mb-6 shadow-inner backdrop-blur-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Estimated Return
            </span>
            <span className="font-semibold text-amber-300">
              {maintenanceMode.estimatedEndTime || '~30 to 45 mins'}
            </span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>

        {/* Action Button: Check Status / Refresh */}
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh & Check Live Status
        </button>
      </div>

      {/* Super Admin Bypass Link */}
      <div className="relative z-10 w-full max-w-md pt-4 pb-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500/60" />
          System ID: BV-GATEWAY-2026
        </span>
        <button
          onClick={() => navigateTo('login')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors font-medium text-xs px-2.5 py-1 rounded-lg hover:bg-slate-800/50"
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Admin Bypass</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
