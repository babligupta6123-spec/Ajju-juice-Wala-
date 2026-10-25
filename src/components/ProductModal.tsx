import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Leaf } from 'lucide-react';
import { Product, CustomizationOptions } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, customization?: CustomizationOptions) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<'Regular' | 'Large'>('Regular');
  const [sweetness, setSweetness] = useState<'Regular' | 'Less Sugar' | 'Honey' | 'No Added Sugar'>('Regular');
  const [iceLevel, setIceLevel] = useState<'Normal Ice' | 'Less Ice' | 'No Ice'>('Normal Ice');

  const regularPrice = product.price;
  const largePrice = product.largePrice || product.price + 25;
  const unitPrice = size === 'Large' ? largePrice : regularPrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(
      {
        ...product,
        price: unitPrice,
      },
      quantity,
      {
        size,
        sweetness,
        iceLevel,
      }
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-100 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Header Image */}
          <div className="relative h-56 w-full bg-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-bold bg-[#FF5E0E] px-2.5 py-0.5 rounded-full inline-block mb-1">
                {product.category}
              </span>
              <h2 id="modal-title" className="text-2xl font-black font-heading">
                {product.name}
              </h2>
              {product.hindiName && (
                <p className="text-xs text-amber-200 font-semibold">{product.hindiName}</p>
              )}
            </div>
          </div>

          {/* Details & Customizations */}
          <div className="p-6 space-y-6">
            <p className="text-stone-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Ingredients */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Ingredients & Fresh Extraction</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-stone-700 font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Choice with explicit prices */}
            <div>
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
                Select Size & Serving
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSize('Regular')}
                  className={`py-3 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    size === 'Regular'
                      ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold">Regular (350ml)</p>
                    <p className="text-[10px] text-stone-500 font-normal">Standard glass</p>
                  </div>
                  <span className="text-sm font-black text-[#0A2616]">
                    ₹{regularPrice}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSize('Large')}
                  className={`py-3 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    size === 'Large'
                      ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold">Large (500ml)</p>
                    <p className="text-[10px] text-stone-500 font-normal">Jumbo glass</p>
                  </div>
                  <span className="text-sm font-black text-[#0A2616]">
                    ₹{largePrice}
                  </span>
                </button>
              </div>
            </div>

            {/* Sweetness Preference */}
            <div>
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
                Sweetness Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Regular', 'Less Sugar', 'Honey', 'No Added Sugar'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSweetness(lvl)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all text-left ${
                      sweetness === lvl
                        ? 'border-orange-500 bg-orange-50 text-orange-900 ring-1 ring-orange-500'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Ice Preference */}
            <div>
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
                Chilled / Ice Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Normal Ice', 'Less Ice', 'No Ice'] as const).map((ice) => (
                  <button
                    key={ice}
                    type="button"
                    onClick={() => setIceLevel(ice)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all ${
                      iceLevel === ice
                        ? 'border-orange-500 bg-orange-50 text-orange-900 ring-1 ring-orange-500'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {ice}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-stone-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF5E0E] hover:bg-[#E24D00] text-white py-3 px-5 rounded-2xl font-bold text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag • ₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
