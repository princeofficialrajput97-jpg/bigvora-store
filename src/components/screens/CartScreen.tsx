import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckoutModal } from './CheckoutModal';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const CartScreen: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotal, 
    navigateTo,
    showToast 
  } = useApp();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BIGVORA20') {
      setDiscountPercent(20);
      showToast('Coupon BIGVORA20 applied! 20% discount added.', 'success');
    } else if (couponCode.trim().toUpperCase() === 'FIRST10') {
      setDiscountPercent(10);
      showToast('Coupon FIRST10 applied! 10% discount added.', 'success');
    } else {
      showToast('Invalid coupon code. Try BIGVORA20', 'error');
    }
  };

  const discountAmount = Math.round((cartTotal * (discountPercent / 100)) * 100) / 100;
  const taxableAmount = cartTotal - discountAmount;
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const finalTotal = Math.round((taxableAmount + tax) * 100) / 100;

  // Check if any cart item has become SOLD OUT
  const hasSoldOutItem = cart.some(item => item.product.status === 'SOLD_OUT');

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Explore our marketplace to acquire ready-made Android Kotlin apps or Next.js web applications.
        </p>
        <button
          onClick={() => navigateTo('explore')}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-900/30 transition-all"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
        <span className="text-xs font-mono text-slate-400">
          {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
        </span>
      </div>

      <h1 className="text-2xl font-black text-white">Shopping Cart</h1>

      {hasSoldOutItem && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p>
            An item in your cart was marked <strong>SOLD OUT</strong> by the server inventory. Please remove it before proceeding to checkout.
          </p>
        </div>
      )}

      {/* Cart Items List */}
      <div className="space-y-3">
        {cart.map(item => {
          const isSoldOut = item.product.status === 'SOLD_OUT';
          const isSingleLicense = item.product.licenseModel === 'SINGLE_LICENSE';

          return (
            <div
              key={item.product.id}
              className={`p-4 rounded-2xl bg-[#0D1322] border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isSoldOut ? 'border-red-900/50 bg-red-950/20' : 'border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={item.product.media.thumbnail}
                  alt=""
                  className="w-16 h-12 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-800"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono text-purple-400 font-semibold">
                      {item.product.type === 'APP' ? 'Android App' : 'Website'}
                    </span>
                    {isSoldOut && (
                      <span className="text-[10px] text-red-400 font-bold bg-red-950/80 border border-red-500/40 px-1.5 py-0.2 rounded">
                        SOLD OUT
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">
                    {item.product.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isSingleLicense ? 'Exclusive Single License' : 'Developer License'} · {item.product.format}
                  </div>
                </div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                {/* Quantity modifier (disabled for single-license) */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-2">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isSingleLicense}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs font-bold text-white px-1">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    disabled={Boolean(isSingleLicense || (item.product.availableStock !== undefined && item.quantity >= item.product.availableStock))}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    title={isSingleLicense ? 'Single license products cannot exceed quantity 1' : ''}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-white block">
                    ${item.product.price * item.quantity}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ${item.product.price} each
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code & Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Coupon input */}
        <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Tag className="w-4 h-4 text-purple-400" />
            <span>Discount Promo Code</span>
          </div>
          <form onSubmit={applyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="e.g. BIGVORA20"
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Apply
            </button>
          </form>
          <p className="text-[11px] text-slate-500">
            Use code <code className="text-purple-300 font-mono">BIGVORA20</code> for 20% discount on ready products.
          </p>
        </div>

        {/* Order Calculation */}
        <div className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Summary</h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-slate-200">${cartTotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Discount ({discountPercent}%)</span>
                <span className="font-mono">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>Estimated Tax (8%)</span>
              <span className="font-mono text-slate-200">${tax.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-extrabold text-white">
              <span>Total Amount</span>
              <span className="font-mono text-purple-300">${finalTotal.toFixed(2)} USD</span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            disabled={hasSoldOutItem}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            <span>Proceed to Secure Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Encrypted Checkout · Instant Download</span>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          finalTotal={finalTotal}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

    </div>
  );
};
