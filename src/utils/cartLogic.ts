import { CartItem, CheckoutFormState } from '../types';

export interface CartTotals {
  subtotal: number;
  totalItems: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
}

export const FREE_DELIVERY_THRESHOLD = 249;
export const STANDARD_DELIVERY_FEE = 30;

export function calculateCartTotals(
  items: CartItem[],
  orderType: 'delivery' | 'pickup' = 'pickup',
  discountAmount: number = 0
): CartTotals {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  let deliveryFee = 0;
  let amountNeededForFreeDelivery = 0;

  if (orderType === 'delivery') {
    if (subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD) {
      deliveryFee = STANDARD_DELIVERY_FEE;
      amountNeededForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;
    } else {
      deliveryFee = 0;
      amountNeededForFreeDelivery = 0;
    }
  }

  const safeDiscount = Math.min(discountAmount, subtotal);
  const grandTotal = Math.max(0, subtotal - safeDiscount + deliveryFee);

  return {
    subtotal,
    totalItems,
    deliveryFee,
    discount: safeDiscount,
    grandTotal,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    amountNeededForFreeDelivery,
  };
}

export function validateCheckoutForm(form: CheckoutFormState): {
  isValid: boolean;
  errors: Partial<Record<keyof CheckoutFormState, string>>;
} {
  const errors: Partial<Record<keyof CheckoutFormState, string>> = {};

  if (!form.customerName || form.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name (at least 2 characters).';
  }

  const digits = form.phoneNumber.replace(/\D/g, '');
  if (!form.phoneNumber || digits.length < 10) {
    errors.phoneNumber = 'Please enter a valid 10-digit mobile number.';
  }

  if (form.orderType === 'delivery') {
    if (!form.address || form.address.trim().length < 8) {
      errors.address = 'Please enter complete delivery address with landmark.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatWhatsAppMessage(params: {
  items: CartItem[];
  totals: CartTotals;
  customer: CheckoutFormState;
  shopName?: string;
}): string {
  const { items, totals, customer, shopName = 'Ajju juice Wala' } = params;

  const lines: string[] = [];

  lines.push(`🍹 *ORDER REQUEST — ${shopName.toUpperCase()}*`);
  lines.push(`📅 *Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`👤 *Customer Details:*`);
  lines.push(`• Name: ${customer.customerName.trim()}`);
  lines.push(`• Phone: ${customer.phoneNumber.trim()}`);
  lines.push(`• Order Type: ${customer.orderType === 'delivery' ? '🛵 Home Delivery' : '🛍️ Self Pickup'}`);

  if (customer.orderType === 'delivery' && customer.address) {
    lines.push(`• Delivery Address: ${customer.address.trim()}`);
  }

  if (customer.preferredTime) {
    lines.push(`• Preferred Slot: ${customer.preferredTime}`);
  }

  if (customer.orderNotes && customer.orderNotes.trim()) {
    lines.push(`• Special Note: ${customer.orderNotes.trim()}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🛒 *Ordered Drinks (${totals.totalItems} items):*`);

  items.forEach((item, index) => {
    const customDetails: string[] = [];
    if (item.customization) {
      if (item.customization.size) customDetails.push(item.customization.size);
      if (item.customization.sweetness) customDetails.push(item.customization.sweetness);
      if (item.customization.iceLevel) customDetails.push(item.customization.iceLevel);
    }

    const customText = customDetails.length > 0 ? ` (${customDetails.join(', ')})` : '';
    const itemSubtotal = item.price * item.quantity;
    lines.push(`${index + 1}. *${item.name}* x ${item.quantity} = ₹${itemSubtotal}${customText}`);
  });

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🧾 *Bill Summary:*`);
  lines.push(`• Item Subtotal: ₹${totals.subtotal}`);

  if (totals.discount > 0) {
    lines.push(`• Discount: -₹${totals.discount}`);
  }

  if (customer.orderType === 'delivery') {
    lines.push(`• Delivery Fee: ${totals.deliveryFee === 0 ? 'FREE (Orders above ₹' + totals.freeDeliveryThreshold + ')' : '₹' + totals.deliveryFee}`);
  } else {
    lines.push(`• Delivery Fee: ₹0 (Pickup)`);
  }

  lines.push(`*• Grand Total: ₹${totals.grandTotal}*`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📌 *Note:* Order will be prepared fresh upon shop confirmation. Thank you!`);

  return lines.join('\n');
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  // Clean phone number to digits only
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

