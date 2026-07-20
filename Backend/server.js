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

// 4. POST: Checkout Order
app.post('/api/orders', async (req, res) => {
  const { kioskId, items, subtotal, tax, grandTotal } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const orderCode = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const [orderResult] = await connection.query(
      'INSERT INTO orders (orderCode, kioskId, subtotal, tax, grandTotal) VALUES (?, ?, ?, ?, ?)',
      [orderCode, kioskId, subtotal, tax, grandTotal]
    );

    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.id, item.quantity, item.price]
      );
    }

    await connection.commit();
    console.log(`[API] Order created: ${orderCode}`);
    res.status(201).json({ success: true, orderCode });
  } catch (err) {
    await connection.rollback();
    console.error('[API Error] /api/orders:', err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// Start Server & keep process listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Express server running continuously on http://localhost:${PORT}`);
});