/**
 * ============================================================================
 * AJJU JUICE WALA — MASTER SHOP CONFIGURATION FILE
 * ============================================================================
 * Central configuration for brand identity, WhatsApp business phone,
 * product menu with 12 items, delivery zones, and business settings.
 */

import { Product, SpecialOffer, DailySpecialConfig, DayOfWeek } from './types';

export interface ShopConfiguration {
  brandName: string;
  tagline: string;
  shortDescription: string;
  whatsappNumber: string;
  displayPhone: string;
  email: string;
  instagram: string;
  address: string;
  cityArea: string;
  openingHours: string;
  googleMapsUrl: string;
  fssaiLicenseNumber: string;
  currencySymbol: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  minOrderAmount: number;
  estimatedPrepTime: string;
  estimatedDeliveryTime: string;
  supportedDeliveryAreas: string[];
  isShopOpen: boolean;
  paymentMethods: {
    cod: boolean;
    pickup_pay: boolean;
    online: boolean;
  };
  setupChecklist: {
    key: string;
    label: string;
    isConfigured: boolean;
    helpText: string;
  }[];
  dailySpecials: Record<string, DailySpecialConfig>;
}

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export function getCurrentDayOfWeek(): typeof DAYS_OF_WEEK[number] {
  const dayIndex = new Date().getDay();
  return DAYS_OF_WEEK[dayIndex];
}

export const SHOP_CONFIG: ShopConfiguration = {
  brandName: 'Ajju Juice Wala',
  tagline: 'Fresh Fruits. Real Taste. Full Energy!',
  shortDescription: 'Freshly squeezed fruit juices, thick rich milkshakes, and refreshing fruit blasts made to order.',
  whatsappNumber: '919876543210',
  displayPhone: '+91 98765 43210',
  email: 'ajju.juicewala@example.com',
  instagram: '@ajjujuicewala',
  address: 'Shop No. 4, Ground Floor, Central Market Road, Near City Clock Tower',
  cityArea: 'Central Market',
  openingHours: 'Monday – Sunday: 8:00 AM – 10:30 PM',
  googleMapsUrl: 'https://maps.google.com/?q=Ajju+Juice+Wala',
  fssaiLicenseNumber: 'FSSAI Lic. No. 22223049000128',
  currencySymbol: '₹',
  freeDeliveryThreshold: 249,
  standardDeliveryFee: 30,
  minOrderAmount: 40,
  estimatedPrepTime: '15–20 mins',
  estimatedDeliveryTime: '30–40 mins',
  supportedDeliveryAreas: [
    'Central Market',
    'Civil Lines',
    'Model Town',
    'Station Road',
    'University Campus',
    'Subhash Nagar',
    'Gandhi Chowk',
    'Railway Colony',
  ],
  isShopOpen: true,
  paymentMethods: {
    cod: true,
    pickup_pay: true,
    online: true,
  },
  dailySpecials: {
    Sunday: {
      day: 'Sunday',
      productId: 'ajju-special-fruit-blast',
      badgeText: 'Sunday Blast Special',
      discountPercent: 10,
      isActive: true,
    },
    Monday: {
      day: 'Monday',
      productId: 'orange-juice',
      badgeText: 'Monday Immunity Boost',
      discountPercent: 10,
      isActive: true,
    },
    Tuesday: {
      day: 'Tuesday',
      productId: 'sweet-lime-juice',
      badgeText: 'Tuesday Desi Refresh',
      discountPercent: 10,
      isActive: true,
    },
    Wednesday: {
      day: 'Wednesday',
      productId: 'watermelon-juice',
      badgeText: 'Midweek Hydration Hit',
      discountPercent: 10,
      isActive: true,
    },
    Thursday: {
      day: 'Thursday',
      productId: 'pineapple-juice',
      badgeText: 'Tangy Thursday Sip',
      discountPercent: 10,
      isActive: true,
    },
    Friday: {
      day: 'Friday',
      productId: 'mango-shake',
      badgeText: 'Friday King Mango',
      discountPercent: 10,
      isActive: true,
    },
    Saturday: {
      day: 'Saturday',
      productId: 'chocolate-shake',
      badgeText: 'Weekend Choco Indulgence',
      discountPercent: 10,
      isActive: true,
    },
  },
  setupChecklist: [
    {
      key: 'whatsapp',
      label: 'Shop WhatsApp Order Number',
      isConfigured: false,
      helpText: 'Currently using placeholder (+91 98765 43210). Update in shopConfig.ts or Owner Dashboard to receive live WhatsApp pings.',
    },
    {
      key: 'address',
      label: 'Exact Stall Address & Landmark',
      isConfigured: true,
      helpText: 'Central Market Road near City Clock Tower configured.',
    },
    {
      key: 'prices',
      label: '12 Fresh Drink Menu & Pricing',
      isConfigured: true,
      helpText: 'All 12 requested juices, milkshakes, and specials active and editable.',
    },
    {
      key: 'delivery',
      label: 'Delivery Areas & Charges',
      isConfigured: true,
      helpText: '8 city zones active with ₹249 free delivery threshold.',
    },
  ],
};

// ==========================================
// 12 JUICE & MILKSHAKE MENU (Exact items requested)
// ==========================================
export const PRODUCTS_LIST: Product[] = [
  // 1. FRESH JUICES
  {
    id: 'orange-juice',
    name: 'Orange Juice',
    hindiName: 'संतरा जूस',
    category: 'Fresh Juices',
    price: 60,
    largePrice: 85,
    originalPrice: 70,
    description: 'Cold-pressed from handpicked sweet Nagpur oranges with natural pulp and zesty citrus aroma.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#FF6F00',
    tags: ['Cold-Pressed', '100% Raw', 'Immunity Boost'],
    calories: '110 kcal',
    isBestseller: true,
    isAvailable: true,
    ingredients: ['Fresh Oranges', 'Natural Orange Pulp', 'Zero Added Water'],
  },
  {
    id: 'sweet-lime-juice',
    name: 'Sweet Lime Juice',
    hindiName: 'मौसमी जूस',
    category: 'Fresh Juices',
    price: 50,
    largePrice: 70,
    originalPrice: 60,
    description: 'Freshly extracted sweet Mosambi juice with a gentle squeeze of black salt and roasted cumin.',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#C0CA33',
    tags: ['Digestive Refresh', 'Vitamin C', 'Desi Favorite'],
    calories: '95 kcal',
    isBestseller: true,
    isAvailable: true,
    ingredients: ['Fresh Sweet Lime (Mosambi)', 'Pinch of Himalayan Black Salt', 'Touch of Roasted Cumin'],
  },
  {
    id: 'watermelon-juice',
    name: 'Watermelon Juice',
    hindiName: 'तरबूज जूस',
    category: 'Fresh Juices',
    price: 40,
    largePrice: 55,
    originalPrice: 50,
    description: 'Crisp, deeply hydrating red watermelon chunks crushed fresh over ice with a fresh mint leaf sprig.',
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#E53935',
    tags: ['Super Hydrating', 'Low Calorie', 'Summer Hit'],
    calories: '75 kcal',
    isBestseller: true,
    isAvailable: true,
    ingredients: ['Fresh Red Watermelon', 'Crushed Mint Sprig', 'Rock Salt Touch'],
  },
  {
    id: 'pineapple-juice',
    name: 'Pineapple Juice',
    hindiName: 'अनानास जूस',
    category: 'Fresh Juices',
    price: 60,
    largePrice: 85,
    originalPrice: 70,
    description: 'Golden sweet & tangy Queen pineapple pressed to order. Naturally digestive and packed with bromelain.',
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#FBC02D',
    tags: ['Digestive Energy', 'Rich in Vitamin C'],
    calories: '120 kcal',
    isBestseller: false,
    isAvailable: true,
    ingredients: ['Queen Pineapple Chunks', 'Fresh Cold Pressed', 'Pinch of Himalayan Pink Salt'],
  },
  {
    id: 'pomegranate-juice',
    name: 'Pomegranate Juice',
    hindiName: 'अनार जूस',
    category: 'Fresh Juices',
    price: 90,
    largePrice: 125,
    originalPrice: 100,
    description: 'Pure Ruby Red pomegranate arils gently pressed for rich antioxidants and iron vitality.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#880E4F',
    tags: ['Super Antioxidant', 'Heart Health', 'Iron Rich'],
    calories: '140 kcal',
    isBestseller: true,
    isAvailable: true,
    ingredients: ['Fresh Ruby Pomegranate Arils', 'Zero Added Water', 'Zero Sugar'],
  },
  {
    id: 'mixed-fruit-juice',
    name: 'Mixed Fruit Juice',
    hindiName: 'मिक्स फ्रूट जूस',
    category: 'Fresh Juices',
    price: 80,
    largePrice: 110,
    originalPrice: 90,
    description: 'A vibrant orchard blend of pomegranate arils, Nagpur orange, sweet lime, crisp apple, and pineapple.',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#F57C00',
    tags: ['Multi-Fruit', 'Antioxidant Power', 'Bestseller'],
    calories: '135 kcal',
    isBestseller: true,
    isAvailable: true,
    ingredients: ['Nagpur Orange', 'Pomegranate', 'Apple', 'Pineapple', 'Mosambi'],
  },

  // 2. MILKSHAKES
  {
    id: 'banana-shake',
    name: 'Banana Shake',
    hindiName: 'केला शेक',
    category: 'Milkshakes',
    price: 60,
    largePrice: 85,
    originalPrice: 70,
    description: 'Slow-churned Robusta banana shake with chilled creamy dairy, cardamom aroma, and roasted almond slivers.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#FDD835',
    tags: ['Energy Sustained', 'Post-Workout', 'Thick & Creamy'],
    calories: '220 kcal',
    isBestseller: false,
    isAvailable: true,
    ingredients: ['Ripe Robusta Bananas', 'Fresh Dairy Milk', 'Cardamom Powder', 'Almond Flakes'],
  },
  {
    id: 'mango-shake',
    name: 'Mango Shake',
    hindiName: 'मैंगो शेक',
    category: 'Milkshakes',
    price: 80,
    largePrice: 110,
    originalPrice: 95,
    description: 'Thick, velvety shake made from ripe Alphonso mango pulp blended with rich chilled milk and pista flakes.',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80',
    fallbackColor: '#FFA000',
    tags: ['King of Fruits', 'Bestseller', 'Thick Shake'],
    calories: '240 kcal',
    isBestseller: true,
    isAvailable: true,
    ingredients: ['Alphonso Mango Pulp', 'Full Cream Milk', 'Pistachio Flakes', 'Cardamom'],
  },
  {
    id: 'chocolate-shake',
    name: 'Chocolate Shake',
    hindiName: 'चॉकलेट शेक',
    category: 'Milkshakes',
    price: 90,
    largePrice: 125,
    originalPrice: 110,
    description: 'Rich Belgian cocoa churned with thick creamy dairy, vanilla aroma, and dark chocolate ganache swirl.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#4E342E',
    tags: ['Belgian Cocoa', 'Decadent Treat', 'Kids Favorite'],
    calories: '280 kcal',
    isBestseller: true,
    isAvailable: true,
    ingredients: ['Belgian Dark Cocoa', 'Cold Fresh Milk', 'Chocolate Ganache Swirl', 'Vanilla Bean'],
  },
  {
    id: 'strawberry-shake',
    name: 'Strawberry Shake',
    hindiName: 'स्ट्रॉबेरी शेक',
    category: 'Milkshakes',
    price: 100,
    largePrice: 135,
    originalPrice: 120,
    description: 'Fresh Mahabaleshwar strawberries churned with creamy chilled milk and pure vanilla ice-cream scoop.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#D81B60',
    tags: ['Mahabaleshwar Berries', 'Creamy Delight'],
    calories: '250 kcal',
    isBestseller: true,
    isAvailable: true,
    ingredients: ['Fresh Strawberries', 'Chilled Fresh Milk', 'Vanilla Ice Cream Scoop'],
  },

  // 3. SPECIAL DRINKS
  {
    id: 'apple-juice',
    name: 'Apple Juice',
    hindiName: 'सेब जूस',
    category: 'Special Drinks',
    price: 70,
    largePrice: 95,
    originalPrice: 80,
    description: 'Crisp Shimla red apples cold-pressed fresh. Naturally sweet, clear, refreshing and zero preservatives.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#C62828',
    tags: ['Shimla Apples', '100% Pure', 'Naturally Sweet'],
    calories: '115 kcal',
    isBestseller: false,
    isAvailable: true,
    ingredients: ['Fresh Shimla Apples', 'Cold Pressed', 'Touch of Lemon'],
  },
  {
    id: 'ajju-special-fruit-blast',
    name: 'Ajju Special Fruit Blast',
    hindiName: 'अज्जू स्पेशल फ्रूट ब्लास्ट',
    category: 'Special Drinks',
    price: 120,
    largePrice: 160,
    originalPrice: 140,
    description: 'Our house pride: Layered exotic fruits, dry fruit toppings, honey drizzle, and fresh cream dollop.',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=1000&q=85',
    fallbackColor: '#D84315',
    tags: ['Signature Masterpiece', 'Dry Fruits', 'Ultimate Energy'],
    calories: '310 kcal',
    isBestseller: true,
    isAvailable: true,
    ingredients: ['Mango & Pomegranate', 'Banana & Apple Chunks', 'Cashews, Almonds & Pistachios', 'Pure Honey Drizzle'],
  },
];

export const SPECIAL_OFFERS_LIST: SpecialOffer[] = [
  {
    id: 'fresh-combo',
    title: 'Fresh Squeeze Duo',
    tagline: 'Choose Any 2 Fresh Juices',
    description: 'Pick your favorite 2 cold-pressed juices (Orange, Sweet Lime, Watermelon, or Pineapple) and save instantly.',
    price: 99,
    originalPrice: 120,
    badge: 'Save ₹21',
    iconName: 'Sparkles',
    productIds: ['orange-juice', 'sweet-lime-juice'],
    isPlaceholderNotice: 'Promo offer configurable in Shop Settings',
  },
  {
    id: 'shake-cooler-trio',
    title: 'Shakes & Sips Trio',
    tagline: 'Mango Shake + Orange + Watermelon',
    description: 'Perfect for sharing: one thick Mango Shake and two revitalizing fruit juices.',
    price: 159,
    originalPrice: 180,
    badge: 'Save ₹21',
    iconName: 'SunMedium',
    productIds: ['mango-shake', 'orange-juice', 'watermelon-juice'],
    isPlaceholderNotice: 'Combo offer configurable in Shop Settings',
  },
  {
    id: 'blast-family-pack',
    title: 'Ajju Blast Party Pack',
    tagline: '2 Ajju Special Blasts + 2 Fresh Juices',
    description: 'Two loaded Fruit Blasts with dry fruits plus two cold-pressed juices for family hydration.',
    price: 349,
    originalPrice: 400,
    badge: 'Best Value • Save ₹51',
    iconName: 'Users',
    productIds: ['ajju-special-fruit-blast', 'pomegranate-juice', 'orange-juice'],
    isPlaceholderNotice: 'Party combo configurable in Shop Settings',
  },
];
