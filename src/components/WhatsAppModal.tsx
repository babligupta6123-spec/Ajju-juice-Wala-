import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle, Info, Settings, MapPin, Phone, User, Clock, MessageSquare } from 'lucide-react';
import { CartItem, CheckoutFormState } from '../types';
import {
  calculateCartTotals,
  validateCheckoutForm,
  formatWhatsAppMessage,
  buildWhatsAppLink,
} from '../utils/cartLogic';
import { STORE_INFO } from '../data/products';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: 'delivery' | 'pickup';
  onOrderTypeChange: (type: 'delivery' | 'pickup') => void;
  discountAmount: number;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  onOrderTypeChange,
  discountAmount,
}) => {
  const [formData, setFormData] = useState<CheckoutFormState>({
    customerName: '',
    phoneNumber: '',
    orderType: orderType,
    address: '',
    locality: 'Central Market',
    landmark: '',
    orderNotes: '',
    preferredTime: 'ASAP (Next available slot)',
    paymentMethod: 'cod',
  });

  const [shopWhatsappNumber, setShopWhatsappNumber] = useState(STORE_INFO.whatsappNumber);
  const [showConfig, setShowConfig] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormState, string>>>({});
  const [showPreview, setShowPreview] = useState(false);

  const [openedUrl, setOpenedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, formData.orderType, discountAmount);
  const formattedMessage = formatWhatsAppMessage({
    items,
    totals,
    customer: formData,
    shopName: STORE_INFO.name,
  });

  const handleInputChange = (
    field: keyof CheckoutFormState,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'orderType') {
        onOrderTypeChange(value as 'delivery' | 'pickup');
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateCheckoutForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const waUrl = buildWhatsAppLink(shopWhatsappNumber, formattedMessage);
    setOpenedUrl(waUrl);

    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // In case window.open is restricted
    }
  };


  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#0F3822] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-stone-300 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center text-2xl shadow-md">
              💬
            </div>
            <div>
              <h2 id="checkout-modal-title" className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                Complete Order via WhatsApp
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                Quick, direct chat checkout with {STORE_INFO.name}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {openedUrl ? (
            <div className="py-6 px-2 text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-[#25D366] text-white flex items-center justify-center mx-auto text-3xl shadow-xl shadow-emerald-500/25">
                💬
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-stone-900 font-heading">
                  WhatsApp Order Ready!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                  We've prepared your order message for <strong>{formData.customerName}</strong>.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-emerald-950">
                  <span>Order Preference:</span>
                  <span>{formData.orderType === 'delivery' ? '🛵 Home Delivery' : '🛍️ Self Pickup'}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Total Items:</span>
                  <span className="font-semibold">{totals.totalItems} items</span>
                </div>
                <div className="flex justify-between font-black text-stone-900 pt-1.5 border-t border-emerald-200/80 text-sm">
                  <span>Grand Total:</span>
                  <span className="text-[#0A2616]">₹{totals.grandTotal}</span>
                </div>
              </div>

              <div className="pt-2 max-w-md mx-auto space-y-3">
                <a
                  href={openedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 rounded-2xl font-black text-base shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
                >
                  <span>👉 Open WhatsApp Chat Directly</span>
                </a>

                <button
                  type="button"
                  onClick={() => setOpenedUrl(null)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline block mx-auto py-1 cursor-pointer"
                >
                  Edit details or modify order
                </button>
              </div>

              <p className="text-[11px] text-stone-400 max-w-xs mx-auto pt-2">
                📌 Note: Our team will verify fruit availability and confirm your order in the chat.
              </p>
            </div>
          ) : (
            <>
              {/* Shop Confirmation Disclaimer Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Important Note on Order Confirmation:</p>
                  <p className="text-amber-800 leading-relaxed">
                    Clicking the button will open WhatsApp with your pre-formatted order details.
                    <strong> Your order is completed and scheduled only after our juice bar team confirms availability and replies to your message.</strong>
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Order Type Toggle */}
                <div>
                  <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
                    Order Preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('orderType', 'delivery')}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        formData.orderType === 'delivery'
                          ? 'border-orange-500 bg-orange-50/80 text-orange-900 ring-2 ring-orange-500/30'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>🛵 Home Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('orderType', 'pickup')}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        formData.orderType === 'pickup'
                          ? 'border-orange-500 bg-orange-50/80 text-orange-900 ring-2 ring-orange-500/30'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>🛍️ Self Pickup</span>
                    </button>
                  </div>
                </div>

                {/* Customer Name */}
                <div>
                  <label htmlFor="customer-name" className="text-xs font-bold text-stone-900 block mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="customer-name"
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 ${
                        errors.customerName
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                    />
                  </div>
                  {errors.customerName && (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="customer-phone" className="text-xs font-bold text-stone-900 block mb-1">
                    WhatsApp Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                      +91
                    </span>
                    <input
                      id="customer-phone"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="98765 43210"
                      className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 ${
                        errors.phoneNumber
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Delivery Address (only if delivery) */}
                {formData.orderType === 'delivery' && (
                  <div>
                    <label htmlFor="customer-address" className="text-xs font-bold text-stone-900 block mb-1">
                      Delivery Address & Landmark <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <textarea
                        id="customer-address"
                        rows={2}
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="House/Flat number, building name, street, nearby landmark"
                        className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 ${
                          errors.address
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                        }`}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                )}

                {/* Preferred Time Slot */}
                <div>
                  <label htmlFor="preferred-time" className="text-xs font-bold text-stone-900 block mb-1">
                    Preferred Preparation / Delivery Time
                  </label>
                  <select
                    id="preferred-time"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="ASAP (Next available slot)">ASAP (Fastest Preparation ~20-30 mins)</option>
                    <option value="Within 45 minutes">Within 45 minutes</option>
                    <option value="In 1 hour">In 1 hour</option>
                    <option value="Evening (5:00 PM – 7:00 PM)">Evening (5:00 PM – 7:00 PM)</option>
                    <option value="Night (8:00 PM – 10:00 PM)">Night (8:00 PM – 10:00 PM)</option>
                  </select>
                </div>

                {/* Order Notes */}
                <div>
                  <label htmlFor="order-notes" className="text-xs font-bold text-stone-900 block mb-1">
                    Optional Instructions / Notes
                  </label>
                  <input
                    id="order-notes"
                    type="text"
                    value={formData.orderNotes}
                    onChange={(e) => handleInputChange('orderNotes', e.target.value)}
                    placeholder="e.g. Ring doorbell, separate straws, less sweet..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Preview Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{showPreview ? 'Hide Message Preview' : 'Show Formatted WhatsApp Message Preview'}</span>
                  </button>

                  {showPreview && (
                    <div className="mt-2 p-3 bg-stone-900 text-emerald-300 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto border border-stone-800">
                      {formattedMessage}
                    </div>
                  )}
                </div>

                {/* Shop WhatsApp Configuration Section */}
                <div className="pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowConfig(!showConfig)}
                    className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Shop WhatsApp Destination: {shopWhatsappNumber} (Click to change placeholder)</span>
                  </button>

                  {showConfig && (
                    <div className="mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                      <p className="font-semibold text-stone-700">
                        Change destination WhatsApp number (e.g., store test line):
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={shopWhatsappNumber}
                          onChange={(e) => setShopWhatsappNumber(e.target.value)}
                          placeholder="e.g. 919876543210"
                          className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShopWhatsappNumber(STORE_INFO.whatsappNumber)}
                          className="text-xs text-stone-600 underline"
                        >
                          Reset default
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 rounded-2xl font-black text-base shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send WhatsApp Order (Total: ₹{totals.grandTotal})</span>
                  </button>
                </div>

              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

