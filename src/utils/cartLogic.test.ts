import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  validateCheckoutForm,
  formatWhatsAppMessage,
  buildWhatsAppLink,
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
} from './cartLogic';
import { CartItem, CheckoutFormState } from '../types';

const mockItems: CartItem[] = [
  {
    id: 'orange-1',
    productId: 'orange-juice',
    name: 'Fresh Orange Juice',
    price: 60,
    quantity: 2,
    image: 'test.jpg',
    category: 'Fresh Juices',
    customization: { iceLevel: 'Normal Ice', sweetness: 'Regular', size: 'Regular' },
  },
  {
    id: 'watermelon-1',
    productId: 'watermelon-juice',
    name: 'Watermelon Juice',
    price: 40,
    quantity: 1,
    image: 'test2.jpg',
    category: 'Fresh Juices',
  },
];

test('calculateCartTotals computes subtotal and total items correctly for pickup', () => {
  const totals = calculateCartTotals(mockItems, 'pickup', 0);
  // (60 * 2) + (40 * 1) = 120 + 40 = 160
  assert.equal(totals.subtotal, 160);
  assert.equal(totals.totalItems, 3);
  assert.equal(totals.deliveryFee, 0);
  assert.equal(totals.discount, 0);
  assert.equal(totals.grandTotal, 160);
});

test('calculateCartTotals adds standard delivery fee when subtotal is below threshold', () => {
  const totals = calculateCartTotals(mockItems, 'delivery', 0);
  assert.equal(totals.subtotal, 160);
  assert.equal(totals.deliveryFee, STANDARD_DELIVERY_FEE);
  assert.equal(totals.grandTotal, 160 + STANDARD_DELIVERY_FEE);
  assert.equal(totals.amountNeededForFreeDelivery, FREE_DELIVERY_THRESHOLD - 160);
});

test('calculateCartTotals gives free delivery when subtotal meets threshold', () => {
  const largeCart: CartItem[] = [
    {
      id: 'mango-1',
      productId: 'mango-shake',
      name: 'Mango Shake',
      price: 80,
      quantity: 4,
      image: 'test.jpg',
      category: 'Milkshakes',
    },
  ];
  // 80 * 4 = 320 >= 249
  const totals = calculateCartTotals(largeCart, 'delivery', 0);
  assert.equal(totals.subtotal, 320);
  assert.equal(totals.deliveryFee, 0);
  assert.equal(totals.grandTotal, 320);
  assert.equal(totals.amountNeededForFreeDelivery, 0);
});

test('calculateCartTotals applies promotional discounts correctly', () => {
  const totals = calculateCartTotals(mockItems, 'pickup', 30);
  // 160 - 30 = 130
  assert.equal(totals.subtotal, 160);
  assert.equal(totals.discount, 30);
  assert.equal(totals.grandTotal, 130);
});

test('validateCheckoutForm flags missing or invalid fields', () => {
  const invalidForm: CheckoutFormState = {
    customerName: '',
    phoneNumber: '123',
    orderType: 'delivery',
    address: '',
    locality: 'Central Market',
    landmark: '',
    orderNotes: '',
    preferredTime: 'ASAP',
    paymentMethod: 'cod',
  };

  const result = validateCheckoutForm(invalidForm);
  assert.equal(result.isValid, false);
  assert.ok(result.errors.customerName);
  assert.ok(result.errors.phoneNumber);
  assert.ok(result.errors.address);
});

test('validateCheckoutForm allows valid pickup without address', () => {
  const validPickup: CheckoutFormState = {
    customerName: 'Aarav Patel',
    phoneNumber: '9876543210',
    orderType: 'pickup',
    address: '',
    locality: 'Central Market',
    landmark: '',
    orderNotes: 'Pack extra napkins please',
    preferredTime: 'Within 20 mins',
    paymentMethod: 'pickup_pay',
  };

  const result = validateCheckoutForm(validPickup);
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('formatWhatsAppMessage builds complete and accurate text with items and customer info', () => {
  const customer: CheckoutFormState = {
    customerName: 'Rohan Roy',
    phoneNumber: '9876543210',
    orderType: 'delivery',
    address: 'Flat 402, Green Meadows, 5th Main, Indiranagar',
    locality: 'Central Market',
    landmark: 'Near Water Tank',
    orderNotes: 'Less sweet please',
    preferredTime: 'ASAP',
    paymentMethod: 'cod',
  };

  const totals = calculateCartTotals(mockItems, 'delivery', 0);
  const message = formatWhatsAppMessage({
    items: mockItems,
    totals,
    customer,
    shopName: 'Ajju Juice Wala',
  });

  assert.ok(message.includes('AJJU JUICE WALA'));
  assert.ok(message.includes('Rohan Roy'));
  assert.ok(message.includes('Fresh Orange Juice'));
  assert.ok(message.includes('Watermelon Juice'));
  assert.ok(message.includes('Flat 402, Green Meadows'));
  assert.ok(message.includes(`Grand Total: ₹${totals.grandTotal}`));
});

test('buildWhatsAppLink generates valid wa.me link with encoded text', () => {
  const url = buildWhatsAppLink('+91 98765 43210', 'Hello Ajju Juice Wala!');
  assert.equal(url.startsWith('https://wa.me/919876543210?text=Hello%20Ajju%20Juice%20Wala!'), true);

  const localUrl = buildWhatsAppLink('9876543210', 'Hello');
  assert.equal(localUrl.startsWith('https://wa.me/919876543210?text=Hello'), true);
});
