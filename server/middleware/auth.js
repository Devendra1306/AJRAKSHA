const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('Auth error: No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Support demo mode if DB is disconnected
    const { isConnected } = require('../config/db');
    if (!isConnected()) {
      req.user = { id: decoded.id, role: 'farmer', name: 'Demo Farmer' };
      return next();
    }

    const { rows } = await query('SELECT id, name, email, role FROM users WHERE id = $1 AND is_active = true', [decoded.id]);
    if (!rows[0]) {
      console.log('Auth error: Invalid token / User not found for ID:', decoded.id);
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = rows[0];
    next();
  } catch (err) {
    console.log('Auth error: Token invalid or expired', err.message);
    res.status(401).json({ error: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

module.exports = { protect, adminOnly };
