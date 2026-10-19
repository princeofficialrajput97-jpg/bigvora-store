export type ProductType = 'APP' | 'WEBSITE';

export type PlatformType = 'ANDROID' | 'WEB' | 'IOS' | 'CROSS_PLATFORM';

export type InventoryStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD_OUT' | 'INACTIVE';

export type LicenseModel = 'SINGLE_LICENSE' | 'LIMITED_STOCK' | 'MULTIPLE_LICENSES';

export type DeliveryContent = 
  | 'APK_ONLY' 
  | 'SOURCE_CODE_ONLY' 
  | 'APK_AND_SOURCE_CODE' 
  | 'WEBSITE_FILES' 
  | 'FULL_SOURCE_CODE' 
  | 'DATABASE_AND_BACKEND' 
  | 'DEPLOYMENT_SUPPORT';

export interface ProductMedia {
  thumbnail: string;
  logo: string;
  screenshots: string[];
  demoVideoUrl?: string;
  liveDemoUrl?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: ProductType;
  category: string;
  platform: PlatformType;
  version: string;
  price: number;
  originalPrice?: number;
  currency: string;
  status: InventoryStatus;
  licenseModel: LicenseModel;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  soldCount: number;
  media: ProductMedia;
  deliveryContents: DeliveryContent[];
  features: string[];
  techStack: string[];
  fileSize: string;
  format: string; // e.g. "ZIP (Android Studio Project + APK)"
  includedServices: string[];
  requirements: string[];
  documentationSummary: string;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  updatedAt: string;
  featured?: boolean;
  popular?: boolean;
}

export type OrderStatus = 
  | 'PAYMENT_PENDING' 
  | 'PAYMENT_FAILED' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'READY_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productType: ProductType;
  thumbnail: string;
  logo: string;
  price: number;
  licenseModel: LicenseModel;
  deliveryContents: DeliveryContent[];
  downloadToken?: string;
  downloadUrl?: string;
  downloadExpiresAt?: string;
  fileSize?: string;
  format?: string;
  installationGuide?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'FAILED' | 'PENDING' | 'REFUNDED';
  paymentTransactionId: string;
  orderStatus: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  verificationStatus?: 'UNDER_24H_REVIEW' | 'VERIFIED' | 'REJECTED';
  verificationNotes?: string;
  verificationDeadline?: string;
  cashContactNumber?: string;
  manualReferenceNote?: string;
}

export type RequestStatus = 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'MORE_INFO_REQUIRED' 
  | 'QUOTE_READY' 
  | 'AWAITING_APPROVAL' 
  | 'AWAITING_PAYMENT' 
  | 'IN_PROGRESS' 
  | 'REVIEW_REQUIRED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface ProjectRequest {
  id: string;
  requestId: string;
  type: 'CUSTOM_APP' | 'CUSTOM_WEBSITE';
  projectName: string;
  category: string;
  description: string;
  targetPlatforms?: string[];
  requiredPages?: string[];
  features: string[];
  budgetRange: string;
  customBudget?: number;
  expectedDeadline: string;
  contactMethod: 'PHONE' | 'EMAIL' | 'WHATSAPP';
  contactValue: string;
  referenceLinks: string[];
  referenceAttachments: string[];
  hasLogo: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;
  quotedPrice?: number;
  currency?: string;
  estimatedDeliveryDate?: string;
  scopeApprovedByCustomer?: boolean;
  assignedTeam?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'CUSTOMER' | 'SUPPORT' | 'PROJECT_TEAM';
  senderName: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
  isDelivered: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  category: 'SUPPORT' | 'PROJECT_INQUIRY' | 'ORDER_INQUIRY';
  referenceId?: string; // e.g. orderId or requestId
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketCategory = 
  | 'ORDER_DELIVERY' 
  | 'PAYMENT_VERIFICATION' 
  | 'CUSTOM_APP' 
  | 'CUSTOM_WEBSITE' 
  | 'TECHNICAL_BUG' 
  | 'GENERAL';

export interface TicketMessage {
  id: string;
  sender: 'CUSTOMER' | 'SUPPORT_AGENT' | 'SYSTEM';
  senderName: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  attachmentName?: string;
  attachmentUrl?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. TKT-92014
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  orderId?: string;
  assignedAgent: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  unreadCustomerCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  isPhoneVerified: boolean;
  role?: 'USER' | 'ADMIN';
  isVerifiedDeveloper?: boolean;
  canUploadApps?: boolean;
  developerBio?: string;
  developerTier?: 'JUNIOR' | 'PRO' | 'ELITE';
  developerStatus?: 'NOT_APPLIED' | 'PENDING' | 'VERIFIED' | 'SUSPENDED';
  uploadedProductsCount?: number;
  totalEarnings?: number;
  createdAt: string;
}

export interface StoreMaintenanceSettings {
  enabled: boolean;
  title: string;
  message: string;
  estimatedEndTime?: string;
  allowAdminBypass: boolean;
  lastUpdated: string;
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'REQUEST' | 'MESSAGE' | 'STOCK';
  read: boolean;
  referenceId?: string;
  actionScreen?: string;
}
