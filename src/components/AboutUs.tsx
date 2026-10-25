import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SHOP_CONFIG } from '../shopConfig';
import {
  OrangeSliceIcon,
  ColdPressDropIcon,
  MintLeafIcon,
  AjjuShopBadgeIcon,
} from './CustomIcons';

interface AboutUsProps {
  onExploreMenu: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onExploreMenu }) => {
  const pillars = [
    {
      title: 'Hand-Selected Fruits',
      description: 'Direct relationships with orchards in Nagpur, Ratnagiri, and Mahabaleshwar ensure peak-season sweetness and aroma in every batch.',
      icon: <OrangeSliceIcon size={20} />,
    },
    {
      title: 'Cold-Pressed Extraction',
      description: 'Zero heat and zero high-speed centrifugal blade oxidation. We preserve essential raw enzymes and vivid natural color.',
      icon: <ColdPressDropIcon size={20} />,
    },
    {
      title: 'Zero Artificial Additives',
      description: 'No packaged puree concentrates, no synthetic dyes, and no corn syrups. Only honest, whole fruit vitality.',
      icon: <MintLeafIcon size={20} />,
    },
    {
      title: 'Biodegradable Servings',
      description: 'Sealed in compostable plant-based PLA cups with paper straws, keeping each order spill-proof and ecologically thoughtful.',
      icon: <AjjuShopBadgeIcon size={20} />,
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#0A2616] text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Composition */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-[36px] overflow-hidden border border-emerald-800/80 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=90"
                alt="Cold-pressed fresh juice assortment with whole fruits and citrus slices"
                className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                <p className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                  Our Simple Daily Standard
                </p>
                <p className="text-white text-xs leading-relaxed">
                  "Real fruit. Pure water. Crushed ice when requested. Zero shortcuts."
                </p>
              </div>
            </div>

            {/* Floating accent badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#FF5E0E] text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border-2 border-emerald-950">
              <OrangeSliceIcon size={28} />
              <div>
                <p className="text-xs font-black">Pressed Daily</p>
                <p className="text-[10px] text-orange-100">Handcrafted per order</p>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & 4 Pillars */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 text-amber-300 text-xs font-semibold tracking-wide mb-4 border border-emerald-800/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Brand Philosophy</span>
            </div>

            {/* Required Heading */}
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading leading-[1.08] mb-6 text-balance">
              A Little More Freshness in Every Day
            </h2>

            {/* Required Description */}
            <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed mb-8">
              At {SHOP_CONFIG.brandName}, we bring together delicious fruit flavors and refreshing beverages. From classic orange juice to creamy smoothies, discover a drink for every mood.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 hover:border-emerald-700 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{pillar.icon}</span>
                    <h3 className="text-sm font-bold text-amber-200 font-heading">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-100/70 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Button Linking to Menu */}
            <button
              type="button"
              onClick={onExploreMenu}
              className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-[#0A2616] px-8 py-4 rounded-2xl font-black text-base shadow-lg shadow-black/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Explore The Fresh Menu</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
