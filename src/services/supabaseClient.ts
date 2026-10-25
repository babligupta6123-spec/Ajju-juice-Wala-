import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrderRecord } from '../types';

export const SUPABASE_PROJECT_ID = 'cfjuvpbbrmrzlowqviua';
export const SUPABASE_URL =
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY =
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_XhLxe3RsTrUbpOtA3VfJ5Q_78hLR4ev';

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  order_type TEXT NOT NULL DEFAULT 'delivery',
  address TEXT,
  locality TEXT,
  landmark TEXT,
  notes TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  grand_total NUMERIC NOT NULL,
  coupon_code TEXT,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'Order Received',
  estimated_time TEXT,
  idempotency_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public / anon users to insert booking orders
CREATE POLICY "Allow public insert orders" 
ON public.orders FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow public / anon users to read orders (for customer order tracking)
CREATE POLICY "Allow public read orders" 
ON public.orders FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow update of orders (for admin order status progression)
CREATE POLICY "Allow update orders" 
ON public.orders FOR UPDATE 
TO anon, authenticated 
USING (true);
`;

export function orderRecordToSupabaseRow(order: OrderRecord) {
  return {
    id: order.id,
    customer_name: order.customer.name,
    phone: order.customer.phone,
    order_type: order.orderType,
    address: order.customer.address || '',
    locality: order.customer.locality || '',
    landmark: order.customer.landmark || '',
    notes: order.customer.notes || '',
    items: order.items,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    discount: order.discount,
    grand_total: order.grandTotal,
    coupon_code: order.couponCode || null,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    status: order.status,
    estimated_time: order.estimatedTime,
    idempotency_token: order.idempotencyToken || null,
    created_at: order.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function supabaseRowToOrderRecord(row: any): OrderRecord {
  return {
    id: row.id,
    orderType: row.order_type || 'delivery',
    customer: {
      name: row.customer_name || 'Customer',
      phone: row.phone || '',
      address: row.address || '',
      locality: row.locality || '',
      landmark: row.landmark || '',
      notes: row.notes || '',
    },
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [],
    subtotal: Number(row.subtotal || 0),
    deliveryFee: Number(row.delivery_fee || 0),
    discount: Number(row.discount || 0),
    grandTotal: Number(row.grand_total || 0),
    couponCode: row.coupon_code || null,
    paymentMethod: row.payment_method || 'cod',
    paymentStatus: row.payment_status || 'pending',
    status: row.status || 'Order Received',
    createdAt: row.created_at || new Date().toISOString(),
    estimatedTime: row.estimated_time || '30–40 mins',
    idempotencyToken: row.idempotency_token || undefined,
  };
}

/**
 * Checks connection status to Supabase
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  project: string;
  message: string;
}> {
  try {
    const { data, error, status } = await supabase.from('orders').select('id').limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return {
          connected: true,
          tableExists: false,
          project: SUPABASE_PROJECT_ID,
          message:
            'Connected to Supabase project successfully! Table "public.orders" has not been created yet in SQL editor.',
        };
      }
      return {
        connected: false,
        tableExists: false,
        project: SUPABASE_PROJECT_ID,
        message: error.message || 'Supabase returned an error response.',
      };
    }

    return {
      connected: true,
      tableExists: true,
      project: SUPABASE_PROJECT_ID,
      message: `Connected & Synced with Supabase "public.orders" table (${data?.length || 0} rows found).`,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      project: SUPABASE_PROJECT_ID,
      message: err.message || 'Network error reaching Supabase.',
    };
  }
}
