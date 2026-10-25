import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// ==========================================
// SUPABASE CLIENT CONFIGURATION
// ==========================================
const SUPABASE_PROJECT_ID = 'cfjuvpbbrmrzlowqviua';
const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_XhLxe3RsTrUbpOtA3VfJ5Q_78hLR4ev';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log(`[SUPABASE] Initialized connection to project: ${SUPABASE_PROJECT_ID}`);

// Persistent JSON file paths for storage backup
const DATA_DIR = path.join(__dirname, '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e);
  }
}

// Memory stores initialized from file
let orders: any[] = readJsonFile<any[]>(ORDERS_FILE, []);
let products: any[] = readJsonFile<any[]>(PRODUCTS_FILE, []);
let settings: any = readJsonFile<any>(SETTINGS_FILE, null);

// In-memory nonce cache to prevent duplicate order submissions
const processedNonces = new Set<string>();

// ==========================================
// API ROUTES
// ==========================================

// Health Check with Supabase info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Ajju Juice Wala',
    time: new Date().toISOString(),
    totalOrders: orders.length,
    supabase: {
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      configured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
    },
  });
});

// GET /api/supabase/status - Test Supabase database connection and table readiness
app.get('/api/supabase/status', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('id').limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return res.json({
          connected: true,
          tableExists: false,
          projectId: SUPABASE_PROJECT_ID,
          message: 'Connected to Supabase! Table "public.orders" needs to be created in Supabase SQL editor.',
        });
      }
      return res.json({
        connected: false,
        tableExists: false,
        projectId: SUPABASE_PROJECT_ID,
        error: error.message,
      });
    }

    res.json({
      connected: true,
      tableExists: true,
      projectId: SUPABASE_PROJECT_ID,
      message: 'Supabase "orders" table is active and receiving live bookings.',
      totalRows: data?.length ?? 0,
    });
  } catch (err: any) {
    res.json({
      connected: false,
      tableExists: false,
      projectId: SUPABASE_PROJECT_ID,
      error: err.message || 'Error reaching Supabase',
    });
  }
});

// GET /api/orders/:id - Customer Order Tracking with phone verification
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { phone } = req.query;

  let order = orders.find((o) => o.id.toUpperCase() === id.toUpperCase());

  // If not found in memory/file, try Supabase
  if (!order) {
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('id', id.toUpperCase()).maybeSingle();
      if (!error && data) {
        order = {
          id: data.id,
          orderType: data.order_type,
          customer: {
            name: data.customer_name,
            phone: data.phone,
            address: data.address,
            locality: data.locality,
            landmark: data.landmark,
            notes: data.notes,
          },
          items: data.items,
          subtotal: Number(data.subtotal),
          deliveryFee: Number(data.delivery_fee),
          discount: Number(data.discount),
          grandTotal: Number(data.grand_total),
          couponCode: data.coupon_code,
          paymentMethod: data.payment_method,
          paymentStatus: data.payment_status,
          status: data.status,
          createdAt: data.created_at,
          estimatedTime: data.estimated_time,
        };
      }
    } catch {
      // Continue
    }
  }

  if (!order) {
    return res.status(404).json({ error: 'Order not found with provided ID' });
  }

  // Security Verification: If phone is provided, verify match
  if (phone) {
    const cleanQueryPhone = String(phone).replace(/\D/g, '');
    const cleanOrderPhone = String(order.customer?.phone || '').replace(/\D/g, '');

    if (
      cleanQueryPhone &&
      cleanOrderPhone &&
      !cleanOrderPhone.endsWith(cleanQueryPhone) &&
      !cleanQueryPhone.endsWith(cleanOrderPhone)
    ) {
      return res.status(403).json({ error: 'Verification failed: Phone number does not match this order' });
    }
  }

  res.json(order);
});

// POST /api/orders - Real Order Placement with Supabase Database Sync
app.post('/api/orders', async (req, res) => {
  const newOrder = req.body;

  if (!newOrder || !newOrder.items || newOrder.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty. Please add drinks to order.' });
  }

  if (!newOrder.customer?.name || newOrder.customer.name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter customer full name.' });
  }

  const phoneDigits = String(newOrder.customer?.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  if (newOrder.orderType === 'delivery') {
    if (!newOrder.customer?.address || newOrder.customer.address.trim().length < 5) {
      return res.status(400).json({ error: 'Please enter complete delivery address.' });
    }
  }

  // Idempotency token check to prevent double click orders
  if (newOrder.idempotencyToken) {
    if (processedNonces.has(newOrder.idempotencyToken)) {
      const existing = orders.find((o) => o.idempotencyToken === newOrder.idempotencyToken);
      if (existing) {
        return res.status(200).json(existing);
      }
    }
    processedNonces.add(newOrder.idempotencyToken);
  }

  // Assign Order ID if missing
  if (!newOrder.id) {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    newOrder.id = `AJJU-${randomDigits}`;
  }

  newOrder.createdAt = newOrder.createdAt || new Date().toISOString();
  newOrder.status = newOrder.status || 'Order Received';

  // 1. Save to local fallback file immediately
  orders.unshift(newOrder);
  writeJsonFile(ORDERS_FILE, orders);

  // 2. Save directly to Supabase orders table
  const supabaseRow = {
    id: newOrder.id,
    customer_name: newOrder.customer?.name || 'Customer',
    phone: newOrder.customer?.phone || '',
    order_type: newOrder.orderType || 'delivery',
    address: newOrder.customer?.address || '',
    locality: newOrder.customer?.locality || '',
    landmark: newOrder.customer?.landmark || '',
    notes: newOrder.customer?.notes || '',
    items: newOrder.items,
    subtotal: newOrder.subtotal,
    delivery_fee: newOrder.deliveryFee || 0,
    discount: newOrder.discount || 0,
    grand_total: newOrder.grandTotal,
    coupon_code: newOrder.couponCode || null,
    payment_method: newOrder.paymentMethod || 'cod',
    payment_status: newOrder.paymentStatus || 'pending',
    status: newOrder.status || 'Order Received',
    estimated_time: newOrder.estimatedTime || '30–40 mins',
    idempotency_token: newOrder.idempotencyToken || null,
    created_at: newOrder.createdAt,
  };

  try {
    const { error: sbError } = await supabase.from('orders').insert(supabaseRow);
    if (sbError) {
      console.warn('[Supabase Sync Notice]:', sbError.message);
    } else {
      console.log(`[Supabase Success]: Order ${newOrder.id} saved to Supabase!`);
    }
  } catch (sbErr: any) {
    console.warn('[Supabase Error]:', sbErr.message);
  }

  res.status(201).json(newOrder);
});

// GET /api/admin/orders - Admin view all orders (merges Supabase + local)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const supabaseOrders = data.map((d: any) => ({
        id: d.id,
        orderType: d.order_type,
        customer: {
          name: d.customer_name,
          phone: d.phone,
          address: d.address,
          locality: d.locality,
          landmark: d.landmark,
          notes: d.notes,
        },
        items: d.items,
        subtotal: Number(d.subtotal),
        deliveryFee: Number(d.delivery_fee),
        discount: Number(d.discount),
        grandTotal: Number(d.grand_total),
        couponCode: d.coupon_code,
        paymentMethod: d.payment_method,
        paymentStatus: d.payment_status,
        status: d.status,
        createdAt: d.created_at,
        estimatedTime: d.estimated_time,
      }));

      // Merge with any local orders not yet in Supabase
      const allMerged = [...supabaseOrders];
      for (const local of orders) {
        if (!allMerged.some((m) => m.id === local.id)) {
          allMerged.push(local);
        }
      }
      return res.json(allMerged);
    }
  } catch {
    // Continue to fallback
  }

  res.json(orders);
});

// PATCH /api/admin/orders/:id/status - Update order status in local & Supabase
app.patch('/api/admin/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    'Order Received',
    'Order Accepted',
    'Preparing Your Juice',
    'Ready for Pickup or Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status specified' });
  }

  const orderIndex = orders.findIndex((o) => o.id.toUpperCase() === id.toUpperCase());
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    writeJsonFile(ORDERS_FILE, orders);
  }

  // Update in Supabase
  try {
    await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id.toUpperCase());
  } catch (err: any) {
    console.warn('[Supabase Status Update Error]:', err.message);
  }

  if (orderIndex !== -1) {
    return res.json(orders[orderIndex]);
  }

  res.json({ id, status });
});

// GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// PUT /api/admin/products
app.put('/api/admin/products', (req, res) => {
  if (Array.isArray(req.body)) {
    products = req.body;
    writeJsonFile(PRODUCTS_FILE, products);
    res.json({ success: true, count: products.length });
  } else {
    res.status(400).json({ error: 'Expected an array of products' });
  }
});

// GET /api/settings
app.get('/api/settings', (req, res) => {
  res.json(settings || {});
});

// PUT /api/admin/settings
app.put('/api/admin/settings', (req, res) => {
  settings = req.body;
  writeJsonFile(SETTINGS_FILE, settings);
  res.json({ success: true });
});

// ==========================================
// VITE DEV SERVER INTEGRATION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production static build
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  } else {
    // Development mode: Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AJJU JUICE WALA] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
