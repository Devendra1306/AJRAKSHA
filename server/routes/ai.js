const router = require('express').Router();
const multer = require('multer');
const { analyzeCrop, getCropReports, analyzeSoil, recommendCrop, recommendFertilizer, predictYield, identifyPest, sendChatMessage, irrigationAdvice } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { query, isConnected } = require('../config/db');
      if (!isConnected()) {
        req.user = { id: decoded.id, role: 'farmer', name: 'Demo Farmer' };
      } else {
        const { rows } = await query('SELECT id, name, email, role FROM users WHERE id = $1 AND is_active = true', [decoded.id]);
        if (rows[0]) req.user = rows[0];
      }
    }
  } catch (err) {
    console.log('Optional auth parse warning:', err.message);
  }
  next();
};

router.post('/crop/analyze', optionalAuth, upload.single('image'), analyzeCrop);
router.get('/crop/reports', protect, getCropReports);
router.post('/soil/analyze', analyzeSoil);
router.post('/crop/recommend', recommendCrop);
router.post('/fertilizer/recommend', recommendFertilizer);
router.post('/yield/predict', predictYield);
router.post('/pest/identify', upload.single('image'), identifyPest);
router.post('/chat', sendChatMessage);
router.post('/irrigation', irrigationAdvice);

module.exports = router;
