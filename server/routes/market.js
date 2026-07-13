const express = require('express');
const router = express.Router();
const { getTodayPrices, getCommodityPrice, getMarketPrices, getTrendingMarkets, getPriceHistory } = require('../controllers/marketController');

// Routes mapping as per requirements
router.get('/today', getTodayPrices);
router.get('/commodity/:commodity', getCommodityPrice);
router.get('/search', getMarketPrices);
router.get('/trending', getTrendingMarkets);
router.get('/history', getPriceHistory);

module.exports = router;
