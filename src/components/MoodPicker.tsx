import React from 'react';
import {
  JuiceGlassIcon,
  OrangeSliceIcon,
  BlenderIcon,
  MintLeafIcon,
} from './CustomIcons';

interface MoodPickerProps {
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const MoodPicker: React.FC<MoodPickerProps> = ({ onSelectCategory, activeCategory }) => {
  const moods = [
    {
      label: 'All Sips',
      category: 'All',
      icon: <JuiceGlassIcon size={26} />,
      desc: 'All 12 handcrafted items',
    },
    {
      label: 'Fresh Juices',
      category: 'Fresh Juices',
      icon: <OrangeSliceIcon size={26} />,
      desc: '100% cold-pressed from ₹40',
    },
    {
      label: 'Milkshakes',
      category: 'Milkshakes',
      icon: <BlenderIcon size={26} />,
      desc: 'Thick & creamy from ₹60',
    },
    {
      label: 'Special Drinks',
      category: 'Special Drinks',
      icon: <MintLeafIcon size={26} />,
      desc: 'Fruit blasts & signatures',
    },
  ];

  return (
    <div className="py-8 border-b border-stone-200/80 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <span>Order Fresh Juices & Shakes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A2616] font-heading">
              What are you craving today?
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium hidden md:inline">
            12 Signature Juices & Shakes Available
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {moods.map((mood) => {
            const isActive = activeCategory === mood.category;
            return (
              <button
                key={mood.category}
                type="button"
                onClick={() => onSelectCategory(mood.category)}
                className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5E0E] text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                    : 'bg-white text-stone-700 border-stone-200/90 hover:border-orange-300 hover:bg-orange-50/40 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-1 rounded-xl bg-black/5 flex items-center justify-center">
                    {mood.icon}
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-bold text-white bg-black/20 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <span className={`text-sm font-bold leading-tight ${isActive ? 'text-white' : 'text-stone-900'}`}>
                  {mood.label}
                </span>
                <span className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-orange-100' : 'text-stone-500'}`}>
                  {mood.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
