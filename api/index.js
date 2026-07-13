/**
 * Vercel Serverless Entry Point — AJRAKSHA API
 * All /api/* requests hit this function.
 * DB and Firebase are initialized lazily and cached across warm invocations.
 */

require('dotenv').config();

const express           = require('express');
const cors              = require('cors');
const helmet            = require('helmet');
const rateLimit         = require('express-rate-limit');
const { connectDB }     = require('../server/config/db');
const { initFirebaseAdmin } = require('../server/config/firebaseAdmin');
const errorHandler      = require('../server/middleware/errorHandler');

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      ALLOWED_ORIGINS.includes(origin) ||
      /\.ngrok(-free)?\.app$/.test(origin) ||
      /\.ngrok-free\.dev$/.test(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.trycloudflare\.com$/.test(origin)
    ) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));
app.use('/api/ai', rateLimit({ windowMs: 60 * 1000, max: 20 }));

// ── Lazy Init — cached across warm Lambda invocations ─────────────────────────
let _ready = false;
const ensureReady = async () => {
  if (_ready) return;
  await connectDB();
  initFirebaseAdmin();
  _ready = true;
};

app.use(async (req, res, next) => {
  try { await ensureReady(); next(); }
  catch (err) { next(err); }
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',          require('../server/routes/auth'));
app.use('/api/ai',            require('../server/routes/ai'));
app.use('/api/crop',          require('../server/routes/ai'));
app.use('/api/market',        require('../server/routes/market'));
app.use('/api/weather',       require('../server/routes/weather'));
app.use('/api/schemes',       require('../server/routes/schemes'));
app.use('/api/diary',         require('../server/routes/diary'));
app.use('/api/notifications', require('../server/routes/notifications'));

app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'AJRAKSHA API' })
);

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Export for Vercel Serverless ───────────────────────────────────────────────
module.exports = app;
