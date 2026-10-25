import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles, AlertCircle, CreditCard, MessageSquare } from 'lucide-react';
import { CartItem } from '../types';
import { calculateCartTotals } from '../utils/cartLogic';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  orderType: 'delivery' | 'pickup';
  onToggleOrderType: (type: 'delivery' | 'pickup') => void;
  onProceedToCheckout: () => void;
  onProceedToWhatsApp: () => void;
  discountAmount: number;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  appliedCoupon: string | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderType,
  onToggleOrderType,
  onProceedToCheckout,
  onProceedToWhatsApp,
  discountAmount,
  onApplyCoupon,
  appliedCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, orderType, discountAmount);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = onApplyCoupon(couponInput.trim());
    if (res.success) {
      setCouponFeedback({ type: 'success', text: res.message });
    } else {
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  const freeDeliveryPercent = Math.min(
    100,
    Math.round((totals.subtotal / totals.freeDeliveryThreshold) * 100)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 id="cart-heading" className="text-lg font-black text-stone-900 font-heading">
                  Your Juice Bag
                </h2>
                <p className="text-xs text-stone-500">
                  {totals.totalItems} {totals.totalItems === 1 ? 'item' : 'items'} ready for fresh prep
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery vs Pickup Selector */}
          <div className="p-4 bg-orange-50/40 border-b border-orange-100">
            <div className="grid grid-cols-2 p-1 bg-stone-200/70 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => onToggleOrderType('delivery')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🛵 Home Delivery
              </button>
              <button
                type="button"
                onClick={() => onToggleOrderType('pickup')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🛍️ Self Pickup
              </button>
            </div>

            {/* Free Delivery Bar (only for Delivery) */}
            {orderType === 'delivery' && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                  <span className="text-stone-600">
                    {totals.amountNeededForFreeDelivery > 0
                      ? `Add ₹${totals.amountNeededForFreeDelivery} more for FREE Delivery`
                      : '🎉 You unlocked FREE Home Delivery!'}
                  </span>
                  <span className="text-orange-600 font-bold">{freeDeliveryPercent}%</span>
                </div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Items Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-3xl mb-4">
                  🥤
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Your cart is feeling thirsty!
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore our cold-pressed juices, velvety shakes, and fruit blasts to fill your bag.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 bg-[#0A2616] text-amber-300 hover:bg-[#14482b] px-6 py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-orange-200 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {item.name}
                    </h4>

                    {/* Customization labels */}
                    {item.customization && (
                      <p className="text-[11px] text-stone-500 truncate">
                        {[item.customization.size, item.customization.sweetness, item.customization.iceLevel]
                          .filter(Boolean)
                          .join(' • ')}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-[#0A2616]">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Stepper controls */}
                      <div className="flex items-center gap-1.5 bg-stone-100 p-0.5 rounded-lg">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name}`}
                          className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name}`}
                          className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-stone-300 hover:text-rose-500 p-1.5 transition-colors self-start cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary & Checkout Actions */}
          {items.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
              {/* Promo code form */}
              <form onSubmit={handleApply} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Coupon: FRESH10 or FRESHSIP20"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold uppercase bg-white focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {couponFeedback && (
                <p className={`text-[11px] font-medium ${couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {couponFeedback.text}
                </p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <span>Coupon {appliedCoupon} active</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}

              {/* Cost Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Item Subtotal ({totals.totalItems} items)</span>
                  <span className="font-semibold text-stone-900">₹{totals.subtotal}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{totals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>
                    Delivery Fee {orderType === 'pickup' ? '(Self Pickup)' : totals.deliveryFee === 0 ? '(Free over ₹249)' : ''}
                  </span>
                  <span className={`font-semibold ${totals.deliveryFee === 0 ? 'text-emerald-600' : 'text-stone-900'}`}>
                    {totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#0A2616] pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span>₹{totals.grandTotal}</span>
                </div>
              </div>

              {/* Primary Action: Proceed to Checkout */}
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 bg-[#FF5E0E] hover:bg-[#E24D00] text-white py-3 px-4 rounded-2xl font-bold text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Checkout • ₹{totals.grandTotal}</span>
              </button>

              {/* Secondary Action: Order via WhatsApp */}
              <button
                type="button"
                onClick={onProceedToWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Or Order on WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-stone-400 hover:text-stone-600 underline cursor-pointer"
                >
                  Clear bag
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
