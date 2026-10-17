const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hotel_db',
});

async function initDb() {
  console.log('Connecting to PostgreSQL database:', process.env.DB_NAME || 'hotel_db');
  const client = await pool.connect();
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    console.log('Applying database schema...');
    await client.query(schemaSql);
    console.log('Schema applied successfully.');

    // Check if table has data
    const res = await client.query('SELECT COUNT(*) FROM hotels');
    const count = parseInt(res.rows[0].count, 10);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate fallback SVG images for seed data if not present
    const seedImages = [
      { file: 'seed_grand_palace.jpg', color: '#1e3a8a', title: 'Grand Palace Hotel' },
      { file: 'seed_heritage_inn.jpg', color: '#b45309', title: 'The Heritage Boutique Inn' },
      { file: 'seed_azure_bay.jpg', color: '#0369a1', title: 'Azure Bay Ocean View Villas' },
      { file: 'seed_mountain_peak.jpg', color: '#15803d', title: 'Mountain Peak Alpine Retreat' },
      { file: 'seed_metropolitan.jpg', color: '#475569', title: 'Metropolitan Business Suites' },
      { file: 'seed_sunset_palm.jpg', color: '#ea580c', title: 'Sunset Palm Beach Resort' },
      { file: 'seed_lakeside_palace.jpg', color: '#6d28d9', title: 'Lakeside Royal Palace' },
      { file: 'seed_eco_valley.jpg', color: '#047857', title: 'Eco Valley Green Lodge' },
    ];

    for (const item of seedImages) {
      const imgPath = path.join(uploadsDir, item.file);
      if (!fs.existsSync(imgPath)) {
        // Create an SVG-based placeholder with high visual quality
        const svg = `<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${item.color}" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#g)" />
          <circle cx="400" cy="210" r="70" fill="rgba(255,255,255,0.15)" />
          <path d="M370 240 L400 170 L430 240 Z" fill="#ffffff" opacity="0.9" />
          <text x="400" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">${item.title}</text>
          <text x="400" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#93c5fd" text-anchor="middle">Luxury Stay &amp; Premium Suites</text>
        </svg>`;
        fs.writeFileSync(imgPath, svg, 'utf-8');
      }
    }

    if (count === 0) {
      console.log('Seeding initial hotel records...');
      const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
      await client.query(seedSql);
      console.log('Initial hotel records seeded successfully.');
    } else {
      console.log(`Database already contains ${count} hotel records. Skipping seed.`);
    }

    console.log('Database initialization completed.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initDb();
