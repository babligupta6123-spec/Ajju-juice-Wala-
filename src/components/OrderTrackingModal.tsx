import React, { useState, useEffect } from 'react';
import { X, Search, Clock, CheckCircle2, AlertCircle, Phone, MapPin, RefreshCw, Sparkles } from 'lucide-react';
import { OrderRecord, OrderStatus } from '../types';
import { OrderService } from '../services/orderService';
import { STORE_INFO } from '../data/products';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  initialPhone?: string;
}

const ORDER_STEPS: OrderStatus[] = [
  'Order Received',
  'Order Accepted',
  'Preparing Your Juice',
  'Ready for Pickup or Out for Delivery',
  'Delivered',
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
  initialPhone = '',
}) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (searchId: string = orderId, searchPhone: string = phone) => {
    if (!searchId || searchId.trim().length < 4) {
      setError('Please enter a valid Order ID (e.g. AJJU-74912)');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await OrderService.getOrder(searchId, searchPhone);

    if (result.error) {
      setError(result.error);
      setOrder(null);
    } else if (result.order) {
      setOrder(result.order);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (initialOrderId) {
      setOrderId(initialOrderId);
      if (initialPhone) setPhone(initialPhone);
      handleTrack(initialOrderId, initialPhone);
    }
  }, [initialOrderId, initialPhone, isOpen]);

  if (!isOpen) return null;

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return ORDER_STEPS.indexOf(status);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracking-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="tracking-title" className="text-base sm:text-lg font-black text-stone-900 font-heading">
                Live Order Tracker
              </h2>
              <p className="text-xs text-stone-500">
                Check real-time juice preparation & delivery status
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tracking"
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Tracking Form */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Order ID *
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  placeholder="e.g. AJJU-74912"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono font-bold uppercase bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Customer Phone (Verification)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit phone"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleTrack()}
              className="w-full flex items-center justify-center gap-2 bg-[#0A2616] text-amber-300 hover:bg-[#14482b] py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Checking Status...</span>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Track My Juice Order</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Active Order Status Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Status Banner */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Current Status</span>
                  </div>
                  <h3 className="text-xl font-black text-[#0A2616] font-heading">
                    {order.status}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Order placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Est. {order.estimatedTime}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTrack()}
                  title="Refresh order status"
                  className="p-2 text-emerald-700 hover:text-emerald-900 bg-white rounded-xl border border-emerald-200 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* 5-Step Progress Stepper */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Order Progression
                </label>

                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {ORDER_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step} className="relative flex items-center gap-3">
                        <div
                          className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : isCurrent
                              ? 'bg-[#FF5E0E] text-white border-[#FF5E0E] ring-4 ring-orange-100 scale-110'
                              : 'bg-white text-stone-400 border-stone-300'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-[#FF5E0E]'
                                : isCompleted
                                ? 'text-stone-900'
                                : 'text-stone-400'
                            }`}
                          >
                            {step}
                          </p>
                          {isCurrent && (
                            <p className="text-[11px] text-stone-500 font-medium">
                              {step === 'Order Received' && 'Order sent to counter. Awaiting acknowledgment.'}
                              {step === 'Order Accepted' && 'Kitchen accepted your order. Fresh fruit selection in progress.'}
                              {step === 'Preparing Your Juice' && 'Cold-pressing and blending your custom drinks.'}
                              {step === 'Ready for Pickup or Out for Delivery' && (order.orderType === 'delivery' ? 'Rider dispatched with insulated bag.' : 'Your drinks are chilled and packed at the counter!')}
                              {step === 'Delivered' && 'Order completed. Enjoy your fresh vitality!'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 font-bold text-stone-900">
                  <span>Ordered Items</span>
                  <span>Amount: ₹{order.grandTotal}</span>
                </div>
                <div className="space-y-1.5 text-stone-600">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                      <span>
                        {item.name} ({item.size || 'Regular'}) x {item.quantity}
                      </span>
                      <span className="font-semibold text-stone-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-[11px] text-stone-500">
                  <span>Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</span>
                  <span>Type: {order.orderType === 'delivery' ? 'Home Delivery' : 'Stall Pickup'}</span>
                </div>
              </div>

              {/* Call Shop Help */}
              <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <span className="text-amber-950 font-medium">Need immediate update? Call shop:</span>
                </div>
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="font-bold text-orange-700 hover:text-orange-900 underline"
                >
                  {STORE_INFO.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
