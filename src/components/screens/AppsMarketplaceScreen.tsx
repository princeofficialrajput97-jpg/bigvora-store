import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import { Smartphone, Sparkles, Filter, Code2, ShieldAlert } from 'lucide-react';

export const AppsMarketplaceScreen: React.FC = () => {
  const { products, navigateTo } = useApp();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');

  const appProducts = products.filter(p => p.type === 'APP');

  const subCategories = ['ALL', 'Fintech & Payments', 'E-Commerce & Delivery', 'Health & Fitness', 'Travel & Navigation'];

  const filteredApps = selectedSubCategory === 'ALL'
    ? appProducts
    : appProducts.filter(p => p.category === selectedSubCategory);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#0E1528] to-purple-950/40 border border-emerald-500/30 p-6">
        <div className="flex items-start justify-between">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-3">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Native Android Catalog</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Ready-Made Android Applications
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Complete Android Studio codebases written in modern Kotlin & Jetpack Compose. Includes pre-compiled APK, architectural documentation, and full source code.
            </p>
          </div>
          <button
            onClick={() => navigateTo('build-app')}
            className="hidden sm:flex px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl items-center gap-1.5 transition-colors shadow-md"
          >
            <Code2 className="w-4 h-4" />
            <span>Need Custom App?</span>
          </button>
        </div>
      </div>

      {/* Sub-Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {subCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedSubCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
              selectedSubCategory === cat
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-[#0D1322] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map(app => (
          <ProductCard key={app.id} product={app} />
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="py-12 text-center text-slate-500 text-sm">
          No Android apps found in this sub-category.
        </div>
      )}

    </div>
  );
};
