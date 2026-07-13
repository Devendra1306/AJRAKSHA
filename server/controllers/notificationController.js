const { query } = require('../config/db');
const {
  sendNotification,
  sendBulkNotification,
  sendWeatherAlert,
  sendMarketAlert,
  sendDiseaseAlert,
  sendIrrigationReminder,
  sendGovernmentSchemeAlert,
  sendPestWarning,
} = require('../services/notificationService');

// ── Helpers ────────────────────────────────────────────────────────────────

/** Fetch all FCM tokens for a user */
const getUserTokens = async (userId) => {
  const result = await query(
    'SELECT device_token FROM user_devices WHERE user_id = $1',
    [userId]
  );
  return result.rows.map((r) => r.device_token);
};

/** Fetch all FCM tokens across all users */
const getAllTokens = async () => {
  const result = await query('SELECT device_token FROM user_devices');
  return result.rows.map((r) => r.device_token);
};

// ── Device Registration ─────────────────────────────────────────────────────

/**
 * POST /api/notifications/register-device
 * Body: { token, platform }
 */
exports.registerDevice = async (req, res, next) => {
  try {
    const { token, platform = 'web' } = req.body;
    if (!token) return res.status(400).json({ error: 'FCM token is required' });

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    // Upsert: insert or update if token already exists for this user
    await query(
      `INSERT INTO user_devices (user_id, device_token, platform, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (device_token)
       DO UPDATE SET user_id = $1, platform = $3, updated_at = NOW()`,
      [userId, token, platform]
    );

    res.json({ success: true, message: 'Device registered for notifications' });
  } catch (err) {
    next(err);
  }
};

// ── Admin Send ──────────────────────────────────────────────────────────────

/**
 * POST /api/notifications/send  (admin only)
 * Body: { title, body, image, data, userIds? }
 */
exports.sendAdminNotification = async (req, res, next) => {
  try {
    const { title, body, image, data, userIds } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'title and body required' });

    let tokens;
    if (userIds && userIds.length > 0) {
      const result = await query(
        'SELECT device_token FROM user_devices WHERE user_id = ANY($1)',
        [userIds]
      );
      tokens = result.rows.map((r) => r.device_token);
    } else {
      tokens = await getAllTokens();
    }

    if (tokens.length === 0) return res.json({ success: true, message: 'No devices registered' });

    const result = await sendBulkNotification({ tokens, title, body, image, data });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// ── Category-specific endpoints ─────────────────────────────────────────────

/**
 * POST /api/notifications/weather
 * Body: { userId?, condition, temp, location }
 */
exports.sendWeather = async (req, res, next) => {
  try {
    const { userId, condition, temp, location } = req.body;
    const tokens = userId ? await getUserTokens(userId) : await getAllTokens();
    if (tokens.length === 0) return res.json({ success: true, message: 'No devices registered' });

    const results = await Promise.all(
      tokens.map((token) => sendWeatherAlert(token, { condition, temp, location }))
    );
    res.json({ success: true, sent: results.filter((r) => r.success).length, total: tokens.length });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/notifications/market
 * Body: { userId?, commodity, price, change, market }
 */
exports.sendMarket = async (req, res, next) => {
  try {
    const { userId, commodity, price, change, market } = req.body;
    const tokens = userId ? await getUserTokens(userId) : await getAllTokens();
    if (tokens.length === 0) return res.json({ success: true, message: 'No devices registered' });

    const results = await Promise.all(
      tokens.map((token) => sendMarketAlert(token, { commodity, price, change, market }))
    );
    res.json({ success: true, sent: results.filter((r) => r.success).length, total: tokens.length });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/notifications/disease
 * Body: { userId, crop, disease, severity, reportId? }
 */
exports.sendDisease = async (req, res, next) => {
  try {
    const { userId, crop, disease, severity, reportId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required for disease alerts' });

    const tokens = await getUserTokens(userId);
    if (tokens.length === 0) return res.json({ success: true, message: 'No devices registered' });

    const results = await Promise.all(
      tokens.map((token) => sendDiseaseAlert(token, { crop, disease, severity, reportId }))
    );
    res.json({ success: true, sent: results.filter((r) => r.success).length });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/notifications/irrigation
 * Body: { userId, crop, fieldName, soilMoisture }
 */
exports.sendIrrigation = async (req, res, next) => {
  try {
    const { userId, crop, fieldName, soilMoisture } = req.body;
    const tokens = userId ? await getUserTokens(userId) : await getAllTokens();
    if (tokens.length === 0) return res.json({ success: true, message: 'No devices registered' });

    const results = await Promise.all(
      tokens.map((token) => sendIrrigationReminder(token, { crop, fieldName, soilMoisture }))
    );
    res.json({ success: true, sent: results.filter((r) => r.success).length });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/notifications/government
 * Body: { schemeName, deadline, benefit }
 */
exports.sendGovernment = async (req, res, next) => {
  try {
    const { schemeName, deadline, benefit } = req.body;
    const tokens = await getAllTokens();
    if (tokens.length === 0) return res.json({ success: true, message: 'No devices registered' });

    const results = await Promise.all(
      tokens.map((token) => sendGovernmentSchemeAlert(token, { schemeName, deadline, benefit }))
    );
    res.json({ success: true, sent: results.filter((r) => r.success).length, total: tokens.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/notifications/history  (authenticated user)
 */
exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const result = await query(
      `SELECT id, title, message, type, is_read, created_at
       FROM notifications WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read
 */
exports.markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    await query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
