import { OrderRecord, OrderStatus, Product, CheckoutFormState, CartItem } from '../types';
import { SHOP_CONFIG, ShopConfiguration, PRODUCTS_LIST } from '../shopConfig';
import {
  supabase,
  orderRecordToSupabaseRow,
  supabaseRowToOrderRecord,
  SUPABASE_PROJECT_ID,
  SUPABASE_SETUP_SQL,
} from './supabaseClient';

const LOCAL_ORDERS_KEY = 'ajju_orders_v1';
const LOCAL_PRODUCTS_KEY = 'ajju_products_v1';
const LOCAL_SETTINGS_KEY = 'ajju_settings_v1';
export const ADMIN_PASSCODE = 'ajju2026';

// Helper to generate unique order ID like AJJU-72941
export function generateOrderId(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `AJJU-${randomDigits}`;
}

export const OrderService = {
  // 1. PLACE A REAL ORDER
  async placeOrder(params: {
    form: CheckoutFormState;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    grandTotal: number;
    couponCode: string | null;
    idempotencyToken: string;
  }): Promise<OrderRecord> {
    const { form, items, subtotal, deliveryFee, discount, grandTotal, couponCode, idempotencyToken } = params;

    const newOrder: OrderRecord = {
      id: generateOrderId(),
      orderType: form.orderType,
      customer: {
        name: form.customerName.trim(),
        phone: form.phoneNumber.trim(),
        address: form.address?.trim(),
        locality: form.locality?.trim(),
        landmark: form.landmark?.trim(),
        notes: form.orderNotes?.trim(),
      },
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        size: i.customization?.size,
        sweetness: i.customization?.sweetness,
        iceLevel: i.customization?.iceLevel,
      })),
      subtotal,
      deliveryFee,
      discount,
      grandTotal,
      couponCode,
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentMethod === 'online' ? 'paid' : 'pending',
      status: 'Order Received',
      createdAt: new Date().toISOString(),
      estimatedTime: form.orderType === 'delivery' ? SHOP_CONFIG.estimatedDeliveryTime : SHOP_CONFIG.estimatedPrepTime,
      idempotencyToken,
    };

    // 1. Try backend API first (when running on full-stack server)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (response.ok) {
        const result = await response.json();
        this.saveLocalOrder(result);
        return result;
      }
    } catch {
      // Backend not running (e.g. Netlify static deployment)
    }

    // 2. Direct Supabase save (essential for Netlify / serverless static hosts)
    try {
      await this.syncOrderDirectToSupabase(newOrder);
    } catch (e) {
      console.warn('Direct Supabase save notice:', e);
    }

    // 3. Persist locally in browser storage
    this.saveLocalOrder(newOrder);
    return newOrder;
  },

  // Save to browser storage
  saveLocalOrder(order: OrderRecord) {
    try {
      const existing = this.getLocalOrders();
      // Anti-duplicate check
      const alreadyExists = existing.some(
        (o) => o.id === order.id || (order.idempotencyToken && o.idempotencyToken === order.idempotencyToken)
      );
      if (!alreadyExists) {
        const updated = [order, ...existing];
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Could not save order locally', e);
    }
  },

  // Get orders stored locally
  getLocalOrders(): OrderRecord[] {
    try {
      const data = localStorage.getItem(LOCAL_ORDERS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore
    }
    return [];
  },

  // 2. TRACK ORDER (with Order ID & Phone validation)
  async getOrder(orderId: string, phone?: string): Promise<{ order?: OrderRecord; error?: string }> {
    const cleanId = orderId.trim().toUpperCase();
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';

    // 1. First try server
    try {
      const query = cleanPhone ? `?phone=${encodeURIComponent(cleanPhone)}` : '';
      const response = await fetch(`/api/orders/${encodeURIComponent(cleanId)}${query}`);
      if (response.ok) {
        const data = await response.json();
        return { order: data };
      }
    } catch {
      // Continue to Supabase lookup
    }

    // 2. Direct Supabase lookup (essential for Netlify cross-device tracking!)
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('id', cleanId).maybeSingle();
      if (!error && data) {
        const orderRecord = supabaseRowToOrderRecord(data);
        if (cleanPhone) {
          const customerPhoneDigits = (orderRecord.customer.phone || '').replace(/\D/g, '');
          if (customerPhoneDigits && !customerPhoneDigits.endsWith(cleanPhone) && !cleanPhone.endsWith(customerPhoneDigits)) {
            return { error: 'Phone number does not match the customer details for this order.' };
          }
        }
        return { order: orderRecord };
      }
    } catch {
      // Continue to local storage fallback
    }

    // 3. Fallback to local storage search
    const localList = this.getLocalOrders();
    const found = localList.find((o) => o.id.toUpperCase() === cleanId);

    if (!found) {
      return { error: `No order found with ID "${orderId}". Please verify and try again.` };
    }

    if (cleanPhone) {
      const customerPhoneDigits = found.customer.phone.replace(/\D/g, '');
      if (customerPhoneDigits && !customerPhoneDigits.endsWith(cleanPhone) && !cleanPhone.endsWith(customerPhoneDigits)) {
        return { error: 'Phone number does not match the customer details for this order.' };
      }
    }

    return { order: found };
  },

  // 3. ADMIN: GET ALL ORDERS
  async getAllOrders(): Promise<OrderRecord[]> {
    // 1. Try backend API first
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const orders = await response.json();
        if (Array.isArray(orders) && orders.length > 0) {
          return orders;
        }
      }
    } catch {
      // Continue to Supabase
    }

    // 2. Direct Supabase query (essential for Netlify Admin view of all orders!)
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const supabaseOrders = data.map((d: any) => supabaseRowToOrderRecord(d));
        return supabaseOrders;
      }
    } catch {
      // Continue
    }

    return this.getLocalOrders();
  },

  // 4. ADMIN: UPDATE ORDER STATUS
  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    // 1. Try backend API first
    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        this.updateLocalOrderStatus(orderId, newStatus);
        return true;
      }
    } catch {
      // Continue to Supabase
    }

    // 2. Direct Supabase update (essential for Netlify Admin!)
    try {
      await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
    } catch {
      // Continue
    }

    this.updateLocalOrderStatus(orderId, newStatus);
    return true;
  },

  updateLocalOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {
      const orders = this.getLocalOrders();
      const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not update order status locally', e);
    }
  },

  // 5. PRODUCTS: GET & UPDATE
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const prods = await response.json();
        if (Array.isArray(prods) && prods.length > 0) {
          return prods;
        }
      }
    } catch {
      // Fallback
    }

    try {
      const local = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      if (local) {
        return JSON.parse(local);
      }
    } catch {
      // Fallback
    }

    return PRODUCTS_LIST;
  },

  async saveProducts(products: Product[]): Promise<boolean> {
    try {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      });
      return true;
    } catch {
      return true;
    }
  },

  // 6. SETTINGS: GET & UPDATE
  async getSettings(): Promise<ShopConfiguration> {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const s = await response.json();
        return { ...SHOP_CONFIG, ...s };
      }
    } catch {
      // Fallback
    }

    try {
      const local = localStorage.getItem(LOCAL_SETTINGS_KEY);
      if (local) {
        return { ...SHOP_CONFIG, ...JSON.parse(local) };
      }
    } catch {
      // Fallback
    }

    return SHOP_CONFIG;
  },

  async saveSettings(settings: Partial<ShopConfiguration>): Promise<boolean> {
    try {
      const current = await this.getSettings();
      const merged = { ...current, ...settings };
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(merged));
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
      return true;
    } catch {
      return true;
    }
  },

  // 7. SUPABASE DATABASE METHODS
  async checkSupabaseStatus(): Promise<{
    connected: boolean;
    tableExists: boolean;
    projectId: string;
    message?: string;
    error?: string;
    totalRows?: number;
  }> {
    try {
      const response = await fetch('/api/supabase/status');
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback to direct client check
    }

    try {
      const { data, error } = await supabase.from('orders').select('id').limit(1);
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
          return {
            connected: true,
            tableExists: false,
            projectId: SUPABASE_PROJECT_ID,
            message: 'Connected to Supabase! Table "public.orders" needs to be created in Supabase SQL editor.',
          };
        }
        return {
          connected: false,
          tableExists: false,
          projectId: SUPABASE_PROJECT_ID,
          error: error.message,
        };
      }
      return {
        connected: true,
        tableExists: true,
        projectId: SUPABASE_PROJECT_ID,
        message: 'Supabase "orders" table is active and receiving live bookings.',
        totalRows: data?.length ?? 0,
      };
    } catch (err: any) {
      return {
        connected: false,
        tableExists: false,
        projectId: SUPABASE_PROJECT_ID,
        error: err.message || 'Error reaching Supabase',
      };
    }
  },

  async syncOrderDirectToSupabase(order: OrderRecord): Promise<boolean> {
    try {
      const row = orderRecordToSupabaseRow(order);
      const { error } = await supabase.from('orders').upsert(row);
      if (error) {
        console.warn('[Direct Supabase sync warning]:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('[Direct Supabase sync error]:', e);
      return false;
    }
  },

  getSupabaseSetupSql(): string {
    return SUPABASE_SETUP_SQL;
  },
};

