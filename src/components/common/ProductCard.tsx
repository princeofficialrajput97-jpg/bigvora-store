import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/soundEffects';
import { SoldOutBadge } from './SoldOutBadge';
import { Heart, Smartphone, Globe, Star, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { navigateTo, toggleWishlist, isWishlisted, addToCart, buyNow } = useApp();
  const wishlisted = isWishlisted(product.id);
  const isSoldOut = product.status === 'SOLD_OUT';

  const handleCardClick = () => {
    sound.playTap();
    navigateTo('product-details', { productId: product.id });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTap();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSoldOut) {
      sound.playSuccess();
      buyNow(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-[#0D1322] border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSoldOut 
          ? 'border-red-900/40 opacity-90 hover:border-red-500/40' 
          : 'border-slate-800/80 hover:border-purple-500/40 hover:shadow-purple-950/20'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={product.media.thumbnail}
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSoldOut ? 'grayscale-40 contrast-110' : ''
          }`}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1322] via-[#0D1322]/20 to-transparent" />

        {/* Top Badges & Actions */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {isSoldOut ? (
              <SoldOutBadge size="sm" />
            ) : product.licenseModel === 'LIMITED_STOCK' ? (
              <span className="text-[10px] font-semibold tracking-wide text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded">
                ONLY {product.availableStock} LEFT
              </span>
            ) : product.licenseModel === 'SINGLE_LICENSE' ? (
              <span className="text-[10px] font-semibold tracking-wide text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded">
                SINGLE LICENSE
              </span>
            ) : null}
          </div>

          <button
            onClick={handleWishlistClick}
            aria-label="Save to Wishlist"
            className="w-8 h-8 rounded-full bg-slate-950/70 border border-slate-700/60 backdrop-blur-md flex items-center justify-center transition-colors hover:bg-slate-800 hover:scale-110 active:scale-95"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wishlisted ? 'fill-pink-500 text-pink-500' : 'text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Small Logo Badge */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2 z-10">
          <img
            src={product.media.logo}
            alt=""
            className="w-8 h-8 rounded-lg object-cover border border-purple-500/30 bg-slate-900 shadow-md"
          />
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-950/60 backdrop-blur-sm px-2 py-0.5 rounded">
            {product.platform === 'ANDROID' ? (
              <Smartphone className="w-3 h-3 text-emerald-400" />
            ) : (
              <Globe className="w-3 h-3 text-cyan-400" />
            )}
            <span>{product.type === 'APP' ? 'Android App' : 'Website'}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Metadata Row (Zero-Pill Discipline: unboxed text with dot separators) */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.version}</span>
            {product.rating > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5 text-amber-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-purple-300 transition-colors">
            {product.title}
          </h3>

          {/* Tagline / Snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>

          {/* Key Deliverables Tagline */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-slate-500">Includes:</span>
            <span className="text-purple-300 font-medium truncate">
              {product.type === 'APP' ? 'Kotlin Source + APK + Docs' : 'Next.js/React + DB Schema'}
            </span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {product.licenseModel === 'SINGLE_LICENSE' ? 'Full Ownership' : 'Developer License'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCardClick}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {isSoldOut ? (
              <button
                disabled
                className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 text-xs font-bold uppercase tracking-wider cursor-not-allowed opacity-80"
              >
                Sold Out
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-900/30 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
