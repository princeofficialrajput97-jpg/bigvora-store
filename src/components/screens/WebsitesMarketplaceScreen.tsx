import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import { Globe, Sparkles, Code2, Server, CheckCircle2 } from 'lucide-react';

export const WebsitesMarketplaceScreen: React.FC = () => {
  const { products, navigateTo } = useApp();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');

  const webProducts = products.filter(p => p.type === 'WEBSITE');

  const subCategories = ['ALL', 'SaaS & Enterprise', 'Real Estate & Living', 'Design & Creative', 'Education & Learning'];

  const filteredSites = selectedSubCategory === 'ALL'
    ? webProducts
    : webProducts.filter(p => p.category === selectedSubCategory);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0E1528] to-indigo-950/40 border border-cyan-500/30 p-6">
        <div className="flex items-start justify-between">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-3">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Web & SaaS Platforms</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Ready-Made Websites & Templates
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Full-stack Next.js, React, and TypeScript codebases with live demo previews, responsive designs, database schemas, and one-click Vercel/Netlify deploy guides.
            </p>
          </div>
          <button
            onClick={() => navigateTo('build-website')}
            className="hidden sm:flex px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl items-center gap-1.5 transition-colors shadow-md"
          >
            <Code2 className="w-4 h-4" />
            <span>Need Custom Website?</span>
          </button>
        </div>
      </div>

      {/* Sub-Category Filter */}
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map(site => (
          <ProductCard key={site.id} product={site} />
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="py-12 text-center text-slate-500 text-sm">
          No websites found in this category.
        </div>
      )}

    </div>
  );
};
