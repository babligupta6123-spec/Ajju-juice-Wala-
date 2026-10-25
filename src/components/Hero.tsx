import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SHOP_CONFIG } from '../shopConfig';
import { FruitCanvas3D, FruitPreset } from './FruitCanvas3D';
import {
  OrangeSliceIcon,
  ColdPressDropIcon,
  MintLeafIcon,
  IceCubeIcon,
  DeliveryScooterIcon,
  AjjuShopBadgeIcon,
} from './CustomIcons';

interface HeroProps {
  onExploreMenu: () => void;
  onOrderNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onOrderNow }) => {
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [activeFruitPreset, setActiveFruitPreset] = useState<FruitPreset>('citrus');

  return (
    <section id="home" className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-[#FAF8F5]">
      {/* Background ambient orchard light blooms */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-amber-200/30 via-orange-200/20 to-lime-200/20 blur-3xl -z-10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-orange-100/35 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Small Promotional Badge (Clean & Unboxed) */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/70 text-orange-950 text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-2xs">
              <OrangeSliceIcon size={18} className="text-orange-600" />
              <span className="font-bold text-orange-700">100% Real Squeezed Fruit</span>
              <span className="text-stone-300" aria-hidden="true">·</span>
              <span className="text-stone-600">Daily Cold-Pressed at {SHOP_CONFIG.brandName}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-black text-[#0A2616] tracking-tight leading-[1.02] mb-6 font-heading text-balance">
              GOOD MOOD.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E0E] via-amber-500 to-[#4EA321]">
                FRESH JUICE.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-xl text-stone-600 font-normal leading-relaxed max-w-xl mb-8 text-pretty">
              Freshly pressed happiness in every sip. Handcrafted to order from sun-ripened orchard fruits with zero preservatives, pure pulp, and natural vitality.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
              <button
                type="button"
                onClick={onExploreMenu}
                className="inline-flex items-center justify-center gap-3 bg-[#0A2616] hover:bg-[#123822] text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-stone-900/10 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                type="button"
                onClick={onOrderNow}
                className="inline-flex items-center justify-center gap-2.5 bg-[#FF5E0E] hover:bg-[#E24D00] text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Order On WhatsApp</span>
                <span className="text-orange-100 font-semibold text-xs bg-black/15 px-2 py-0.5 rounded-md">
                  Direct Chat
                </span>
              </button>
            </div>

            {/* Trust Strip with Custom Bespoke Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-200/80 w-full">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <ColdPressDropIcon size={16} />
                  <span>Cold Pressed</span>
                </div>
                <p className="text-[11px] text-stone-500">Zero Added Heat</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <MintLeafIcon size={16} />
                  <span>100% Whole Fruit</span>
                </div>
                <p className="text-[11px] text-stone-500">No Powders or Purees</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <IceCubeIcon size={16} />
                  <span>Chilled Crisp</span>
                </div>
                <p className="text-[11px] text-stone-500">Pure Rock Ice</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <DeliveryScooterIcon size={16} />
                  <span>Swift Delivery</span>
                </div>
                <p className="text-[11px] text-stone-500">Free on ₹{SHOP_CONFIG.freeDeliveryThreshold}+</p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Stage & Photo Showcase */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            
            {/* View Mode Switcher Pill */}
            <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-xs mb-4 z-20">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                aria-pressed={viewMode === '3d'}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-[#0A2616] text-amber-300 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span role="img" aria-label="3D Cube">🧊</span>
                <span>Interactive 3D Stage</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('photo')}
                aria-pressed={viewMode === 'photo'}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'photo'
                    ? 'bg-[#0A2616] text-amber-300 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span role="img" aria-label="Camera">📸</span>
                <span>Real Chilled Glass</span>
              </button>
            </div>

            {/* Main Stage Container */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[36px] overflow-hidden shadow-2xl shadow-orange-950/15 border-4 border-white bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] group flex items-center justify-center">
              
              {viewMode === '3d' ? (
                /* 3D WebGL Canvas Component */
                <div className="w-full h-full relative">
                  <FruitCanvas3D
                    className="w-full h-full"
                    preset={activeFruitPreset}
                    onPresetChange={(p) => setActiveFruitPreset(p)}
                  />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/80 flex items-center gap-2.5 z-10 pointer-events-none">
                    <div className="w-8 h-8 rounded-xl bg-[#FF5E0E] text-white flex items-center justify-center font-black text-xs">
                      ₹60
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-tight">Nagpur Fresh Orange</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">Cold-Pressed to Order</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Realistic High-Res Glass Photograph */
                <div className="w-full h-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1200&q=90"
                    alt="A tall glass of chilled, freshly squeezed orange juice surrounded by fresh whole oranges, ripe mangoes, and strawberries with condensation droplets"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  {/* Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />

                  {/* Top Tag */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/80 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FF5E0E] text-white flex items-center justify-center font-black text-xs">
                      ₹79
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-tight">Fresh Orange Juice</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">100% Nagpur Oranges</p>
                    </div>
                  </div>

                  {/* Bottom Info Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/80">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                        <AjjuShopBadgeIcon size={16} />
                        <span>Pure Orchard Ingredients</span>
                      </div>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md uppercase">
                        Handmade
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Sun-ripened oranges, Alphonso mangoes, strawberries, and sweet mint leaves cold-pressed per order.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Subtle Floating Accents */}
            <div className="absolute -top-3 -right-2 bg-[#4EA321] text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white hidden sm:flex items-center gap-1.5 z-20">
              <MintLeafIcon size={14} />
              <span>Zero Preservatives</span>
            </div>

            <div className="absolute -bottom-3 -left-2 bg-[#0A2616] text-amber-300 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg border-2 border-emerald-900 hidden sm:flex items-center gap-1.5 z-20">
              <ColdPressDropIcon size={14} />
              <span>Instant Vitality</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
