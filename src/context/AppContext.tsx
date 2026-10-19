import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, OrderStatus, ProjectRequest, Conversation, CartItem, UserProfile, StoreNotification, SupportTicket, TicketStatus, TicketMessage, TicketCategory, TicketPriority, StoreMaintenanceSettings } from '../types';
import { INITIAL_TICKETS, INITIAL_USERS, INITIAL_MAINTENANCE_SETTINGS } from '../data/initialData';
import { api } from '../services/api';
import { sound } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';

export type ScreenName = 
  | 'splash'
  | 'login'
  | 'welcome'
  | 'home'
  | 'explore'
  | 'apps'
  | 'websites'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'build-app'
  | 'build-website'
  | 'my-requests'
  | 'messages'
  | 'wishlist'
  | 'profile'
  | 'settings'
  | 'support'
  | 'store-info'
  | 'api-docs'
  | 'admin';

export const ADMIN_PHONE_RAW = '9266428368';
export const isUserAdmin = (user?: UserProfile | null): boolean => {
  if (!user || !user.phone) return false;
  const digits = user.phone.replace(/\D/g, '');
  return digits.endsWith(ADMIN_PHONE_RAW) || user.role === 'ADMIN';
};

export type DeviceMode = 'ANDROID_MOBILE' | 'TABLET' | 'RESPONSIVE_FULL';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextType {
  currentScreen: ScreenName;
  navigateTo: (screen: ScreenName, params?: { productId?: string; conversationId?: string; searchKeyword?: string }) => void;
  selectedProductId: string | null;
  selectedConversationId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;

  // Products & Inventory
  products: Product[];
  refreshProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: string, txId?: string, extraNotes?: string) => Promise<{ success: boolean; order?: Order; error?: string }>;
  approveCashPayment: (orderId: string) => Promise<boolean>;
  refreshOrders: () => Promise<void>;
  downloadPackage: (item: any, order?: Order) => Promise<void>;

  // Project Requests
  requests: ProjectRequest[];
  submitCustomRequest: (payload: any) => Promise<{ success: boolean; requestId?: string; error?: string }>;
  submitProjectRequest: (payload: any) => Promise<{ success: boolean; requestId?: string; error?: string }>;
  approveQuote: (requestId: string) => Promise<boolean>;
  refreshRequests: () => Promise<void>;

  // Messaging
  conversations: Conversation[];
  sendMessage: (convId: string, text: string, attachmentName?: string) => Promise<boolean>;
  refreshConversations: () => Promise<void>;
  openConversationWithSupport: (initialTopic?: string) => void;

  // Support Tickets System
  tickets: SupportTicket[];
  activeTicketId: string | null;
  setActiveTicketId: (id: string | null) => void;
  createTicket: (data: { subject: string; category: TicketCategory; priority: TicketPriority; orderId?: string; initialMessage: string; attachmentName?: string }) => Promise<SupportTicket>;
  sendTicketReply: (ticketId: string, text: string, attachmentName?: string) => Promise<boolean>;
  closeTicket: (ticketId: string) => void;
  reopenTicket: (ticketId: string) => void;
  openTicketForOrder: (orderId: string, orderTitle: string) => void;

  // User Auth
  user: UserProfile | null;
  loginWithOtp: (phone: string, otp: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  requestOtp: (phone: string) => Promise<{ success: boolean; devOtp?: string; error?: string }>;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Notifications
  notifications: StoreNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;

  // Quick Action
  buyNow: (product: Product) => void;

  // Admin & Store Owner Controls (Strictly for 9266428368)
  isAdmin: boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED') => Promise<boolean>;
  updateProjectRequest: (requestId: string, updates: Partial<ProjectRequest>) => Promise<boolean>;
  deleteProjectRequest: (requestId: string) => Promise<boolean>;
  addProduct: (product: any) => Promise<boolean>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  replyTicketAsAdmin: (ticketId: string, text: string) => Promise<boolean>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<boolean>;
  broadcastNotification: (notif: { title: string; message: string; actionScreen?: string; type?: any }) => void;

  // Maintenance Mode (Master Store Switch)
  maintenanceMode: StoreMaintenanceSettings;
  toggleMaintenanceMode: (enabled: boolean, message?: string, estimatedEndTime?: string) => Promise<boolean>;

  // User & Developer Access Control (Verify developers & grant upload rights)
  usersList: UserProfile[];
  updateUserDeveloperStatus: (userId: string, isVerifiedDeveloper: boolean, canUploadApps: boolean, developerTier?: 'JUNIOR' | 'PRO' | 'ELITE') => Promise<boolean>;
  totalUsersCount: number;
  totalDevelopersCount: number;
  totalPendingDevelopersCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('ANDROID_MOBILE');

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('bigvora_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('bigvora_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const stored = localStorage.getItem('bigvora_tickets');
      return stored ? JSON.parse(stored) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });
  const [activeTicketId, setActiveTicketId] = useState<string | null>(() => INITIAL_TICKETS[0]?.id || null);
  const [notifications, setNotifications] = useState<StoreNotification[]>(() => api.getNotifications());

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('bigvora_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u && isUserAdmin(u)) {
          u.role = 'ADMIN';
        }
        return u;
      }
      return null;
    } catch {
      return null;
    }
  });

  const isAdmin = isUserAdmin(user);

  const [maintenanceMode, setMaintenanceMode] = useState<StoreMaintenanceSettings>(() => {
    try {
      const stored = localStorage.getItem('bigvora_maintenance');
      return stored ? JSON.parse(stored) : INITIAL_MAINTENANCE_SETTINGS;
    } catch {
      return INITIAL_MAINTENANCE_SETTINGS;
    }
  });

  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem('bigvora_users_list');
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('bigvora_maintenance', JSON.stringify(maintenanceMode));
  }, [maintenanceMode]);

  useEffect(() => {
    localStorage.setItem('bigvora_users_list', JSON.stringify(usersList));
  }, [usersList]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Sync Products from server
  const refreshProducts = async () => {
    const prods = await api.getProducts();
    setProducts(prods);
  };

  const refreshOrders = async () => {
    const ords = await api.getOrders();
    setOrders(ords);
  };

  const refreshRequests = async () => {
    const reqs = await api.getProjectRequests();
    setRequests(reqs);
  };

  const refreshConversations = async () => {
    const convs = await api.getConversations();
    setConversations(convs);
  };

  useEffect(() => {
    refreshProducts();
    refreshOrders();
    refreshRequests();
    refreshConversations();
  }, []);

  // Save cart & wishlist changes
  useEffect(() => {
    localStorage.setItem('bigvora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bigvora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('bigvora_tickets', JSON.stringify(tickets));
    } catch (e) {}
  }, [tickets]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('bigvora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bigvora_user');
    }
  }, [user]);

  const navigateTo = (screen: ScreenName, params?: { productId?: string; conversationId?: string; searchKeyword?: string }) => {
    if (params?.productId) {
      setSelectedProductId(params.productId);
    }
    if (params?.conversationId) {
      setSelectedConversationId(params.conversationId);
    }
    if (params?.searchKeyword !== undefined) {
      setSearchQuery(params.searchKeyword);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.status === 'SOLD_OUT') {
      showToast(`"${product.title}" is SOLD OUT and cannot be added.`, 'error');
      return false;
    }

    // Check single license constraint
    if (product.licenseModel === 'SINGLE_LICENSE') {
      const existing = cart.find(c => c.product.id === product.id);
      if (existing) {
        showToast(`Single license item already in your cart.`, 'warning');
        return false;
      }
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = product.licenseModel === 'SINGLE_LICENSE' ? 1 : updated[existingIndex].quantity + quantity;
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, { product, quantity, addedAt: new Date().toISOString() }];
    });

    showToast(`Added "${product.title}" to Cart`, 'success');
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(c => c.product.id !== productId));
    showToast('Removed item from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(c => {
      if (c.product.id === productId) {
        if (c.product.licenseModel === 'SINGLE_LICENSE') {
          return { ...c, quantity: 1 };
        }
        return { ...c, quantity };
      }
      return c;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Quick Buy Now
  const buyNow = (product: Product) => {
    if (product.status === 'SOLD_OUT') {
      showToast(`Cannot checkout: "${product.title}" is SOLD OUT.`, 'error');
      return;
    }
    addToCart(product, 1);
    navigateTo('cart');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Place Order (With server-side inventory verification and download token generation)
  const placeOrder = async (paymentMethod: string, txId?: string, extraNotes?: string): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    // Double check stock availability
    for (const item of cart) {
      const p = getProductById(item.product.id);
      if (p && p.status === 'SOLD_OUT') {
        return { success: false, error: `Product "${p.title}" was just SOLD OUT by another buyer.` };
      }
    }

    const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const isCash = paymentMethod === 'CASH_MANUAL';

    const orderPayload = {
      idempotencyKey,
      items: cart.map(c => ({
        productId: c.product.id,
        productTitle: c.product.title,
        productType: c.product.type,
        thumbnail: c.product.media.thumbnail,
        logo: c.product.media.logo,
        price: c.product.price,
        licenseModel: c.product.licenseModel,
        deliveryContents: c.product.deliveryContents,
        fileSize: c.product.fileSize,
        format: c.product.format,
        quantity: c.quantity,
      })),
      paymentMethod,
      paymentTransactionId: txId || (isCash ? `CASH-REQ-${Date.now().toString().slice(-8)}` : `BV-TXN-${Date.now().toString().slice(-8)}`),
      customerName: user?.name || 'Customer',
      customerPhone: user?.phone || '',
      customerEmail: user?.email || '',
      manualReferenceNote: extraNotes,
    };

    const result = await api.createOrder(orderPayload);

    if (result.success && result.order) {
      clearCart();
      await refreshProducts(); // live update stock and SOLD_OUT states
      await refreshOrders();
      await refreshConversations();

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#7C3AED', '#6366F1', '#EC4899', '#38BDF8'],
        });
      } catch (e) {
        // Safe fallback
      }

      // Add push notification
      const newNotif: StoreNotification = {
        id: `notif-${Date.now()}`,
        title: isCash ? 'Cash Payment Order Registered' : 'Order Confirmed & Delivered',
        message: isCash
          ? `Order #${result.order.orderNumber} placed via Phone/Cash. Under 24-Hour verification window.`
          : `Order #${result.order.orderNumber} confirmed. Digital downloads and license files are available now.`,
        timestamp: 'Just now',
        type: isCash ? 'PAYMENT' : 'ORDER',
        read: false,
        referenceId: result.order.id,
        actionScreen: 'orders',
      };
      setNotifications(prev => [newNotif, ...prev]);
      api.saveNotifications([newNotif, ...notifications]);

      showToast(
        isCash 
          ? `Cash Order #${result.order.orderNumber} placed! 24-hr verification started.`
          : `Order #${result.order.orderNumber} confirmed! Files ready.`,
        'success'
      );
      return result;
    }

    return result;
  };

  const approveCashPayment = async (orderId: string): Promise<boolean> => {
    const result = await api.approveCashOrder(orderId);
    if (result.success && result.order) {
      await refreshOrders();
      await refreshConversations();
      showToast(`Order #${result.order.orderNumber} payment verified & approved! Source code download unlocked.`, 'success');
      return true;
    }
    return false;
  };

  // Custom Request Submission
  const submitCustomRequest = async (payload: any) => {
    const result = await api.submitProjectRequest(payload);
    if (result.success && result.request) {
      await refreshRequests();
      await refreshConversations();

      const newNotif: StoreNotification = {
        id: `notif-${Date.now()}`,
        title: 'Custom Brief Submitted',
        message: `Request ${result.requestId} is under review. Our engineering team will prepare your scope & quote.`,
        timestamp: 'Just now',
        type: 'REQUEST',
        read: false,
        referenceId: result.request.id,
        actionScreen: 'my-requests',
      };
      setNotifications(prev => [newNotif, ...prev]);
      api.saveNotifications([newNotif, ...notifications]);

      showToast(`Request ${result.requestId} registered successfully!`, 'success');
      return result;
    }
    return { success: false, error: result.error || 'Failed to submit' };
  };

  const approveQuote = async (requestId: string) => {
    const success = await api.approveProjectQuote(requestId);
    if (success) {
      await refreshRequests();
      showToast('Project quote and scope approved! Moving to payment milestone.', 'success');
      return true;
    }
    return false;
  };

  // Messaging
  const sendMessage = async (convId: string, text: string, attachmentName?: string) => {
    const ok = await api.sendMessage(convId, text, attachmentName);
    if (ok) {
      await refreshConversations();
      return true;
    }
    return false;
  };

  const openConversationWithSupport = (initialTopic?: string) => {
    setSelectedConversationId('conv-support');
    navigateTo('messages');
    if (initialTopic) {
      showToast(`Opened inquiry: ${initialTopic}`, 'info');
    }
  };

  // Support Tickets System
  const createTicket = async (data: {
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    orderId?: string;
    initialMessage: string;
    attachmentName?: string;
  }): Promise<SupportTicket> => {
    const ticketNum = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: ticketNum,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'OPEN',
      orderId: data.orderId,
      assignedAgent: 'Vikram Joshi (Senior Support Engineer)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCustomerCount: 0,
      messages: [
        {
          id: `tm-${Date.now()}`,
          sender: 'CUSTOMER',
          senderName: user?.name || 'Customer',
          text: data.initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachmentName: data.attachmentName
        },
        {
          id: `tm-${Date.now() + 1}`,
          sender: 'SYSTEM',
          senderName: 'BigVora Helpdesk Bot',
          text: `Ticket #${ticketNum} registered with Priority [${data.priority}]. A dedicated support engineer will respond shortly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    setActiveTicketId(newTicket.id);
    showToast(`Support Ticket #${ticketNum} created!`, 'success');
    return newTicket;
  };

  const sendTicketReply = async (ticketId: string, text: string, attachmentName?: string): Promise<boolean> => {
    const customerMsg: TicketMessage = {
      id: `tm-${Date.now()}`,
      sender: 'CUSTOMER',
      senderName: user?.name || 'Customer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentName
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          messages: [...t.messages, customerMsg]
        };
      }
      return t;
    }));

    setTimeout(() => {
      const agentReply: TicketMessage = {
        id: `tm-${Date.now() + 50}`,
        sender: 'SUPPORT_AGENT',
        senderName: 'Vikram Joshi',
        senderRole: 'Senior Support Engineer',
        text: 'Thank you for updating your ticket. Our technical team is reviewing this and verifying your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTickets(prev => prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: t.status === 'OPEN' ? 'IN_PROGRESS' : t.status,
            updatedAt: new Date().toISOString(),
            messages: [...t.messages, agentReply]
          };
        }
        return t;
      }));
    }, 1500);

    return true;
  };

  const closeTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'RESOLVED',
          updatedAt: new Date().toISOString(),
          messages: [
            ...t.messages,
            {
              id: `tm-${Date.now()}`,
              sender: 'SYSTEM',
              senderName: 'BigVora Helpdesk Bot',
              text: 'Ticket has been marked as RESOLVED.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    }));
    showToast('Ticket marked as resolved', 'info');
  };

  const reopenTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'IN_PROGRESS',
          updatedAt: new Date().toISOString(),
          messages: [
            ...t.messages,
            {
              id: `tm-${Date.now()}`,
              sender: 'SYSTEM',
              senderName: 'BigVora Helpdesk Bot',
              text: 'Ticket has been RE-OPENED by the client for further inspection.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    }));
    showToast('Ticket re-opened', 'info');
  };

  const openTicketForOrder = (orderId: string, orderTitle: string) => {
    createTicket({
      subject: `Support for Order #${orderId.slice(-6)} - ${orderTitle}`,
      category: 'ORDER_DELIVERY',
      priority: 'HIGH',
      orderId,
      initialMessage: `I need technical assistance regarding my order #${orderId} (${orderTitle}).`
    });
    navigateTo('messages');
  };

  // Auth
  const requestOtp = async (phone: string) => {
    return await api.sendOtp(phone);
  };

  const loginWithOtp = async (phone: string, otp: string, name?: string) => {
    const res = await api.verifyOtp(phone, otp, name);
    if (res.success && res.user) {
      if (isUserAdmin(res.user)) {
        res.user.role = 'ADMIN';
        res.user.name = name || 'BigVora Founder & Admin';
      }
      setUser(res.user);
      localStorage.setItem('bigvora_user', JSON.stringify(res.user));
      setIsAuthModalOpen(false);
      showToast(isUserAdmin(res.user) ? `👑 Welcome Super Admin (Founder)!` : `Welcome, ${res.user.name}!`, 'success');
      return { success: true };
    }
    return { success: false, error: res.error || 'Invalid OTP code' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bigvora_user');
    showToast('Signed out of BigVora Store', 'info');
  };

  // ==========================================
  // ADMIN & STORE OWNER METHODS (A TO Z CONTROL)
  // ==========================================
  const updateOrderStatus = async (orderId: string, status: OrderStatus, paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED'): Promise<boolean> => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          orderStatus: status,
          paymentStatus: paymentStatus || o.paymentStatus,
          verificationStatus: status === 'DELIVERED' || paymentStatus === 'PAID' ? 'VERIFIED' : o.verificationStatus
        };
      }
      return o;
    }));
    showToast(`Order status updated to ${status}`, 'success');
    return true;
  };

  const updateProjectRequest = async (requestId: string, updates: Partial<ProjectRequest>): Promise<boolean> => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId || r.requestId === requestId) {
        return {
          ...r,
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return r;
    }));
    showToast(`Brief ${requestId} updated successfully!`, 'success');
    return true;
  };

  const deleteProjectRequest = async (requestId: string): Promise<boolean> => {
    setRequests(prev => prev.filter(r => r.id !== requestId && r.requestId !== requestId));
    showToast(`Brief removed from records`, 'info');
    return true;
  };

  const addProduct = async (newProd: any): Promise<boolean> => {
    const id = `prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      soldCount: 0,
      rating: 5.0,
      reviewCount: 1,
      currency: 'USD',
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [product, ...prev]);
    showToast(`Product "${product.title}" added to store!`, 'success');
    return true;
  };

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<boolean> => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, ...updates, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
    showToast(`Product updated successfully`, 'success');
    return true;
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast(`Product deleted from marketplace`, 'info');
    return true;
  };

  const replyTicketAsAdmin = async (ticketId: string, text: string): Promise<boolean> => {
    const reply: TicketMessage = {
      id: `tm-${Date.now()}`,
      sender: 'SUPPORT_AGENT',
      senderName: 'BigVora Founder & Admin',
      senderRole: 'Super Admin',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId || t.ticketNumber === ticketId) {
        return {
          ...t,
          status: 'IN_PROGRESS',
          updatedAt: new Date().toISOString(),
          messages: [...t.messages, reply]
        };
      }
      return t;
    }));
    showToast(`Admin reply submitted to ticket!`, 'success');
    return true;
  };

  const updateTicketStatus = async (ticketId: string, status: TicketStatus): Promise<boolean> => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId || t.ticketNumber === ticketId) {
        return {
          ...t,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
    showToast(`Ticket status updated to ${status}`, 'success');
    return true;
  };

  const broadcastNotification = (notif: { title: string; message: string; actionScreen?: string; type?: any }) => {
    const newNotif: StoreNotification = {
      id: `notif-${Date.now()}`,
      title: notif.title,
      message: notif.message,
      timestamp: 'Just now',
      type: notif.type || 'ORDER',
      read: false,
      actionScreen: notif.actionScreen || 'home',
    };
    setNotifications(prev => [newNotif, ...prev]);
    api.saveNotifications([newNotif, ...notifications]);
    showToast(`Broadcast sent to all users!`, 'success');
  };

  const toggleMaintenanceMode = async (enabled: boolean, message?: string, estimatedEndTime?: string): Promise<boolean> => {
    setMaintenanceMode(prev => ({
      ...prev,
      enabled,
      message: message !== undefined ? message : prev.message,
      estimatedEndTime: estimatedEndTime !== undefined ? estimatedEndTime : prev.estimatedEndTime,
      lastUpdated: new Date().toISOString()
    }));
    sound.playTap();
    if (enabled) {
      showToast('⚠️ Maintenance Mode Activated! Normal users blocked.', 'warning');
      broadcastNotification({
        title: '⚠️ Store Scheduled Maintenance',
        message: message || 'Store maintenance in progress. Regular downloads paused temporarily.',
        type: 'STOCK'
      });
    } else {
      showToast('✅ Store Maintenance Ended! Marketplace is LIVE.', 'success');
      confetti({ particleCount: 40, spread: 60 });
    }
    return true;
  };

  const updateUserDeveloperStatus = async (
    userId: string,
    isVerifiedDeveloper: boolean,
    canUploadApps: boolean,
    developerTier?: 'JUNIOR' | 'PRO' | 'ELITE'
  ): Promise<boolean> => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          isVerifiedDeveloper,
          canUploadApps,
          developerStatus: isVerifiedDeveloper ? 'VERIFIED' : (u.developerStatus === 'PENDING' ? 'PENDING' : 'NOT_APPLIED'),
          developerTier: developerTier || u.developerTier || (isVerifiedDeveloper ? 'PRO' : 'JUNIOR')
        };
      }
      return u;
    }));

    if (user && user.id === userId) {
      setUser(prev => prev ? {
        ...prev,
        isVerifiedDeveloper,
        canUploadApps,
        developerStatus: isVerifiedDeveloper ? 'VERIFIED' : prev.developerStatus,
        developerTier: developerTier || prev.developerTier
      } : null);
    }

    sound.playSuccess();
    showToast(`Developer permissions updated for user!`, 'success');
    return true;
  };

  const totalUsersCount = usersList.length;
  const totalDevelopersCount = usersList.filter(u => u.isVerifiedDeveloper).length;
  const totalPendingDevelopersCount = usersList.filter(u => u.developerStatus === 'PENDING').length;

  const updateProfile = (name: string, email: string) => {
    if (!user) return;
    const updated = { ...user, name, email };
    setUser(updated);
    showToast('Profile updated', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      api.saveNotifications(updated);
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      api.saveNotifications(updated);
      return updated;
    });
    showToast('Marked all notifications as read', 'info');
  };

  // Client-Safe Real Package Download
  const downloadPackage = async (item: any, order?: Order) => {
    try {
      showToast(`Generating package bundle for "${item.productTitle}"...`, 'info');
      const zip = new JSZip();

      const customerName = order?.customerName || user?.name || 'Valued Client';
      const customerEmail = order?.customerEmail || user?.email || 'client@bigvora.com';
      const orderNum = order?.orderNumber || `BV-${Date.now().toString().slice(-6)}`;
      const timestamp = new Date().toISOString();

      zip.file(
        'README.md',
        `# ${item.productTitle}\n\n` +
        `**Product Platform:** ${item.productType || 'Android App'}\n` +
        `**Package Format:** ${item.format || 'ZIP (Source Code + Documentation)'}\n` +
        `**License Tier:** ${item.licenseModel || 'COMMERCIAL_DEVELOPER_LICENSE'}\n` +
        `**Licensed To:** ${customerName} (${customerEmail})\n` +
        `**Order Reference:** #${orderNum}\n` +
        `**Issued At:** ${timestamp}\n\n` +
        `---\n\n` +
        `## Quick Setup Instructions\n\n` +
        `### For Android Applications:\n` +
        `1. Extract this ZIP archive to your local development folder.\n` +
        `2. Open Android Studio (Ladybug / Hedgehog or newer).\n` +
        `3. Select "Open Project" and choose the extracted folder.\n` +
        `4. Allow Gradle dependencies to sync automatically.\n` +
        `5. Build Debug APK or generate your signed release APK from the Build menu.\n\n` +
        `### For Website Projects:\n` +
        `1. Extract all source files.\n` +
        `2. Run \`npm install\` or \`pnpm install\` in the terminal.\n` +
        `3. Set up your \`.env\` variables according to \`.env.example\`.\n` +
        `4. Run \`npm run dev\` to launch your live local server.\n\n` +
        `Need assistance? Reach out to BigVora in-app Support anytime!\n`
      );

      zip.file(
        'LICENSE_CERTIFICATE.txt',
        `=================================================================\n` +
        `BIGVORA STORE — OFFICIAL DIGITAL LICENSE CERTIFICATE\n` +
        `=================================================================\n` +
        `Product: ${item.productTitle}\n` +
        `Order Number: #${orderNum}\n` +
        `Licensee: ${customerName}\n` +
        `Licensee Email: ${customerEmail}\n` +
        `License Tier: ${item.licenseModel || 'COMMERCIAL_DEVELOPER_LICENSE'}\n` +
        `Verification Hash: ${item.downloadToken || 'BV-AUTH-' + Date.now()}\n` +
        `Status: VERIFIED & AUTHENTIC\n` +
        `Date: ${timestamp}\n\n` +
        `Terms: Grants the authorized holder the rights to customize, deploy, and\n` +
        `publish this software in accordance with BigVora Store marketplace terms.\n` +
        `=================================================================\n`
      );

      zip.file(
        'SETUP_GUIDE.txt',
        item.installationGuide ||
        `1. Extract all files.\n2. Open in Android Studio or VS Code.\n3. Configure build.gradle or package.json.\n4. Deploy!`
      );

      zip.file(
        'PROJECT_MANIFEST.json',
        JSON.stringify(
          {
            title: item.productTitle,
            type: item.productType,
            format: item.format,
            fileSize: item.fileSize,
            orderNumber: orderNum,
            verifiedLicensee: customerName,
            deliveredAt: timestamp,
          },
          null,
          2
        )
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const safeTitle = (item.productTitle || 'BigVora_Project').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeTitle}_Source_Bundle.zip`;

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      showToast(`Downloaded ${filename} successfully!`, 'success');
    } catch (err) {
      console.error('[Download] Failed to generate bundle:', err);
      showToast('Download generation failed. Please try again.', 'error');
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        selectedProductId,
        selectedConversationId,
        searchQuery,
        setSearchQuery,
        deviceMode,
        setDeviceMode,
        products,
        refreshProducts,
        getProductById,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        placeOrder,
        approveCashPayment,
        refreshOrders,
        downloadPackage,
        requests,
        submitCustomRequest,
        submitProjectRequest: submitCustomRequest,
        approveQuote,
        refreshRequests,
        conversations,
        sendMessage,
        refreshConversations,
        openConversationWithSupport,
        tickets,
        activeTicketId,
        setActiveTicketId,
        createTicket,
        sendTicketReply,
        closeTicket,
        reopenTicket,
        openTicketForOrder,
        user,
        loginWithOtp,
        requestOtp,
        logout,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toasts,
        showToast,
        buyNow,
        isAdmin,
        updateOrderStatus,
        updateProjectRequest,
        deleteProjectRequest,
        addProduct,
        updateProduct,
        deleteProduct,
        replyTicketAsAdmin,
        updateTicketStatus,
        broadcastNotification,
        maintenanceMode,
        toggleMaintenanceMode,
        usersList,
        updateUserDeveloperStatus,
        totalUsersCount,
        totalDevelopersCount,
        totalPendingDevelopersCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
