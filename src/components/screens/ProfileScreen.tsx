import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BigVoraLogo } from '../common/BigVoraLogo';
import { 
  User, 
  PackageCheck, 
  FileText, 
  Heart, 
  MessageSquare, 
  Settings as SettingsIcon, 
  HelpCircle, 
  LogOut, 
  ShieldCheck, 
  ChevronRight, 
  Edit3, 
  Save, 
  Smartphone, 
  Mail,
  Code2,
  ShieldAlert,
  Zap,
  ArrowRight
} from 'lucide-react';
import { sound } from '../../services/soundEffects';

export const ProfileScreen: React.FC = () => {
  const { 
    user, 
    isAdmin,
    logout, 
    updateProfile, 
    navigateTo, 
    setIsAuthModalOpen, 
    orders, 
    requests, 
    wishlist 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Not Signed In</h2>
        <p className="text-xs text-slate-400">
          Sign in using your mobile number and OTP to view your orders and project quotes.
        </p>
        <button
          onClick={() => navigateTo('login')}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-900/30 transition-all active:scale-95"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-[#0D1322] border border-slate-800/80 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/50 shadow-md"
            />
            {user.isPhoneVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-sm" title="Verified Account">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 text-slate-400 hover:text-purple-300"
                title="Edit profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-400">
              <span className="flex items-center justify-center sm:justify-start gap-1 font-mono">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                {user.phone}
              </span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span className="flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                {user.email}
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] text-amber-300 font-mono bg-amber-950/80 border border-amber-500/50 px-3 py-1 rounded-full font-bold shadow-sm shadow-amber-900/30">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>👑 BigVora Founder & Super Admin</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[10px] text-purple-300 font-mono bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                  <BigVoraLogo size="xs" variant="icon-only" />
                  <span>Verified BigVora Client · Active</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-5 pt-4 border-t border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Super Admin Access Card - STRICTLY VISIBLE FOR PHONE 9266428368 */}
      {isAdmin && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#181128] to-slate-900 border-2 border-amber-500/60 shadow-2xl shadow-amber-950/40 space-y-3 relative overflow-hidden animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <ShieldAlert className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white">BigVora Store Master Control</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500 text-black font-extrabold uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  A-to-Z Store Control: Client Briefs, WhatsApp Contact, 1-Click Cash Approval, Product Catalog & Technical Helpdesk.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playCash();
              navigateTo('admin');
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Launch Admin Control Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div
          onClick={() => navigateTo('orders')}
          className="p-3.5 bg-[#0D1322] border border-slate-800 hover:border-purple-500/40 rounded-2xl cursor-pointer transition-colors"
        >
          <PackageCheck className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <span className="text-xs font-bold text-white block">My Orders</span>
          <span className="text-[10px] text-slate-500 font-mono">{orders.length} orders</span>
        </div>

        <div
          onClick={() => navigateTo('my-requests')}
          className="p-3.5 bg-[#0D1322] border border-slate-800 hover:border-purple-500/40 rounded-2xl cursor-pointer transition-colors"
        >
          <FileText className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <span className="text-xs font-bold text-white block">My Requests</span>
          <span className="text-[10px] text-slate-500 font-mono">{requests.length} briefs</span>
        </div>

        <div
          onClick={() => navigateTo('wishlist')}
          className="p-3.5 bg-[#0D1322] border border-slate-800 hover:border-purple-500/40 rounded-2xl cursor-pointer transition-colors"
        >
          <Heart className="w-5 h-5 text-pink-400 mx-auto mb-1" />
          <span className="text-xs font-bold text-white block">Saved</span>
          <span className="text-[10px] text-slate-500 font-mono">{wishlist.length} items</span>
        </div>
      </div>

      {/* Settings & Support Links */}
      <div className="p-3 rounded-2xl bg-[#0D1322] border border-slate-800/80 divide-y divide-slate-800/60">
        <div
          onClick={() => navigateTo('settings')}
          className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 rounded-xl cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">App Settings</h4>
              <p className="text-[10px] text-slate-500">Theme, notifications, and security</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div
          onClick={() => navigateTo('support')}
          className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 rounded-xl cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Help & FAQs</h4>
              <p className="text-[10px] text-slate-500">Order help, downloads & terms</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div
          onClick={() => navigateTo('api-docs')}
          className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 rounded-xl cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-purple-300">Backend API Contracts</h4>
              <p className="text-[10px] text-slate-500">Specs for future Admin & Developer applications</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div
          onClick={logout}
          className="p-3.5 flex items-center justify-between hover:bg-red-950/20 rounded-xl cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-400">Sign Out</h4>
              <p className="text-[10px] text-slate-500">End active session on this device</p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Brand Logo Footer */}
      <div className="py-6 flex justify-center">
        <BigVoraLogo size="lg" variant="full" className="opacity-90" />
      </div>
    </div>
  );
};
