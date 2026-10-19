import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Smartphone, 
  Globe, 
  Check,
  Tag,
  Sparkles
} from 'lucide-react';

export const ExploreScreen: React.FC = () => {
  const { products, searchQuery, setSearchQuery } = useApp();

  const [selectedType, setSelectedType] = useState<'ALL' | 'APP' | 'WEBSITE'>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE_ONLY' | 'SOLD_OUT_ONLY'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'POPULAR'>('POPULAR');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('bigvora_recent_searches');
      return stored ? JSON.parse(stored) : ['Fintech', 'Grocery Delivery', 'SaaS', 'Offline AI'];
    } catch {
      return ['Fintech', 'Grocery Delivery', 'SaaS', 'Offline AI'];
    }
  });

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    setRecentSearches(prev => {
      const updated = [clean, ...prev.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      localStorage.setItem('bigvora_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('bigvora_recent_searches');
  };

  // Popular search tags for quick suggestions
  const suggestedTags = ['Kotlin', 'Compose', 'Next.js', 'Fintech', 'Food Delivery', 'SaaS', 'AI'];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => cats.add(p.category));
    return ['ALL', ...Array.from(cats)];
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesTagline = p.tagline.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesTech = p.techStack.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTagline && !matchesCategory && !matchesTech) return false;
      }

      // Type filter
      if (selectedType !== 'ALL' && p.type !== selectedType) return false;

      // Platform filter
      if (selectedPlatform !== 'ALL' && p.platform !== selectedPlatform) return false;

      // Category filter
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

      // Availability filter (Section 4 & 5 compliance)
      if (availabilityFilter === 'AVAILABLE_ONLY' && p.status === 'SOLD_OUT') return false;
      if (availabilityFilter === 'SOLD_OUT_ONLY' && p.status !== 'SOLD_OUT') return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price;
      if (sortBy === 'PRICE_DESC') return b.price - a.price;
      if (sortBy === 'POPULAR') return b.soldCount - a.soldCount;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [products, searchQuery, selectedType, selectedPlatform, selectedCategory, availabilityFilter, sortBy]);

  const resetFilters = () => {
    setSelectedType('ALL');
    setSelectedPlatform('ALL');
    setSelectedCategory('ALL');
    setAvailabilityFilter('ALL');
    setSortBy('POPULAR');
    setSearchQuery('');
  };

  const hasActiveFilters = 
    selectedType !== 'ALL' || 
    selectedPlatform !== 'ALL' || 
    selectedCategory !== 'ALL' || 
    availabilityFilter !== 'ALL' || 
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-5 pb-20">
      
      {/* Header Title & Summary */}
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>Explore Marketplace</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Browse verified ready-made Android applications and website platforms.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter by keyword, tech stack, or feature..."
          className="w-full pl-11 pr-10 py-3 bg-[#0D1322] border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/80 transition-colors"
        />
        <Search className="w-4 h-4 text-purple-400 absolute left-4 top-3.5" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Recent Searches (Section 4 Compliance) */}
      {recentSearches.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-500 shrink-0 font-medium">Recent:</span>
          {recentSearches.map(term => (
            <button
              key={term}
              onClick={() => {
                setSearchQuery(term);
                saveRecentSearch(term);
              }}
              className="px-2.5 py-0.5 rounded-lg shrink-0 transition-colors bg-[#0E1528] border border-slate-800/80 text-slate-300 hover:text-purple-300 text-[11px] font-mono"
            >
              {term}
            </button>
          ))}
          <button
            onClick={clearRecentSearches}
            className="text-[10px] text-slate-500 hover:text-slate-400 shrink-0 ml-1 underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Suggested Search Tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-slate-500 shrink-0 font-medium">Quick tags:</span>
        {suggestedTags.map(tag => (
          <button
            key={tag}
            onClick={() => {
              setSearchQuery(tag);
              saveRecentSearch(tag);
            }}
            className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors border ${
              searchQuery.toLowerCase() === tag.toLowerCase()
                ? 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Filter Bar: Segmented Type Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center p-1 bg-[#0D1322] border border-slate-800/80 rounded-xl gap-1">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedType === 'ALL'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setSelectedType('APP')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              selectedType === 'APP'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android Apps</span>
          </button>
          <button
            onClick={() => setSelectedType('WEBSITE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              selectedType === 'WEBSITE'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Websites</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[#0D1322] border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="POPULAR">Most Popular</option>
            <option value="NEWEST">Newest First</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Availability & Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Availability Filter (Critical requirement for SOLD OUT control) */}
        <div className="flex items-center bg-[#0D1322] border border-slate-800 rounded-xl p-1 gap-1 text-xs">
          <button
            onClick={() => setAvailabilityFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              availabilityFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setAvailabilityFilter('AVAILABLE_ONLY')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              availabilityFilter === 'AVAILABLE_ONLY' ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Available Only
          </button>
          <button
            onClick={() => setAvailabilityFilter('SOLD_OUT_ONLY')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              availabilityFilter === 'SOLD_OUT_ONLY' ? 'bg-red-950/80 border border-red-500/40 text-red-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sold Out Archives
          </button>
        </div>

        {/* Category Selector */}
        {categories.length > 2 && (
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-[#0D1322] border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        )}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 px-2 py-1 ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-3">
        <span>Showing {filteredProducts.length} verified listings</span>
        {availabilityFilter === 'SOLD_OUT_ONLY' && (
          <span className="text-red-400 font-mono">Archive Mode: Viewing historic sold assets</span>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-[#0D1322]/50 border border-slate-800/80 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Matching Products Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
            We couldn't find any products matching your specific criteria. Try resetting your filters or request a custom build.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
