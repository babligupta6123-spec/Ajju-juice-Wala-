import React, { useState, useMemo } from 'react';
import { Search, Sparkles, X, Star } from 'lucide-react';
import { Product, ProductCategory, CustomizationOptions, DailySpecialConfig } from '../types';
import { getCurrentDayOfWeek } from '../shopConfig';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import {
  JuiceGlassIcon,
  OrangeSliceIcon,
  BlenderIcon,
  MintLeafIcon,
} from './CustomIcons';

interface ProductMenuProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, customization?: CustomizationOptions) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  dailySpecials?: Record<string, DailySpecialConfig>;
}

export const ProductMenu: React.FC<ProductMenuProps> = ({
  products,
  onAddToCart,
  activeCategory,
  onSelectCategory,
  dailySpecials,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const categories: ProductCategory[] = ['All', 'Fresh Juices', 'Milkshakes', 'Special Drinks'];

  const currentDay = getCurrentDayOfWeek();
  const todaySpecial = dailySpecials?.[currentDay];
  const specialProduct = todaySpecial?.isActive ? products.find((p) => p.id === todaySpecial.productId) : null;

  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => {
      const matchesCategory =
        activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.hindiName && product.hindiName.includes(searchQuery)) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section id="menu" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complete Juice & Shake Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0A2616] tracking-tight font-heading">
            Pure Taste, Freshly Squeezed
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
            100% natural fruits with zero chemicals. Select your favorite size and sweetness.
          </p>
        </div>

        {/* Controls: Search & Price Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Price Sorting */}
          <div className="relative">
            <label htmlFor="sort-price" className="sr-only">Sort by price</label>
            <select
              id="sort-price"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl border border-stone-200/90 bg-white text-xs font-bold text-stone-700 focus:outline-none focus:border-orange-500 cursor-pointer shadow-xs"
            >
              <option value="default">Default Menu Order</option>
              <option value="price-asc">Price: Low to High (₹40+)</option>
              <option value="price-desc">Price: High to Low (₹120-)</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <label htmlFor="search-drinks" className="sr-only">Search juices, shakes, fruits</label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="search-drinks"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orange, shake, apple..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-stone-200/90 bg-white text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Today's Daily Special Spotlight Banner */}
      {specialProduct && todaySpecial && (
        <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/80 border border-amber-300/80 shadow-md shadow-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5E0E] to-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              ⭐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-amber-950 uppercase tracking-wider bg-amber-300/80 px-2.5 py-0.5 rounded-full">
                  Today's Special ({currentDay})
                </span>
                <span className="text-[11px] font-bold text-orange-600 hidden sm:inline">Featured Pick of the Day</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 font-heading mt-0.5">
                {specialProduct.name} — <span className="text-orange-600">{todaySpecial.badgeText}</span>
              </h3>
              <p className="text-xs text-stone-600 line-clamp-1 max-w-xl">
                {specialProduct.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <span className="text-xl font-black text-[#0A2616]">
              ₹{specialProduct.price}
            </span>
            <button
              type="button"
              onClick={() => onAddToCart(specialProduct, 1)}
              className="inline-flex items-center gap-1.5 bg-[#0A2616] hover:bg-[#14482b] text-amber-300 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <span>Add Today's Special</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Category Segmented Tabs with Custom Icons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = cat === 'All' ? products.length : products.filter((p) => p.category === cat).length;

          const getCategoryIcon = () => {
            switch (cat) {
              case 'Fresh Juices':
                return <OrangeSliceIcon size={18} />;
              case 'Milkshakes':
                return <BlenderIcon size={18} />;
              case 'Special Drinks':
                return <MintLeafIcon size={18} />;
              default:
                return <JuiceGlassIcon size={18} />;
            }
          };

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              aria-label={`Filter by ${cat} (${count} items)`}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0A2616] text-amber-300 shadow-md shadow-emerald-950/20'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 shadow-xs'
              }`}
            >
              {getCategoryIcon()}
              <span>{cat}</span>
              <span className={`text-[11px] tabular-nums ${isActive ? 'text-amber-200/70' : 'text-stone-400'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((product) => {
            const isTodaySpecial =
              todaySpecial?.isActive && todaySpecial?.productId === product.id;
            const badgeText = isTodaySpecial ? todaySpecial.badgeText || `Today's Special` : undefined;

            return (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onOpenDetails={(p) => setSelectedProductForModal(p)}
                dailySpecialBadge={badgeText}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-stone-300">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="text-lg font-bold text-stone-800 mb-1">No drinks found</h3>
          <p className="text-sm text-stone-500 mb-4">
            Try searching for another fruit name or reset your category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('All');
            }}
            className="inline-flex items-center gap-2 bg-[#FF5E0E] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md cursor-pointer"
          >
            Show All 12 Drinks
          </button>
        </div>
      )}

      {/* Modal for Customization */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={onAddToCart}
      />
    </section>
  );
};
