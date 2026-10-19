import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Headphones, 
  MessageSquare, 
  Download, 
  CreditCard, 
  FileCode, 
  ArrowLeft,
  CheckCircle2,
  Mail,
  Smartphone
} from 'lucide-react';

export const HelpSupportScreen: React.FC = () => {
  const { openConversationWithSupport, navigateTo } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I download the source code after completing payment?',
      a: 'Immediately after your order is confirmed, go to "My Orders". Each digital item will feature a "Download ZIP" button that initiates a secure authenticated download containing the full source project, pre-compiled APK, and setup documentation.'
    },
    {
      q: 'What is the difference between Single License and Commercial Developer License?',
      a: 'A Single License product is sold exclusively to one buyer. As soon as you purchase it, BigVora marks it permanently as SOLD OUT on the marketplace and nobody else can buy it. A Developer License allows multiple verified customers to build client apps using the foundation.'
    },
    {
      q: 'Can I test an Android APK before purchasing the source code?',
      a: 'Yes! In each product details page, we provide detailed feature screenshots, demo video demonstrations, and verified user reviews. If you need a demo APK build file to test on a physical Android handset, open a direct chat with our support squad.'
    },
    {
      q: 'How does the Custom App Development ("Build Your App") process work?',
      a: '1. You submit your project brief with desired features and target platform (Android / iOS).\n2. Our technical squad analyzes your requirements and uploads a fixed quote into My Requests.\n3. You review the scope and approve the quote.\n4. Work begins with milestone progress updates and direct chat with your assigned lead developer.'
    },
    {
      q: 'What versions of Android Studio and Gradle are supported?',
      a: 'All Android application source codes on BigVora Store are built and tested on Android Studio Ladybug/Hedgehog with Android SDK 24 through 34+ (supporting Android 7.0 to 14/15) with Jetpack Compose.'
    },
    {
      q: 'Can BigVora assist in publishing the purchased app to the Google Play Store?',
      a: 'Yes. In the product details or custom app brief, you can request deployment assistance. Our engineers will generate your release keystore, configure Google Play Console metadata, and provide guidance for Google review compliance.'
    }
  ];

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateTo('profile')}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-white">Help & Customer Support</h2>
          <p className="text-xs text-slate-400">Find answers or chat directly with our technical squad.</p>
        </div>
      </div>

      {/* Support Chat Callout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0E1528] to-indigo-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Need Live Technical Assistance?</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Chat with our engineering dispatch squad regarding orders, downloads, or quotes.
            </p>
          </div>
        </div>

        <button
          onClick={() => openConversationWithSupport('General support inquiry')}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/30 flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Launch Live Chat</span>
        </button>
      </div>

      {/* Category Help Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => navigateTo('orders')}
          className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-colors"
        >
          <Download className="w-5 h-5 text-purple-400 mb-2" />
          <h4 className="text-xs font-bold text-white">Download Help</h4>
          <p className="text-[11px] text-slate-400 mt-1">Troubleshoot token generation and ZIP decompression.</p>
        </div>

        <div
          onClick={() => navigateTo('cart')}
          className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-colors"
        >
          <CreditCard className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="text-xs font-bold text-white">Payment & Billing</h4>
          <p className="text-[11px] text-slate-400 mt-1">Cards, UPI, invoices, receipts, and currency FAQs.</p>
        </div>

        <div
          onClick={() => navigateTo('my-requests')}
          className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-colors"
        >
          <FileCode className="w-5 h-5 text-cyan-400 mb-2" />
          <h4 className="text-xs font-bold text-white">Custom Project Briefs</h4>
          <p className="text-[11px] text-slate-400 mt-1">Milestone scopes, quotes, revisions, and SLAs.</p>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0D1322] border border-slate-800/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3 whitespace-pre-line">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Details */}
      <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 text-xs text-slate-400 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Official Inquiries & Billing Desk:</h4>
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <a href="mailto:support@bigvora.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span className="underline">support@bigvora.com</span>
          </a>
          <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono underline">+91 98765 43210 (Direct Desk)</span>
          </a>
          <a
            href="https://wa.me/919876543210?text=Hello%20BigVora%20Support%2C%20I%20need%20assistance"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition-colors"
          >
            WhatsApp Desk
          </a>
        </div>
      </div>

    </div>
  );
};
