import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SoldOutBadge } from '../common/SoldOutBadge';
import { ProductCard } from '../common/ProductCard';
import { LiveWebsitePreview } from '../common/LiveWebsitePreview';
import { VideoEmbedPlayer, isYouTubeUrl } from '../common/VideoEmbedPlayer';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingBag, 
  Zap, 
  CheckCircle2, 
  Star, 
  Smartphone, 
  Globe, 
  Play, 
  Download, 
  ShieldCheck, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export const ProductDetailScreen: React.FC = () => {
  const { 
    selectedProductId, 
    getProductById, 
    navigateTo, 
    products, 
    toggleWishlist, 
    isWishlisted, 
    addToCart, 
    buyNow,
    showToast,
    openConversationWithSupport
  } = useApp();

  const product = selectedProductId ? getProductById(selectedProductId) : null;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLiveDemoModal, setShowLiveDemoModal] = useState(false);
  const [showImageLightbox, setShowImageLightbox] = useState(false);

  if (!product) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-slate-400">Product not found or has been relocated.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-purple-600 rounded-xl text-white text-xs font-semibold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isSoldOut = product.status === 'SOLD_OUT';
  const wishlisted = isWishlisted(product.id);

  // Similar available products
  const similarProducts = products
    .filter(p => p.id !== product.id && p.type === product.type && p.status !== 'SOLD_OUT')
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard', 'info');
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-[#0D1322] border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className="p-2 rounded-xl bg-[#0D1322] border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* SOLD OUT Warning Banner if applicable */}
      {isSoldOut && (
        <SoldOutBadge variant="banner" />
      )}

      {/* Media Showcase: Main Gallery & Video/Demo buttons */}
      <div className="space-y-3">
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
          <img
            src={product.media.screenshots[activeImageIndex] || product.media.thumbnail}
            alt={product.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isSoldOut ? 'grayscale-40 contrast-110' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070A12]/80 via-transparent to-transparent pointer-events-none" />

          {/* Video or Live Demo Overlays */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            {product.media.demoVideoUrl && (
              <button
                onClick={() => setShowVideoModal(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-950/90 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                <span>{isYouTubeUrl(product.media.demoVideoUrl) ? 'Watch YouTube Demo' : 'Watch Video Demo'}</span>
              </button>
            )}

            {product.type === 'WEBSITE' && (
              <button
                onClick={() => setShowLiveDemoModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 ml-auto transition-all shadow-md active:scale-95"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Live Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail Carousel */}
        {product.media.screenshots.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {product.media.screenshots.map((shot, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 aspect-video rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeImageIndex === idx ? 'border-purple-500 scale-102' : 'border-slate-800 opacity-60 hover:opacity-90'
                }`}
              >
                <img src={shot} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Details & Title Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <img
            src={product.media.logo}
            alt=""
            className="w-14 h-14 rounded-2xl object-cover border border-purple-500/30 bg-[#0D1322] shadow-lg shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{product.version}</span>
              <span aria-hidden="true">·</span>
              <span>{product.platform}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5 leading-snug">
              {product.title}
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {product.tagline}
        </p>

        {/* Price & Primary Action Box */}
        <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-xs text-slate-400">USD</span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
              <span className="text-purple-300 font-medium">
                {product.licenseModel === 'SINGLE_LICENSE'
                  ? 'Exclusive Single-Buyer License'
                  : product.licenseModel === 'LIMITED_STOCK'
                  ? `Limited Stock (${product.availableStock} available)`
                  : 'Commercial Developer License'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isSoldOut ? (
              <button
                disabled
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-400 text-xs font-bold uppercase tracking-wider cursor-not-allowed opacity-90 text-center"
              >
                Item Sold Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => buyNow(product)}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Contents Section (Critical requirement: APK vs Source vs Web Files vs Hosting) */}
      <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Download className="w-4 h-4 text-purple-400" />
          <span>Guaranteed Digital Delivery Contents</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The following assets and files are packaged into the authenticated delivery archive upon confirmed purchase:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {product.includedServices.map((service, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{service}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>Format: <strong className="text-slate-200 font-mono">{product.format}</strong></span>
          <span>Size: <strong className="text-slate-200 font-mono">{product.fileSize}</strong></span>
        </div>
      </div>

      {/* Description & Core Features */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white">Description & Architectural Overview</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>

        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Features</h4>
          <div className="space-y-2">
            {product.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technology Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {product.techStack.map(tech => (
              <span key={tech} className="px-2.5 py-1 bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono rounded-lg">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Documentation & System Requirements */}
      <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Documentation & Requirements</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {product.documentationSummary}
        </p>
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Minimum Environment:</span>
          {product.requirements.map((req, idx) => (
            <div key={idx} className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Verified Customer Reviews</span>
              <span className="text-xs text-amber-400 font-bold inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {product.rating} ({product.reviewCount})
              </span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {product.reviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-xl bg-[#0D1322] border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{rev.author}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question or Custom Modification Need */}
      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-purple-200">Need customizations for this product?</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Our engineering team can rebrand, add backend endpoints, or customize features.
          </p>
        </div>
        <button
          onClick={() => openConversationWithSupport(`Customization inquiry for ${product.title}`)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shrink-0 transition-colors"
        >
          Ask Team
        </button>
      </div>

      {/* Similar Available Products (Shown especially if this is SOLD OUT!) */}
      {similarProducts.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            {isSoldOut ? 'Alternative Available Products' : 'You May Also Like'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Video Demo Simulator Modal with YouTube & MP4 support */}
      {showVideoModal && product.media.demoVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0D1322] border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
                <span>
                  {isYouTubeUrl(product.media.demoVideoUrl) ? 'YouTube Video Demo' : 'Product Demonstration Video'} — {product.title}
                </span>
              </span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-2 sm:p-4 bg-black flex items-center justify-center">
              <VideoEmbedPlayer
                url={product.media.demoVideoUrl}
                title={`Demonstration of ${product.title}`}
                autoPlay={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Screenshot Lightbox Modal */}
      {showImageLightbox && (
        <div 
          onClick={() => setShowImageLightbox(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-in fade-in cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="w-full flex items-center justify-between pb-2 text-xs text-slate-400 font-mono">
              <span>Photo {activeImageIndex + 1} of {product.media.screenshots.length}</span>
              <button 
                onClick={() => setShowImageLightbox(false)} 
                className="px-3 py-1 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
              >
                Close
              </button>
            </div>
            <img
              src={product.media.screenshots[activeImageIndex] || product.media.thumbnail}
              alt=""
              className="max-h-[80vh] w-auto rounded-2xl object-contain border border-slate-800 shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Live Demo Modal for Websites */}
      {showLiveDemoModal && (
        <LiveWebsitePreview
          product={product}
          onClose={() => setShowLiveDemoModal(false)}
        />
      )}

    </div>
  );
};
