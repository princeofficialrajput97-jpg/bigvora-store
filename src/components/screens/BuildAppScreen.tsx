import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Smartphone, 
  Globe, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Mail, 
  User, 
  DollarSign, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  X,
  Zap,
  PhoneCall
} from 'lucide-react';

export type BuildMode = 'SELECT' | 'APP' | 'WEBSITE';

interface BuildAppScreenProps {
  initialMode?: BuildMode;
}

export const BuildAppScreen: React.FC<BuildAppScreenProps> = ({ initialMode }) => {
  const { navigateTo, user, showToast, submitProjectRequest } = useApp();

  // Mode: APP (Build My App) or WEBSITE (Build My Website)
  const [selectedType, setSelectedType] = useState<'APP' | 'WEBSITE'>(
    initialMode === 'WEBSITE' ? 'WEBSITE' : 'APP'
  );

  useEffect(() => {
    if (initialMode && initialMode !== 'SELECT') {
      setSelectedType(initialMode);
    }
  }, [initialMode]);

  // Form Fields
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState(user?.name || '');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.phone || '');
  const [sameAsContact, setSameAsContact] = useState(true);
  const [emailId, setEmailId] = useState(user?.email || '');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [customBudget, setCustomBudget] = useState<string>('35000');
  const [projectIdea, setProjectIdea] = useState('');

  // 24-Hour Review Popup State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedBrief, setSubmittedBrief] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 58 });

  // Sync WhatsApp with Contact when checkbox is active
  useEffect(() => {
    if (sameAsContact) {
      setWhatsappNumber(contactNumber);
    }
  }, [contactNumber, sameAsContact]);

  // 24-Hour Countdown Timer
  useEffect(() => {
    if (!isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Preset Budget Buttons
  const inrPresets = ['15000', '35000', '65000', '125000', '250000'];
  const usdPresets = ['300', '600', '1200', '2500', '5000'];
  const presets = currency === 'INR' ? inrPresets : usdPresets;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      showToast(selectedType === 'APP' ? 'Please enter App Name' : 'Please enter Website Name', 'error');
      return;
    }
    if (!clientName.trim()) {
      showToast('Please enter your Name', 'error');
      return;
    }
    if (!contactNumber.trim()) {
      showToast('Please enter your Contact Number', 'error');
      return;
    }
    if (!emailId.trim()) {
      showToast('Please enter your Email ID', 'error');
      return;
    }

    const budgetNum = parseFloat(customBudget) || (currency === 'INR' ? 35000 : 600);

    const briefData: any = {
      type: selectedType === 'APP' ? 'CUSTOM_APP' : 'CUSTOM_WEBSITE',
      projectName: projectName.trim(),
      category: selectedType === 'APP' ? 'Custom Mobile App' : 'Custom Web Application',
      description: projectIdea.trim() || `Client requested custom ${selectedType.toLowerCase()} development.`,
      targetPlatforms: selectedType === 'APP' ? ['Android', 'iOS'] : ['Web Application', 'Responsive Mobile'],
      requiredPages: ['Home', 'Core Features', 'Checkout / User Profile'],
      features: projectIdea ? [projectIdea.slice(0, 100)] : ['High Performance Architecture', 'Secure Auth', 'Payment Integration'],
      budgetRange: `${currency === 'INR' ? '₹' : '$'}${budgetNum.toLocaleString()}`,
      customBudget: budgetNum,
      expectedDeadline: '2-3 Weeks',
      contactMethod: 'PHONE',
      contactValue: contactNumber.trim(),
      whatsappNumber: (sameAsContact ? contactNumber : whatsappNumber).trim(),
      emailId: emailId.trim(),
      clientName: clientName.trim(),
      referenceLinks: [],
      referenceAttachments: [],
      hasLogo: false,
      notes: `WhatsApp: ${sameAsContact ? contactNumber : whatsappNumber} | Email: ${emailId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'SUBMITTED'
    };

    sound.playCash();
    confetti({ particleCount: 90, spread: 80 });

    const ok = await submitProjectRequest(briefData);
    if (ok) {
      setSubmittedBrief(briefData);
      setIsSubmitted(true);
      showToast('24-Hour Callback Request submitted successfully!', 'success');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-24 animate-in fade-in">
      
      {/* Top Banner / Type Toggle */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#10162B] via-[#0D1222] to-[#070A12] border-2 border-purple-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                Build My Custom Project
              </h1>
              <p className="text-[11px] text-slate-400">
                Set your self-budget & request our 24-hour callback review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            <Clock className="w-3 h-3 animate-spin" />
            <span>24h Callback Guarantee</span>
          </div>
        </div>

        {/* 1-Tap Switcher: App vs Website */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#05070D] rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              sound.playTabSwitch();
              setSelectedType('APP');
            }}
            className={`py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              selectedType === 'APP'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Build My App</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTabSwitch();
              setSelectedType('WEBSITE');
            }}
            className={`py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              selectedType === 'WEBSITE'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-950/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Build My Website</span>
          </button>
        </div>
      </div>

      {/* Main Single-Step Request Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-3xl bg-[#090D1A] border border-slate-800 space-y-4 shadow-2xl">
        
        {/* 1. App Name or Website Name */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
            <span>{selectedType === 'APP' ? 'App Name *' : 'Website Name *'}</span>
            <span className="text-[10px] text-purple-400 font-normal">What is your project called?</span>
          </label>
          <input
            type="text"
            required
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            placeholder={selectedType === 'APP' ? 'e.g. FitPulse Gym App, QuickGrocer, CryptoPay' : 'e.g. EduPortal SaaS, LuxeEstate, FoodDelivery Web'}
            className="w-full px-4 py-3 bg-[#05070D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 shadow-inner font-medium"
          />
        </div>

        {/* 2. Custom Self-Budget (Apne Hisab Se Set Kar Paye) */}
        <div className="p-4 rounded-2xl bg-[#05070D] border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Your Budget (Set As Per Your Choice) *</span>
            </label>

            {/* Currency Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setCurrency('INR');
                  setCustomBudget('35000');
                }}
                className={`px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrency('USD');
                  setCustomBudget('600');
                }}
                className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}
              >
                $ USD
              </button>
            </div>
          </div>

          {/* Budget Number Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-extrabold text-base">
              {currency === 'INR' ? '₹' : '$'}
            </span>
            <input
              type="number"
              required
              value={customBudget}
              onChange={e => setCustomBudget(e.target.value)}
              placeholder="Enter your exact target budget..."
              className="w-full pl-9 pr-4 py-3 bg-[#090D1A] border-2 border-amber-500/40 rounded-xl text-base sm:text-lg font-black font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 shadow-inner"
            />
          </div>

          {/* Fast Preset Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 self-center mr-1">Quick Select:</span>
            {presets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setCustomBudget(amt);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  customBudget === amt
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {currency === 'INR' ? `₹${parseInt(amt).toLocaleString()}` : `$${amt}`}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Client Name */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Your Full Name *</span>
          </label>
          <input
            type="text"
            required
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-4 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>

        {/* 4. Contact Phone Number & WhatsApp Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Contact Number *</span>
            </label>
            <input
              type="tel"
              required
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Number *</span>
              </label>
              <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsContact}
                  onChange={e => setSameAsContact(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>Same</span>
              </label>
            </div>
            <input
              type="tel"
              required
              disabled={sameAsContact}
              value={whatsappNumber}
              onChange={e => setWhatsappNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full px-4 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 ${
                sameAsContact ? 'opacity-70 cursor-not-allowed bg-slate-900/60' : ''
              }`}
            />
          </div>
        </div>

        {/* 5. Email ID */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>Email Address *</span>
          </label>
          <input
            type="email"
            required
            value={emailId}
            onChange={e => setEmailId(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>

        {/* 6. Optional Project Idea / Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">
            <span>Project Idea / Key Features (Optional)</span>
          </label>
          <textarea
            rows={2}
            value={projectIdea}
            onChange={e => setProjectIdea(e.target.value)}
            placeholder={
              selectedType === 'APP' 
                ? 'e.g. Need UPI payment integration, Google sign-in, order tracking on map...' 
                : 'e.g. Need responsive dark mode SaaS website, user dashboard, Stripe checkout...'
            }
            className="w-full px-4 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-950/60 flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
        >
          <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
          <span>Request 24-Hour Callback & Quote</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        <p className="text-[11px] text-center text-slate-400 pt-1">
          🔒 Zero commitment. Our Senior Architect reviews your budget & calls you within 24 hours.
        </p>
      </form>

      {/* ==================================================== */}
      {/* 24 HOURS CALL BACK REQUEST POPUP (MODAL)             */}
      {/* Both App & Website trigger this popup upon submit    */}
      {/* ==================================================== */}
      {isSubmitted && submittedBrief && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-md bg-[#090D1A] border-2 border-emerald-500/50 rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-center my-auto">
            
            {/* Top Glowing Icon */}
            <div className="relative mx-auto w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/40">
              <CheckCircle2 className="w-10 h-10" />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-black">
                24h
              </div>
            </div>

            <div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold uppercase tracking-wider font-mono">
                Request Confirmed ✓
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                24-Hour Callback Request Active!
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Thank you <strong className="text-white">{submittedBrief.clientName}</strong>! BigVora Solutions Architect & Founder team has received your <strong className="text-purple-400">{submittedBrief.projectName}</strong> specifications.
              </p>
            </div>

            {/* Live 24-Hour Countdown Box */}
            <div className="p-4 rounded-2xl bg-[#05070D] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Guaranteed Callback Window</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">In Queue #1</span>
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xl sm:text-2xl font-black text-amber-400">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-400 block uppercase">Hours</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xl sm:text-2xl font-black text-amber-400">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-400 block uppercase">Minutes</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xl sm:text-2xl font-black text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-400 block uppercase">Seconds</span>
                </div>
              </div>
            </div>

            {/* Brief Summary Card */}
            <div className="text-left text-xs bg-[#05070D] p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Project:</span>
                <span className="text-white font-bold">{submittedBrief.projectName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Your Budget:</span>
                <span className="text-amber-400 font-bold">{submittedBrief.budgetRange}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contact Number:</span>
                <span className="text-slate-200">{submittedBrief.contactValue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="text-emerald-400">{submittedBrief.whatsappNumber}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* Instant WhatsApp Jump to Founder */}
              <a
                href={`https://wa.me/919266428368?text=${encodeURIComponent(`Hello BigVora Founder! I just submitted a 24-hour callback request for my ${submittedBrief.type === 'CUSTOM_APP' ? 'App' : 'Website'} "${submittedBrief.projectName}" with budget ${submittedBrief.budgetRange}. Let's discuss!`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Founder on WhatsApp Now (0s Wait)</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    navigateTo('my-requests');
                  }}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                >
                  View My Requests
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    navigateTo('home');
                  }}
                  className="py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Return to Store
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
