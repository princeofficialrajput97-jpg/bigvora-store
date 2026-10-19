import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertTriangle, CheckCircle2, Signal } from 'lucide-react';
import { sound } from '../../services/soundEffects';

interface OfflineModalProps {
  apiBaseUrl?: string;
}

export const OfflineModal: React.FC<OfflineModalProps> = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setRetryFailed(false);
      setJustReconnected(true);
      try {
        sound.playSuccess();
      } catch (e) {
        // audio might be blocked before interaction
      }
      setTimeout(() => setJustReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
      try {
        sound.playTap();
      } catch (e) {}
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryFailed(false);

    try {
      // Test basic navigator and attempt ping
      if (!navigator.onLine) {
        throw new Error('Navigator reports offline');
      }

      // Try quick ping to public backend or health
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('https://backend-production-1bb18.up.railway.app/api/products', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store'
      }).catch(() => {
        // Fallback to origin
        return fetch('/api/products', { method: 'HEAD', signal: controller.signal, cache: 'no-store' });
      });

      clearTimeout(timeoutId);

      if (res && (res.ok || res.status < 500)) {
        setIsOffline(false);
        setJustReconnected(true);
        sound.playSuccess();
        setTimeout(() => setJustReconnected(false), 3000);
      } else {
        throw new Error('Connection test did not return 200');
      }
    } catch (err) {
      setRetryFailed(true);
      sound.playError();
      setTimeout(() => setRetryFailed(false), 4000);
    } finally {
      setIsRetrying(false);
    }
  };

  // Reconnection toast indicator
  if (justReconnected && !isOffline) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-2xl bg-emerald-950/95 border border-emerald-500/60 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>इंटरनेट वापस कनेक्ट हो गया! (Back Online)</span>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0B0F19] border-2 border-red-500/40 p-6 shadow-2xl shadow-red-950/50 text-center overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing Wifi Icon */}
        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-60" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-950 to-red-900 border border-red-500/50 flex items-center justify-center text-red-400 shadow-lg shadow-red-950/60">
            <WifiOff className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Status Chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-[11px] font-mono font-bold text-red-300 mb-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span>NO INTERNET CONNECTION</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-black text-white tracking-tight">
          इंटरनेट कनेक्शन नहीं है!
        </h3>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          BigVora Store से प्रोडक्ट्स देखने, ऑर्डर्स प्लेस करने और डेटाबेस सिंक करने के लिए इंटरनेट जरूरी है।
        </p>

        {/* Helpful instructions */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <Signal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>कृपया अपना Wi-Fi या Mobile Data ऑन करें</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AirPlane Mode ऑन करके ऑफ करें</span>
          </div>
        </div>

        {retryFailed && (
          <div className="mt-3 p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-[11px] text-red-300 font-medium animate-in shake">
            ❌ अभी भी कनेक्शन नहीं मिल रहा है। कृपया नेटवर्क चेक करें।
          </div>
        )}

        {/* Retry Button */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'कनेक्शन जाँचा जा रहा है...' : 'फिर से प्रयास करें (Retry)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
