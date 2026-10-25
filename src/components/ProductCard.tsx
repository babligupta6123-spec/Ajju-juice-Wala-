import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, SlidersHorizontal, Check, Sparkles } from 'lucide-react';
import { Product, CustomizationOptions } from '../types';
import {
  OrangeSliceIcon,
  MangoIcon,
  WatermelonSliceIcon,
  StrawberryIcon,
  PineappleIcon,
  BlenderIcon,
  MintLeafIcon,
  JuiceGlassIcon,
} from './CustomIcons';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, customization?: CustomizationOptions) => void;
  onOpenDetails: (product: Product) => void;
  dailySpecialBadge?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetails,
  dailySpecialBadge,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleIncrement = () => setQuantity((q) => Math.min(q + 1, 20));
  const handleDecrement = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const getFruitIcon = () => {
    switch (product.id) {
      case 'orange-juice':
        return <OrangeSliceIcon size={16} />;
      case 'mango-shake':
        return <MangoIcon size={16} />;
      case 'watermelon-juice':
        return <WatermelonSliceIcon size={16} />;
      case 'strawberry-shake':
        return <StrawberryIcon size={16} />;
      case 'pineapple-juice':
        return <PineappleIcon size={16} />;
      case 'banana-shake':
      case 'chocolate-shake':
        return <BlenderIcon size={16} />;
      case 'sweet-lime-juice':
      case 'apple-juice':
        return <MintLeafIcon size={16} />;
      default:
        return <JuiceGlassIcon size={16} />;
    }
  };

  return (
    <article
      className={`bg-white rounded-[28px] overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
        dailySpecialBadge
          ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/10 hover:shadow-xl hover:-translate-y-1'
          : 'border-stone-200/90 hover:border-orange-300 shadow-xs hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* Top Image Container (65% visual dominance) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
            style={{ backgroundColor: product.fallbackColor }}
          >
            <div className="mb-2 p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              {getFruitIcon()}
            </div>
            <span className="text-xs font-bold text-white bg-black/40 px-3 py-1 rounded-full">
              {product.name}
            </span>
          </div>
        )}

        {/* Subtle Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Daily Special Highlight Badge (Takes Visual Priority) */}
        {dailySpecialBadge ? (
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 text-[11px] font-black text-stone-950 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 px-3 py-1 rounded-full shadow-md border border-amber-100">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span className="tracking-tight">{dailySpecialBadge}</span>
          </div>
        ) : (
          /* Standard Category & Bestseller Overlay */
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 text-[11px] font-bold text-white bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full">
            {getFruitIcon()}
            <span>{product.category}</span>
            {product.isBestseller && (
              <>
                <span className="text-amber-400" aria-hidden="true">·</span>
                <span className="text-amber-300">Bestseller</span>
              </>
            )}
          </div>
        )}

        {/* Calories */}
        {product.calories && (
          <span className="absolute bottom-3.5 left-3.5 text-[11px] font-semibold text-white/95 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-md tabular-nums">
            {product.calories}
          </span>
        )}

        {/* Quick Customize Button */}
        <button
          type="button"
          onClick={() => onOpenDetails(product)}
          aria-label={`Customize ${product.name}`}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-orange-600 flex items-center justify-center shadow-md transition-all cursor-pointer z-10"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Tags / Ingredients */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
            <span>{product.tags[0]}</span>
            <span aria-hidden="true">·</span>
            <span>{product.tags[1] || 'Orchard Fresh'}</span>
          </div>

          {/* Product Name */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3
              onClick={() => onOpenDetails(product)}
              className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors cursor-pointer font-heading leading-tight"
            >
              {product.name}
            </h3>
          </div>

          {product.hindiName && (
            <p className="text-xs text-stone-400 font-medium mb-2">{product.hindiName}</p>
          )}

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Price & Quantity & Actions */}
        <div className="pt-3 border-t border-stone-100 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0A2616] tabular-nums">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs font-semibold text-stone-400 line-through tabular-nums">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={handleDecrement}
                aria-label={`Decrease quantity for ${product.name}`}
                className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-stone-900 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                aria-label={`Increase quantity for ${product.name}`}
                className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Bag Button */}
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${quantity} ${product.name} to Cart for ₹${product.price * quantity}`}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap shadow-md ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : dailySpecialBadge
                ? 'bg-gradient-to-r from-[#FF5E0E] to-amber-500 hover:from-[#E24D00] hover:to-amber-600 text-white shadow-orange-500/25'
                : 'bg-[#FF5E0E] hover:bg-[#E24D00] active:scale-[0.98] text-white shadow-orange-500/20'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag · ₹{product.price * quantity}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
};
