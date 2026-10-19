import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { Product, ProjectRequest, Order, SupportTicket, RequestStatus, TicketStatus, UserProfile } from '../../types';
import { VideoEmbedPlayer, isYouTubeUrl } from '../common/VideoEmbedPlayer';
import { 
  ShieldAlert, 
  DollarSign, 
  ShoppingBag, 
  PackageCheck, 
  FileText, 
  Headphones, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Smartphone, 
  Globe, 
  ExternalLink, 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  Trash2, 
  Edit3, 
  Save, 
  RefreshCw, 
  Bell, 
  Check, 
  Zap, 
  X,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  Radio,
  Tag,
  Users,
  UserCheck,
  Video,
  Image as ImageIcon,
  Wrench,
  AlertTriangle,
  Upload,
  Play
} from 'lucide-react';

export type AdminTab = 
  | 'OVERVIEW' 
  | 'PRODUCTS' 
  | 'DEVELOPERS' 
  | 'MAINTENANCE' 
  | 'BRIEFS' 
  | 'ORDERS' 
  | 'TICKETS' 
  | 'BROADCAST';

export const AdminScreen: React.FC = () => {
  const { 
    user, 
    isAdmin, 
    navigateTo, 
    orders, 
    requests, 
    products, 
    tickets, 
    approveCashPayment, 
    updateOrderStatus,
    updateProjectRequest,
    deleteProjectRequest,
    addProduct,
    updateProduct,
    deleteProduct,
    replyTicketAsAdmin,
    updateTicketStatus,
    broadcastNotification,
    showToast,
    maintenanceMode,
    toggleMaintenanceMode,
    usersList,
    updateUserDeveloperStatus,
    totalUsersCount,
    totalDevelopersCount,
    totalPendingDevelopersCount
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');

  // ==========================================
  // PRODUCT ADD / EDIT MODAL STATE
  // Supports App Video, 10 Photos, Features list, Live Demo links
  // ==========================================
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdTagline, setNewProdTagline] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdType, setNewProdType] = useState<'APP' | 'WEBSITE'>('APP');
  const [newProdPlatform, setNewProdPlatform] = useState<'ANDROID' | 'WEB' | 'CROSS_PLATFORM'>('ANDROID');
  const [newProdCategory, setNewProdCategory] = useState('Fintech & Payments');
  const [newProdPrice, setNewProdPrice] = useState('149');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('249');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdLicense, setNewProdLicense] = useState<'SINGLE_LICENSE' | 'LIMITED_STOCK' | 'MULTIPLE_LICENSES'>('LIMITED_STOCK');
  const [newProdTechStack, setNewProdTechStack] = useState('Kotlin, Jetpack Compose, Room DB, Retrofit');
  const [newProdFormat, setNewProdFormat] = useState('ZIP (Android Studio Project + Signed APK)');
  const [newProdFileSize, setNewProdFileSize] = useState('42.5 MB');
  const [newProdPackageName, setNewProdPackageName] = useState('com.bigvora.app');
  const [newProdVersion, setNewProdVersion] = useState('v1.0.0');
  const [newProdDemoUrl, setNewProdDemoUrl] = useState('https://bigvora.com/preview');
  const [newProdVideoUrl, setNewProdVideoUrl] = useState('https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [newProdThumbnail, setNewProdThumbnail] = useState('https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80');

  // Up to 10 Screenshots/Photos
  const [newProdScreenshots, setNewProdScreenshots] = useState<string[]>([
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  ]);
  const [screenshotInput, setScreenshotInput] = useState('');

  // Native Device Gallery File Input Refs
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Photo Upload directly from Device Gallery
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - newProdScreenshots.length;
    if (remainingSlots <= 0) {
      showToast('Maximum 10 screenshots limit reached! Remove some to add more.', 'warning');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    sound.playTap();

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setNewProdScreenshots(prev => {
            if (prev.length >= 10) return prev;
            return [...prev, dataUrl];
          });
          // If thumbnail is empty or default, set first image
          setNewProdThumbnail(prev => {
            if (!prev || prev.includes('unsplash.com')) return dataUrl;
            return prev;
          });
        }
      };
      reader.readAsDataURL(file);
    });

    showToast(`Added ${filesToProcess.length} photo(s) from phone gallery!`, 'success');
    e.target.value = '';
  };

  // Handle Main Thumbnail Upload from Device Gallery
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sound.playTap();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewProdThumbnail(event.target.result as string);
        showToast('App / Website thumbnail updated from gallery!', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Features List Builder
  const [newProdFeatures, setNewProdFeatures] = useState<string[]>([
    'Clean MVVM Architecture with modern components',
    'Offline-first caching & fast local storage',
    'Biometric fingerprint / Face ID app authentication',
    '100% responsive dark mode ready UI'
  ]);
  const [featureInput, setFeatureInput] = useState('');

  // Quick Price Edit Modal
  const [editingPriceProduct, setEditingPriceProduct] = useState<Product | null>(null);
  const [editPriceValue, setEditPriceValue] = useState('');

  // Developer Management Filter & Search
  const [devSearchQuery, setDevSearchQuery] = useState('');
  const [devFilterTab, setDevFilterTab] = useState<'ALL' | 'DEVELOPERS' | 'PENDING' | 'REGULAR'>('ALL');

  // Maintenance Settings State
  const [maintTitle, setMaintTitle] = useState(maintenanceMode.title);
  const [maintMessage, setMaintMessage] = useState(maintenanceMode.message);
  const [maintEndTime, setMaintEndTime] = useState(maintenanceMode.estimatedEndTime || '~30 to 45 mins');

  // Broadcast Notification Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastScreen, setBroadcastScreen] = useState('home');

  // Ticket Reply State
  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({});

  // Quote Editing State for Project Briefs
  const [quoteInputs, setQuoteInputs] = useState<Record<string, { price: string; days: string }>>({});

  // ==========================================
  // SECURITY GUARD CHECK
  // STRICTLY RESERVED FOR PHONE NUMBER: 9266428368
  // ==========================================
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-red-950/60 border-2 border-red-500/50 flex items-center justify-center mx-auto text-red-400 mb-4 shadow-xl shadow-red-950/40">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-white">Access Denied · Admin Only</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
          This control panel is strictly restricted. Only the authorized BigVora Super Admin account registered with mobile number <strong className="text-white font-mono">9266428368</strong> has permission to view and manage this portal.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTap();
              navigateTo('home');
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Return to Store
          </button>
          <button
            onClick={() => {
              sound.playTap();
              navigateTo('login');
            }}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-colors"
          >
            Login with Admin Number
          </button>
        </div>
      </div>
    );
  }

  // Financial & Inventory KPI Calculations
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingCashOrders = orders.filter(
    o => o.verificationStatus === 'UNDER_24H_REVIEW' || o.paymentStatus === 'PENDING'
  );

  const openTickets = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS');

  // Handle Adding Screenshot (Max 10)
  const handleAddScreenshot = () => {
    if (!screenshotInput.trim()) return;
    if (newProdScreenshots.length >= 10) {
      showToast('Maximum 10 screenshots allowed per product!', 'warning');
      return;
    }
    setNewProdScreenshots(prev => [...prev, screenshotInput.trim()]);
    setScreenshotInput('');
    sound.playTap();
  };

  const handleRemoveScreenshot = (idx: number) => {
    setNewProdScreenshots(prev => prev.filter((_, i) => i !== idx));
    sound.playTap();
  };

  const handleLoadStockScreenshots = () => {
    const stockImages = [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    ];
    setNewProdScreenshots(stockImages);
    showToast('Loaded 5 high-resolution demo screenshots', 'info');
    sound.playTap();
  };

  // Handle Features Builder
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setNewProdFeatures(prev => [...prev, featureInput.trim()]);
    setFeatureInput('');
    sound.playTap();
  };

  const handleRemoveFeature = (idx: number) => {
    setNewProdFeatures(prev => prev.filter((_, i) => i !== idx));
    sound.playTap();
  };

  // Handle Full Product Creation
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle.trim()) {
      showToast('Product title is required', 'error');
      return;
    }

    const priceNum = parseFloat(newProdPrice) || 99;
    const origPriceNum = parseFloat(newProdOriginalPrice) || (priceNum * 1.5);
    const stockNum = parseInt(newProdStock) || 10;

    const newProduct: any = {
      title: newProdTitle.trim(),
      tagline: newProdTagline.trim() || `${newProdType} by BigVora`,
      description: newProdDescription.trim() || `Production-grade ${newProdType} built with ${newProdTechStack}. Clean source code with documentation and deployment guide.`,
      type: newProdType,
      platform: newProdPlatform,
      category: newProdCategory,
      version: newProdVersion.trim() || 'v1.0.0',
      price: priceNum,
      originalPrice: origPriceNum,
      currency: 'USD',
      status: 'AVAILABLE',
      licenseModel: newProdLicense,
      totalStock: stockNum,
      availableStock: stockNum,
      reservedStock: 0,
      media: {
        thumbnail: newProdThumbnail.trim() || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80',
        logo: newProdThumbnail.trim(),
        screenshots: newProdScreenshots.length > 0 ? newProdScreenshots : [newProdThumbnail.trim()],
        demoVideoUrl: newProdVideoUrl.trim() || undefined,
        liveDemoUrl: newProdType === 'WEBSITE' ? newProdDemoUrl.trim() : undefined,
      },
      deliveryContents: newProdType === 'APP' 
        ? ['APK_AND_SOURCE_CODE', 'FULL_SOURCE_CODE', 'DEPLOYMENT_SUPPORT']
        : ['WEBSITE_FILES', 'FULL_SOURCE_CODE', 'DATABASE_AND_BACKEND', 'DEPLOYMENT_SUPPORT'],
      features: newProdFeatures.length > 0 ? newProdFeatures : ['Modern responsive design', 'Full source code included'],
      techStack: newProdTechStack.split(',').map(s => s.trim()).filter(Boolean),
      fileSize: newProdFileSize.trim() || '45 MB',
      format: newProdFormat.trim() || (newProdType === 'APP' ? 'ZIP (Android Studio Project + APK)' : 'ZIP (Next.js Source Code)'),
      includedServices: ['Complete source code', 'Free bug updates for 6 months', 'Setup documentation'],
      requirements: [newProdType === 'APP' ? 'Android Studio Hedgehog+ (SDK 24+)' : 'Node.js 18+ and npm/yarn'],
      documentationSummary: 'Comprehensive step-by-step README with architecture diagrams and deployment instructions.',
    };

    sound.playCash();
    const ok = await addProduct(newProduct);
    if (ok) {
      confetti({ particleCount: 80, spread: 80 });
      setIsAddProductOpen(false);
      // Reset form
      setNewProdTitle('');
      setNewProdTagline('');
      setNewProdDescription('');
      setNewProdPrice('149');
    }
  };

  // Handle Quick Price Update
  const handleSavePriceEdit = async () => {
    if (!editingPriceProduct) return;
    const newPrice = parseFloat(editPriceValue);
    if (isNaN(newPrice) || newPrice <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }
    sound.playCash();
    await updateProduct(editingPriceProduct.id, { price: newPrice });
    setEditingPriceProduct(null);
  };

  // Handle Broadcast Submission
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    sound.playNotification();
    broadcastNotification({
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      actionScreen: broadcastScreen,
      type: 'ORDER'
    });
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  // Handle Ticket Reply
  const handleSendTicketReply = async (ticketId: string) => {
    const text = ticketReplies[ticketId];
    if (!text || !text.trim()) return;
    sound.playTap();
    await replyTicketAsAdmin(ticketId, text.trim());
    setTicketReplies(prev => ({ ...prev, [ticketId]: '' }));
  };

  // Handle Project Brief Status / Quote Update
  const handleSaveBriefQuote = (reqId: string) => {
    const quote = quoteInputs[reqId];
    if (!quote) return;
    sound.playCash();
    const price = parseFloat(quote.price);
    updateProjectRequest(reqId, {
      quotedPrice: !isNaN(price) ? price : undefined,
      status: 'QUOTE_READY',
      expectedDeadline: quote.days ? `${quote.days} Days` : undefined
    });
    showToast(`Official quote for ${reqId} saved & sent to client!`, 'success');
  };

  // Filtered Users List
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(devSearchQuery.toLowerCase()) ||
      u.phone.includes(devSearchQuery) ||
      u.email.toLowerCase().includes(devSearchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (devFilterTab === 'DEVELOPERS') return u.isVerifiedDeveloper;
    if (devFilterTab === 'PENDING') return u.developerStatus === 'PENDING';
    if (devFilterTab === 'REGULAR') return !u.isVerifiedDeveloper && u.developerStatus !== 'PENDING';
    return true;
  });

  return (
    <div className="space-y-6 pb-28 animate-in fade-in">
      
      {/* Top Super Admin Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#130E26] to-slate-900 border-2 border-amber-500/50 shadow-2xl shadow-amber-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">BigVora Store Master Control</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold uppercase tracking-wider">
                Founder Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Logged in: <strong className="text-amber-400 font-bold">+91 9266428368</strong> · Full Store Access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              sound.playTap();
              navigateTo('home');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setIsAddProductOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-950/50 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add App / Website</span>
          </button>
        </div>
      </div>

      {/* Main Admin Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1.5 bg-[#090D1A] border border-slate-800 rounded-2xl scrollbar-none">
        {[
          { id: 'OVERVIEW', label: 'Overview', icon: Zap, badge: pendingCashOrders.length ? `${pendingCashOrders.length} alert` : undefined },
          { id: 'PRODUCTS', label: 'Store Catalog', icon: ShoppingBag, count: products.length },
          { id: 'DEVELOPERS', label: 'Developers & Users', icon: Users, count: totalUsersCount, badge: totalPendingDevelopersCount > 0 ? `${totalPendingDevelopersCount} pending` : undefined },
          { id: 'MAINTENANCE', label: 'Maintenance Mode', icon: Wrench, badge: maintenanceMode.enabled ? 'ACTIVE' : undefined },
          { id: 'BRIEFS', label: 'Client Briefs', icon: FileText, count: requests.length },
          { id: 'ORDERS', label: 'Orders & Cash', icon: PackageCheck, count: orders.length, badge: pendingCashOrders.length > 0 ? `${pendingCashOrders.length} cash` : undefined },
          { id: 'TICKETS', label: 'Support Desk', icon: Headphones, count: openTickets.length },
          { id: 'BROADCAST', label: 'Broadcast', icon: Radio },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playTabSwitch();
                setActiveTab(tab.id as AdminTab);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-black/30 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold animate-pulse ${
                  tab.id === 'MAINTENANCE' ? 'bg-amber-500 text-black' : 'bg-red-600 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* TAB 1: OVERVIEW & FINANCIAL DASHBOARD                */}
      {/* ==================================================== */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          
          {/* Urgent Cash Review Banner */}
          {pendingCashOrders.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/60 border-2 border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 animate-pulse" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {pendingCashOrders.length} Cash Payment Order(s) Awaiting 24h Verification!
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Customers placed manual cash orders. 1-click verify to unlock authenticated 48-hr download links.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playTap();
                  setActiveTab('ORDERS');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow shrink-0 active:scale-95 transition-all"
              >
                Review & Unlock
              </button>
            </div>
          )}

          {/* Maintenance Status Widget */}
          {maintenanceMode.enabled && (
            <div className="p-4 rounded-2xl bg-orange-950/60 border border-orange-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-orange-400 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-white">Maintenance Mode is Active</h4>
                  <p className="text-[11px] text-slate-300">Public store browsing is blocked. Only you can navigate.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('MAINTENANCE')}
                className="px-3 py-1 bg-orange-500 text-black text-xs font-bold rounded-lg"
              >
                Manage
              </button>
            </div>
          )}

          {/* Core Analytics KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-1 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Gross Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                ${totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                ≈ ₹{(totalRevenue * 86.5).toLocaleString()} INR
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-1 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Digital Orders</span>
                <PackageCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {orders.length}
              </div>
              <div className="text-[11px] text-slate-500">
                {orders.filter(o => o.paymentStatus === 'PAID').length} Paid & Delivered
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-1 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Verified Developers</span>
                <UserCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {totalDevelopersCount} <span className="text-xs font-normal text-slate-400">/ {totalUsersCount} users</span>
              </div>
              <div className="text-[11px] text-amber-400 font-semibold">
                {totalPendingDevelopersCount} pending approvals
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-1 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Support Tickets</span>
                <Headphones className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {openTickets.length}
              </div>
              <div className="text-[11px] text-slate-500">
                {tickets.length} Total Raised
              </div>
            </div>
          </div>

          {/* Quick Access Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <button
              onClick={() => {
                sound.playTap();
                setIsAddProductOpen(true);
              }}
              className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-[#0A0D18] border border-purple-500/30 text-left hover:border-purple-500/60 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Add App or Website</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Publish a new Kotlin Android app or Next.js website with demo video, up to 10 photos, and features.
              </p>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('DEVELOPERS');
              }}
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-[#0A0D18] border border-blue-500/30 text-left hover:border-blue-500/60 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Developer Accounts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verify developer badges, grant app upload permissions, and manage all {totalUsersCount} registered users.
              </p>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('MAINTENANCE');
              }}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-[#0A0D18] border border-amber-500/30 text-left hover:border-amber-500/60 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Maintenance Mode Switch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Status: {maintenanceMode.enabled ? '⚠️ LOCKED' : '✅ LIVE'}. Toggle instant platform lockdown with custom return notice.
              </p>
            </button>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: STORE CATALOG & PRODUCTS MANAGEMENT          */}
      {/* ==================================================== */}
      {activeTab === 'PRODUCTS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>Store Catalog & Products ({products.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage Android apps & Next.js websites. Set price, toggle Sold Out, delete or add rich media.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setIsAddProductOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 self-start sm:self-auto active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add App / Website</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {products.map(prod => {
              const isSoldOut = prod.status === 'SOLD_OUT';
              const screenshotCount = prod.media.screenshots?.length || 1;
              const hasVideo = !!prod.media.demoVideoUrl;

              return (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={prod.media.thumbnail}
                          alt={prod.title}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        {hasVideo && (
                          <div className="absolute -bottom-1 -right-1 bg-red-600 text-white p-0.5 rounded-md text-[9px]" title="Has Demo Video">
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white leading-tight">{prod.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {prod.platform} · {prod.category}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                            📸 {screenshotCount} photos
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm font-black text-white font-mono">
                          ${prod.price}
                        </span>
                        <button
                          onClick={() => {
                            setEditingPriceProduct(prod);
                            setEditPriceValue(prod.price.toString());
                          }}
                          className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                          title="Edit Custom Price"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        isSoldOut ? 'bg-red-950 text-red-300 border border-red-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {prod.status}
                      </span>
                    </div>
                  </div>

                  {/* Tech stack & features preview */}
                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                    {prod.techStack?.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {t}
                      </span>
                    ))}
                    {prod.techStack && prod.techStack.length > 3 && (
                      <span className="px-1.5 py-0.5 text-slate-500">+{prod.techStack.length - 3}</span>
                    )}
                  </div>

                  {/* Inline Admin Controls */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs gap-2">
                    {/* Toggle Sold Out Lock */}
                    <button
                      onClick={() => {
                        sound.playTap();
                        updateProduct(prod.id, {
                          status: isSoldOut ? 'AVAILABLE' : 'SOLD_OUT',
                          availableStock: isSoldOut ? 5 : 0
                        });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isSoldOut
                          ? 'bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300'
                          : 'bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300'
                      }`}
                    >
                      {isSoldOut ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{isSoldOut ? 'Re-open Stock' : 'Mark SOLD OUT'}</span>
                    </button>

                    {/* Price Quick Steppers */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          sound.playTap();
                          updateProduct(prod.id, { price: Math.max(10, prod.price - 20) });
                        }}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono hover:bg-slate-800"
                        title="Reduce price by $20"
                      >
                        -$20
                      </button>
                      <button
                        onClick={() => {
                          sound.playTap();
                          updateProduct(prod.id, { price: prod.price + 20 });
                        }}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono hover:bg-slate-800"
                        title="Increase price by $20"
                      >
                        +$20
                      </button>
                    </div>

                    {/* Delete Product */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${prod.title}" from store catalog permanently?`)) {
                          sound.playTap();
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: DEVELOPERS & USER MANAGEMENT                 */}
      {/* ==================================================== */}
      {activeTab === 'DEVELOPERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Developer Access & User Permissions ({totalUsersCount})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Verify developer badges, grant app upload permissions, and manage user seller tiers.
              </p>
            </div>

            {/* Quick Counters */}
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono">
                🎖️ {totalDevelopersCount} Verified Devs
              </span>
              <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 font-mono">
                ⏳ {totalPendingDevelopersCount} Pending
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-[#090D1A] border border-slate-800 rounded-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user by name, phone (+91...), or email..."
                value={devSearchQuery}
                onChange={e => setDevSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'ALL', label: 'All Users' },
                { id: 'DEVELOPERS', label: 'Developers Only' },
                { id: 'PENDING', label: 'Pending Review' },
                { id: 'REGULAR', label: 'Regular Customers' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setDevFilterTab(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    devFilterTab === f.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Users List Grid */}
          <div className="space-y-3">
            {filteredUsers.map(u => {
              const isDev = !!u.isVerifiedDeveloper;
              const canUpload = !!u.canUploadApps;

              return (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{u.name}</h4>
                          {u.role === 'ADMIN' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-black uppercase">
                              Admin
                            </span>
                          )}
                          {isDev && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Verified Dev</span>
                            </span>
                          )}
                          {u.developerStatus === 'PENDING' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 font-semibold animate-pulse">
                              Pending Approval
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{u.phone}</span>
                          <span>•</span>
                          <span>{u.email}</span>
                          {u.developerTier && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400 font-bold">Tier: {u.developerTier}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Direct Contact Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <a
                        href={`https://wa.me/${u.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${u.name}, this is BigVora Founder regarding your developer account on BigVora Store.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${u.phone}`}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                        title="Call User"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {u.developerBio && (
                    <p className="text-xs text-slate-300 bg-[#05070D] p-2.5 rounded-xl border border-slate-800/80 italic">
                      "{u.developerBio}"
                    </p>
                  )}

                  {/* Toggle Controls */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      {/* Toggle 1: Verify Developer Account */}
                      <button
                        onClick={() => {
                          updateUserDeveloperStatus(u.id, !isDev, canUpload);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors ${
                          isDev
                            ? 'bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{isDev ? 'Developer Verified ✓' : 'Approve as Developer'}</span>
                      </button>

                      {/* Toggle 2: Grant App Upload Permission */}
                      <button
                        onClick={() => {
                          updateUserDeveloperStatus(u.id, isDev, !canUpload);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors ${
                          canUpload
                            ? 'bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300'
                            : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{canUpload ? 'Upload Permission: GRANTED' : 'Allow App Uploads'}</span>
                      </button>
                    </div>

                    {/* Developer Tier Selector */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Tier:</span>
                      {(['JUNIOR', 'PRO', 'ELITE'] as const).map(tier => (
                        <button
                          key={tier}
                          onClick={() => updateUserDeveloperStatus(u.id, isDev, canUpload, tier)}
                          className={`px-2 py-0.5 rounded font-mono ${
                            u.developerTier === tier
                              ? 'bg-amber-500 text-black font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: STORE MAINTENANCE MODE CONTROLS               */}
      {/* ==================================================== */}
      {activeTab === 'MAINTENANCE' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-[#090D1A] border-2 border-amber-500/40 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Wrench className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Store Maintenance Mode</h2>
                <p className="text-xs text-slate-400">
                  Instantly block public visitors with a sleek animated maintenance shield.
                </p>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
              maintenanceMode.enabled
                ? 'bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
            }`}>
              {maintenanceMode.enabled ? '● MAINTENANCE ACTIVE' : '● STORE LIVE'}
            </div>
          </div>

          {/* Master Toggle Button */}
          <div className="p-4 rounded-2xl bg-[#05070D] border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">
                {maintenanceMode.enabled ? 'Turn OFF Maintenance (Reopen Store)' : 'Turn ON Maintenance (Lock Store)'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {maintenanceMode.enabled 
                  ? 'All customers can browse, cart, and purchase immediately.' 
                  : 'Visitors will see the upgrade screen. You (+91 9266428368) bypass automatically.'}
              </p>
            </div>

            <button
              onClick={() => toggleMaintenanceMode(!maintenanceMode.enabled, maintMessage, maintEndTime)}
              className={`px-5 py-3 rounded-xl font-black text-xs shadow-lg active:scale-95 transition-all flex items-center gap-2 ${
                maintenanceMode.enabled
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400'
              }`}
            >
              {maintenanceMode.enabled ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{maintenanceMode.enabled ? 'Deactivate & Open Store' : 'Activate Maintenance Now'}</span>
            </button>
          </div>

          {/* Maintenance Message Configuration */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Heading *</label>
              <input
                type="text"
                value={maintTitle}
                onChange={e => setMaintTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Explanation to Customers *</label>
              <textarea
                rows={3}
                value={maintMessage}
                onChange={e => setMaintMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Reopening Time</label>
              <input
                type="text"
                value={maintEndTime}
                onChange={e => setMaintEndTime(e.target.value)}
                placeholder="e.g. Back online in ~30 minutes"
                className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => {
                toggleMaintenanceMode(maintenanceMode.enabled, maintMessage, maintEndTime);
                showToast('Maintenance settings saved successfully!', 'success');
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Notice Content</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: CLIENT BRIEFS (CUSTOM APPS & WEBSITES)        */}
      {/* ==================================================== */}
      {activeTab === 'BRIEFS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Custom Client Project Briefs ({requests.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Incoming briefs from "Build My App" & "Build My Website" with client self-budget & direct actions.
              </p>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-[#090D1A] border border-slate-800">
              <p className="text-xs text-slate-400">No custom briefs submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(req => {
                const phoneDigits = req.contactValue?.replace(/\D/g, '') || '';
                const currentQuote = quoteInputs[req.id] || {
                  price: req.quotedPrice ? req.quotedPrice.toString() : '',
                  days: req.expectedDeadline ? req.expectedDeadline.replace(/\D/g, '') : '14'
                };

                return (
                  <div
                    key={req.id}
                    className="p-5 rounded-3xl bg-[#090D1A] border border-slate-800 space-y-4 shadow-xl"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                            req.type === 'CUSTOM_APP' 
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/30' 
                              : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                          }`}>
                            {req.type === 'CUSTOM_APP' ? '📱 Custom App Brief' : '🌐 Custom Website Brief'}
                          </span>
                          <span className="text-xs font-mono text-slate-400">#{req.requestId}</span>
                        </div>
                        <h3 className="text-base font-extrabold text-white mt-1">{req.projectName}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Category: {req.category}</p>
                      </div>

                      {/* Direct Communication Buttons */}
                      <div className="flex items-center gap-2">
                        {phoneDigits && (
                          <a
                            href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hello! BigVora Solutions Architect here regarding your ${req.type === 'CUSTOM_APP' ? 'Mobile App' : 'Website'} brief "${req.projectName}". We reviewed your specifications and would love to discuss your launch timeline!`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Client</span>
                          </a>
                        )}

                        {phoneDigits && (
                          <a
                            href={`tel:${phoneDigits}`}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                            title="Direct Phone Call"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Remove brief #${req.requestId}?`)) {
                              deleteProjectRequest(req.id);
                            }
                          }}
                          className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                          title="Delete Brief"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Client Self-Determined Budget & Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#05070D] p-3.5 rounded-2xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Client Self-Set Budget:</span>
                        <span className="text-sm font-extrabold text-amber-400 font-mono">
                          {req.customBudget ? `$${req.customBudget.toLocaleString()} USD` : req.budgetRange}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">Contact Detail:</span>
                        <span className="text-white font-mono font-medium">{req.contactValue} ({req.contactMethod})</span>
                      </div>

                      {req.targetPlatforms && req.targetPlatforms.length > 0 && (
                        <div>
                          <span className="text-slate-400 block mb-0.5">Target Platforms:</span>
                          <span className="text-slate-200">{req.targetPlatforms.join(', ')}</span>
                        </div>
                      )}

                      {req.requiredPages && req.requiredPages.length > 0 && (
                        <div>
                          <span className="text-slate-400 block mb-0.5">Required Pages:</span>
                          <span className="text-slate-200">{req.requiredPages.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Features Typed By Client */}
                    {req.features && req.features.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-400">Features Typed by Client:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {req.features.map((f, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs">
                              • {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {req.description && (
                      <p className="text-xs text-slate-300 leading-relaxed bg-[#05070D] p-3 rounded-xl border border-slate-800/60">
                        "{req.description}"
                      </p>
                    )}

                    {/* Official Milestone Quote & Status Setter */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Status:</span>
                        <select
                          value={req.status}
                          onChange={e => updateProjectRequest(req.id, { status: e.target.value as RequestStatus })}
                          className="px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-amber-300 font-bold"
                        >
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                          <option value="QUOTE_READY">QUOTE_READY</option>
                          <option value="AWAITING_PAYMENT">AWAITING_PAYMENT</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Quote $ USD"
                          value={currentQuote.price}
                          onChange={e => setQuoteInputs(prev => ({
                            ...prev,
                            [req.id]: { ...currentQuote, price: e.target.value }
                          }))}
                          className="w-28 px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white font-mono"
                        />
                        <input
                          type="number"
                          placeholder="Days"
                          value={currentQuote.days}
                          onChange={e => setQuoteInputs(prev => ({
                            ...prev,
                            [req.id]: { ...currentQuote, days: e.target.value }
                          }))}
                          className="w-20 px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white font-mono"
                        />
                        <button
                          onClick={() => handleSaveBriefQuote(req.id)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow active:scale-95 transition-all"
                        >
                          Send Quote
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: DIGITAL ORDERS & CASH PAYMENTS               */}
      {/* ==================================================== */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-400" />
                <span>Digital Purchases & Cash Verifications ({orders.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                1-click approve pending cash orders to issue download tokens immediately.
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-[#090D1A] border border-slate-800">
              <p className="text-xs text-slate-400">No customer orders recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {orders.map(order => {
                const isUnderReview = order.verificationStatus === 'UNDER_24H_REVIEW' || order.paymentStatus === 'PENDING';

                return (
                  <div
                    key={order.id}
                    className={`p-4 sm:p-5 rounded-3xl bg-[#090D1A] border space-y-3 shadow-lg ${
                      isUnderReview ? 'border-amber-500/50 bg-amber-950/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white">#{order.orderNumber}</span>
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Customer: <strong className="text-white">{order.customerName}</strong> ({order.customerPhone})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-white font-mono block">
                          ${order.total} USD
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Method: {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#05070D]">
                          <div className="flex items-center gap-2.5">
                            <img src={item.thumbnail} alt={item.productTitle} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <span className="font-bold text-white block">{item.productTitle}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{item.licenseModel}</span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-slate-300">${item.price}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cash 1-Click Verification Trigger */}
                    {isUnderReview ? (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                        <div className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 animate-pulse" />
                          <span>Cash Order · Unapproved</span>
                        </div>
                        <button
                          onClick={async () => {
                            sound.playCash();
                            const ok = await approveCashPayment(order.id);
                            if (ok) confetti({ particleCount: 70, spread: 70 });
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify & Unlock Downloads Now</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-mono text-[11px]">
                          ✓ Downloads Unlocked & Active
                        </span>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'REFUNDED', 'REFUNDED')}
                          className="text-slate-500 hover:text-red-400 text-[11px] transition-colors"
                        >
                          Mark Refunded
                        </button>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 7: SUPPORT HELPDESK TICKETS                     */}
      {/* ==================================================== */}
      {activeTab === 'TICKETS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Headphones className="w-5 h-5 text-purple-400" />
                <span>Customer Support Tickets ({tickets.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Reply directly to client technical tickets as BigVora Founder / Senior Engineer.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="p-5 rounded-3xl bg-[#090D1A] border border-slate-800 space-y-4 shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                      #{ticket.ticketNumber}
                    </span>
                    <span className="text-xs font-bold text-white">{ticket.subject}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                      {ticket.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                      ticket.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}>
                      {ticket.status}
                    </span>

                    <button
                      onClick={() => updateTicketStatus(ticket.id, ticket.status === 'RESOLVED' ? 'IN_PROGRESS' : 'RESOLVED')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                    >
                      {ticket.status === 'RESOLVED' ? 'Re-open' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>

                {/* Messages Timeline */}
                <div className="space-y-2 max-h-60 overflow-y-auto p-3 rounded-2xl bg-[#05070D] border border-slate-800/80">
                  {ticket.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        msg.sender === 'CUSTOMER'
                          ? 'bg-slate-900 border border-slate-800 text-slate-200'
                          : 'bg-purple-950/60 border border-purple-500/30 text-purple-200 ml-4'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{msg.senderName} ({msg.senderRole || msg.sender})</span>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Admin Reply Box */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type official founder / technical engineer reply..."
                    value={ticketReplies[ticket.id] || ''}
                    onChange={e => setTicketReplies(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleSendTicketReply(ticket.id)}
                    className="flex-1 px-3.5 py-2 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => handleSendTicketReply(ticket.id)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow active:scale-95 transition-all"
                  >
                    Reply
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 8: BROADCAST NOTIFICATION FORM                  */}
      {/* ==================================================== */}
      {activeTab === 'BROADCAST' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#090D1A] border border-slate-800 space-y-5 shadow-2xl">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400" />
              <span>Broadcast Store Announcement</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Push a real-time notification to all client accounts. Appears in their top bell icon.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Notification Title *</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                placeholder="e.g. ⚡ Flash Sale: 30% Off on Kotlin Jetpack Compose Apps"
                className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-white text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message Body *</label>
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Use coupon code BIGVORA20 at checkout for an instant 20% discount on complete source code packages..."
                className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-white text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Radio className="w-4 h-4" />
              <span>Send Broadcast to All Users</span>
            </button>
          </form>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 1: ADD NEW APP / WEBSITE (SUPER MEDIA RICH)    */}
      {/* Supports: App Video, 10 Photos, Features, Specs      */}
      {/* ==================================================== */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#090D1A] border-2 border-purple-500/50 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Publish New {newProdType === 'APP' ? 'Android App' : 'Website'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Upload video preview, 10 photos, features & code details</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateProduct} className="space-y-4 overflow-y-auto pr-1 flex-1">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#05070D] rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setNewProdType('APP');
                    setNewProdPlatform('ANDROID');
                    setNewProdFormat('ZIP (Android Studio Project + APK)');
                  }}
                  className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    newProdType === 'APP'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Android App</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewProdType('WEBSITE');
                    setNewProdPlatform('WEB');
                    setNewProdFormat('ZIP (Next.js Source Code + SQL)');
                  }}
                  className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    newProdType === 'WEBSITE'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Website / SaaS</span>
                </button>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {newProdType === 'APP' ? 'App Name / Title *' : 'Website Name / Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdTitle}
                    onChange={e => setNewProdTitle(e.target.value)}
                    placeholder={newProdType === 'APP' ? 'e.g. QuickPay - Multi-Currency Wallet App' : 'e.g. CloudSaaS - Modern AI Analytics Dashboard'}
                    className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Short Tagline *</label>
                  <input
                    type="text"
                    required
                    value={newProdTagline}
                    onChange={e => setNewProdTagline(e.target.value)}
                    placeholder="Kotlin Jetpack Compose Android Client + Supabase Backend"
                    className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                  <textarea
                    rows={2}
                    value={newProdDescription}
                    onChange={e => setNewProdDescription(e.target.value)}
                    placeholder="Describe key features, architectural design, included source code files..."
                    className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* SECTION: MEDIA SUITE (YouTube Video & Phone Gallery 10 Photos) */}
              <div className="p-4 rounded-2xl bg-[#05070D] border border-slate-800 space-y-4">
                
                {/* Hidden File Pickers for Native Gallery Access */}
                <input 
                  type="file" 
                  ref={galleryInputRef} 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleGalleryUpload} 
                />
                <input 
                  type="file" 
                  ref={thumbnailInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleThumbnailUpload} 
                />

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-purple-400" />
                    <span>Media Suite: YouTube Video & Gallery Photos</span>
                  </h4>
                  <span className="text-[11px] font-mono text-purple-300 font-bold bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-lg">
                    {newProdScreenshots.length} / 10 Photos
                  </span>
                </div>

                {/* 1. App / Website Demo Video (Supports YouTube Watch, Shorts & MP4) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      <span>{newProdType === 'APP' ? 'App Demo Video (YouTube Link or MP4)' : 'Website Demo Video (YouTube Link or MP4)'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setNewProdVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                        showToast('Sample YouTube link added', 'info');
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300 font-semibold"
                    >
                      + Sample YouTube Link
                    </button>
                  </div>

                  <input
                    type="url"
                    value={newProdVideoUrl}
                    onChange={e => setNewProdVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or MP4 link"
                    className="w-full px-3.5 py-2.5 bg-[#090D1A] border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500 shadow-inner"
                  />

                  {/* Instant Live Video Preview Box */}
                  {newProdVideoUrl && (
                    <div className="p-2.5 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{isYouTubeUrl(newProdVideoUrl) ? 'YouTube Video Embed Active' : 'MP4 Direct Video Active'}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">Live preview below:</span>
                      </div>
                      <VideoEmbedPlayer url={newProdVideoUrl} className="max-h-48" />
                    </div>
                  )}
                </div>

                {/* 2. Photo Gallery Upload (From Phone Gallery & Web URLs) */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block">
                        Product Screenshots & Photos (Up to 10 Photos)
                      </label>
                      <p className="text-[10px] text-slate-500">Upload directly from phone gallery or paste image URLs</p>
                    </div>

                    {/* Gallery Upload Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={newProdScreenshots.length >= 10}
                        className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose from Gallery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1 transition-colors"
                        title="Set main thumbnail/icon from gallery"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                        <span>Thumbnail</span>
                      </button>
                    </div>
                  </div>

                  {/* URL Input Fallback + Stock Loader */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)..."
                      value={screenshotInput}
                      onChange={e => setScreenshotInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddScreenshot())}
                      className="flex-1 px-3 py-2 bg-[#090D1A] border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddScreenshot}
                      disabled={newProdScreenshots.length >= 10}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl"
                    >
                      Add URL
                    </button>
                    <button
                      type="button"
                      onClick={handleLoadStockScreenshots}
                      className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-xl"
                      title="Load sample images"
                    >
                      Stock Photos
                    </button>
                  </div>

                  {/* 10 Photos Visual Grid Preview with Delete Button */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {newProdScreenshots.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-700 bg-slate-900 shadow-md">
                        <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-black/80 text-[9px] px-1 rounded text-white font-mono font-bold">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-red-600/90 hover:bg-red-500 text-white shadow transition-all"
                          title="Remove Photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Main Thumbnail Preview */}
                  {newProdThumbnail && (
                    <div className="p-2.5 rounded-xl bg-[#090D1A] border border-slate-800 flex items-center gap-3">
                      <img src={newProdThumbnail} alt="Thumbnail Preview" className="w-10 h-10 rounded-lg object-cover border border-purple-500/40" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-purple-400 font-bold block uppercase tracking-wider">Main Storefront Thumbnail</span>
                        <p className="text-[11px] text-slate-400 truncate font-mono">{newProdThumbnail.slice(0, 50)}...</p>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* SECTION: FEATURES BUILDER */}
              <div className="p-4 rounded-2xl bg-[#05070D] border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Bullet Features Builder ({newProdFeatures.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Type feature & press Enter</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Real-time Firebase push notifications with custom sound..."
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    className="flex-1 px-3 py-2 bg-[#090D1A] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>

                {/* Features Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {newProdFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5"
                    >
                      <span>• {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-500 hover:text-red-400 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & License Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={e => setNewProdOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Fintech & Payments">Fintech & Payments</option>
                    <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    <option value="SaaS & Productivity">SaaS & Productivity</option>
                    <option value="Crypto & Web3">Crypto & Web3</option>
                    <option value="Social & Community">Social & Community</option>
                  </select>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={newProdTechStack}
                    onChange={e => setNewProdTechStack(e.target.value)}
                    placeholder="Kotlin, Compose, Room, Retrofit"
                    className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {newProdType === 'APP' ? 'Package Name / Version' : 'Live Website Demo URL'}
                  </label>
                  {newProdType === 'APP' ? (
                    <input
                      type="text"
                      value={newProdPackageName}
                      onChange={e => setNewProdPackageName(e.target.value)}
                      placeholder="com.bigvora.app"
                      className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white font-mono"
                    />
                  ) : (
                    <input
                      type="url"
                      value={newProdDemoUrl}
                      onChange={e => setNewProdDemoUrl(e.target.value)}
                      placeholder="https://preview.bigvora.com/saas"
                      className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-xl text-xs text-white font-mono"
                    />
                  )}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-950/50 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish to Storefront</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: QUICK PRICE EDIT MODAL                      */}
      {/* ==================================================== */}
      {editingPriceProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#090D1A] border-2 border-amber-500/50 rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Adjust Product Price</span>
              </h3>
              <button onClick={() => setEditingPriceProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-300 font-semibold mb-2">{editingPriceProduct.title}</p>
              <label className="block text-[11px] text-slate-400 mb-1">Set New Price ($ USD):</label>
              <input
                type="number"
                value={editPriceValue}
                onChange={e => setEditPriceValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700 rounded-xl text-sm font-mono text-white font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                ≈ ₹{((parseFloat(editPriceValue) || 0) * 86.5).toFixed(0)} INR
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingPriceProduct(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePriceEdit}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Price
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
