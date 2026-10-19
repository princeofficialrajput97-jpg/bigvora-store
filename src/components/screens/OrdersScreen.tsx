import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { BigVoraLogo } from '../common/BigVoraLogo';
import { 
  PackageCheck, 
  Download, 
  FileText, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Receipt,
  X,
  ExternalLink,
  Code2,
  Smartphone,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  Banknote
} from 'lucide-react';

export const OrdersScreen: React.FC = () => {
  const { orders, navigateTo, openConversationWithSupport, downloadPackage, showToast } = useApp();

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [guideModalItem, setGuideModalItem] = useState<{ title: string; guide: string } | null>(null);

  const handleDownload = async (item: any, order: Order) => {
    showToast(`Downloading source package for ${item.productTitle}...`, 'info');
    // If downloadUrl is available from server, try direct fetch
    if (item.downloadUrl && item.downloadUrl.startsWith('/api/downloads/')) {
      try {
        const resp = await fetch(item.downloadUrl);
        if (resp.ok) {
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const cleanTitle = (item.productTitle || 'BigVora_Project').replace(/[^a-zA-Z0-9_-]/g, '_');
          a.download = `${cleanTitle}_Source_Bundle.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast(`Downloaded ${a.download} successfully!`, 'success');
          return;
        }
      } catch {
        // Fallback to client-side package generation
      }
    }
    // Client-side ZIP bundle generation
    await downloadPackage(item, order);
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-purple-400" />
          <span>My Orders & Digital Deliveries</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your purchased source code packages, signed APK builds, and license certificates.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center bg-[#0D1322]/50 border border-slate-800/80 rounded-3xl p-8 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 mb-3">
            <PackageCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Orders Yet</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            When you purchase ready-made apps or websites, your download links and licenses will appear here.
          </p>
          <button
            onClick={() => navigateTo('explore')}
            className="mt-5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isCashPending = order.paymentMethod === 'CASH_MANUAL' && 
              (order.paymentStatus === 'PENDING' || order.orderStatus === 'PAYMENT_PENDING' || order.verificationStatus === 'UNDER_24H_REVIEW');

            return (
              <div
                key={order.id}
                className={`p-5 rounded-2xl bg-[#0D1322] border space-y-4 shadow-sm transition-colors ${
                  isCashPending ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800/80'
                }`}
              >
                {/* Order Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isCashPending 
                        ? 'bg-amber-950/80 border border-amber-500/40 text-amber-400' 
                        : 'bg-purple-950/60 border border-purple-500/30 text-purple-400'
                    }`}>
                      {isCashPending ? <Banknote className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          #{order.orderNumber}
                        </span>
                        {isCashPending ? (
                          <span className="text-[10px] text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                            <span>24H VERIFICATION IN PROGRESS</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.2 rounded font-mono font-medium">
                            PAID & DELIVERED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()} · {order.paymentMethod === 'CASH_MANUAL' ? 'Cash / Phone Consultation' : order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>View Receipt</span>
                    </button>

                    <button
                      onClick={() => openConversationWithSupport(`Inquiry regarding Order #${order.orderNumber}`)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-purple-300 transition-colors"
                      title="Order Support"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dedicated 24-Hour Review Banner for Cash / Phone Payments */}
                {isCashPending && (
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            Cash / Phone Consultation: 24-Hour Review Window Active
                          </h4>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                            Order is held under review for up to 24 hours. Our accounts desk will call or WhatsApp your registered number to verify the cash/bank transaction. Once verified, your download tokens unlock immediately.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-500/20 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-slate-300">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                          <span>Billing Desk:</span>
                          <a href="tel:+919876543210" className="font-mono font-bold text-white hover:text-amber-300 underline">
                            +91 98765 43210
                          </a>
                        </span>
                        <a
                          href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello BigVora team, checking status for Order #${order.orderNumber}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded font-bold hover:bg-emerald-900"
                        >
                          WhatsApp
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateTo('messages', { conversationId: `conv-order-${order.id}` })}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3 h-3 text-purple-400" />
                          <span>Open Chat / Upload Proof</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="w-14 h-11 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-mono text-purple-400 font-bold">
                              {item.productType}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {item.format}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {item.productTitle}
                          </h4>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Package Size: <span className="font-mono text-slate-200">{item.fileSize || '38 MB'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Download & Instructions Actions */}
                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                        <button
                          onClick={() => setGuideModalItem({
                            title: item.productTitle,
                            guide: item.installationGuide || '1. Extract ZIP.\n2. Open in Android Studio / IDE.\n3. Run gradle build / npm install.\n4. Connect backend.'
                          })}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Code2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Setup Guide</span>
                        </button>

                        {isCashPending ? (
                          <button
                            disabled
                            className="px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs font-semibold cursor-not-allowed opacity-80 flex items-center gap-1.5"
                            title="Files will unlock once billing lead verifies cash payment"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span>Locked · 24h Review Pending</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDownload(item, order)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all active:scale-95"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download ZIP ({item.fileSize || '42MB'})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              {/* Order Total Footer */}
              <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Licensed directly to {order.customerEmail}</span>
                </span>
                <span className="font-bold text-white text-sm">
                  Total: <span className="font-mono text-purple-300">${order.total.toFixed(2)} USD</span>
                </span>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Setup Guide Modal */}
      {guideModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0D1322] border border-purple-500/40 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setGuideModalItem(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Installation & Setup Instructions</span>
            </h3>
            <p className="text-xs text-purple-300 font-medium mt-1">
              {guideModalItem.title}
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {guideModalItem.guide}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setGuideModalItem(null)}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0D1322] border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center pb-4 border-b border-slate-800">
              <BigVoraLogo size="md" variant="stacked" className="mb-2" />
              <p className="text-[11px] font-mono text-purple-400">Order #{selectedReceiptOrder.orderNumber}</p>
              <span className="text-[10px] text-slate-500 block mt-1">
                {new Date(selectedReceiptOrder.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Customer:</span>
                <span className="text-white font-medium">{selectedReceiptOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Email:</span>
                <span className="text-white font-medium">{selectedReceiptOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tx Reference:</span>
                <span className="font-mono text-slate-300">{selectedReceiptOrder.paymentTransactionId}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                {selectedReceiptOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span className="truncate max-w-[200px]">{it.productTitle}</span>
                    <span className="font-mono">${it.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
                <span>Total Paid:</span>
                <span className="font-mono text-purple-300">${selectedReceiptOrder.total.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
