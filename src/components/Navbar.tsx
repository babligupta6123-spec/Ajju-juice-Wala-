import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Sparkles, PhoneCall, Clock, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { SHOP_CONFIG } from '../shopConfig';
import { AjjuShopBadgeIcon } from './CustomIcons';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenContact: () => void;
  onOpenTracking?: () => void;
  onOpenAdmin?: () => void;
  onOpenChecklist?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenAdmin,
  onOpenChecklist,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'Offers', href: '#offers' },
    { name: 'Our Craft', href: '#about' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Slim Top Announcement Bar */}
      <div className="bg-[#0A2616] text-amber-200 text-xs py-2 px-4 text-center font-medium tracking-wide flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>{SHOP_CONFIG.brandName} • Fresh Cold-Pressed Juices • Free Delivery on ₹{SHOP_CONFIG.freeDeliveryThreshold}+</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 ml-auto text-[11px]">
          {onOpenTracking && (
            <button
              type="button"
              onClick={onOpenTracking}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-amber-300 font-semibold"
            >
              <Clock className="w-3 h-3" />
              <span>Track Order</span>
            </button>
          )}

          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-stone-300 font-medium"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Owner PIN</span>
            </button>
          )}

          {onOpenChecklist && (
            <button
              type="button"
              onClick={onOpenChecklist}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <span>⚙️ Setup Guide</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3.5'
            : 'bg-[#FAF8F5] py-4 border-b border-stone-200/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            
            {/* Zone 1: Brand Wordmark */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl shrink-0"
              aria-label={`${SHOP_CONFIG.brandName} Home`}
            >
              <div className="w-10 h-10 rounded-2xl bg-[#0A2616] flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform border border-amber-300/30">
                <AjjuShopBadgeIcon size={28} />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-[#0A2616] tracking-tight font-heading whitespace-nowrap">
                  {SHOP_CONFIG.brandName}
                </span>
              </div>
            </a>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-700" aria-label="Primary Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="hover:text-orange-600 transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Zone 3: Primary Action & Controls */}
            <div className="flex items-center gap-2.5 shrink-0">
              
              {/* Order Tracking Button on Desktop */}
              {onOpenTracking && (
                <button
                  type="button"
                  onClick={onOpenTracking}
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-orange-600 bg-stone-100 hover:bg-stone-200/80 px-3 py-2 rounded-full transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>Track Order</span>
                </button>
              )}

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={onOpenCart}
                aria-label={`View shopping cart with ${cartCount} items`}
                className="relative flex items-center gap-2 bg-[#FF5E0E] hover:bg-[#E24D00] active:scale-95 text-white px-4 py-2.5 rounded-full font-bold text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Bag</span>
                <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs font-black min-w-[20px] text-center tabular-nums">
                  {cartCount}
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[96px] bg-white border-b border-stone-200 shadow-xl px-6 py-6 transition-all animate-in slide-in-from-top-3">
            <div className="flex flex-col gap-4">
              <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/50">
                {SHOP_CONFIG.brandName} • {SHOP_CONFIG.openingHours}
              </div>

              <div className="grid grid-cols-2 gap-2 py-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="flex items-center justify-between text-stone-800 hover:text-orange-600 font-semibold p-3 rounded-xl hover:bg-orange-50 transition-colors"
                  >
                    <span>{link.name}</span>
                    <span className="text-orange-400 text-xs">→</span>
                  </a>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                {onOpenTracking && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenTracking();
                    }}
                    className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>Track Your Order Status</span>
                  </button>
                )}

                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-stone-700" />
                    <span>Shop Owner Dashboard (PIN Protected)</span>
                  </button>
                )}

                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="flex items-center justify-center gap-2 text-stone-800 bg-stone-100 hover:bg-stone-200 font-semibold py-3 rounded-xl text-xs"
                >
                  <PhoneCall className="w-4 h-4 text-orange-600" />
                  <span>Call {STORE_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
