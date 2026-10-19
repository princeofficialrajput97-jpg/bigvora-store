import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  X, 
  Lock, 
  ExternalLink, 
  ShoppingBag, 
  CheckCircle2, 
  Star,
  Sparkles,
  ArrowRight,
  Code2
} from 'lucide-react';

interface LiveWebsitePreviewProps {
  product: Product;
  onClose: () => void;
}

export const LiveWebsitePreview: React.FC<LiveWebsitePreviewProps> = ({ product, onClose }) => {
  const { addToCart, navigateTo } = useApp();
  const [viewport, setViewport] = useState<'DESKTOP' | 'TABLET' | 'MOBILE'>('DESKTOP');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FEATURES' | 'PRICING' | 'CODE'>('OVERVIEW');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const viewportWidths = {
    DESKTOP: 'w-full max-w-5xl',
    TABLET: 'w-[768px] max-w-full',
    MOBILE: 'w-[375px] max-w-full',
  };

  const isSoldOut = product.status === 'SOLD_OUT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative ${viewportWidths[viewport]} h-[90vh] bg-[#0A0E1A] border border-cyan-500/40 rounded-3xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300`}>
        
        {/* Browser Mock Chrome */}
        <div className="p-3 bg-[#0D1322] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Traffic Lights & URL */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="truncate max-w-[200px] sm:max-w-xs">
                https://preview.{product.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.bigvora.store
              </span>
            </div>
          </div>

          {/* Viewport Resizer & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewport('DESKTOP')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'DESKTOP' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('TABLET')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'TABLET' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('MOBILE')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'MOBILE' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {!isSoldOut && (
              <button
                onClick={() => {
                  addToCart(product, 1);
                  onClose();
                  navigateTo('cart');
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy Source Code (${product.price})</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Interactive Webpage Body */}
        <div className="flex-1 overflow-y-auto bg-[#070A12] text-slate-100 flex flex-col">
          
          {/* Simulated Web Nav */}
          <nav className="border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between sticky top-0 bg-[#070A12]/95 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
              <img src={product.media.logo} alt="" className="w-7 h-7 rounded-lg object-cover border border-cyan-500/30" />
              <span className="font-extrabold text-sm text-white">{product.title}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`hover:text-cyan-400 transition-colors ${activeTab === 'OVERVIEW' ? 'text-cyan-400 font-bold' : ''}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('FEATURES')}
                className={`hover:text-cyan-400 transition-colors ${activeTab === 'FEATURES' ? 'text-cyan-400 font-bold' : ''}`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab('PRICING')}
                className={`hover:text-cyan-400 transition-colors ${activeTab === 'PRICING' ? 'text-cyan-400 font-bold' : ''}`}
              >
                Pricing Demo
              </button>
              <button
                onClick={() => setActiveTab('CODE')}
                className={`hover:text-cyan-400 transition-colors hidden sm:block ${activeTab === 'CODE' ? 'text-cyan-400 font-bold' : ''}`}
              >
                Architecture
              </button>
            </div>
          </nav>

          {/* Interactive Views */}
          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-10">
            
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-8 animate-in fade-in duration-150">
                {/* Hero */}
                <div className="text-center space-y-4 py-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Interactive Web Simulation</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    {product.tagline}
                  </h1>
                  <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Screenshots Gallery Showcase */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img src={product.media.thumbnail} alt="" className="w-full aspect-video object-cover" />
                </div>

                {/* Interactive Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-xl font-black text-white">99+</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Lighthouse Score</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-xl font-black text-white">0.4s</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">First Contentful Paint</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-xl font-black text-white">100%</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">TypeScript Typed</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-xl font-black text-white">v{product.version}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Production Build</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'FEATURES' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white">Engineered Web Components</h2>
                  <p className="text-xs text-slate-400 mt-1">Pre-configured modules ready to launch</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features.map((feat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{feat}</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Fully responsive with Tailwind CSS styling and accessible ARIA attributes.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'PRICING' && (
              <div className="space-y-6 animate-in fade-in duration-150 text-center">
                <h2 className="text-2xl font-black text-white">Interactive Billing Toggle Demo</h2>
                <div className="inline-flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      billingCycle === 'monthly' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      billingCycle === 'yearly' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Yearly (Save 20%)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm">Starter</h4>
                    <div className="text-2xl font-black text-white">
                      {billingCycle === 'yearly' ? '$19' : '$24'}<span className="text-xs text-slate-400 font-normal">/mo</span>
                    </div>
                    <p className="text-xs text-slate-400">Basic features & 5 team seats.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 space-y-3 relative shadow-xl">
                    <span className="text-[10px] font-bold bg-cyan-600 text-white px-2 py-0.5 rounded-full absolute -top-2.5 right-4">
                      Best Value
                    </span>
                    <h4 className="font-bold text-white text-sm">Pro Business</h4>
                    <div className="text-2xl font-black text-white">
                      {billingCycle === 'yearly' ? '$49' : '$59'}<span className="text-xs text-slate-400 font-normal">/mo</span>
                    </div>
                    <p className="text-xs text-slate-400">Unlimited seats, API access, SLA support.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm">Enterprise</h4>
                    <div className="text-2xl font-black text-white">Custom</div>
                    <p className="text-xs text-slate-400">Dedicated instance & custom contracts.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'CODE' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>Enclosed Codebase Stack</span>
                  </h3>
                  <span className="text-xs font-mono text-cyan-300">{product.format}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                  <p className="text-slate-500">// Included in digital download:</p>
                  <p>├── /app & /components (Next.js 15 & React 19)</p>
                  <p>├── /prisma/schema.prisma (PostgreSQL ready)</p>
                  <p>├── /public/assets (Vector logos & iconography)</p>
                  <p>├── .env.example (Pre-configured environment keys)</p>
                  <p>└── README.md (Vercel & Netlify zero-config deploy)</p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Callout */}
          <footer className="p-4 bg-[#0D1322] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Verified Interactive Preview · BigVora Official Release</span>
            <button
              onClick={() => {
                addToCart(product, 1);
                onClose();
                navigateTo('cart');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <span>Get Full Source Code</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </footer>

        </div>

      </div>
    </div>
  );
};
