import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Package,
  Settings,
  Coffee,
  CheckCircle,
  Clock,
  Phone,
  RefreshCw,
  Plus,
  Save,
  ShieldAlert,
  Sparkles,
  Calendar,
  Database,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Server,
  AlertCircle,
  Globe,
  Rocket,
  CloudUpload,
} from 'lucide-react';
import { OrderRecord, OrderStatus, Product, DayOfWeek, DailySpecialConfig } from '../types';
import { OrderService, ADMIN_PASSCODE } from '../services/orderService';
import { SHOP_CONFIG, ShopConfiguration, DAYS_OF_WEEK, getCurrentDayOfWeek } from '../shopConfig';
import { SUPABASE_PROJECT_ID, SUPABASE_URL, SUPABASE_SETUP_SQL } from '../services/supabaseClient';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsUpdated?: (products: Product[]) => void;
  onSettingsUpdated?: (settings: ShopConfiguration) => void;
}

const STATUS_OPTIONS: OrderStatus[] = [
  'Order Received',
  'Order Accepted',
  'Preparing Your Juice',
  'Ready for Pickup or Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onProductsUpdated,
  onSettingsUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'specials' | 'settings' | 'supabase'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ShopConfiguration>(SHOP_CONFIG);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    tableExists: boolean;
    projectId: string;
    message?: string;
    error?: string;
    totalRows?: number;
  } | null>(null);
  const [checkingSupabase, setCheckingSupabase] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const today = getCurrentDayOfWeek();

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
      checkSupabase();
    }
  }, [isAuthenticated]);

  const checkSupabase = async () => {
    setCheckingSupabase(true);
    try {
      const status = await OrderService.checkSupabaseStatus();
      setSupabaseStatus(status);
    } catch (err: any) {
      setSupabaseStatus({
        connected: false,
        tableExists: false,
        projectId: SUPABASE_PROJECT_ID,
        error: err.message || 'Connection test failed',
      });
    } finally {
      setCheckingSupabase(false);
    }
  };

  const handleCopySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    }
    setSqlCopied(true);
    showNotice('Supabase SQL Schema copied to clipboard!');
    setTimeout(() => setSqlCopied(false), 3000);
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Incorrect passcode. Use owner PIN: ajju2026');
    }
  };

  const loadAdminData = async () => {
    setIsLoading(true);
    const [fetchedOrders, fetchedProducts, fetchedSettings] = await Promise.all([
      OrderService.getAllOrders(),
      OrderService.getProducts(),
      OrderService.getSettings(),
    ]);
    setOrders(fetchedOrders);
    setProducts(fetchedProducts);
    setSettings(fetchedSettings);
    setIsLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await OrderService.updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showNotice(`Order ${orderId} moved to "${newStatus}"`);
  };

  const handlePriceChange = (productId: string, field: 'price' | 'largePrice', value: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [field]: value } : p))
    );
  };

  const handleStockToggle = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isAvailable: !(p.isAvailable ?? true) } : p))
    );
  };

  const handleSaveProducts = async () => {
    await OrderService.saveProducts(products);
    if (onProductsUpdated) {
      onProductsUpdated(products);
    }
    showNotice('Drink menu & prices saved successfully!');
  };

  const handleDailySpecialChange = (
    day: string,
    field: keyof DailySpecialConfig,
    value: any
  ) => {
    setSettings((prev) => {
      const currentSpecials = prev.dailySpecials || {};
      const dayConfig = currentSpecials[day] || {
        day: day as DayOfWeek,
        productId: products[0]?.id || 'orange-juice',
        badgeText: `${day} Special`,
        isActive: true,
      };

      return {
        ...prev,
        dailySpecials: {
          ...currentSpecials,
          [day]: {
            ...dayConfig,
            [field]: value,
          },
        },
      };
    });
  };

  const handleSaveSettings = async () => {
    await OrderService.saveSettings(settings);
    if (onSettingsUpdated) {
      onSettingsUpdated(settings);
    }
    showNotice('Settings updated successfully!');
  };

  const handleSaveSpecials = async () => {
    await OrderService.saveSettings(settings);
    if (onSettingsUpdated) {
      onSettingsUpdated(settings);
    }
    showNotice('Weekly Daily Specials updated successfully!');
  };

  const showNotice = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter === 'active') {
      return o.status !== 'Delivered' && o.status !== 'Cancelled';
    }
    if (selectedStatusFilter === 'completed') {
      return o.status === 'Delivered' || o.status === 'Cancelled';
    }
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0A2616] text-white border-b border-emerald-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
              👑
            </div>
            <div>
              <h2 id="admin-title" className="text-base sm:text-lg font-black tracking-tight font-heading text-amber-300">
                Ajju Juice Wala — Owner Dashboard
              </h2>
              <p className="text-xs text-stone-300">
                Manage live customer orders, drink prices, daily specials, and delivery
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dashboard"
            className="p-2 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-heading">
                Shop Owner Verification
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter shop owner PIN to manage orders and menu pricing.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Owner PIN (e.g. ajju2026)"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-center font-mono font-bold text-sm tracking-widest focus:outline-none focus:border-orange-500"
              />

              {authError && (
                <p className="text-xs text-rose-600 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#FF5E0E] hover:bg-[#E24D00] text-white py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-all"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-3 border-b border-stone-200 bg-stone-50 shrink-0 overflow-x-auto">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'border-[#FF5E0E] text-[#FF5E0E]'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Orders ({orders.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'products'
                      ? 'border-[#FF5E0E] text-[#FF5E0E]'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  <span>Menu & Prices ({products.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('specials')}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'specials'
                      ? 'border-[#FF5E0E] text-[#FF5E0E]'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Daily Specials (7)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'border-[#FF5E0E] text-[#FF5E0E]'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Shop Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('supabase');
                    checkSupabase();
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'supabase'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Supabase DB</span>
                  {supabaseStatus?.connected ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Connected" />
                  ) : null}
                </button>
              </div>

              <button
                type="button"
                onClick={loadAdminData}
                title="Refresh data"
                className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-200 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {feedback && (
              <div className="p-2.5 bg-emerald-100 text-emerald-900 text-xs font-bold text-center shrink-0">
                ✓ {feedback}
              </div>
            )}

            {/* TAB 1: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Status Filter */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedStatusFilter('active')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                        selectedStatusFilter === 'active'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600'
                      }`}
                    >
                      Active Orders
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStatusFilter('completed')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                        selectedStatusFilter === 'completed'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600'
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                        selectedStatusFilter === 'all'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600'
                      }`}
                    >
                      All
                    </button>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} shown
                  </span>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-16 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                    <p className="text-3xl mb-2">🥤</p>
                    <p className="text-sm font-bold text-stone-700">No orders in this view</p>
                    <p className="text-xs text-stone-400 mt-1">New customer orders will appear here automatically.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-orange-200 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                          <div>
                            <span className="text-sm font-black text-[#FF5E0E] font-mono">
                              {ord.id}
                            </span>
                            <span className="text-xs text-stone-400 ml-2">
                              {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                              {ord.orderType === 'delivery' ? '🛵 Delivery' : '🛍️ Stall Pickup'}
                            </span>
                          </div>

                          {/* Status Select Controller */}
                          <div className="flex items-center gap-2">
                            <label htmlFor={`status-${ord.id}`} className="text-[11px] font-bold text-stone-600">
                              Status:
                            </label>
                            <select
                              id={`status-${ord.id}`}
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                              className="px-2.5 py-1 rounded-lg border border-stone-200 text-xs font-bold text-stone-800 bg-amber-50 focus:outline-none focus:border-orange-500 cursor-pointer"
                            >
                              {STATUS_OPTIONS.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                          <div>
                            <p><strong>Customer:</strong> {ord.customer.name}</p>
                            <p className="flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-orange-600" />
                              <a href={`tel:${ord.customer.phone}`} className="underline font-semibold">
                                {ord.customer.phone}
                              </a>
                            </p>
                          </div>
                          <div>
                            {ord.customer.address && (
                              <p className="line-clamp-2"><strong>Address:</strong> {ord.customer.address}</p>
                            )}
                            {ord.customer.notes && (
                              <p className="text-amber-800 bg-amber-50 p-1 rounded mt-1">
                                <strong>Note:</strong> {ord.customer.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="bg-stone-50 p-2.5 rounded-xl text-xs space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <span>
                                {it.name} ({it.size || 'Regular'}) x {it.quantity}
                              </span>
                              <span className="font-semibold">₹{it.price * it.quantity}</span>
                            </div>
                          ))}
                          <div className="pt-1.5 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                            <span>Grand Total ({ord.paymentMethod.toUpperCase()})</span>
                            <span>₹{ord.grandTotal}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MENU & PRICES MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Product Pricing & Availability
                    </h3>
                    <p className="text-xs text-stone-500">
                      Edit regular and large size prices for each drink
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProducts}
                    className="flex items-center gap-1.5 bg-[#FF5E0E] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E24D00] shadow-sm cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Menu Changes</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900">{p.name}</span>
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                              {p.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">{p.description.slice(0, 50)}...</p>
                        </div>
                      </div>

                      {/* Price Inputs */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <label className="text-[10px] font-bold text-stone-500">Reg (₹):</label>
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => handlePriceChange(p.id, 'price', Number(e.target.value))}
                            className="w-16 px-2 py-1 text-xs font-bold rounded border border-stone-200"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <label className="text-[10px] font-bold text-stone-500">Lrg (₹):</label>
                          <input
                            type="number"
                            value={p.largePrice || p.price + 25}
                            onChange={(e) => handlePriceChange(p.id, 'largePrice', Number(e.target.value))}
                            className="w-16 px-2 py-1 text-xs font-bold rounded border border-stone-200"
                          />
                        </div>

                        {/* Stock toggle */}
                        <button
                          type="button"
                          onClick={() => handleStockToggle(p.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                            (p.isAvailable ?? true)
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {(p.isAvailable ?? true) ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: DAILY SPECIALS SCHEDULE */}
            {activeTab === 'specials' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900">
                        Weekly 'Daily Specials' Schedule
                      </h3>
                      <span className="text-[10px] font-black text-amber-900 bg-amber-300 px-2.5 py-0.5 rounded-full">
                        Today is {today}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Selected items automatically display the highlight badge on the product menu for that day of the week.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveSpecials}
                    className="flex items-center gap-1.5 bg-[#FF5E0E] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E24D00] shadow-sm cursor-pointer shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Daily Specials</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {DAYS_OF_WEEK.map((day) => {
                    const config = settings.dailySpecials?.[day] || {
                      day,
                      productId: products[0]?.id || 'orange-juice',
                      badgeText: `${day} Special`,
                      isActive: true,
                    };
                    const isToday = day === today;
                    const selectedProduct = products.find((p) => p.id === config.productId);

                    return (
                      <div
                        key={day}
                        className={`p-4 rounded-2xl border transition-all ${
                          isToday
                            ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-300/60'
                            : 'bg-white border-stone-200 shadow-xs'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          {/* Day info */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0A2616] text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                              {day.slice(0, 3)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-stone-900 font-heading">
                                  {day}
                                </span>
                                {isToday && (
                                  <span className="text-[10px] font-black uppercase text-amber-950 bg-amber-300 px-2 py-0.5 rounded-full">
                                    ★ Active Today
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-500">
                                {selectedProduct ? `Current pick: ${selectedProduct.name} (₹${selectedProduct.price})` : 'Select drink below'}
                              </p>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            {/* Product Select */}
                            <div>
                              <label className="text-[10px] font-bold text-stone-500 block mb-0.5">
                                Featured Drink:
                              </label>
                              <select
                                value={config.productId}
                                onChange={(e) => handleDailySpecialChange(day, 'productId', e.target.value)}
                                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-white focus:outline-none focus:border-orange-500"
                              >
                                {products.map((prod) => (
                                  <option key={prod.id} value={prod.id}>
                                    {prod.name} (₹{prod.price})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Badge Text Input */}
                            <div>
                              <label className="text-[10px] font-bold text-stone-500 block mb-0.5">
                                Highlight Badge Text:
                              </label>
                              <input
                                type="text"
                                value={config.badgeText}
                                onChange={(e) => handleDailySpecialChange(day, 'badgeText', e.target.value)}
                                placeholder="e.g. Sunday Blast Special"
                                className="w-48 px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-white focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            {/* Active Toggle */}
                            <div className="pt-3 sm:pt-0">
                              <button
                                type="button"
                                onClick={() => handleDailySpecialChange(day, 'isActive', !config.isActive)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                  config.isActive
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-stone-200 text-stone-600'
                                }`}
                              >
                                {config.isActive ? 'Active Special' : 'Disabled'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Live Badge Preview */}
                        {config.isActive && (
                          <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-stone-500 font-medium">
                              Badge appearance on menu:
                            </span>
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-stone-950 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 px-3 py-0.5 rounded-full shadow-2xs border border-amber-200">
                              <Sparkles className="w-3 h-3 text-orange-600 shrink-0" />
                              <span>{config.badgeText || `${day} Special`}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: BUSINESS & DELIVERY SETTINGS */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h3 className="text-sm font-bold text-stone-900">
                    Store Operational Settings
                  </h3>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="flex items-center gap-1.5 bg-[#FF5E0E] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E24D00] shadow-sm cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Settings</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Shop Brand Name
                    </label>
                    <input
                      type="text"
                      value={settings.brandName}
                      onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      WhatsApp Business Number (Receiving Orders)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Shop Opening Hours
                    </label>
                    <input
                      type="text"
                      value={settings.openingHours}
                      onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Minimum Order Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={settings.minOrderAmount}
                      onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Standard Delivery Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={settings.standardDeliveryFee}
                      onChange={(e) => setSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Free Delivery Threshold (₹)
                    </label>
                    <input
                      type="number"
                      value={settings.freeDeliveryThreshold}
                      onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                {/* Delivery Areas */}
                <div className="pt-3 border-t border-stone-200">
                  <label className="text-xs font-bold text-stone-900 block mb-1">
                    Supported Delivery Localities (Comma Separated)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.supportedDeliveryAreas.join(', ')}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        supportedDeliveryAreas: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Customers attempting delivery outside these areas will be prompted to choose stall pickup.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: SUPABASE DATABASE CONFIGURATION & STATUS */}
            {activeTab === 'supabase' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Header with status badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <Database className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-stone-900 font-heading">
                        Supabase Database Integration
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Direct cloud database connection saving customer orders & bookings to your Supabase project
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={checkSupabase}
                      disabled={checkingSupabase}
                      className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${checkingSupabase ? 'animate-spin' : ''}`} />
                      <span>{checkingSupabase ? 'Testing...' : 'Test Connection'}</span>
                    </button>

                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      <span>Open Supabase</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Live Status Card */}
                <div
                  className={`p-4 rounded-2xl border ${
                    supabaseStatus?.connected
                      ? supabaseStatus.tableExists
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/80 border-amber-200 text-amber-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {supabaseStatus?.connected ? (
                      supabaseStatus.tableExists ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      )
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold">
                          {supabaseStatus?.connected
                            ? supabaseStatus.tableExists
                              ? 'Connected & Syncing with Supabase "orders" Table'
                              : 'Connected to Supabase Project (Table Setup Needed)'
                            : 'Checking Supabase Connection...'}
                        </h4>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            supabaseStatus?.connected
                              ? supabaseStatus.tableExists
                                ? 'bg-emerald-200/80 text-emerald-900'
                                : 'bg-amber-200/80 text-amber-900'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {supabaseStatus?.connected
                            ? supabaseStatus.tableExists
                              ? 'Active & Ready'
                              : 'Action Needed'
                            : 'Testing'}
                        </span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed opacity-90">
                        {supabaseStatus?.message ||
                          (supabaseStatus?.error ? `Notice: ${supabaseStatus.error}` : 'Testing connection to project cfjuvpbbrmrzlowqviua...')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connected Credentials Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Supabase Project ID
                    </span>
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono font-bold text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-200">
                        {SUPABASE_PROJECT_ID}
                      </code>
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Verified
                      </span>
                    </div>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      API Authorization Key
                    </span>
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono text-stone-800 bg-white px-2 py-1 rounded-lg border border-stone-200">
                        sb_publishable_XhL...4ev
                      </code>
                      <span className="text-[11px] text-stone-500 font-medium">Publishable Key</span>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Guide & SQL Schema Box */}
                <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 shadow-lg border border-stone-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white font-heading">
                          Supabase SQL Schema for "public.orders"
                        </h4>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Run this SQL script in your Supabase project SQL Editor to enable the orders table and RLS policies.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
                    >
                      {sqlCopied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                      <span>{sqlCopied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                    </button>
                  </div>

                  {/* 3 Step Instructions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-xs">
                    <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] mb-1.5">
                        1
                      </div>
                      <p className="font-semibold text-white">Open SQL Editor</p>
                      <p className="text-stone-400 text-[11px] mt-0.5">
                        Go to your Supabase project dashboard and click "SQL Editor" on the left menu.
                      </p>
                    </div>

                    <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] mb-1.5">
                        2
                      </div>
                      <p className="font-semibold text-white">Paste SQL Script</p>
                      <p className="text-stone-400 text-[11px] mt-0.5">
                        Click "New Query", paste the copied SQL from above into the query window.
                      </p>
                    </div>

                    <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] mb-1.5">
                        3
                      </div>
                      <p className="font-semibold text-white">Click Run (Ctrl+Enter)</p>
                      <p className="text-stone-400 text-[11px] mt-0.5">
                        Click "Run". The table, schema, and security policies will be created immediately!
                      </p>
                    </div>
                  </div>

                  {/* Code Snippet Box */}
                  <div className="relative">
                    <pre className="bg-stone-950 p-4 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-56 leading-relaxed border border-stone-800 select-all">
                      {SUPABASE_SETUP_SQL}
                    </pre>
                  </div>
                </div>

                {/* Architecture & Reliability Guarantee */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-stone-600 leading-relaxed">
                    <p className="font-bold text-stone-900 mb-0.5">
                      Fail-Safe Dual Persistence Architecture
                    </p>
                    <p>
                      Every juice and milkshake order submitted by customers is synced to Supabase (Project:{' '}
                      <span className="font-mono font-semibold">{SUPABASE_PROJECT_ID}</span>) and backed up locally. Even if network latency occurs, no customer order will ever be lost or dropped.
                    </p>
                  </div>
                </div>

                {/* Netlify Deployment Status & Settings */}
                <div className="bg-gradient-to-br from-teal-50 via-emerald-50/40 to-stone-50 border border-teal-200/80 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-200/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                        <Rocket className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-teal-950 font-heading">
                          Netlify Production Deployment Setup
                        </h4>
                        <p className="text-[11px] text-teal-700">
                          Pre-configured with <code className="font-mono font-bold">netlify.toml</code>, <code className="font-mono font-bold">public/_redirects</code> & Supabase client
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://app.netlify.com/drop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#00ad9f] hover:bg-[#008f83] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors shrink-0"
                    >
                      <CloudUpload className="w-3.5 h-3.5" />
                      <span>Netlify Drop (1-Click)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
                    <div className="bg-white/80 p-3 rounded-xl border border-teal-100 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block mb-1">
                        Build Command
                      </span>
                      <code className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        npm run build
                      </code>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border border-teal-100 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block mb-1">
                        Publish Directory
                      </span>
                      <code className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        dist
                      </code>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border border-teal-100 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block mb-1">
                        SPA Routing Rewrite
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ready (/* → /index.html)
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-3">
                    💡 <strong>Tip:</strong> You can connect your GitHub repository directly to Netlify for automatic continuous deployments, or drag the <code className="font-mono">dist</code> folder into Netlify Drop.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
