import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { AuthModal } from './components/screens/AuthModal';
import { SplashScreen } from './components/screens/SplashScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { AppsMarketplaceScreen } from './components/screens/AppsMarketplaceScreen';
import { WebsitesMarketplaceScreen } from './components/screens/WebsitesMarketplaceScreen';
import { ProductDetailScreen } from './components/screens/ProductDetailScreen';
import { CartScreen } from './components/screens/CartScreen';
import { OrdersScreen } from './components/screens/OrdersScreen';
import { BuildAppScreen } from './components/screens/BuildAppScreen';
import { BuildWebsiteScreen } from './components/screens/BuildWebsiteScreen';
import { MyRequestsScreen } from './components/screens/MyRequestsScreen';
import { MessagesScreen } from './components/screens/MessagesScreen';
import { WishlistScreen } from './components/screens/WishlistScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { HelpSupportScreen } from './components/screens/HelpSupportScreen';
import { StoreInfoScreen } from './components/screens/StoreInfoScreen';
import { ApiDocsScreen } from './components/screens/ApiDocsScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { MaintenanceScreen } from './components/screens/MaintenanceScreen';

const MainLayout: React.FC = () => {
  const { currentScreen, toasts, maintenanceMode, isAdmin, navigateTo } = useApp();

  if (currentScreen === 'splash') {
    return <SplashScreen />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  if (maintenanceMode?.enabled && !isAdmin) {
    return <MaintenanceScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'apps':
        return <AppsMarketplaceScreen />;
      case 'websites':
        return <WebsitesMarketplaceScreen />;
      case 'product-details':
        return <ProductDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'build-app':
        return <BuildAppScreen initialMode="SELECT" />;
      case 'build-website':
        return <BuildAppScreen initialMode="WEBSITE" />;
      case 'my-requests':
        return <MyRequestsScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'support':
        return <HelpSupportScreen />;
      case 'store-info':
        return <StoreInfoScreen />;
      case 'api-docs':
        return <ApiDocsScreen />;
      case 'admin':
        return <AdminScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-[#070A12] text-slate-100 flex flex-col overflow-hidden antialiased selection:bg-purple-600/30 selection:text-purple-200">
      
      {/* Toast Notification Container */}
      <div 
        className="fixed top-4 right-4 z-[999] flex flex-col gap-2 max-w-sm pointer-events-none"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-xl border text-xs font-medium flex items-center gap-2 animate-in slide-in-from-top duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-red-950/95 border-red-500/50 text-red-200'
                : toast.type === 'warning'
                ? 'bg-amber-950/95 border-amber-500/50 text-amber-200'
                : 'bg-purple-950/95 border-purple-500/50 text-purple-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 animate-pulse" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Maintenance Mode Super Admin Warning Bar */}
      {maintenanceMode?.enabled && isAdmin && (
        <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-slate-950 px-3 py-1.5 flex items-center justify-between text-xs font-bold shadow-lg z-[90] shrink-0 border-b border-amber-400/40">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping shrink-0" />
            <span className="truncate">⚠️ STORE MAINTENANCE ACTIVE — Visitors are currently blocked</span>
          </div>
          <button 
            onClick={() => navigateTo('admin')}
            className="px-2.5 py-0.5 rounded-md bg-slate-950 text-amber-300 hover:bg-slate-900 transition-colors text-[11px] font-semibold shrink-0 ml-2"
          >
            Admin Center
          </button>
        </div>
      )}

      {/* Pinned Mobile App Header */}
      <Header />

      {/* Main Screen Content: Scrolls smoothly inside the viewport, padded at bottom so content is never covered by BottomNav */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-3 overflow-y-auto pb-24 overscroll-contain">
        {renderScreen()}
      </main>

      {/* Permanently Pinned Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
