const router = require('express').Router();
const multer = require('multer');
const { analyzeCrop, getCropReports, analyzeSoil, recommendCrop, recommendFertilizer, predictYield, identifyPest, sendChatMessage, irrigationAdvice } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/crop/analyze', protect, upload.single('image'), analyzeCrop);
router.get('/crop/reports', protect, getCropReports);
router.post('/soil/analyze', analyzeSoil);
router.post('/crop/recommend', recommendCrop);
router.post('/fertilizer/recommend', recommendFertilizer);
router.post('/yield/predict', predictYield);
router.post('/pest/identify', upload.single('image'), identifyPest);
router.post('/chat', sendChatMessage);
router.post('/irrigation', irrigationAdvice);

module.exports = router;
