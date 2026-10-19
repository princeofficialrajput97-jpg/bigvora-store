import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BigVoraLogo } from '../common/BigVoraLogo';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  Lock,
  Download,
  Banknote,
  PhoneCall,
  Clock,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface CheckoutModalProps {
  finalTotal: number;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ finalTotal, onClose }) => {
  const { placeOrder, user, navigateTo, approveCashPayment, showToast } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NETBANKING' | 'CRYPTO' | 'CASH_MANUAL'>('CARD');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [status, setStatus] = useState<'INPUT' | 'PROCESSING' | 'SUCCESS' | 'CASH_WAIT_24H' | 'FAILED'>('INPUT');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  // Form Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cashCustomerPhone, setCashCustomerPhone] = useState(user?.phone || '');
  const [cashWhatsappPhone, setCashWhatsappPhone] = useState(user?.phone || '');
  const [cashReferenceNote, setCashReferenceNote] = useState('');
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 48 });

  React.useEffect(() => {
    if (status !== 'CASH_WAIT_24H') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const handlePay = async (simulateFailure = false) => {
    if (!termsAccepted) {
      setErrorMessage('Please accept the digital license and terms to continue.');
      return;
    }

    setErrorMessage('');
    setStatus('PROCESSING');

    // Process payment
    setTimeout(async () => {
      if (simulateFailure) {
        setStatus('FAILED');
        setErrorMessage('Payment declined by payment issuer (Transaction was not approved).');
        return;
      }

      const txId = paymentMethod === 'CASH_MANUAL' 
        ? `CASH-REQ-${Date.now().toString().slice(-8)}` 
        : `BV-TXN-${Date.now().toString().slice(-8)}`;

      const extraNotes = paymentMethod === 'CASH_MANUAL' 
        ? `Calling Phone: ${cashCustomerPhone} | WhatsApp: ${cashWhatsappPhone} | Note: ${cashReferenceNote}` 
        : undefined;

      const result = await placeOrder(paymentMethod, txId, extraNotes);

      if (result.success && result.order) {
        setConfirmedOrderId(result.order.id);
        setConfirmedOrderNumber(result.order.orderNumber);

        if (paymentMethod === 'CASH_MANUAL') {
          setStatus('CASH_WAIT_24H');
        } else {
          setStatus('SUCCESS');
        }
      } else {
        setStatus('FAILED');
        setErrorMessage(result.error || 'Server rejected order: Item is SOLD OUT or unavailable.');
      }
    }, 1500);
  };

  const handleSimulateCashApproval = async () => {
    if (!confirmedOrderId) return;
    setStatus('PROCESSING');
    await approveCashPayment(confirmedOrderId);
    setStatus('SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0D1322] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/60 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        {status !== 'PROCESSING' && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 1. PROCESSING VIEW */}
        {status === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-purple-900/30 border-t-purple-500 animate-spin" />
              <Lock className="w-6 h-6 text-purple-400 absolute top-5 left-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Verifying Transaction & Inventory...</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Locking server license tokens, verifying reservation leases, and minting order records.
            </p>
          </div>
        )}

        {/* 2. SUCCESS VIEW (Instant Gateway Delivery) */}
        {status === 'SUCCESS' && (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Payment Verified & Delivered!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your digital product source code & APK have been unlocked and delivered.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Order Ref:</span>
                <span className="font-mono text-purple-300 font-bold">#{confirmedOrderNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">DELIVERED</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Paid:</span>
                <span className="font-mono text-white">${finalTotal.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigateTo('orders');
                }}
                className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
              >
                <Download className="w-4 h-4" />
                <span>Go to My Downloads</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. CASH / MANUAL PAYMENT 24-HOUR WAIT VIEW */}
        {status === 'CASH_WAIT_24H' && (
          <div className="py-6 text-center space-y-5">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/40">
                <Clock className="w-8 h-8" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold mb-2">
                <span>24-HOUR VERIFICATION WINDOW INITIATED</span>
              </div>
              <h3 className="text-xl font-black text-white">Cash / Phone Payment Registered!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                Order <strong className="text-purple-300">#{confirmedOrderNumber}</strong> has been logged. Our accounts desk is reviewing your payment over the phone/WhatsApp.
              </p>
            </div>

            {/* 24-Hour Timer & Call Notice Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Review Window:</span>
                <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>{String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s Remaining</span>
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-slate-400">Billing Desk:</span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href="tel:+919876543210"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white rounded-lg font-mono text-xs font-bold transition-colors"
                      title="Call Billing Desk"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
                      <span>+91 98765 43210</span>
                    </a>
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello BigVora Billing, I have placed Cash Order #${confirmedOrderNumber} for $${finalTotal.toFixed(2)} USD and would like payment verification.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg font-mono text-xs font-bold transition-colors"
                      title="WhatsApp Billing Desk"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your license stock is transactionally reserved during review.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-200">
                <strong>Next Step:</strong> You can upload your payment receipt or UTR screenshot in the linked <em>Messages</em> thread. Once approved, your download keys will unlock instantly!
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigateTo('orders');
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all"
              >
                <span>Track 24-Hour Status in My Orders</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigateTo('messages');
                }}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>Open Chat & Send Screenshot Proof</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. FAILED VIEW */}
        {status === 'FAILED' && (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-950 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Payment Failed</h3>
              <p className="text-xs text-red-300 mt-1">{errorMessage}</p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setStatus('INPUT')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Payment</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-red-950/60 border border-red-800/40 text-red-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 5. INPUT VIEW */}
        {status === 'INPUT' && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <BigVoraLogo size="sm" variant="horizontal" className="mb-2" />
                <h3 className="text-xl font-extrabold text-white">Complete Purchase</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-white">${finalTotal.toFixed(2)}</span>
                  <span className="text-xs text-slate-400">USD (Inclusive of taxes)</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Payment Method Selector (Includes CASH / CALL) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                onClick={() => setPaymentMethod('CARD')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-purple-950/60 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span className="text-[11px] font-semibold">Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod('UPI')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-purple-950/60 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-semibold">UPI/GPay</span>
              </button>

              <button
                onClick={() => setPaymentMethod('CASH_MANUAL')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'CASH_MANUAL'
                    ? 'bg-amber-950/60 border-amber-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Banknote className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-300">Cash / Call</span>
              </button>

              <button
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'NETBANKING'
                    ? 'bg-purple-950/60 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-[11px] font-semibold">NetBanking</span>
              </button>

              <button
                onClick={() => setPaymentMethod('CRYPTO')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'CRYPTO'
                    ? 'bg-purple-950/60 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-semibold">USDT/Web3</span>
              </button>
            </div>

            {/* Input Details: CASH / CALL METHOD */}
            {paymentMethod === 'CASH_MANUAL' && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 text-xs">
                <div className="flex items-start gap-2.5">
                  <PhoneCall className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-xs">
                      Cash / Direct Phone Consultation & Verification
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Pay via direct bank transfer, cash, or phone consultation. Our billing team will verify your payment details and release digital files within <strong>24 hours</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Official Billing Desk:</span>
                    <div className="flex items-center gap-1.5">
                      <a href="tel:+919876543210" className="font-bold text-purple-300 hover:text-white font-mono underline">
                        +91 98765 43210
                      </a>
                      <a
                        href="https://wa.me/919876543210?text=Hello%20BigVora%20Billing%2C%20I%20want%20to%20inquire%20about%20Cash%20Payment"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold hover:bg-emerald-900"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Toll-Free Helpline:</span>
                    <a href="tel:+18005828672" className="font-bold text-slate-300 hover:text-white font-mono">
                      +1 (800) 582-VORA
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Verification Timeline:</span>
                    <span className="text-amber-400 font-bold font-mono">24 Hours Review Window</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Your Contact Calling Phone Number * (for verification call)</label>
                  <input
                    type="tel"
                    value={cashCustomerPhone}
                    onChange={e => setCashCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210 or +1 (555) 782-3921"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Your WhatsApp Number * (for instant screenshot receipt review)</label>
                  <input
                    type="tel"
                    value={cashWhatsappPhone}
                    onChange={e => setCashWhatsappPhone(e.target.value)}
                    placeholder="+91 98765 43210 or +1 (555) 782-3921"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Payment Note / UTR / Reference (Optional)</label>
                  <input
                    type="text"
                    value={cashReferenceNote}
                    onChange={e => setCashReferenceNote(e.target.value)}
                    placeholder="e.g. Paid cash at desk / UTR #9821382"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>
            )}

            {/* Input Details: CARD */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono placeholder-slate-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono placeholder-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono placeholder-slate-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Input Details: UPI */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                <label className="block text-slate-400">Virtual Payment Address (VPA / UPI ID)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. username@okhdfcbank"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono placeholder-slate-600"
                />
                <span className="text-[10px] text-slate-500">Supports Google Pay, PhonePe, Paytm and BHIM UPI</span>
              </div>
            )}

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-purple-600 focus:ring-0"
              />
              <span>
                I accept the digital ownership license, single-buyer usage terms, and verification guidelines.
              </span>
            </label>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handlePay(false)}
                className={`w-full py-3.5 px-4 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all ${
                  paymentMethod === 'CASH_MANUAL'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-950/40'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/40'
                }`}
              >
                {paymentMethod === 'CASH_MANUAL' ? (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Confirm Cash Order (${finalTotal.toFixed(2)}) & Start 24h Review</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Pay ${finalTotal.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
