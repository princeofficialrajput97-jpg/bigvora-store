import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BigVoraLogo } from '../common/BigVoraLogo';
import { 
  ShieldCheck, 
  HelpCircle, 
  FileCode2, 
  Settings as SettingsIcon,
  Headphones,
  CheckCircle2,
  Lock,
  Server,
  Download,
  CreditCard,
  FileText,
  Mail,
  Smartphone,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  PhoneCall
} from 'lucide-react';

export const StoreInfoScreen: React.FC = () => {
  const { navigateTo, openConversationWithSupport } = useApp();
  const [activeTab, setActiveTab] = useState<'ASSURANCE' | 'SUPPORT' | 'DOCS'>('ASSURANCE');

  return (
    <div className="space-y-6 pb-24">
      {/* Page Header with Official Brand Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#11162C] via-[#0D1222] to-[#0A0E1A] border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <BigVoraLogo size="lg" variant="icon-only" className="glow-purple-md shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">BigVora Store Center</h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">
                Official
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
              Find. Buy. Build. — Authentic source code licenses, verified APKs, and 24-hour review dispatch.
            </p>
          </div>
        </div>

        <button
          onClick={() => openConversationWithSupport('Store center inquiry')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shrink-0 flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Support Desk</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-[#0D1322] border border-slate-800 rounded-xl p-1 gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('ASSURANCE')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'ASSURANCE'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Guarantees & Verification</span>
        </button>
        <button
          onClick={() => setActiveTab('SUPPORT')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'SUPPORT'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Customer Help & FAQs</span>
        </button>
        <button
          onClick={() => setActiveTab('DOCS')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'DOCS'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>System & API Specs</span>
        </button>
      </div>

      {/* Tab 1: Guarantees & Verification */}
      {activeTab === 'ASSURANCE' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#13152C] via-[#0D1324] to-[#0A0E1A] border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Authentic Codebase Guarantee</h3>
                <span className="text-xs text-purple-300 font-mono">100% Validated Source Projects</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every app and website listed on BigVora Store is compiled and verified before listing. 
              Android projects are verified with Android Studio and Gradle, and websites are tested on Next.js 15 and Node.js LTS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs font-bold text-white">Atomic Inventory Locks</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When you initiate checkout, our server reserves the license with a 10-minute hold. Single-license apps are archived immediately upon purchase so nobody else can buy them.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                <Download className="w-4 h-4" />
                <h4 className="text-xs font-bold text-white">Instant Signed Deliveries</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Purchases include cryptographically generated tokens to download the full ZIP source archive, ready APKs, database schemas, and documentation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <CreditCard className="w-4 h-4" />
                <h4 className="text-xs font-bold text-white">Transparent 24h Cash/Call Option</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cash and offline orders receive dedicated phone and WhatsApp coordination with our billing desk (+91 98765 43210) and a live 24-hour review countdown.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-violet-400">
                <FileText className="w-4 h-4" />
                <h4 className="text-xs font-bold text-white">Full Intellectual Property Rights</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                You receive full rights to modify, deploy, rebrand, and publish purchased source code to the Google Play Store or web hosting under your own developer account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Support Quick Hub */}
      {activeTab === 'SUPPORT' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0E1528] to-indigo-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Direct Lead Developer Support</h3>
              <p className="text-xs text-slate-300 mt-1">
                Have questions about gradle build, dependencies, or quote reviews?
              </p>
            </div>
            <button
              onClick={() => openConversationWithSupport('Store center inquiry')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shrink-0 transition-transform active:scale-95"
            >
              Open Direct Chat
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Contact Channels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="block text-slate-400 text-[10px]">Calling & WhatsApp Desk:</span>
                    <a href="tel:+919876543210" className="font-mono font-bold text-white hover:text-purple-300 underline">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <a
                  href="https://wa.me/919876543210?text=Hello%20BigVora%20Team%2C%20I%20have%20an%20inquiry%20regarding%20products%20and%20orders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold"
                >
                  WhatsApp
                </a>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="block text-slate-400 text-[10px]">Official Email:</span>
                  <a href="mailto:support@bigvora.com" className="font-bold text-white hover:text-purple-300 underline">
                    support@bigvora.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateTo('support')}
            className="w-full py-3 bg-[#0D1322] hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs font-semibold text-purple-300 flex items-center justify-center gap-2 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Open Detailed FAQ & Troubleshooting Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab 3: System & API Docs Shortcut */}
      {activeTab === 'DOCS' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-purple-400" />
              <span>Full-Stack REST Architecture & PostgreSQL Schemas</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              BigVora Store is backed by an Express REST server with live endpoints for products catalog, atomic inventory reservations, idempotency checkouts, and project quote dispatches.
            </p>
            <button
              onClick={() => navigateTo('api-docs')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
            >
              <span>View Interactive API Documentation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Return to Products button */}
      <div className="pt-2">
        <button
          onClick={() => navigateTo('home')}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 text-center transition-colors"
        >
          ← Return to Apps & Websites Catalog
        </button>
      </div>
    </div>
  );
};
