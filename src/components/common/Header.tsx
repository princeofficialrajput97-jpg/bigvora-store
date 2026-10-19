import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BigVoraLogo } from './BigVoraLogo';
import { 
  Bell, 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  ShieldCheck,
  PackageCheck,
  ShieldAlert
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentScreen, 
    navigateTo, 
    cart, 
    wishlist, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    user, 
    isAdmin,
    orders,
    setIsAuthModalOpen
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <>
      <header 
        className="sticky top-0 z-40 w-full bg-[#070A12]/95 backdrop-blur-md border-b border-slate-800/80"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigateTo('home')}
            className="cursor-pointer transition-opacity hover:opacity-90 flex items-center"
          >
            <BigVoraLogo size="md" />
          </div>

          {/* Store Assurance Tagline */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-purple-400 font-mono text-[11px] bg-purple-950/40 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              Find · Buy · Build
            </span>
          </div>

          {/* Navigation & Action Controls */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* Search shortcut */}
            <button
              onClick={() => navigateTo('explore')}
              aria-label="Search Marketplace"
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Store Center & Guarantees */}
            <button
              onClick={() => navigateTo('store-info')}
              title="Store Guarantees & Support"
              className="p-2 text-slate-400 hover:text-purple-300 rounded-lg hover:bg-slate-800/60 transition-colors hidden sm:flex items-center gap-1 text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="text-[11px] font-medium">Assurance</span>
            </button>

            {/* Wishlist Icon (Hidden on mobile to fit cleanly, available in Profile) */}
            <button
              onClick={() => navigateTo('wishlist')}
              aria-label="Wishlist"
              className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors hidden md:flex"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Orders Shortcut (Hidden on mobile to fit cleanly, available in Profile) */}
            <button
              onClick={() => navigateTo('orders')}
              aria-label="My Orders"
              title="My Orders & Downloads"
              className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors hidden md:flex"
            >
              <PackageCheck className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Notifications"
                className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0E1424] border border-purple-500/30 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-[11px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/40">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.actionScreen) {
                              navigateTo(n.actionScreen as any, { productId: n.referenceId });
                              setIsNotificationsOpen(false);
                            }
                          }}
                          className={`py-3 px-1 cursor-pointer transition-colors hover:bg-slate-800/40 rounded-lg flex items-start gap-3 ${
                            !n.read ? 'bg-purple-950/20' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-purple-400' : 'bg-transparent'}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-semibold text-slate-200">{n.title}</h4>
                              <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => navigateTo('cart')}
              aria-label="Cart"
              className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-purple-300" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Super Admin Dashboard Shortcut (STRICTLY for 9266428368) */}
            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                title="BigVora Super Admin Dashboard"
                className="px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-900 transition-all flex items-center gap-1.5 shadow-sm text-xs font-mono font-bold"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Profile Avatar / Login */}
            {user ? (
              <button
                onClick={() => navigateTo('profile')}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800/60 transition-colors ml-1"
                title={user.name}
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
                />
              </button>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

          </div>
        </div>
      </header>
    </>
  );
};
