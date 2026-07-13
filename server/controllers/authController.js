const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, isConnected } = require('../config/db');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const DEMO_USER = {
  id: 'demo-user-001',
  name: 'Demo Farmer',
  email: 'demo@ajraksha.ai',
  role: 'farmer',
  location: 'Punjab, India',
  farm_size: 5,
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, location, farmSize, soilType, crops } = req.body;

    if (!isConnected()) {
      // Demo mode — return mock token
      const user = { ...DEMO_USER, name: name || 'Farmer', email: email || 'demo@ajraksha.ai' };
      return res.status(201).json({ token: signToken(user.id), user, demo: true });
    }

    const { rows: existing } = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const { rows } = await query(
      `INSERT INTO users (name, email, password, location, farm_size, soil_type, crops)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role`,
      [name, email, hashedPassword, location, farmSize, soilType, crops]
    );
    const user = rows[0];
    res.status(201).json({ token: signToken(user.id), user });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isConnected()) {
      // Demo mode
      const user = { ...DEMO_USER, email: email || 'demo@ajraksha.ai' };
      return res.json({ token: signToken(user.id), user, demo: true });
    }

    const { rows } = await query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
    if (!rows[0] || !(await bcrypt.compare(password, rows[0].password || ''))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const { password: _, ...user } = rows[0];
    res.json({ token: signToken(user.id), user });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.json({ user: { ...DEMO_USER, ...req.user } });
    }
    const { rows } = await query(
      'SELECT id, name, email, role, location, farm_size, soil_type, crops, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json({ user: rows[0] || DEMO_USER });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.json({ user: { ...DEMO_USER, ...req.body } });
    }
    const { name, location, farmSize, soilType, crops } = req.body;
    const { rows } = await query(
      `UPDATE users SET name=$1, location=$2, farm_size=$3, soil_type=$4, crops=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6 RETURNING id, name, email, role, location`,
      [name, location, farmSize, soilType, crops, req.user.id]
    );
    res.json({ user: rows[0] });
  } catch (err) { next(err); }
};
