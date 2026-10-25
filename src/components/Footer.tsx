import React from 'react';
import { ArrowUp, Sparkles, MapPin, Phone, Mail, Clock, Instagram, ShieldCheck, Compass } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface FooterProps {
  onOpenChecklist?: () => void;
  onOpenTracking?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenChecklist, onOpenTracking, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Brand Info (col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-xl shadow-md">
                🍹
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight font-heading">
                  {STORE_INFO.name}
                </span>
              </div>
            </div>

            <p className="text-orange-400 text-sm font-semibold italic">
              "{STORE_INFO.tagline}"
            </p>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Artisanal cold-pressed fruit juices, comforting thick milkshakes, and signature fruit blasts handcrafted fresh to order. Fast local delivery and stall pickup.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-[#25D366] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label={`${STORE_INFO.name} WhatsApp`}
              >
                💬
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-rose-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label={`${STORE_INFO.name} Instagram`}
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-orange-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label={`${STORE_INFO.name} Google Maps`}
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (col 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Explore & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-amber-400 transition-colors">
                  Home & Fresh Daily Picks
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Full Drink Menu (12 Sips)
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-amber-400 transition-colors">
                  Value Combos & Offers
                </a>
              </li>
              {onOpenTracking && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenTracking}
                    className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🔍 Track My Order</span>
                  </button>
                </li>
              )}
              {onOpenAdmin && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="text-stone-400 hover:text-white font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>👑 Shop Owner Dashboard</span>
                  </button>
                </li>
              )}
              {onOpenChecklist && (
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenChecklist}
                    className="text-stone-500 hover:text-stone-300 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>⚙️ Store Setup Guide</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Store Hours & Quick Reach (col 4) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Visit & Contact
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{STORE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{STORE_INFO.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-white">
                  {STORE_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{STORE_INFO.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-stone-500 block">
                {STORE_INFO.fssaiNumber}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved. Handcrafted with fresh fruit passion.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-stone-600">Pure Fruits • Cold Pressed • No Preservatives</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
