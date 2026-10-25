import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight, ShieldCheck, Clock, MapPin, Phone, User, MessageSquare } from 'lucide-react';
import { CartItem, CheckoutFormState, OrderRecord, PaymentMethod } from '../types';
import { SHOP_CONFIG } from '../shopConfig';
import { calculateCartTotals, buildWhatsAppLink } from '../utils/cartLogic';
import { OrderService } from '../services/orderService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: 'delivery' | 'pickup';
  onOrderTypeChange: (type: 'delivery' | 'pickup') => void;
  discountAmount: number;
  appliedCoupon: string | null;
  onOrderPlaced: (order: OrderRecord) => void;
  onOpenTracking: (orderId: string, phone: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  onOrderTypeChange,
  discountAmount,
  appliedCoupon,
  onOrderPlaced,
  onOpenTracking,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState(SHOP_CONFIG.supportedDeliveryAreas[0] || 'Central Market');
  const [customLocality, setCustomLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(orderType === 'pickup' ? 'pickup_pay' : 'cod');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, orderType, discountAmount);
  const effectiveLocality = locality === 'Other' ? customLocality : locality;
  const isSupportedArea =
    orderType === 'pickup' ||
    SHOP_CONFIG.supportedDeliveryAreas.some((a) => a.toLowerCase() === effectiveLocality.trim().toLowerCase());

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (orderType === 'delivery') {
      if (!address || address.trim().length < 5) {
        setErrorMessage('Please enter your complete delivery street address.');
        return;
      }
      if (locality === 'Other' && (!customLocality || customLocality.trim().length < 2)) {
        setErrorMessage('Please specify your locality or area.');
        return;
      }
      if (!isSupportedArea) {
        setErrorMessage(
          `Sorry, "${effectiveLocality}" is outside our delivery zone. Please choose an area from the list or select Self Pickup.`
        );
        return;
      }
    }

    if (totals.subtotal < SHOP_CONFIG.minOrderAmount) {
      setErrorMessage(`Minimum order amount is ₹${SHOP_CONFIG.minOrderAmount}. Please add more items.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Idempotency token based on timestamp and form
      const idempotencyToken = `nonce-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const formState: CheckoutFormState = {
        customerName,
        phoneNumber: cleanPhone,
        orderType,
        address: orderType === 'delivery' ? `${address}, Locality: ${effectiveLocality}${landmark ? ', Landmark: ' + landmark : ''}` : 'Shop Stall Pickup',
        locality: effectiveLocality,
        landmark,
        orderNotes,
        preferredTime: 'ASAP',
        paymentMethod,
      };

      const placed = await OrderService.placeOrder({
        form: formState,
        items,
        subtotal: totals.subtotal,
        deliveryFee: totals.deliveryFee,
        discount: totals.discount,
        grandTotal: totals.grandTotal,
        couponCode: appliedCoupon,
        idempotencyToken,
      });

      setConfirmedOrder(placed);
      onOrderPlaced(placed);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong while placing your order. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareOnWhatsApp = (order: OrderRecord) => {
    const lines = [
      `🍹 *NEW ORDER CONFIRMATION — AJJU JUICE WALA*`,
      `🔖 *Order ID:* ${order.id}`,
      `👤 *Customer:* ${order.customer.name} (${order.customer.phone})`,
      `🛵 *Type:* ${order.orderType === 'delivery' ? 'Home Delivery' : 'Self Pickup'}`,
      order.orderType === 'delivery' ? `📍 *Address:* ${order.customer.address}` : '',
      `🛒 *Items:*`,
      ...order.items.map((i) => `• ${i.name} (${i.size || 'Regular'}) x ${i.quantity} = ₹${i.price * i.quantity}`),
      `💰 *Total:* ₹${order.grandTotal} (${order.paymentMethod.toUpperCase()})`,
      `⚡ *Status:* ${order.status}`,
    ].filter(Boolean);

    const link = buildWhatsAppLink(SHOP_CONFIG.whatsappNumber, lines.join('\n'));
    window.location.href = link;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="checkout-modal-title" className="text-base sm:text-lg font-black text-stone-900 font-heading">
                {confirmedOrder ? 'Order Placed Successfully!' : 'Fast Checkout & Details'}
              </h2>
              <p className="text-xs text-stone-500">
                {confirmedOrder ? `Order Reference: ${confirmedOrder.id}` : 'Handcrafted fresh juices delivered to your doorstep'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {confirmedOrder ? (
            /* ==========================================
               ORDER CONFIRMATION SUCCESS VIEW
               ========================================== */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {confirmedOrder.status}
                </span>
                <h3 className="text-2xl font-black text-stone-900 font-heading mt-3">
                  Thank you for ordering from Ajju Juice Wala!
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  Your order has been placed successfully and received by the kitchen.
                </p>
              </div>

              {/* Order ID Badge Card */}
              <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200 max-w-md mx-auto text-left">
                <div className="flex items-center justify-between pb-2 border-b border-orange-200/60">
                  <span className="text-xs font-semibold text-stone-600">Order Reference ID</span>
                  <span className="text-sm font-black text-[#FF5E0E] font-mono tracking-wider">
                    {confirmedOrder.id}
                  </span>
                </div>
                <div className="pt-2 text-xs text-stone-600 space-y-1">
                  <p><strong>Customer:</strong> {confirmedOrder.customer.name} ({confirmedOrder.customer.phone})</p>
                  <p><strong>Order Type:</strong> {confirmedOrder.orderType === 'delivery' ? '🛵 Home Delivery' : '🛍️ Self Stall Pickup'}</p>
                  {confirmedOrder.customer.address && (
                    <p className="line-clamp-2"><strong>Address:</strong> {confirmedOrder.customer.address}</p>
                  )}
                  <p><strong>Estimated Prep/Delivery:</strong> {confirmedOrder.estimatedTime}</p>
                  <p><strong>Payment Method:</strong> {confirmedOrder.paymentMethod.toUpperCase()} (₹{confirmedOrder.grandTotal})</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTracking(confirmedOrder.id, confirmedOrder.customer.phone);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0A2616] text-amber-300 hover:bg-[#14482b] py-3.5 px-5 rounded-2xl font-bold text-xs shadow-md cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Live Order Tracker</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareOnWhatsApp(confirmedOrder)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-5 rounded-2xl font-bold text-xs shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send to WhatsApp</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer"
                >
                  Continue Browsing Menu
                </button>
              </div>
            </div>
          ) : (
            /* ==========================================
               CHECKOUT FORM VIEW
               ========================================== */
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Order Mode Toggle */}
              <div>
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
                  1. Delivery Option
                </label>
                <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      onOrderTypeChange('delivery');
                      setPaymentMethod('cod');
                    }}
                    className={`py-3 px-4 rounded-xl transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    🛵 Home Delivery ({SHOP_CONFIG.estimatedDeliveryTime})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOrderTypeChange('pickup');
                      setPaymentMethod('pickup_pay');
                    }}
                    className={`py-3 px-4 rounded-xl transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    🛍️ Self Stall Pickup ({SHOP_CONFIG.estimatedPrepTime})
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  2. Contact Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Mobile Number (10 Digits) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address (only for delivery) */}
              {orderType === 'delivery' ? (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                    3. Delivery Location
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Select Delivery Area / Locality *
                      </label>
                      <select
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 focus:outline-none focus:border-orange-500"
                      >
                        {SHOP_CONFIG.supportedDeliveryAreas.map((area) => (
                          <option key={area} value={area}>
                            {area} (Standard Delivery)
                          </option>
                        ))}
                        <option value="Other">Other Area...</option>
                      </select>
                    </div>

                    {locality === 'Other' && (
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Enter Your Locality Name *
                        </label>
                        <input
                          type="text"
                          value={customLocality}
                          onChange={(e) => setCustomLocality(e.target.value)}
                          placeholder="Your locality / colony"
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Near Temple / Metro / Hospital"
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Complete Street Address / Flat No. / Building *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <textarea
                        rows={2}
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Flat No., Floor, Building Name, Street"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Pickup Location:</span>
                  </div>
                  <p className="font-semibold">{SHOP_CONFIG.brandName}</p>
                  <p className="text-emerald-800">{SHOP_CONFIG.address}</p>
                  <p className="text-[11px] text-emerald-700">Estimated Ready Time: {SHOP_CONFIG.estimatedPrepTime} from order placement.</p>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  Optional Preparation Instructions
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Extra cold please, keep straws separate, no ice in shake"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
                  4. Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {orderType === 'delivery' && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-xl border text-xs font-bold text-left cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-1 ring-orange-500'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <p>💵 Cash on Delivery</p>
                      <p className="text-[10px] text-stone-500 font-normal mt-0.5">Pay cash to delivery rider</p>
                    </button>
                  )}

                  {orderType === 'pickup' && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pickup_pay')}
                      className={`p-3 rounded-xl border text-xs font-bold text-left cursor-pointer transition-all ${
                        paymentMethod === 'pickup_pay'
                          ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-1 ring-orange-500'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <p>🏪 Pay at Stall</p>
                      <p className="text-[10px] text-stone-500 font-normal mt-0.5">Cash or UPI at shop counter</p>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left cursor-pointer transition-all ${
                      paymentMethod === 'online'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-1 ring-orange-500'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p>💳 UPI / Online</p>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                        Instant
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-normal mt-0.5">GPay, PhonePe, Paytm QR</p>
                  </button>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900 pb-2 border-b border-stone-200">
                  <span>Order Summary ({totals.totalItems} items)</span>
                  <span>₹{totals.grandTotal}</span>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1 text-xs text-stone-600 pr-1">
                  {items.map((i) => (
                    <div key={i.id} className="flex justify-between items-center text-[11px]">
                      <span>{i.name} ({i.customization?.size || 'Regular'}) x {i.quantity}</span>
                      <span className="font-semibold">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totals.subtotal}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({appliedCoupon})</span>
                      <span>-₹{totals.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className={totals.deliveryFee === 0 ? 'text-emerald-600 font-semibold' : ''}>
                      {totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-stone-200">
                    <span>Payable Amount</span>
                    <span>₹{totals.grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#FF5E0E] hover:bg-[#E24D00] disabled:opacity-60 text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Placing Order with Kitchen...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Place Order • ₹{totals.grandTotal}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
