import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCode2, 
  Database, 
  Layers, 
  Server, 
  ArrowLeft, 
  Check, 
  Copy, 
  ShieldCheck,
  Code
} from 'lucide-react';

export const ApiDocsScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'API' | 'SCHEMA' | 'ARCHITECTURE'>('API');

  const copyCode = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast('Copied to clipboard', 'info');
  };

  const postgresSchema = `-- =================================================================
-- BIGVORA STORE POSTGRESQL PRODUCTION RELATIONAL SCHEMA
-- Ready for future Admin Panel, Developer App, & Customer Marketplace
-- =================================================================

-- 1. Users & Customer Profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'CUSTOMER', -- 'CUSTOMER', 'ADMIN', 'DEVELOPER'
    is_phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Catalog
CREATE TABLE products (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(32) NOT NULL, -- 'APP', 'WEBSITE'
    category VARCHAR(64) NOT NULL,
    platform VARCHAR(32) NOT NULL, -- 'ANDROID', 'WEB', 'IOS'
    version VARCHAR(32) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    currency VARCHAR(8) DEFAULT 'USD',
    status VARCHAR(32) NOT NULL, -- 'AVAILABLE', 'RESERVED', 'SOLD_OUT', 'INACTIVE'
    license_model VARCHAR(32) NOT NULL, -- 'SINGLE_LICENSE', 'LIMITED_STOCK', 'MULTIPLE_LICENSES'
    total_stock INT NOT NULL DEFAULT 1,
    available_stock INT NOT NULL DEFAULT 1,
    reserved_stock INT NOT NULL DEFAULT 0,
    sold_count INT NOT NULL DEFAULT 0,
    file_size VARCHAR(32),
    format VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Stock Reservations (Transactional Concurrency Lock)
CREATE TABLE stock_reservations (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL, -- 'PENDING', 'CONSUMED', 'EXPIRED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL -- 10-minute lease
);

-- 4. Orders & Fulfillment
CREATE TABLE orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'USD',
    payment_method VARCHAR(64) NOT NULL,
    payment_status VARCHAR(32) NOT NULL, -- 'PAID', 'FAILED', 'PENDING'
    payment_transaction_id VARCHAR(128) NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    order_status VARCHAR(32) NOT NULL DEFAULT 'DELIVERED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Order Items & Secure Delivery Tokens
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id),
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    download_token VARCHAR(128) UNIQUE NOT NULL,
    download_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    download_count INT DEFAULT 0
);

-- 6. Custom Project Requests (Build App / Build Website)
CREATE TABLE project_requests (
    id VARCHAR(64) PRIMARY KEY,
    request_id VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    type VARCHAR(32) NOT NULL, -- 'CUSTOM_APP', 'CUSTOM_WEBSITE'
    project_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    budget_range VARCHAR(64),
    custom_budget NUMERIC(10, 2),
    expected_deadline VARCHAR(64),
    status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED',
    quoted_price NUMERIC(10, 2),
    estimated_delivery_date DATE,
    scope_approved_by_customer BOOLEAN DEFAULT FALSE,
    assigned_team VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Messaging Threads & Communications
CREATE TABLE conversations (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    category VARCHAR(32) NOT NULL, -- 'SUPPORT', 'PROJECT_INQUIRY', 'ORDER_INQUIRY'
    reference_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(32) NOT NULL, -- 'CUSTOMER', 'SUPPORT', 'PROJECT_TEAM'
    sender_name VARCHAR(128) NOT NULL,
    message_text TEXT NOT NULL,
    attachment_url TEXT,
    attachment_name VARCHAR(255),
    is_delivered BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lightning queries
CREATE INDEX idx_products_type_status ON products(type, status);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_reservations_status_expires ON stock_reservations(status, expires_at);
CREATE INDEX idx_download_tokens ON order_items(download_token);
`;

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateTo('home')}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-purple-400" />
            <span>Backend Architecture & Future Client Contracts</span>
          </h2>
          <p className="text-xs text-slate-400">
            Authoritative API contracts, database schema, and integration hooks for future Admin & Developer applications.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-[#0D1322] border border-slate-800 rounded-xl gap-1">
        <button
          onClick={() => setActiveTab('API')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'API' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          REST API Contracts
        </button>
        <button
          onClick={() => setActiveTab('SCHEMA')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'SCHEMA' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          PostgreSQL DDL Schema
        </button>
        <button
          onClick={() => setActiveTab('ARCHITECTURE')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'ARCHITECTURE' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Future Admin/Dev App Topology
        </button>
      </div>

      {activeTab === 'API' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-mono text-[11px]">GET</span>
                <code className="text-purple-300 font-mono">/api/products</code>
              </span>
              <span className="text-[11px] text-slate-400">Public Marketplace Catalog</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Returns filtered list of Android apps and websites with real-time server inventory status. Query params: <code>type</code>, <code>platform</code>, <code>status</code>, <code>search</code>, <code>sort</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/40 font-mono text-[11px]">POST</span>
                <code className="text-purple-300 font-mono">/api/inventory/reserve</code>
              </span>
              <span className="text-[11px] text-slate-400">Transactional Stock Lock</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reserves stock on the server for 10 minutes during checkout. Returns <code>reservationId</code> and lease expiration. Rejects immediately if item is SOLD OUT.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/40 font-mono text-[11px]">POST</span>
                <code className="text-purple-300 font-mono">/api/orders</code>
              </span>
              <span className="text-[11px] text-slate-400">Idempotent Order & Delivery</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receives payment transaction ID, validates inventory idempotently, marks single-license items as permanently SOLD OUT, and generates signed digital delivery tokens.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-mono text-[11px]">GET</span>
                <code className="text-purple-300 font-mono">/api/downloads/:token</code>
              </span>
              <span className="text-[11px] text-slate-400">Authenticated Secure Download</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Validates time-limited token and streams the full source code archive (ZIP) with embedded license certificate.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'SCHEMA' && (
        <div className="p-5 rounded-3xl bg-[#0D1322] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>PostgreSQL Schema Migrations (v1.0.sql)</span>
            </span>
            <button
              onClick={() => copyCode(postgresSchema)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy SQL</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[500px]">
            {postgresSchema}
          </pre>
        </div>
      )}

      {activeTab === 'ARCHITECTURE' && (
        <div className="p-6 rounded-3xl bg-[#0D1322] border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white">Future Ecosystem Architecture</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The customer application connects to the unified Express/PostgreSQL backend layer. When separate Admin and Developer applications are developed in subsequent phases, they will interface with the identical database and endpoints:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/40 space-y-2">
              <span className="text-xs font-bold text-purple-300 block">1. Customer App (Current)</span>
              <p className="text-[11px] text-slate-400 leading-snug">
                Browse catalog, purchase source code, request custom builds, initiate support chats, and download digital deliveries.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">2. Future Admin Panel</span>
              <p className="text-[11px] text-slate-400 leading-snug">
                Manage product inventory listings, override stock states, review customer request briefs, dispatch quotes, and view sales ledger.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">3. Future Developer App</span>
              <p className="text-[11px] text-slate-400 leading-snug">
                Developer portal for verified engineers to upload new Android templates, commit source code updates, and reply to client inquiries.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
