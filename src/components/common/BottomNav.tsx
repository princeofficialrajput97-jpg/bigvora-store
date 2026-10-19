import React from 'react';
import { useApp, ScreenName } from '../../context/AppContext';
import { sound } from '../../services/soundEffects';
import { Home, Compass, Plus, Headphones, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, tickets } = useApp();

  const openTicketsCount = tickets?.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.unreadCustomerCount > 0).length || 0;

  const navItems: { label: string; screen: ScreenName; icon: React.ElementType; badge?: number }[] = [
    { label: 'Home', screen: 'home', icon: Home },
    { label: 'Explore', screen: 'explore', icon: Compass },
    { label: 'Build', screen: 'build-app', icon: Plus },
    { label: 'Support', screen: 'messages', icon: Headphones, badge: openTicketsCount },
    { label: 'Profile', screen: 'profile', icon: User },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 w-full bg-[#070A12]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-between shadow-[0_-8px_32px_rgba(0,0,0,0.7)]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.4rem)' }}
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.screen;
        const isCenterBuild = idx === 2;

        if (isCenterBuild) {
          return (
            <div key={item.label} className="relative flex-1 flex justify-center items-center">
              <button
                onClick={() => {
                  sound.playTabSwitch();
                  navigateTo('build-app');
                }}
                className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
                aria-label="Build Custom Android App or Website"
              >
                <div className={`w-12 h-12 rounded-full p-[2px] transition-all duration-300 shadow-xl ${
                  isActive 
                    ? 'bg-gradient-to-tr from-purple-400 via-pink-500 to-indigo-400 shadow-purple-600/50 scale-105 ring-4 ring-purple-500/20' 
                    : 'bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 shadow-purple-900/40 group-hover:scale-105 active:scale-95'
                }`}>
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#181133] to-[#0A0718] flex items-center justify-center border border-purple-400/30">
                    <Plus className={`w-6 h-6 text-white stroke-[2.5] transition-transform duration-300 ${
                      isActive ? 'rotate-90 text-purple-300' : 'group-hover:rotate-90'
                    }`} />
                  </div>
                </div>
                <span className={`text-[10px] font-bold mt-1 tracking-wide ${
                  isActive ? 'text-purple-300' : 'text-slate-400 group-hover:text-purple-300'
                }`}>
                  Build
                </span>
              </button>
            </div>
          );
        }

        return (
          <button
            key={item.label}
            onClick={() => {
              sound.playTabSwitch();
              navigateTo(item.screen);
            }}
            className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all focus:outline-none ${
              isActive ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${
                isActive ? 'scale-110 text-purple-400 stroke-[2.2]' : 'stroke-[1.8]'
              }`} />
              
              {/* Notification Badge: Cleanly pinned to top-right of icon, never breaking text */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-[#070A12] shadow-sm">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            
            <span className={`text-[10px] mt-1 truncate tracking-tight transition-colors ${
              isActive ? 'text-purple-300 font-bold' : 'text-slate-400 font-medium'
            }`}>
              {item.label}
            </span>

            {isActive && (
              <span className="w-1 h-1 rounded-full bg-purple-400 mt-0.5 shadow-sm shadow-purple-400" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
