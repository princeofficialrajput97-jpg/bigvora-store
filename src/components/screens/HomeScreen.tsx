import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import { sound } from '../../services/soundEffects';
import { 
  Search, 
  Smartphone, 
  Globe, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Package, 
  User,
  Zap
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { products, navigateTo, searchQuery, user } = useApp();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [activeTab, setActiveTab] = useState<'ALL' | 'APPS' | 'WEBSITES'>('ALL');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTap();
    navigateTo('explore', { searchKeyword: localSearch });
  };

  const apps = products.filter(p => p.type === 'APP');
  const websites = products.filter(p => p.type === 'WEBSITE');
  
  // Filter products by selected tab
  const displayedProducts = activeTab === 'APPS' 
    ? apps 
    : activeTab === 'WEBSITES' 
    ? websites 
    : products;

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      
      {/* Featured Developer Showcase Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-slate-900 border border-purple-500/30 p-3.5 sm:p-4 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Official Developer Hub</span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              Production Android & Web Codes
            </h2>
            <p className="text-[11px] text-slate-300 leading-snug">
              Kotlin Jetpack Compose · Next.js 15 · Instant APK Downloads
            </p>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              navigateTo('build-app');
            }}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-900/40 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span>Custom Build</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder="Search Android apps, Kotlin, Next.js, websites..."
          className="w-full pl-10 pr-24 py-2.5 bg-[#090D1A] border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
        />
        <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm active:scale-95"
        >
          Search
        </button>
      </form>

      {/* Main Tab Switcher: Direct Catalog of Apps & Websites */}
      <div className="flex items-center justify-between gap-1 p-1 bg-[#090D1A] border border-slate-800 rounded-2xl">
        <button
          onClick={() => {
            sound.playTabSwitch();
            setActiveTab('ALL');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'ALL'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>All ({products.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playTabSwitch();
            setActiveTab('APPS');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'APPS'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
          <span>Apps ({apps.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playTabSwitch();
            setActiveTab('WEBSITES');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'WEBSITES'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-300" />
          <span>Websites ({websites.length})</span>
        </button>
      </div>

      {/* When ALL tab: Show organized sections */}
      {activeTab === 'ALL' && (
        <>
          {/* Section 1: Android Apps */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Android Apps</h3>
                  <p className="text-[11px] text-slate-400">Production Kotlin & Compose projects with signed APKs</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playTap();
                  navigateTo('apps');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
              >
                <span>View All ({apps.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Section 2: Websites & Web Platforms */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Websites & Web Platforms</h3>
                  <p className="text-[11px] text-slate-400">Next.js 15, React, TypeScript & Tailwind sites with schemas</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playTap();
                  navigateTo('websites');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
              >
                <span>View All ({websites.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {websites.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* When APPS tab: Show direct grid */}
      {activeTab === 'APPS' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Android Applications Catalog</span>
            </h3>
            <span className="text-xs text-slate-400">{apps.length} available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* When WEBSITES tab: Show direct grid */}
      {activeTab === 'WEBSITES' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Websites & Web Platforms Catalog</span>
            </h3>
            <span className="text-xs text-slate-400">{websites.length} available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {websites.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Footer Navigation Link to Store Center */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Authentic source code with instant downloads</span>
        <button
          onClick={() => {
            sound.playTap();
            navigateTo('store-info');
          }}
          className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Store Assurance & Help</span>
        </button>
      </div>

    </div>
  );
};
