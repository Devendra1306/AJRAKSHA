const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  registerDevice,
  sendAdminNotification,
  sendWeather,
  sendMarket,
  sendDisease,
  sendIrrigation,
  sendGovernment,
  getHistory,
  markRead,
} = require('../controllers/notificationController');

// ── Device registration (any authenticated user) ────────────────────────────
router.post('/register-device', protect, registerDevice);

// ── History for logged-in user ──────────────────────────────────────────────
router.get('/history', protect, getHistory);
router.patch('/:id/read', protect, markRead);

// ── Admin-only send endpoints ───────────────────────────────────────────────
router.post('/send', protect, adminOnly, sendAdminNotification);
router.post('/weather', protect, adminOnly, sendWeather);
router.post('/market', protect, adminOnly, sendMarket);
router.post('/disease', protect, sendDisease); // triggered by own AI flow
router.post('/irrigation', protect, sendIrrigation);
router.post('/government', protect, adminOnly, sendGovernment);

module.exports = router;
