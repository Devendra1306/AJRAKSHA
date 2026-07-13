const { Pool } = require('pg');

let pool;
let dbConnected = false;

const connectDB = async () => {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn('⚠️  DATABASE_URL not set — running in demo mode (no persistence)');
      return null;
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    await pool.query('SELECT 1');
    dbConnected = true;
    console.log('✅ Neon PostgreSQL connected successfully');
    await initializeTables();
    return pool;
  } catch (err) {
    console.warn('⚠️  Database connection failed:', err.message);
    console.warn('⚠️  Running in DEMO MODE — AI features work, data not persisted');
    pool = null;
    dbConnected = false;
    return null;
  }
};

const initializeTables = async () => {
  if (!pool) return;
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      role VARCHAR(50) DEFAULT 'farmer',
      location VARCHAR(255),
      farm_size DECIMAL(10,2),
      soil_type VARCHAR(100),
      crops TEXT[],
      language VARCHAR(50) DEFAULT 'en',
      avatar VARCHAR(500),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS crop_reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      image_url VARCHAR(500),
      disease VARCHAR(255),
      confidence DECIMAL(5,2),
      severity VARCHAR(50),
      crop VARCHAR(100),
      symptoms TEXT[],
      treatment JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS soil_reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      ph DECIMAL(4,2),
      nitrogen DECIMAL(8,2),
      phosphorus DECIMAL(8,2),
      potassium DECIMAL(8,2),
      moisture DECIMAL(5,2),
      organic_matter DECIMAL(5,2),
      soil_type VARCHAR(100),
      health_score INTEGER,
      recommendations JSONB,
      best_crops TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS chats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS chat_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
      role VARCHAR(20) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS market_prices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      crop VARCHAR(100) NOT NULL,
      price DECIMAL(10,2),
      unit VARCHAR(50),
      market VARCHAR(255),
      state VARCHAR(100),
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS farm_diary (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50),
      description TEXT,
      amount DECIMAL(10,2),
      date DATE DEFAULT CURRENT_DATE,
      crop VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255),
      message TEXT,
      type VARCHAR(50),
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS user_devices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      device_token TEXT UNIQUE NOT NULL,
      platform VARCHAR(50) DEFAULT 'web',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id)`,
  ];
  for (const q of queries) {
    try { await pool.query(q); } catch (e) { console.warn('Table init warning:', e.message); }
  }
  console.log('✅ Database tables initialized');
};

const query = (text, params) => {
  if (!pool || !dbConnected) {
    return Promise.resolve({ rows: [], rowCount: 0 });
  }
  return pool.query(text, params);
};

const isConnected = () => dbConnected;

module.exports = { connectDB, query, isConnected };
