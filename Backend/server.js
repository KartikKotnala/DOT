const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// Email Transporter Setup (for OTP verification)
// ---------------------------------------------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ---------------------------------------------------------
// File Upload & Static Asset Setup
// ---------------------------------------------------------
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically at http://localhost:5001/uploads/...
app.use('/uploads', express.static(uploadsDir));

// Configure Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// File Upload API Endpoint
app.post('/api/admin/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded' });
    }
    const relativePath = `/uploads/${req.file.filename}`;
    console.log(`[API] Image uploaded successfully: ${relativePath}`);
    res.json({ imageUrl: relativePath });
  } catch (err) {
    console.error('[API Error] Upload handler:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// AUTHENTICATION & USER MANAGEMENT ROUTES
// ---------------------------------------------------------

// 1. REGISTER DETAILS & SEND 3-MINUTE OTP
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const userRole = role === 'admin' ? 'admin' : 'agent';

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0 && existing[0].is_verified) {
      return res.status(400).json({ error: 'User with this email already exists. Please log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3-minute limit

    if (existing.length > 0) {
      await db.query(
        'UPDATE users SET name = ?, password = ?, role = ?, otp_code = ?, otp_expires_at = ? WHERE email = ?',
        [name, hashedPassword, userRole, otp, expiresAt, email]
      );
    } else {
      await db.query(
        'INSERT INTO users (name, email, password, role, otp_code, otp_expires_at, is_verified, status) VALUES (?, ?, ?, ?, ?, ?, 0, "pending")',
        [name, email, hashedPassword, userRole, otp, expiresAt]
      );
    }

    await transporter.sendMail({
      from: `"Kiosk Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Portal OTP Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1e293b;">Kiosk Portal Registration</h2>
          <p>Your 6-digit verification code for role <strong>${userRole.toUpperCase()}</strong> is:</p>
          <h1 style="color: #2563eb; letter-spacing: 6px; font-size: 32px;">${otp}</h1>
          <p style="color: #dc2626; font-size: 12px; font-weight: bold;">⚠️ Code expires in 3 minutes.</p>
        </div>
      `
    });

    console.log(`[AUTH] Sent 3-min OTP (${otp}) to ${email}`);
    res.json({ success: true, message: 'OTP sent to your email! Code expires in 3 minutes.' });

  } catch (err) {
    console.error('[AUTH Error] Register:', err);
    res.status(500).json({ error: 'Failed to process registration or send email' });
  }
});

// 2. VERIFY OTP & AUTOMATICALLY APPROVE USER
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'User record not found' });

    const user = rows[0];

    if (!user.otp_code || user.otp_code !== otp) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (new Date(user.otp_expires_at) < new Date()) {
      await db.query('UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE email = ?', [email]);
      return res.status(400).json({ error: 'OTP code has expired (3 min limit). Please request a new code.' });
    }

    // Set is_verified = 1 and auto-set status = 'approved' upon verification
    await db.query(
      'UPDATE users SET is_verified = 1, status = "approved", otp_code = NULL, otp_expires_at = NULL WHERE email = ?',
      [email]
    );

    res.json({
      success: true,
      message: 'Email verified and account approved successfully! You can now sign in.'
    });

  } catch (err) {
    console.error('[AUTH Error] Verify OTP:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'User does not exist' });

    const user = rows[0];

    if (!user.is_verified) {
      return res.status(401).json({ error: 'Email not verified. Please complete OTP verification.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Account pending manager approval. Please wait for access grant.' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your access request was rejected.' });
    }

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('[AUTH Error] Login:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// Root & Client API Routes
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// ADMIN CATALOG & CRUD ROUTES (Categories, Brands, Products)
// ---------------------------------------------------------

// GET: Fetch Combined Catalog (Categories, Brands, Products) for Admin Dashboard
app.get('/api/admin/catalog', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    const [brands] = await db.query('SELECT * FROM brands');
    const [productsRaw] = await db.query('SELECT * FROM products');
    
    const products = productsRaw.map(item => ({
      ...item,
      kioskPaths: typeof item.kioskPaths === 'string' ? JSON.parse(item.kioskPaths) : (item.kioskPaths || {})
    }));

    res.json({ categories, brands, products });
  } catch (err) {
    console.error('[API Error] /api/admin/catalog:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- CATEGORIES ---
app.post('/api/admin/categories', async (req, res) => {
  const { id, name, description } = req.body;
  try {
    await db.query('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)', [id, name, description]);
    res.status(201).json({ success: true, message: 'Category added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/categories/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
    res.json({ success: true, message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- BRANDS ---
app.post('/api/admin/brands', async (req, res) => {
  const { id, ProductsNamesid, name, image } = req.body;
  try {
    await db.query(
      'INSERT INTO brands (id, ProductsNamesid, name, image) VALUES (?, ?, ?, ?)', 
      [id, ProductsNamesid || '1', name, image]
    );
    res.status(201).json({ success: true, message: 'Brand added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/brands/:id', async (req, res) => {
  const { ProductsNamesid, name, image } = req.body;
  try {
    await db.query(
      'UPDATE brands SET ProductsNamesid = ?, name = ?, image = ? WHERE id = ?', 
      [ProductsNamesid, name, image, req.params.id]
    );
    res.json({ success: true, message: 'Brand updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/brands/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM brands WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SUB-PRODUCTS ---
app.post('/api/admin/products', async (req, res) => {
  const { id, brandId, name, price, storage, ram, image, description, floor, mapX, mapY, kioskPaths } = req.body;
  try {
    const pathsJson = typeof kioskPaths === 'object' ? JSON.stringify(kioskPaths) : (kioskPaths || '{}');
    await db.query(
      `INSERT INTO products 
        (id, brandId, name, price, storage, ram, image, description, floor, mapX, mapY, kioskPaths) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, brandId, name, price, storage, ram, image, description, floor || 1, mapX || 0, mapY || 0, pathsJson]
    );
    res.status(201).json({ success: true, message: 'Product added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', async (req, res) => {
  const { brandId, name, price, storage, ram, image, description, floor, mapX, mapY, kioskPaths } = req.body;
  try {
    const pathsJson = typeof kioskPaths === 'object' ? JSON.stringify(kioskPaths) : (kioskPaths || '{}');
    await db.query(
      `UPDATE products 
       SET brandId = ?, name = ?, price = ?, storage = ?, ram = ?, image = ?, description = ?, floor = ?, mapX = ?, mapY = ?, kioskPaths = ? 
       WHERE id = ?`,
      [brandId, name, price, storage, ram, image, description, floor, mapX, mapY, pathsJson, req.params.id]
    );
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// ADMIN ORDER MANAGEMENT
// ---------------------------------------------------------

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

// 6. PUT: Admin - Update Order Status
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

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Express server running continuously on http://localhost:${PORT}`);
});