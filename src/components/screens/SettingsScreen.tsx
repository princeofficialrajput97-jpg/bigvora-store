import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Globe2, 
  ShieldCheck, 
  FileText, 
  Trash2, 
  ArrowLeft, 
  Check, 
  Smartphone,
  Lock,
  X
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { navigateTo, showToast, logout } = useApp();

  const [orderNotifs, setOrderNotifs] = useState(true);
  const [promoNotifs, setPromoNotifs] = useState(false);
  const [stockNotifs, setStockNotifs] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [showPolicyModal, setShowPolicyModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const policyContents: Record<string, { title: string; content: string }> = {
    terms: {
      title: 'Terms and Conditions',
      content: `1. ACCEPTANCE OF DIGITAL COMMERCE TERMS
By acquiring ready-made source code or commissioning custom software via BigVora Store, the customer receives an authorized software license based on the selected tier (Single License vs Commercial Developer License).

2. LICENSE & OWNERSHIP
- Single License Products: Ownership transfers exclusively to the buyer upon confirmed payment. BigVora immediately archives the item as SOLD OUT and ceases further distribution.
- Commercial Developer License: Grants non-exclusive, perpetual rights to build, rebrand, modify, and distribute derived applications for client or end-user deployments. Reselling raw uncompiled source code archives directly as a competing marketplace listing is strictly prohibited.

3. DIGITAL DELIVERIES
All source code and pre-compiled APK downloads are signed and linked to verified customer order records. Downloads are accessible via time-limited authenticated tokens.`,
    },
    privacy: {
      title: 'Privacy Policy',
      content: `1. DATA COLLECTION
BigVora Store collects verified phone numbers, emails, and project technical specifications solely to process digital fulfillment, send order tokens, and facilitate direct engineer-to-customer collaboration.

2. PAYMENT DATA SECURITY
We do not store or transmit raw credit card numbers, CVVs, or bank passwords. All payments are verified via industry-standard 256-bit encrypted gateways and tokenized webhooks.

3. ATTACHMENTS & PROJECT DATA
Reference documents, logos, and wireframes uploaded during custom requests are stored in private encrypted storage and accessible only to assigned project squad leads.`,
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      content: `1. DIGITAL PRODUCTS
Due to the irrevocable nature of downloadable source code archives and signed APK assets, purchases that have been successfully verified and delivered are non-refundable once digital download tokens have been accessed.

2. CORRUPTION OR DEFECT GUARANTEE
If an archived ZIP or project fails to build or lacks promised deliverables as documented on the product page, BigVora Support provides direct 1-on-1 engineer assistance or a full wallet credit within 7 calendar days.

3. CUSTOM DEVELOPMENT MILESTONES
Custom development projects follow milestone-based payments. You may cancel any uninitiated milestone for a 100% refund of the unspent escrow prior to commencement of that sprint.`,
    }
  };

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
          <h2 className="text-xl font-extrabold text-white">App Settings</h2>
          <p className="text-xs text-slate-400">Configure notifications, themes, and view legal policies.</p>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <span>Notification Preferences</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Order & Delivery Alerts</span>
              <span className="text-[11px] text-slate-400">Instant push notification on successful payment and file download generation</span>
            </div>
            <input
              type="checkbox"
              checked={orderNotifs}
              onChange={e => setOrderNotifs(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-0 bg-slate-900 border-slate-700"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-800/60">
            <div>
              <span className="text-xs font-bold text-white block">Inventory & Stock Alerts</span>
              <span className="text-[11px] text-slate-400">Alerts when wishlisted products approach limited stock or SOLD OUT status</span>
            </div>
            <input
              type="checkbox"
              checked={stockNotifs}
              onChange={e => setStockNotifs(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-0 bg-slate-900 border-slate-700"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-800/60">
            <div>
              <span className="text-xs font-bold text-white block">Promotional Dispatches</span>
              <span className="text-[11px] text-slate-400">Discount coupons and new Android template release alerts</span>
            </div>
            <input
              type="checkbox"
              checked={promoNotifs}
              onChange={e => setPromoNotifs(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-0 bg-slate-900 border-slate-700"
            />
          </label>
        </div>
      </div>

      {/* Appearance & Language */}
      <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Moon className="w-4 h-4 text-purple-400" />
          <span>Appearance & Localization</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Theme Mode</span>
              <span className="text-[11px] text-slate-400">Visual direction optimized for Android AMOLED screens</span>
            </div>
            <span className="text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-lg">
              Dark Premium (Default)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
            <div>
              <span className="font-bold text-white block">Marketplace Language</span>
              <span className="text-[11px] text-slate-400">Regional localization and currency formatting</span>
            </div>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
            >
              <option value="English (US)">English (US)</option>
              <option value="Spanish (ES)">Español</option>
              <option value="German (DE)">Deutsch</option>
              <option value="Hindi (IN)">हिंदी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legal & Policies */}
      <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Legal & Consumer Protection</span>
        </h3>

        <div className="divide-y divide-slate-800/60 text-xs">
          <button
            onClick={() => setShowPolicyModal('terms')}
            className="w-full py-2.5 flex items-center justify-between text-slate-300 hover:text-white"
          >
            <span>Terms and Conditions</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowPolicyModal('privacy')}
            className="w-full py-2.5 flex items-center justify-between text-slate-300 hover:text-white"
          >
            <span>Privacy Policy</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowPolicyModal('refund')}
            className="w-full py-2.5 flex items-center justify-between text-slate-300 hover:text-white"
          >
            <span>Refund & Digital Asset Cancellation Policy</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Account Deletion Danger Zone */}
      <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span>Data Privacy & Account Removal</span>
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          In accordance with Google Play and international data privacy compliance, you can request full erasure of your account, telephone token, and project briefs.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-semibold rounded-xl transition-colors"
        >
          Delete BigVora Account
        </button>
      </div>

      {/* App Version Info */}
      <div className="text-center pt-2">
        <span className="text-[11px] text-slate-500 font-mono block">
          BigVora Store · Android Customer Marketplace v1.0 (Build 1001)
        </span>
        <span className="text-[10px] text-slate-600 block mt-0.5">
          Engineered with Kotlin Architecture, Jetpack UI & Reactive State
        </span>
      </div>

      {/* Policy Reader Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0D1322] border border-purple-500/40 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setShowPolicyModal(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-3">
              {policyContents[showPolicyModal].title}
            </h3>
            <div className="max-h-72 overflow-y-auto text-xs text-slate-300 whitespace-pre-wrap leading-relaxed pr-2 font-mono">
              {policyContents[showPolicyModal].content}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowPolicyModal(null)}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0D1322] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Permanently Delete Account?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This action will revoke active session tokens and erase your profile. Any existing verified digital license download keys should be backed up locally before continuing.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  logout();
                  showToast('Account data deleted successfully.', 'info');
                  navigateTo('home');
                }}
                className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
