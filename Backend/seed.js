const fs = require('fs');
const path = require('path');
const db = require('./db');

async function seedDatabase() {
  try {
    console.log('🌱 Starting Database Seeding process...');

    // Resolve paths to your existing Frontend JSON files
    const brandsPath = path.join(__dirname, '../Frontend/public/SubProductsBrand.json');
    const productsPath = path.join(__dirname, '../Frontend/public/SubProducts.json');
    const kiosksPath = path.join(__dirname, '../Frontend/public/KioskRegistry.json');

    const brandsData = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const kioskData = JSON.parse(fs.readFileSync(kiosksPath, 'utf8'));

    // 1. Seed Brands
    for (const b of brandsData) {
      await db.query(
        'INSERT INTO brands (id, name, ProductsNamesid) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)',
        [b.id, b.name, b.ProductsNamesid || null]
      );
    }
    console.log('✅ Brands inserted successfully!');

    // 2. Seed Products & Map Paths
    for (const p of productsData) {
      await db.query(
        `INSERT INTO products (id, brandId, name, price, storage, image, description, floor, mapX, mapY, kioskPaths) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), kioskPaths=VALUES(kioskPaths)`,
        [
          p.id,
          p.brandId,
          p.name,
          p.price || null,
          p.storage || '',
          p.image || '',
          p.description || '',
          p.floor,
          p.mapX,
          p.mapY,
          JSON.stringify(p.kioskPaths || {})
        ]
      );
    }
    console.log('✅ Products & SVG Map Paths inserted successfully!');

    // 3. Seed Kiosks
    if (kioskData.kiosks && Array.isArray(kioskData.kiosks)) {
      for (const k of kioskData.kiosks) {
        await db.query(
          'INSERT INTO kiosks (id, name, floor, x, y) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)',
          [k.id, k.name, k.floor, k.x, k.y]
        );
      }
    }
    console.log('✅ Kiosks inserted successfully!');

    console.log('🎉 Seeding Complete! All data migrated to MySQL database.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();