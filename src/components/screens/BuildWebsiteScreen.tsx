import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, 
  Layers, 
  Send, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Server, 
  UploadCloud, 
  CheckCircle2, 
  FileCheck,
  PhoneCall,
  Mail,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
  Laptop
} from 'lucide-react';

export const BuildWebsiteScreen: React.FC = () => {
  const { submitCustomRequest, navigateTo, showToast, user } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    requestId: string;
    projectName: string;
    budget: string;
    phone: string;
    whatsapp: string;
    email: string;
  } | null>(null);

  // Form Fields
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('SaaS & Digital Platform');
  const [description, setDescription] = useState('');
  const [customBudget, setCustomBudget] = useState('1800');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [requiredPages, setRequiredPages] = useState<string[]>([
    'Landing Page (Hero & Bento Grid)',
    'Pricing & Features Matrix',
    'Customer Auth & Dashboard',
  ]);
  const [desiredFeatures, setDesiredFeatures] = useState<string[]>([
    'Responsive Dark Premium Design',
    'PostgreSQL / Supabase Database',
    'Payment Gateway Integration (Stripe)',
  ]);
  const [needsHosting, setNeedsHosting] = useState(true);
  const [referenceUrls, setReferenceUrls] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [expectedDeadline, setExpectedDeadline] = useState('Standard (3-4 Weeks)');
  
  // Communication Inputs (User phone, WhatsApp, main email ID)
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.phone || '');
  const [emailId, setEmailId] = useState(user?.email || '');
  const [notes, setNotes] = useState('');

  // 24-Hour Countdown Timer for submitted view
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 54 });

  useEffect(() => {
    if (!submittedData) return;
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
  }, [submittedData]);

  const pageOptions = [
    'Landing Page (Hero & Bento Grid)',
    'Pricing & Features Matrix',
    'Customer Auth & Dashboard',
    'E-Commerce Store & Checkout',
    'Blog & CMS Articles Engine',
    'Docs & Help Center Portal',
    'Admin Management Portal',
    'Client Booking / Scheduling',
  ];

  const techFeatures = [
    'Responsive Dark Premium Design',
    'PostgreSQL / Supabase Database',
    'Payment Gateway Integration (Stripe / Cards)',
    'SEO Optimization & OpenGraph Meta Cards',
    'Custom Domain & SSL Setup',
    'Automated Email & SMS Notifications',
    'Real-time WebSockets & Live Chat',
    'Admin REST & GraphQL API Engine',
  ];

  const togglePage = (p: string) => {
    setRequiredPages(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const toggleFeature = (f: string) => {
    setDesiredFeatures(prev => 
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setAttachedFiles(prev => [...prev, fileName]);
      showToast(`Attached file: ${fileName}`, 'success');
    }
  };

  const handleSubmitBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      showToast('Please enter a website name', 'error');
      setCurrentStep(1);
      return;
    }

    if (!phoneNumber.trim()) {
      showToast('Please enter your primary phone number', 'error');
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    const budgetStr = customBudget ? `${currencySymbol}${parseFloat(customBudget).toLocaleString()}` : '$1,500 - $3,000';

    const payload = {
      type: 'CUSTOM_WEBSITE',
      projectName,
      category,
      description,
      requiredPages,
      features: desiredFeatures,
      referenceLinks: referenceUrls ? [referenceUrls] : [],
      referenceAttachments: attachedFiles,
      budgetRange: budgetStr,
      customBudget: parseFloat(customBudget) || 1800,
      expectedDeadline,
      contactMethod: 'PHONE',
      contactValue: `Phone: ${phoneNumber} | WhatsApp: ${whatsappNumber} | Email: ${emailId}`,
      notes: `${notes ? notes + ' | ' : ''}${needsHosting ? 'Requested Vercel/Cloudflare deployment and custom domain setup.' : ''}`,
    };

    const res = await submitCustomRequest(payload);
    setIsSubmitting(false);

    if (res.success && res.requestId) {
      setSubmittedData({
        requestId: res.requestId,
        projectName,
        budget: budgetStr,
        phone: phoneNumber,
        whatsapp: whatsappNumber,
        email: emailId,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- VIEW 1: SUBMITTED 24-HOUR ARCHITECT WAIT SCREEN ---
  if (submittedData) {
    return (
      <div className="space-y-6 pb-24 animate-in fade-in duration-300">
        
        {/* Top Celebration & 24h Review Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121B33] via-[#0E1528] to-[#0A0E1A] border border-cyan-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-cyan-950/90 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Clock className="w-8 h-8" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold uppercase mb-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>24-HOUR ARCHITECT REVIEW INITIATED</span>
            </div>
            <h2 className="text-2xl font-black text-white">Website Project Brief Submitted!</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
              Your website specifications <strong className="text-cyan-300 font-mono">[{submittedData.requestId}]</strong> have been forwarded to BigVora's Web Engineering Squad.
            </p>
          </div>

          {/* Active 24-Hour Timer Widget */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-sm shadow-inner">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Review Window:</span>
            <span className="font-bold text-white text-base">
              {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          {/* Review Details Card */}
          <div className="p-5 rounded-2xl bg-[#090D18]/90 border border-slate-800 text-left text-xs space-y-3 max-w-lg mx-auto shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Request Reference:</span>
              <span className="font-mono text-cyan-300 font-bold">{submittedData.requestId}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Review Status:</span>
              <span className="text-cyan-400 font-mono font-bold flex items-center gap-1">
                <span>UNDER 24H ARCHITECT EVALUATION</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-500 block">Website Name:</span>
                <span className="font-semibold text-white">{submittedData.projectName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Customer Budget:</span>
                <span className="font-mono font-semibold text-emerald-400">{submittedData.budget}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Calling Phone:</span>
                <span className="font-mono text-slate-200">{submittedData.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">WhatsApp Number:</span>
                <span className="font-mono text-emerald-300">{submittedData.whatsapp}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Main Email ID:</span>
                <span className="text-slate-200">{submittedData.email}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] text-cyan-200 leading-relaxed">
              <strong>What Happens in the Next 24 Hours:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                <li>Our senior full-stack architect analyzes your required pages & database schema.</li>
                <li>An official milestone quote & delivery roadmap will be uploaded to <em>My Requests</em>.</li>
                <li>Our lead project dispatcher will call or WhatsApp your number to confirm details.</li>
              </ul>
            </div>
          </div>

          {/* Direct Instant Contact Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <span>Call Lead Architect: +91 98765 43210</span>
            </a>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello BigVora team, I just submitted Custom Website Brief [${submittedData.requestId}] for ${submittedData.projectName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Brief Desk</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 max-w-md mx-auto">
            <button
              onClick={() => navigateTo('my-requests')}
              className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Track in My Requests</span>
            </button>

            <button
              onClick={() => navigateTo('messages')}
              className="w-full sm:flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Open Project Chat</span>
            </button>
          </div>
        </div>

      </div>
    );
  }

  // --- VIEW 2: CUSTOM PROJECT BRIEF FORM (Fixed Packages Removed) ---
  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-2">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Custom Website & Platform Development · Direct Brief</span>
        </div>
        <h1 className="text-2xl font-black text-white">Custom Project Brief</h1>
        <p className="text-xs text-slate-400 mt-1">
          Submit your website idea, choose your pages & tech stack, fill your own budget, and receive an engineering quote within 24 hours.
        </p>
      </div>

      {/* Main Multi-Step Form Container */}
      <div className="p-6 rounded-3xl bg-[#0D1322] border border-slate-800/80 space-y-6 shadow-xl">
        
        {/* Step Header Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">
              {currentStep}
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {currentStep === 1 && 'Step 1: Website Name & Category'}
              {currentStep === 2 && 'Step 2: Required Pages & Modules'}
              {currentStep === 3 && 'Step 3: Self-Input Budget & Idea Details'}
              {currentStep === 4 && 'Step 4: Phone, WhatsApp & Main Email ID'}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Step {currentStep} of 4</span>
        </div>

        {/* STEP 1: Website Name, Category, Platform */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Website / Platform Name *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. ApexConsulting, NovaPortal, AuraStudio, VoraMart"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Website Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="SaaS & Digital Platform">SaaS & Digital Platform</option>
                <option value="E-Commerce & Marketplace">E-Commerce & Marketplace</option>
                <option value="Corporate & Company Portal">Corporate & Company Portal</option>
                <option value="Real Estate & Living">Real Estate & Living</option>
                <option value="Education & LMS Academy">Education & LMS Academy</option>
                <option value="Creative Agency & Portfolio">Creative Agency & Portfolio</option>
                <option value="Healthcare & Appointments">Healthcare & Appointments</option>
                <option value="Custom Web App Engine">Custom Web App Engine</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Platform & Viewport
              </label>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2.5">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>Responsive Web Platform (Next.js 15, Tailwind, Mobile PWA + Desktop)</span>
                </div>
                <Check className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Required Pages & Technical Modules */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Select Required Pages:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pageOptions.map(p => {
                  const isSelected = requiredPages.includes(p);
                  return (
                    <div
                      key={p}
                      onClick={() => togglePage(p)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{p}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-cyan-600 border-cyan-400 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Required Technical Modules:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {techFeatures.map(f => {
                  const isSelected = desiredFeatures.includes(f);
                  return (
                    <div
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{f}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-cyan-600 border-cyan-400 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Self-Input Budget ("budget apne app bharne ka") & Idea Details */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Self-Input Custom Budget */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-white flex items-center justify-between">
                <span>Enter Your Custom Budget * (Apna Budget Khud Bharein)</span>
                <span className="text-[11px] text-cyan-400 font-mono font-normal">Self-Determined Amount</span>
              </label>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Specify the budget you have allocated for this website development project.
              </p>
              
              <div className="flex items-center gap-2 pt-1">
                {/* Currency selector */}
                <select
                  value={currencySymbol}
                  onChange={e => setCurrencySymbol(e.target.value)}
                  className="text-base font-black text-cyan-400 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono cursor-pointer"
                >
                  <option value="$">$ USD</option>
                  <option value="₹">₹ INR</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </select>

                <input
                  type="number"
                  min="100"
                  step="50"
                  value={customBudget}
                  onChange={e => setCustomBudget(e.target.value)}
                  placeholder="1800"
                  required
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-cyan-500/50 rounded-xl text-white text-base font-mono font-bold focus:outline-none focus:border-cyan-400"
                />
                <span className="text-xs text-slate-400 font-mono">Amount</span>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 pt-1 text-xs">
                <span className="text-[10px] text-slate-500">Quick chips:</span>
                {['800', '1500', '2500', '4500'].map(val => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setCustomBudget(val)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded font-mono"
                  >
                    {currencySymbol}{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Idea & Business Goals */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Website Idea & Business Goals (Apna Idea Detail Mein Likhein) *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain your website concept: What is the main product or service? Who are your target visitors? What actions should they take?"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Reference URLs */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Reference Website Links (Inspiration & Design Benchmarks)
              </label>
              <input
                type="text"
                value={referenceUrls}
                onChange={e => setReferenceUrls(e.target.value)}
                placeholder="e.g. https://stripe.com, https://linear.app, https://dribbble.com/..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>

            {/* File Uploads */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Attach Logo, Wireframes, or Branding Assets
              </label>
              <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-7 h-7 text-cyan-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-300 font-medium">Click to attach logo, wireframe or design files</p>
                <span className="text-[10px] text-slate-500">PNG, JPG, PDF, Figma links supported</span>
              </div>

              {attachedFiles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {attachedFiles.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Hosting Checkbox */}
            <div>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <input
                  type="checkbox"
                  checked={needsHosting}
                  onChange={e => setNeedsHosting(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Include Vercel / Netlify / Cloudflare deployment assistance and custom domain connection</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Phone Number, WhatsApp Number, Main Email ID */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white block">Official Verification Contacts:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Our lead architect and dispatcher will contact you within <strong>24 Hours</strong> via Call and WhatsApp to review your quote.
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span>Primary Calling Phone Number * (Phone Number)</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 019-2831 or +91 98765 43210"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Number * (Watsapp Number)</span>
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                placeholder="+1 (555) 019-2831 or +91 98765 43210"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                We send milestone updates, design previews, and quotes directly to your WhatsApp.
              </span>
            </div>

            {/* Main Email ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>Main Email ID * (Main ID)</span>
              </label>
              <input
                type="email"
                value={emailId}
                onChange={e => setEmailId(e.target.value)}
                placeholder="founder@company.com"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Official PDF quotation, SLA agreement, and invoice will be delivered to this email.
              </span>
            </div>

            {/* Deadline & Additional Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Expected Delivery Timeline
                </label>
                <select
                  value={expectedDeadline}
                  onChange={e => setExpectedDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                >
                  <option value="Rush Priority (1-2 Weeks)">Rush Priority (1-2 Weeks)</option>
                  <option value="Standard (3-4 Weeks)">Standard (3-4 Weeks)</option>
                  <option value="Flexible (6-8 Weeks)">Flexible (6-8 Weeks)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Need dark theme, Stripe in EUR..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Step Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && !projectName.trim()) {
                  showToast('Please enter a website name', 'error');
                  return;
                }
                if (currentStep === 3 && (!description.trim() || !customBudget.trim())) {
                  showToast('Please describe your idea and enter your budget', 'error');
                  return;
                }
                setCurrentStep(prev => prev + 1);
              }}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-md active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitBrief}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-900/40 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Website Brief (24h Review)</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
