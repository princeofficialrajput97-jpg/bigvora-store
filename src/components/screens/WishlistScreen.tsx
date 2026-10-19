import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';

export const WishlistScreen: React.FC = () => {
  const { wishlist, products, navigateTo } = useApp();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-6 pb-24">
      
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span>Saved Products & Wishlist</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor pricing, stock updates, and licensing status for your saved Android apps and website listings.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="py-20 text-center bg-[#0D1322]/50 border border-slate-800/80 rounded-3xl p-8 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-400 mb-3">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Click the heart icon on any Android app or website to save it here for future reference.
          </p>
          <button
            onClick={() => navigateTo('explore')}
            className="mt-5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
