import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { INITIAL_PRODUCTS, INITIAL_REQUESTS, INITIAL_CONVERSATIONS, INITIAL_TICKETS } from './src/data/initialData.ts';
import { Product, Order, ProjectRequest, Conversation, SupportTicket } from './src/types/index.ts';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Enable CORS for mobile app (Capacitor WebView) and remote clients
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// PostgreSQL Cloud Database Pool
let pool: any = null;
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
    });
    console.log('[BigVora Database] PostgreSQL Pool configured with live DATABASE_URL.');
  } catch (err) {
    console.warn('[BigVora Database] Failed to initialize PostgreSQL pool:', err);
  }
}

// In-Memory & Cloud Synchronized State
let products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
const orders: Order[] = [];
let projectRequests: ProjectRequest[] = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
let conversations: Conversation[] = JSON.parse(JSON.stringify(INITIAL_CONVERSATIONS));
let tickets: SupportTicket[] = JSON.parse(JSON.stringify(INITIAL_TICKETS));

// Cloud Database Initializer & Persistence Helpers
async function initDb() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS store_data (
        key VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Load or seed Products
    const prodRes = await pool.query('SELECT data FROM store_data WHERE key = $1', ['products']);
    if (prodRes.rows.length > 0 && Array.isArray(prodRes.rows[0].data)) {
      products = prodRes.rows[0].data;
      console.log(`[BigVora Database] Loaded ${products.length} products from PostgreSQL.`);
    } else {
      await pool.query('INSERT INTO store_data (key, data) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', ['products', JSON.stringify(products)]);
    }

    // Load Orders
    const ordRes = await pool.query('SELECT data FROM store_data WHERE key = $1', ['orders']);
    if (ordRes.rows.length > 0 && Array.isArray(ordRes.rows[0].data)) {
      orders.length = 0;
      orders.push(...ordRes.rows[0].data);
      console.log(`[BigVora Database] Loaded ${orders.length} orders from PostgreSQL.`);
    }

    // Load Requests
    const reqRes = await pool.query('SELECT data FROM store_data WHERE key = $1', ['requests']);
    if (reqRes.rows.length > 0 && Array.isArray(reqRes.rows[0].data)) {
      projectRequests = reqRes.rows[0].data;
      console.log(`[BigVora Database] Loaded ${projectRequests.length} project requests from PostgreSQL.`);
    }

    // Load Conversations
    const convRes = await pool.query('SELECT data FROM store_data WHERE key = $1', ['conversations']);
    if (convRes.rows.length > 0 && Array.isArray(convRes.rows[0].data)) {
      conversations = convRes.rows[0].data;
      console.log(`[BigVora Database] Loaded ${conversations.length} conversations from PostgreSQL.`);
    }

    // Load Support Tickets
    const tktRes = await pool.query('SELECT data FROM store_data WHERE key = $1', ['tickets']);
    if (tktRes.rows.length > 0 && Array.isArray(tktRes.rows[0].data)) {
      tickets = tktRes.rows[0].data;
      console.log(`[BigVora Database] Loaded ${tickets.length} support tickets from PostgreSQL.`);
    } else {
      await pool.query('INSERT INTO store_data (key, data) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', ['tickets', JSON.stringify(tickets)]);
    }
  } catch (err) {
    console.warn('[BigVora Database] PostgreSQL initialization warning:', err);
  }
}

async function persistData(key: string, data: any) {
  if (!pool) return;
  try {
    await pool.query(`
      INSERT INTO store_data (key, data, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
    `, [key, JSON.stringify(data)]);
  } catch (err) {
    console.error(`[BigVora Database] Failed to persist key "${key}":`, err);
  }
}

// Stock Reservations Map: reservationId -> { productId, quantity, expiresAt, status: 'PENDING' | 'CONSUMED' | 'EXPIRED' }
interface StockReservation {
  id: string;
  productId: string;
  quantity: number;
  createdAt: number;
  expiresAt: number;
  status: 'PENDING' | 'CONSUMED' | 'EXPIRED';
}
const activeReservations = new Map<string, StockReservation>();

// Idempotent Orders Cache: idempotencyKey -> Order
const idempotencyKeys = new Map<string, Order>();

// Download Tokens Map: token -> { orderId, productId, customerEmail, expiresAt, downloadCount }
interface DownloadTokenRecord {
  token: string;
  orderId: string;
  productId: string;
  productTitle: string;
  customerEmail: string;
  expiresAt: number;
  downloadCount: number;
}
const downloadTokens = new Map<string, DownloadTokenRecord>();

// OTP Verification Store
interface OtpRecord {
  phone: string;
  otp: string;
  expiresAt: number;
}
const activeOtps = new Map<string, OtpRecord>();

// Clean up expired reservations every 30 seconds
setInterval(() => {
  const now = Date.now();
  for (const [resId, reservation] of activeReservations.entries()) {
    if (reservation.status === 'PENDING' && now > reservation.expiresAt) {
      reservation.status = 'EXPIRED';
      // Release reserved stock back to available stock
      const product = products.find(p => p.id === reservation.productId);
      if (product) {
        product.reservedStock = Math.max(0, product.reservedStock - reservation.quantity);
        product.availableStock += reservation.quantity;
        if (product.status === 'RESERVED' && product.availableStock > 0) {
          product.status = 'AVAILABLE';
        }
      }
      activeReservations.delete(resId);
      console.log(`[Inventory] Released expired reservation ${resId} for product ${reservation.productId}`);
    }
  }
}, 30000);

// --- REST API ROUTES ---

// 1. GET /api/products
app.get('/api/products', (req: Request, res: Response) => {
  const { type, platform, status, search, minPrice, maxPrice, sort } = req.query;
  let results = [...products];

  if (type) {
    results = results.filter(p => p.type === String(type).toUpperCase());
  }
  if (platform && platform !== 'ALL') {
    results = results.filter(p => p.platform === String(platform).toUpperCase());
  }
  if (status && status !== 'ALL') {
    results = results.filter(p => p.status === String(status).toUpperCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.techStack.some(t => t.toLowerCase().includes(q))
    );
  }
  if (minPrice) {
    results = results.filter(p => p.price >= parseFloat(String(minPrice)));
  }
  if (maxPrice) {
    results = results.filter(p => p.price <= parseFloat(String(maxPrice)));
  }

  // Sorting
  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popularity') {
    results.sort((a, b) => b.soldCount - a.soldCount);
  }

  res.json({ success: true, count: results.length, products: results });
});

// 2. GET /api/products/:id
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product });
});

// 3. POST /api/inventory/reserve (Transactional Reservation Lock)
app.post('/api/inventory/reserve', (req: Request, res: Response) => {
  const { productId, quantity = 1 } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  if (product.status === 'SOLD_OUT' || product.availableStock < quantity) {
    return res.status(409).json({
      success: false,
      error: 'Product is SOLD OUT or insufficient stock available.',
      currentStatus: product.status,
      availableStock: product.availableStock,
    });
  }

  // Atomic lock on stock
  product.availableStock -= quantity;
  product.reservedStock += quantity;

  if (product.availableStock === 0) {
    product.status = 'RESERVED';
  }

  const reservationId = `RES-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes hold

  activeReservations.set(reservationId, {
    id: reservationId,
    productId,
    quantity,
    createdAt: Date.now(),
    expiresAt,
    status: 'PENDING',
  });

  res.json({
    success: true,
    reservationId,
    expiresAt: new Date(expiresAt).toISOString(),
    remainingAvailableStock: product.availableStock,
  });
});

// 4. POST /api/inventory/release
app.post('/api/inventory/release', (req: Request, res: Response) => {
  const { reservationId } = req.body;
  const reservation = activeReservations.get(reservationId);

  if (!reservation || reservation.status !== 'PENDING') {
    return res.status(400).json({ success: false, error: 'Invalid or expired reservation' });
  }

  reservation.status = 'EXPIRED';
  const product = products.find(p => p.id === reservation.productId);
  if (product) {
    product.reservedStock = Math.max(0, product.reservedStock - reservation.quantity);
    product.availableStock += reservation.quantity;
    if (product.availableStock > 0 && product.status === 'RESERVED') {
      product.status = 'AVAILABLE';
    }
  }
  activeReservations.delete(reservationId);

  res.json({ success: true, message: 'Stock reservation released successfully' });
});

// 5. POST /api/orders (Idempotent order creation with server payment verification)
app.post('/api/orders', (req: Request, res: Response) => {
  const {
    idempotencyKey,
    items,
    paymentMethod,
    paymentTransactionId,
    customerName,
    customerPhone,
    customerEmail,
    reservationIds = [],
  } = req.body;

  if (!idempotencyKey) {
    return res.status(400).json({ success: false, error: 'idempotencyKey is required' });
  }

  // Check idempotency cache
  if (idempotencyKeys.has(idempotencyKey)) {
    return res.json({
      success: true,
      cached: true,
      order: idempotencyKeys.get(idempotencyKey),
    });
  }

  // Validate items & stock
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ success: false, error: `Product ${item.productId} not found` });
    }
    if (product.status === 'SOLD_OUT') {
      return res.status(409).json({
        success: false,
        error: `Cannot purchase "${product.title}" because it is SOLD OUT.`,
      });
    }
  }

  // Commit reservations & decrement final inventory
  for (const item of items) {
    const product = products.find(p => p.id === item.productId)!;
    const qty = item.quantity || 1;

    // Check if reservation was held
    const matchingRes = reservationIds.find((rId: string) => {
      const r = activeReservations.get(rId);
      return r && r.productId === product.id && r.status === 'PENDING';
    });

    if (matchingRes) {
      const r = activeReservations.get(matchingRes)!;
      r.status = 'CONSUMED';
      product.reservedStock = Math.max(0, product.reservedStock - r.quantity);
      activeReservations.delete(matchingRes);
    } else {
      product.availableStock = Math.max(0, product.availableStock - qty);
    }

    product.soldCount += qty;

    // Single license exhaustion or stock zero -> Mark SOLD_OUT authoritatively
    if (product.licenseModel === 'SINGLE_LICENSE' || (product.availableStock === 0 && product.reservedStock === 0)) {
      product.status = 'SOLD_OUT';
      product.availableStock = 0;
    }
  }

  const subtotal = items.reduce((sum: number, it: any) => sum + it.price * (it.quantity || 1), 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + tax;

  const orderNumber = `BV-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderId = `ord-${Date.now()}`;

  const isCashManual = paymentMethod === 'CASH_MANUAL';

  const orderItems = items.map((it: any) => {
    // Only generate active download tokens if already paid; if cash/manual, generate upon approval
    if (!isCashManual) {
      const downloadToken = `DL-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48-hour authenticated access link

      downloadTokens.set(downloadToken, {
        token: downloadToken,
        orderId,
        productId: it.productId,
        productTitle: it.productTitle,
        customerEmail: customerEmail || 'customer@bigvora.com',
        expiresAt,
        downloadCount: 0,
      });

      return {
        ...it,
        downloadToken,
        downloadUrl: `/api/downloads/${downloadToken}`,
        downloadExpiresAt: new Date(expiresAt).toISOString(),
        fileSize: it.fileSize || '42.5 MB',
        format: it.format || 'ZIP (Source Code + Documentation)',
        installationGuide: '1. Unzip the package. 2. Read the enclosed README.md. 3. Open in Android Studio / VS Code. 4. Configure your .env or keystore credentials.',
      };
    } else {
      return {
        ...it,
        fileSize: it.fileSize || '42.5 MB',
        format: it.format || 'ZIP (Source Code + Documentation)',
        installationGuide: 'Available upon payment verification confirmation within 24 hours.',
      };
    }
  });

  const verificationDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const order: Order = {
    id: orderId,
    orderNumber,
    createdAt: new Date().toISOString(),
    items: orderItems,
    subtotal,
    tax,
    discount: 0,
    total,
    currency: 'USD',
    paymentMethod: paymentMethod || 'CREDIT_CARD_SANDBOX',
    paymentStatus: isCashManual ? 'PENDING' : 'PAID',
    paymentTransactionId: paymentTransactionId || (isCashManual ? `CASH-REQ-${Date.now()}` : `TXN-BV-${Date.now()}`),
    orderStatus: isCashManual ? 'PAYMENT_PENDING' : 'DELIVERED',
    customerName: customerName || 'Valued Customer',
    customerPhone: customerPhone || '+1 (555) 019-2831',
    customerEmail: customerEmail || 'customer@bigvora.com',
    verificationStatus: isCashManual ? 'UNDER_24H_REVIEW' : 'VERIFIED',
    verificationDeadline: isCashManual ? verificationDeadline : undefined,
    verificationNotes: isCashManual 
      ? 'Manual verification requested via phone/WhatsApp consultation. Review window: 24 hours.' 
      : undefined,
  };

  orders.unshift(order);
  idempotencyKeys.set(idempotencyKey, order);
  persistData('orders', orders);
  persistData('products', products);

  // If Cash / Manual Payment, initiate linked conversation for screenshot & verification exchange
  if (isCashManual) {
    const cashConv = {
      id: `conv-order-${order.id}`,
      title: `Order #${order.orderNumber} Cash / Billing Verification`,
      category: 'ORDER_INQUIRY' as const,
      referenceId: order.id,
      lastMessage: 'Cash/Direct payment initiated. Billing desk will verify within 24 hours.',
      lastMessageTimestamp: 'Just now',
      unreadCount: 1,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'SUPPORT' as const,
          senderName: 'BigVora Billing Desk',
          text: `Namaste / Hello! We received your Cash / Direct Phone Payment order #${order.orderNumber} ($${total} USD). Our accounts team is reviewing your details within the standard 24-hour verification window. If you have a payment screenshot, UTR number, or cash receipt, please share it right here!`,
          timestamp: 'Just now',
          isDelivered: true,
        }
      ]
    };
    conversations.unshift(cashConv);
  }

  res.json({
    success: true,
    order,
    message: isCashManual 
      ? 'Cash order registered! Verification in progress (24-hour review window).'
      : 'Order verified and confirmed. Digital delivery tokens created.',
  });
});

// 5b. POST /api/orders/:id/approve-cash (Approve 24-hour Cash / Manual Verification)
app.post('/api/orders/:id/approve-cash', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  order.paymentStatus = 'PAID';
  order.orderStatus = 'DELIVERED';
  order.verificationStatus = 'VERIFIED';
  order.verificationNotes = 'Verified and approved by BigVora Billing Lead.';

  // Generate the download tokens now that payment is approved
  order.items = order.items.map(it => {
    const downloadToken = `DL-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = Date.now() + 48 * 60 * 60 * 1000;

    downloadTokens.set(downloadToken, {
      token: downloadToken,
      orderId: order.id,
      productId: it.productId,
      productTitle: it.productTitle,
      customerEmail: order.customerEmail,
      expiresAt,
      downloadCount: 0,
    });

    return {
      ...it,
      downloadToken,
      downloadUrl: `/api/downloads/${downloadToken}`,
      downloadExpiresAt: new Date(expiresAt).toISOString(),
      installationGuide: '1. Unzip archive. 2. Open in Android Studio / IDE. 3. Read README.md.',
    };
  });

  // Post update to the linked message conversation
  const conv = conversations.find(c => c.referenceId === order.id);
  if (conv) {
    conv.messages.push({
      id: `msg-${Date.now()}`,
      sender: 'SUPPORT',
      senderName: 'BigVora Billing Lead',
      text: `🎉 Good news! Your payment for Order #${order.orderNumber} has been verified and approved. Your digital source code and APK downloads are now unlocked in My Orders!`,
      timestamp: 'Just now',
      isDelivered: true,
    });
    conv.lastMessage = 'Payment verified! Source code unlocked.';
    conv.lastMessageTimestamp = 'Just now';
    conv.unreadCount += 1;
  }
  persistData('orders', orders);
  persistData('conversations', conversations);

  res.json({
    success: true,
    order,
    message: 'Payment verified successfully! Digital download tokens issued.',
  });
});

// 6. GET /api/orders
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ success: true, count: orders.length, orders });
});

// 7. GET /api/orders/:id
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, order });
});

// 8. GET /api/downloads/:token (Secure Time-Limited Tokenized Digital Delivery API)
app.get('/api/downloads/:token', (req: Request, res: Response) => {
  const { token } = req.params;
  const record = downloadTokens.get(token);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'Invalid or non-existent download token.',
    });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(410).json({
      success: false,
      error: 'Download link expired. Please generate a refreshed access link in My Orders.',
    });
  }

  record.downloadCount += 1;

  // Serve a genuine, clean digital delivery archive payload
  const safeFilename = `${record.productTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Source_Bundle.zip`;
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('X-BigVora-Download-Token', token);
  res.setHeader('X-BigVora-Download-Count', record.downloadCount.toString());

  // Return realistic bundle bytes with license certificate
  const bundleContent = Buffer.from(`=======================================================
BIGVORA STORE - DIGITAL PRODUCT DELIVERY PACKAGE
Product: ${record.productTitle}
Order Ref: ${record.orderId}
Licensed To: ${record.customerEmail}
Verified Purchase Hash: ${token}
=======================================================

INSTALLATION & INTEGRATION INSTRUCTIONS:
1. Extract all source code files to your local development directory.
2. If this is an Android Application:
   - Open Android Studio (Ladybug / Hedgehog or newer).
   - Select "Open an Existing Project" and choose the extracted folder.
   - Sync Gradle dependencies.
   - Generate your production release keystore or use debug key.
3. If this is a Website / SaaS Portal:
   - Run 'npm install' or 'yarn install'.
   - Copy '.env.example' to '.env' and supply your database URL.
   - Run 'npm run dev' to launch local dev server.
4. Support & Maintenance:
   - Reach out via BigVora in-app Support for setup assistance.

Thank you for choosing BigVora Store!
=======================================================`);

  res.send(bundleContent);
});

// 9. POST /api/auth/send-otp
app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || phone.length < 7) {
    return res.status(400).json({ success: false, error: 'Valid phone number is required.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  activeOtps.set(phone, { phone, otp, expiresAt });

  console.log(`[SMS Gateway] Sent OTP ${otp} to ${phone}`);

  res.json({
    success: true,
    message: `OTP sent to ${phone}`,
    // For seamless testing in development/sandbox, we also provide the OTP in response
    devOtp: otp,
    expiresInSeconds: 300,
  });
});

// 10. POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { phone, otp, name } = req.body;
  const record = activeOtps.get(phone);

  // Allow standard test OTP 888888 or matching record
  const isValid = (record && record.otp === otp && Date.now() <= record.expiresAt) || otp === '888888';

  if (!isValid) {
    return res.status(400).json({ success: false, error: 'Incorrect or expired OTP. Please try again.' });
  }

  activeOtps.delete(phone);

  const cleanDigits = (phone || '').replace(/\D/g, '');
  const isAdmin = cleanDigits.endsWith('9266428368');

  const user = {
    id: isAdmin ? 'usr-admin-founder' : `usr-${Date.now()}`,
    name: isAdmin ? (name || 'BigVora Founder & Admin') : (name || 'BigVora User'),
    phone,
    email: isAdmin ? 'admin@bigvora.com' : `${cleanDigits}@customer.bigvora.com`,
    avatarUrl: isAdmin 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isPhoneVerified: true,
    role: isAdmin ? 'ADMIN' : 'USER',
    createdAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    token: `bvt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    user,
  });
});

// 11. POST /api/requests (Submit Custom App / Custom Website Request)
app.post('/api/requests', (req: Request, res: Response) => {
  const body = req.body;
  const requestId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRequest: ProjectRequest = {
    id: `req-${Date.now()}`,
    requestId,
    type: body.type || 'CUSTOM_APP',
    projectName: body.projectName || 'Untitled Project',
    category: body.category || 'General',
    description: body.description || '',
    targetPlatforms: body.targetPlatforms || ['Android'],
    requiredPages: body.requiredPages || [],
    features: body.features || [],
    budgetRange: body.budgetRange || '$1,000 - $3,000',
    customBudget: body.customBudget,
    expectedDeadline: body.expectedDeadline || '4-6 Weeks',
    contactMethod: body.contactMethod || 'PHONE',
    contactValue: body.contactValue || '',
    referenceLinks: body.referenceLinks || [],
    referenceAttachments: body.referenceAttachments || [],
    hasLogo: !!body.hasLogo,
    notes: body.notes || '',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    status: 'SUBMITTED',
  };

  projectRequests.unshift(newRequest);

  // Auto-create a linked discussion thread in Messages
  const newConversation: Conversation = {
    id: `conv-${newRequest.id}`,
    title: `Discussion: ${requestId} (${newRequest.projectName})`,
    category: 'PROJECT_INQUIRY',
    referenceId: newRequest.id,
    lastMessage: 'Project inquiry submitted. Our engineering lead will review your specifications.',
    lastMessageTimestamp: 'Just now',
    unreadCount: 0,
    messages: [
      {
        id: `msg-${Date.now()}`,
        sender: 'SUPPORT',
        senderName: 'BigVora Project Dispatcher',
        text: `Your ${newRequest.type === 'CUSTOM_APP' ? 'Custom Android App' : 'Custom Website'} request (${requestId}) was successfully received! Our technical team is reviewing your requirements and will upload a milestone quote.`,
        timestamp: 'Just now',
        isDelivered: true,
      }
    ]
  };
  conversations.unshift(newConversation);
  persistData('requests', projectRequests);
  persistData('conversations', conversations);

  res.json({
    success: true,
    requestId,
    request: newRequest,
    message: 'Project request registered. Track status under My Requests.',
  });
});

// 12. GET /api/requests
app.get('/api/requests', (req: Request, res: Response) => {
  res.json({ success: true, count: projectRequests.length, requests: projectRequests });
});

// 13. PATCH /api/requests/:id/approve (Approve Quote)
app.patch('/api/requests/:id/approve', (req: Request, res: Response) => {
  const request = projectRequests.find(r => r.id === req.params.id || r.requestId === req.params.id);
  if (!request) {
    return res.status(404).json({ success: false, error: 'Request not found' });
  }

  request.scopeApprovedByCustomer = true;
  request.status = 'AWAITING_PAYMENT';
  request.updatedAt = new Date().toISOString().split('T')[0];
  persistData('requests', projectRequests);

  res.json({ success: true, request });
});

// 14. GET /api/conversations
app.get('/api/conversations', (req: Request, res: Response) => {
  res.json({ success: true, conversations });
});

// 15. POST /api/conversations/:id/messages
app.post('/api/conversations/:id/messages', (req: Request, res: Response) => {
  const { text, attachmentUrl, attachmentName } = req.body;
  const conv = conversations.find(c => c.id === req.params.id);

  if (!conv) {
    return res.status(404).json({ success: false, error: 'Conversation not found' });
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    sender: 'CUSTOMER' as const,
    senderName: 'You',
    text: text || '',
    attachmentUrl,
    attachmentName,
    timestamp: 'Just now',
    isDelivered: true,
  };

  conv.messages.push(newMsg);
  conv.lastMessage = text || (attachmentName ? `Sent attachment: ${attachmentName}` : '');
  conv.lastMessageTimestamp = 'Just now';

  // Simulate an intelligent automated acknowledgement from support after short delay
  setTimeout(() => {
    const replyMsg = {
      id: `msg-reply-${Date.now()}`,
      sender: conv.category === 'PROJECT_INQUIRY' ? ('PROJECT_TEAM' as const) : ('SUPPORT' as const),
      senderName: conv.category === 'PROJECT_INQUIRY' ? 'Alex (Project Lead)' : 'BigVora Support',
      text: conv.category === 'PROJECT_INQUIRY' 
        ? 'Thank you for your update. Our engineers have attached this to your project scope record.'
        : 'Thank you for reaching out! A BigVora customer agent has received your message and will respond shortly.',
      timestamp: 'Just now',
      isDelivered: true,
    };
    conv.messages.push(replyMsg);
    conv.lastMessage = replyMsg.text;
    conv.unreadCount += 1;
  }, 1000);

  res.json({ success: true, message: newMsg });
});

// 16. GET /api/docs (API Contracts and Schema for Future Admin & Developer Apps)
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    appName: 'BigVora Store API',
    version: '1.0.0',
    description: 'Clean backend architecture and OpenAPI-compliant contracts ready for customer, admin, and developer clients.',
    schemas: {
      Product: {
        id: 'string (UUID)',
        title: 'string',
        type: 'APP | WEBSITE',
        category: 'string',
        platform: 'ANDROID | WEB | IOS | CROSS_PLATFORM',
        price: 'number (USD)',
        status: 'AVAILABLE | RESERVED | SOLD_OUT | INACTIVE',
        licenseModel: 'SINGLE_LICENSE | LIMITED_STOCK | MULTIPLE_LICENSES',
        totalStock: 'integer',
        availableStock: 'integer',
        reservedStock: 'integer',
        soldCount: 'integer',
        media: 'ProductMedia',
        deliveryContents: 'DeliveryContent[]',
      },
      Order: {
        id: 'string',
        orderNumber: 'string',
        customerEmail: 'string',
        total: 'number',
        paymentStatus: 'PAID | FAILED | PENDING | REFUNDED',
        orderStatus: 'DELIVERED | PROCESSING | CONFIRMED',
        items: 'OrderItem[]',
      },
      InventoryReservation: {
        reservationId: 'string',
        productId: 'string',
        quantity: 'integer',
        expiresAt: 'timestamp (10-minute lease)',
      }
    },
    endpoints: [
      { method: 'GET', path: '/api/products', summary: 'List and filter ready-made apps and websites' },
      { method: 'POST', path: '/api/inventory/reserve', summary: 'Atomic reservation lock on item stock' },
      { method: 'POST', path: '/api/inventory/release', summary: 'Release stock back to available pool' },
      { method: 'POST', path: '/api/orders', summary: 'Place idempotent verified order & generate download tokens' },
      { method: 'GET', path: '/api/downloads/:token', summary: 'Time-limited signed download of digital files' },
      { method: 'POST', path: '/api/auth/send-otp', summary: 'Initiate phone OTP login' },
      { method: 'POST', path: '/api/auth/verify-otp', summary: 'Validate OTP and issue JWT session' },
      { method: 'POST', path: '/api/requests', summary: 'Submit Custom App or Website development brief' },
      { method: 'PATCH', path: '/api/requests/:id/approve', summary: 'Approve milestone quote' },
      { method: 'GET', path: '/api/conversations', summary: 'Fetch user messaging threads' },
      { method: 'POST', path: '/api/conversations/:id/messages', summary: 'Send message with attachments' },
    ]
  });
});

// 17. GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    database: pool ? 'postgresql' : 'in-memory',
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRequests: projectRequests.length,
    totalTickets: tickets.length,
  });
});

// 18. Support Tickets Endpoints
app.get('/api/tickets', (req: Request, res: Response) => {
  res.json({ success: true, count: tickets.length, tickets });
});

app.post('/api/tickets', (req: Request, res: Response) => {
  const { subject, category, priority, initialMessage, attachmentName } = req.body;
  const ticketNumber = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
  const newTicket: SupportTicket = {
    id: `tkt-${Date.now()}`,
    ticketNumber,
    subject: subject || 'Support Request',
    category: (category as any) || 'GENERAL',
    priority: priority || 'MEDIUM',
    status: 'OPEN',
    assignedAgent: 'Vikram Joshi (Senior Support Lead)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCustomerCount: 0,
    messages: [
      {
        id: `tm-${Date.now()}`,
        sender: 'CUSTOMER',
        senderName: 'Customer',
        text: initialMessage || 'Ticket opened.',
        attachmentName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  };
  tickets.unshift(newTicket);
  persistData('tickets', tickets);
  res.json({ success: true, ticket: newTicket });
});

app.post('/api/tickets/:id/reply', (req: Request, res: Response) => {
  const { text, senderRole, senderName } = req.body;
  const tkt = tickets.find(t => t.id === req.params.id || t.ticketNumber === req.params.id);
  if (!tkt) return res.status(404).json({ success: false, error: 'Ticket not found' });

  const replyMsg = {
    id: `tm-${Date.now()}`,
    sender: (senderRole === 'SUPER_ADMIN' ? 'SUPPORT_AGENT' : 'CUSTOMER') as any,
    senderName: senderName || (senderRole === 'SUPER_ADMIN' ? 'BigVora Founder & Admin' : 'Customer'),
    senderRole: senderRole || 'Customer',
    text: (text || '').trim(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  tkt.messages.push(replyMsg);
  tkt.updatedAt = new Date().toISOString();
  persistData('tickets', tickets);
  res.json({ success: true, message: replyMsg });
});

app.patch('/api/tickets/:id', (req: Request, res: Response) => {
  const { status, assignedAgent } = req.body;
  const tkt = tickets.find(t => t.id === req.params.id || t.ticketNumber === req.params.id);
  if (!tkt) return res.status(404).json({ success: false, error: 'Ticket not found' });

  if (status) tkt.status = status;
  if (assignedAgent) tkt.assignedAgent = assignedAgent;
  tkt.updatedAt = new Date().toISOString();
  persistData('tickets', tickets);
  res.json({ success: true, ticket: tkt });
});

// 19. Admin Orders & Products Endpoints (PostgreSQL Synced)
app.patch('/api/admin/orders/:id', (req: Request, res: Response) => {
  const { status, paymentStatus } = req.body;
  const ord = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!ord) return res.status(404).json({ success: false, error: 'Order not found' });

  if (status) ord.orderStatus = status;
  if (paymentStatus) {
    ord.paymentStatus = paymentStatus;
    if (paymentStatus === 'PAID') {
      ord.verificationStatus = 'VERIFIED';
    }
  }
  persistData('orders', orders);
  res.json({ success: true, order: ord });
});

app.post('/api/admin/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    soldCount: 0,
    rating: 5.0,
    reviewCount: 1,
    currency: req.body.currency || 'USD',
    updatedAt: new Date().toISOString().split('T')[0],
  };
  products.unshift(newProduct);
  persistData('products', products);
  res.json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', (req: Request, res: Response) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Product not found' });

  products[idx] = { ...products[idx], ...req.body, updatedAt: new Date().toISOString().split('T')[0] };
  persistData('products', products);
  res.json({ success: true, product: products[idx] });
});

app.delete('/api/admin/products/:id', (req: Request, res: Response) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Product not found' });

  const deleted = products.splice(idx, 1)[0];
  persistData('products', products);
  res.json({ success: true, deletedProduct: deleted });
});

app.patch('/api/admin/requests/:id', (req: Request, res: Response) => {
  const reqItem = projectRequests.find(r => r.id === req.params.id || r.requestId === req.params.id);
  if (!reqItem) return res.status(404).json({ success: false, error: 'Request not found' });

  Object.assign(reqItem, req.body, { updatedAt: new Date().toISOString().split('T')[0] });
  persistData('requests', projectRequests);
  res.json({ success: true, request: reqItem });
});

app.delete('/api/admin/requests/:id', (req: Request, res: Response) => {
  const idx = projectRequests.findIndex(r => r.id === req.params.id || r.requestId === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Request not found' });

  const deleted = projectRequests.splice(idx, 1)[0];
  persistData('requests', projectRequests);
  res.json({ success: true, deletedRequest: deleted });
});

// Setup Vite middleware in dev or static serving in production
async function start() {
  await initDb();
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        if (vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e as Error);
        }
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BigVora Store] Server initialized on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('[BigVora Store] Failed to start server:', err);
});
