import React from 'react';
import { Tag, PlusCircle, AlertCircle } from 'lucide-react';
import { SPECIAL_OFFERS, PRODUCTS } from '../data/products';
import { SpecialOffer } from '../types';
import { OrangeSliceIcon, WatermelonSliceIcon, JuiceGlassIcon } from './CustomIcons';

interface SpecialOffersProps {
  onAddComboToCart: (offer: SpecialOffer) => void;
}

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ onAddComboToCart }) => {
  const getIcon = (offerId: string) => {
    switch (offerId) {
      case 'summer-cooler':
        return <WatermelonSliceIcon size={24} />;
      case 'family-fruit-pack':
        return <JuiceGlassIcon size={24} />;
      default:
        return <OrangeSliceIcon size={24} />;
    }
  };

  return (
    <section id="offers" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-orange-900 text-xs font-semibold tracking-wide mb-3">
            <Tag className="w-3.5 h-3.5 text-orange-600" />
            <span>Limited Time Value Combos</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0A2616] tracking-tight font-heading mb-3">
            Signature Value Offers
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Curated beverage bundles crafted for maximum refreshment and everyday savings. Perfect for sharing with friends and family.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SPECIAL_OFFERS.map((offer) => {
            const bundledProducts = PRODUCTS.filter((p) => offer.productIds.includes(p.id));

            return (
              <div
                key={offer.id}
                className="relative flex flex-col justify-between bg-white rounded-[32px] p-7 border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(offer.id)}
                  </div>
                  <span className="text-xs font-black tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-3 py-1 rounded-full">
                    {offer.badge}
                  </span>
                </div>

                {/* Offer Details */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-orange-600 tracking-wide uppercase">
                    {offer.tagline}
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 mt-1 mb-2 font-heading">
                    {offer.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {offer.description}
                  </p>

                  {/* Bundled Drinks Preview */}
                  <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/60 mb-5">
                    <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                      Included Drinks:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {bundledProducts.map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-white px-2.5 py-1 rounded-lg border border-stone-200/80 text-stone-800 shadow-2xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-[#0A2616] tabular-nums">
                      ₹{offer.price}
                    </span>
                    <span className="text-sm font-semibold text-stone-400 line-through tabular-nums">
                      ₹{offer.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Save ₹{offer.originalPrice - offer.price}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions & Transparency Notice */}
                <div className="space-y-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => onAddComboToCart(offer)}
                    className="w-full flex items-center justify-center gap-2 bg-[#0A2616] hover:bg-[#FF5E0E] active:scale-[0.98] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-300" />
                    <span>Add Combo to Bag (₹{offer.price})</span>
                  </button>

                  <div className="flex items-start gap-1.5 text-[11px] text-stone-500 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{offer.isPlaceholderNotice}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
