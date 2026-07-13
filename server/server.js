require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');
const { initFirebaseAdmin } = require('./config/firebaseAdmin');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security
app.use(helmet({ crossOriginEmbedderPolicy: false }));

// CORS — allow localhost, the configured CLIENT_URL, and any ngrok / tunnel domain
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any ngrok, loca.lt, cloudflare, or vercel preview URL
    if (
      ALLOWED_ORIGINS.includes(origin) ||
      /\.ngrok(-free)?\.app$/.test(origin) ||
      /\.ngrok-free\.dev$/.test(origin) ||
      /\.loca\.lt$/.test(origin) ||
      /\.trycloudflare\.com$/.test(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' }));
app.use('/api/ai', rateLimit({ windowMs: 60 * 1000, max: 20 }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/crop', require('./routes/ai'));
app.use('/api/market', require('./routes/market'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/diary', require('./routes/diary'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'AJRAKSHA API' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  initFirebaseAdmin();
  app.listen(PORT, () => {
    console.log(`🚀 AJRAKSHA Server running on port ${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;
