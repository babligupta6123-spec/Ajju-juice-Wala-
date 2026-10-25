import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MoodPicker } from './components/MoodPicker';
import { SpecialOffers } from './components/SpecialOffers';
import { ProductMenu } from './components/ProductMenu';
import { AboutUs } from './components/AboutUs';
import { CustomerReviews } from './components/CustomerReviews';
import { ContactLocation } from './components/ContactLocation';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { SetupChecklistModal } from './components/SetupChecklistModal';
import { Toast, ToastMessage } from './components/Toast';
import { Product, CartItem, CustomizationOptions, SpecialOffer, OrderRecord } from './types';
import { PRODUCTS_LIST, SHOP_CONFIG, ShopConfiguration } from './shopConfig';
import { calculateCartTotals } from './utils/cartLogic';
import { OrderService } from './services/orderService';

const CART_STORAGE_KEY = 'ajju_juice_cart_v1';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS_LIST);
  const [shopSettings, setShopSettings] = useState<ShopConfiguration>(SHOP_CONFIG);

  // Cart state with localStorage initialization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingParams, setTrackingParams] = useState<{ id?: string; phone?: string }>({});
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch updated products and store settings from service / backend
  useEffect(() => {
    OrderService.getProducts().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setProducts(loaded);
      }
    });
    OrderService.getSettings().then((loadedSettings) => {
      if (loadedSettings) {
        setShopSettings(loadedSettings);
      }
    });
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  // Recalculate discount if cart changes and coupon is applied
  useEffect(() => {
    if (!appliedCoupon) return;
    const totals = calculateCartTotals(cart, orderType, 0);
    if (appliedCoupon === 'FRESH10') {
      setDiscountAmount(Math.round(totals.subtotal * 0.1));
    } else if (appliedCoupon === 'FRESHSIP20') {
      setDiscountAmount(Math.min(totals.subtotal, 20));
    }
  }, [cart, appliedCoupon, orderType]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add product to bag
  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    customization?: CustomizationOptions
  ) => {
    const customKey = customization
      ? `${product.id}-${customization.size || 'reg'}-${customization.sweetness || 'std'}-${customization.iceLevel || 'std'}`
      : product.id;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === customKey);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: customKey,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
          category: product.category,
          customization,
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`Added ${quantity}x ${product.name} to bag!`);
  };

  // Add special combo offer to cart
  const handleAddComboToCart = (offer: SpecialOffer) => {
    const comboCartItem: CartItem = {
      id: `combo-${offer.id}-${Date.now()}`,
      productId: offer.id,
      name: `${offer.title} (${offer.badge})`,
      price: offer.price,
      quantity: 1,
      image:
        products.find((p) => p.id === offer.productIds[0])?.image ||
        'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
      category: 'Special Drinks',
      customization: {
        size: 'Regular',
        sweetness: 'Regular',
        iceLevel: 'Normal Ice',
      },
    };

    setCart((prev) => [...prev, comboCartItem]);
    showToast(`Added "${offer.title}" combo to bag!`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    const item = cart.find((i) => i.id === id);
    setCart((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      showToast(`Removed ${item.name} from bag`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    showToast('Your bag was emptied', 'info');
  };

  const handleApplyCoupon = (code: string): { success: boolean; message: string } => {
    const normalized = code.trim().toUpperCase();
    const totals = calculateCartTotals(cart, orderType, 0);

    if (totals.subtotal === 0) {
      return { success: false, message: 'Add drinks to your bag before applying coupon.' };
    }

    if (normalized === 'FRESH10') {
      const discount = Math.round(totals.subtotal * 0.1);
      setAppliedCoupon('FRESH10');
      setDiscountAmount(discount);
      return { success: true, message: `FRESH10 applied! Saved ₹${discount} (10% off).` };
    } else if (normalized === 'FRESHSIP20') {
      const discount = Math.min(totals.subtotal, 20);
      setAppliedCoupon('FRESHSIP20');
      setDiscountAmount(discount);
      return { success: true, message: `FRESHSIP20 applied! Saved ₹${discount}.` };
    } else {
      return { success: false, message: 'Invalid coupon code. Try FRESH10 or FRESHSIP20.' };
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleProceedToWhatsApp = () => {
    setIsCartOpen(false);
    setIsWhatsAppModalOpen(true);
  };

  const handleOrderPlaced = (order: OrderRecord) => {
    // Clear cart upon successful order placement
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    showToast(`Order ${order.id} placed with kitchen!`);
  };

  const handleOpenTracking = (orderId?: string, phone?: string) => {
    setTrackingParams({ id: orderId, phone });
    setIsTrackingOpen(true);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotals = calculateCartTotals(cart, orderType, discountAmount);

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] selection:bg-orange-200 selection:text-orange-950 font-sans">
      {/* Top Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenContact={scrollToContact}
        onOpenTracking={() => handleOpenTracking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with 3D Juice Glass */}
        <Hero
          onExploreMenu={scrollToMenu}
          onOrderNow={() => {
            if (cart.length > 0) {
              setIsCartOpen(true);
            } else {
              scrollToMenu();
            }
          }}
        />

        {/* 2. Mood & Craving Filter */}
        <MoodPicker
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            scrollToMenu();
          }}
        />

        {/* 3. Special Value Offers */}
        <SpecialOffers onAddComboToCart={handleAddComboToCart} />

        {/* 4. Complete Juice & Shake Menu (All 12 items with price sorting & sizes) */}
        <ProductMenu
          products={products}
          onAddToCart={handleAddToCart}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          dailySpecials={shopSettings.dailySpecials}
        />

        {/* 5. Our Craft & Fruit Philosophy */}
        <AboutUs onExploreMenu={scrollToMenu} />

        {/* 6. Customer Reviews */}
        <CustomerReviews />

        {/* 7. Contact, Location & Hours */}
        <ContactLocation />
      </main>

      {/* Footer */}
      <Footer
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onOpenTracking={() => handleOpenTracking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Floating Cart Quick Bar */}
      {totalCartCount > 0 && !isCartOpen && !isCheckoutOpen && !isWhatsAppModalOpen && (
        <aside aria-label="Mobile cart action" className="lg:hidden fixed bottom-4 inset-x-4 z-30 animate-in slide-in-from-bottom-3">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between bg-[#0A2616] text-white p-3.5 px-5 rounded-2xl shadow-2xl border border-emerald-900/80 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#FF5E0E] text-white flex items-center justify-center font-bold text-xs tabular-nums">
                {totalCartCount}
              </span>
              <span className="text-xs font-bold text-white">
                {totalCartCount === 1 ? '1 Drink' : `${totalCartCount} Drinks`} · ₹{cartTotals.grandTotal}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <span>View Bag & Order</span>
              <span>→</span>
            </div>
          </button>
        </aside>
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        orderType={orderType}
        onToggleOrderType={setOrderType}
        onProceedToCheckout={handleProceedToCheckout}
        onProceedToWhatsApp={handleProceedToWhatsApp}
        discountAmount={discountAmount}
        onApplyCoupon={handleApplyCoupon}
        appliedCoupon={appliedCoupon}
      />

      {/* Real Customer Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        discountAmount={discountAmount}
        appliedCoupon={appliedCoupon}
        onOrderPlaced={handleOrderPlaced}
        onOpenTracking={handleOpenTracking}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderId={trackingParams.id}
        initialPhone={trackingParams.phone}
      />

      {/* Shop Owner Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductsUpdated={(updated) => setProducts(updated)}
        onSettingsUpdated={(updated) => setShopSettings(updated)}
      />

      {/* WhatsApp Ordering Preview Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        items={cart}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        discountAmount={discountAmount}
      />

      {/* Setup Checklist Modal */}
      <SetupChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />

      {/* Global Toast System */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
