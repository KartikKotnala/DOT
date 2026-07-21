const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
  res.send('Kiosk Backend API is Running!');
});

// 1. GET: All Products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    const formatted = rows.map(item => ({
      ...item,
      kioskPaths: typeof item.kioskPaths === 'string' ? JSON.parse(item.kioskPaths) : item.kioskPaths
    }));
    console.log(`[API] Fetched ${formatted.length} products`);
    res.json(formatted);
  } catch (err) {
    console.error('[API Error] /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET: All Brands
app.get('/api/brands', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM brands');
    console.log(`[API] Fetched ${rows.length} brands`);
    res.json(rows);
  } catch (err) {
    console.error('[API Error] /api/brands:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. GET: Kiosks Registry
app.get('/api/kiosks', async (req, res) => {
  try {
    const [kiosks] = await db.query('SELECT * FROM kiosks');
    console.log(`[API] Fetched ${kiosks.length} kiosks`);
    res.json({
      kiosks,
      transitHubs: {
        lift: [
          { floor: 1, x: 340, y: 500 },
          { floor: 2, x: 340, y: 500 },
          { floor: 3, x: 340, y: 500 }
        ],
        escalator: [
          { floor: 1, x: 400, y: 150 },
          { floor: 2, x: 400, y: 150 },
          { floor: 3, x: 400, y: 150 }
        ],
        stairs: [
          { floor: 1, x: 600, y: 450 },
          { floor: 2, x: 600, y: 450 },
          { floor: 3, x: 600, y: 450 }
        ]
      }
    });
  } catch (err) {
    console.error('[API Error] /api/kiosks:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. POST: Complete Kiosk Customer Checkout Order
app.post('/api/orders', async (req, res) => {
  const { 
    kioskId, 
    customerName, 
    customerPhone, 
    customerEmail, 
    paymentMethod, 
    items, 
    subtotal, 
    tax, 
    grandTotal 
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const orderCode = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    // Insert Main Order Header
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
        (orderCode, kioskId, customerName, customerPhone, customerEmail, paymentMethod, subtotal, tax, grandTotal, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        orderCode, 
        kioskId || 'kiosk_floor2_atrium', 
        customerName || 'Walk-in Guest', 
        customerPhone || 'N/A', 
        customerEmail || 'N/A', 
        paymentMethod || 'upi', 
        subtotal, 
        tax, 
        grandTotal
      ]
    );

    const insertedOrderId = orderResult.insertId;

    // Insert Line Items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
        [insertedOrderId, item.id, item.quantity, item.price]
      );
    }

    await connection.commit();
    console.log(`[API] Order created successfully: ${orderCode} for ${customerName}`);
    res.status(201).json({ success: true, orderCode });

  } catch (err) {
    await connection.rollback();
    console.error('[API Error] /api/orders:', err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// 5. GET: Admin - Fetch All Customer Orders with Purchased Items
app.get('/api/admin/orders', async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders ORDER BY createdAt DESC');
    
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name as productName, p.image 
         FROM order_items oi 
         LEFT JOIN products p ON oi.productId = p.id 
         WHERE oi.orderId = ?`, 
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error('[API Error] /api/admin/orders:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. PUT: Admin - Update Order Status ('Pending', 'Processing', 'Completed', 'Cancelled')
app.put('/api/admin/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (err) {
    console.error('[API Error] /api/admin/orders status update:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server & keep process listening
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Express server running continuously on http://localhost:${PORT}`);
});

