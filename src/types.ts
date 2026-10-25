export type ProductCategory = 'All' | 'Fresh Juices' | 'Milkshakes' | 'Special Drinks';

export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export interface DailySpecialConfig {
  day: DayOfWeek;
  productId: string;
  badgeText: string;
  discountPercent?: number;
  isActive: boolean;
}

export interface CustomizationOptions {
  iceLevel?: 'Normal Ice' | 'Less Ice' | 'No Ice';
  sweetness?: 'Regular' | 'Less Sugar' | 'Honey' | 'No Added Sugar';
  size?: 'Regular' | 'Large';
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Fresh Juices' | 'Milkshakes' | 'Special Drinks';
  price: number;
  originalPrice?: number;
  largePrice?: number;
  description: string;
  image: string;
  fallbackColor: string;
  tags: string[];
  calories?: string;
  isBestseller?: boolean;
  isAvailable?: boolean;
  ingredients: string[];
}

export interface CartItem {
  id: string; // unique cart entry key (productId + customizations)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  customization?: CustomizationOptions;
}

export interface SpecialOffer {
  id: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  badge: string;
  iconName: string;
  productIds: string[];
  isPlaceholderNotice: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  drinkOrdered: string;
  comment: string;
  avatarBg: string;
}

export type OrderStatus =
  | 'Order Received'
  | 'Order Accepted'
  | 'Preparing Your Juice'
  | 'Ready for Pickup or Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'pickup_pay' | 'online';

export interface OrderCustomer {
  name: string;
  phone: string;
  address?: string;
  locality?: string;
  landmark?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  sweetness?: string;
  iceLevel?: string;
}

export interface OrderRecord {
  id: string; // e.g. AJJU-74912
  orderType: 'delivery' | 'pickup';
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  couponCode?: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  createdAt: string;
  estimatedTime: string;
  idempotencyToken?: string;
}

export interface CheckoutFormState {
  customerName: string;
  phoneNumber: string;
  orderType: 'delivery' | 'pickup';
  address: string;
  locality: string;
  landmark: string;
  orderNotes: string;
  preferredTime: string;
  paymentMethod: PaymentMethod;
}
