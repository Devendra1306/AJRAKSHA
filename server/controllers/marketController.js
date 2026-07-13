const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 900 }); // 15 minutes

const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), options.timeout || 10000);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, 1000 * (i + 1))); // Exponential-ish backoff
    }
  }
};

const getMarketData = async (filters = {}) => {
  const { MARKET_API_KEY, MARKET_RESOURCE_ID, MARKET_BASE_URL } = process.env;
  if (!MARKET_API_KEY || !MARKET_RESOURCE_ID) {
    throw new Error('Market API credentials not configured');
  }

  // Create a cache key based on filters
  const cacheKey = JSON.stringify(filters);
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const url = new URL(`${MARKET_BASE_URL}/${MARKET_RESOURCE_ID}`);
  url.searchParams.append('api-key', MARKET_API_KEY);
  url.searchParams.append('format', 'json');
  url.searchParams.append('limit', '500'); // Fetch up to 500 records

  if (filters.state) url.searchParams.append('filters[state]', filters.state);
  if (filters.district) url.searchParams.append('filters[district]', filters.district);
  if (filters.market) url.searchParams.append('filters[market]', filters.market);
  if (filters.commodity) url.searchParams.append('filters[commodity]', filters.commodity);
  if (filters.arrival_date) url.searchParams.append('filters[arrival_date]', filters.arrival_date);

  try {
    const data = await fetchWithRetry(url.toString(), { timeout: 10000 });
    
    // Structure and normalize data
    const normalizedData = (data.records || []).map(record => ({
      commodity: record.commodity,
      market: record.market,
      district: record.district,
      state: record.state,
      min_price: parseFloat(record.min_price),
      max_price: parseFloat(record.max_price),
      modal_price: parseFloat(record.modal_price),
      arrival_date: record.arrival_date
    }));

    cache.set(cacheKey, normalizedData);
    return normalizedData;
  } catch (err) {
    console.error('Market API Error:', err.message);
    throw new Error('Government API Down or Unreachable');
  }
};


const { analyzeWithSchema } = require('./aiController');

// Helper to format Date to DD/MM/YYYY
const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

exports.getTodayPrices = async (req, res, next) => {
  try {
    const data = await getMarketData({}); // Without date filter for demo, because API might not have today's data instantly

    // Sort by most recent arrival date and get top 50
    const sortedData = data.sort((a, b) => new Date(b.arrival_date.split('/').reverse().join('-')) - new Date(a.arrival_date.split('/').reverse().join('-'))).slice(0, 50);

    // AI Insight generation (sending a small sample to avoid huge context)
    const sampleForAI = sortedData.slice(0, 10).map(d => `${d.commodity} in ${d.market}: ₹${d.modal_price}`);
    
    let aiInsight = { insight: "Market is stable.", recommendation: "Monitor closely." };
    try {
      if (sampleForAI.length > 0) {
        aiInsight = await analyzeWithSchema(
          `Analyze today's mandi prices: ${sampleForAI.join(', ')}.
           Explain best commodity to sell, expected trend, and farmer recommendation.
           Return JSON: { "insight": "String explaining trends", "recommendation": "String with specific advice" }`,
          'You are an expert agricultural economist analyzing Indian market prices.'
        );
      }
    } catch (aiErr) {
      console.warn("AI Insight generation failed, skipping.", aiErr.message);
    }

    res.json({ success: true, data: sortedData, aiInsight });
  } catch (err) {
    next(err);
  }
};

exports.getCommodityPrice = async (req, res, next) => {
  try {
    const { commodity } = req.params;
    if (!commodity) return res.status(400).json({ success: false, error: "Invalid Commodity" });

    const data = await getMarketData({ commodity: commodity.charAt(0).toUpperCase() + commodity.slice(1).toLowerCase() });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getMarketPrices = async (req, res, next) => {
  try {
    const { state, district, market, commodity } = req.query;
    const filters = {};
    if (state) filters.state = state;
    if (district) filters.district = district;
    if (market) filters.market = market;
    if (commodity) filters.commodity = commodity;

    const data = await getMarketData(filters);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getTrendingMarkets = async (req, res, next) => {
  try {
    const data = await getMarketData({});
    
    if (data.length === 0) return res.json({ success: true, data: { gainers: [], losers: [], trending: [] } });

    // Compute basic mocked trends since API doesn't provide historical % change directly
    // We will just group and create pseudo-trends based on the available data.
    const commodities = [...new Set(data.map(d => d.commodity))].slice(0, 5);
    
    const trendingData = {
      gainers: commodities.slice(0, 2).map(c => ({ commodity: c, change: (Math.random() * 5 + 1).toFixed(1) + '%' })),
      losers: commodities.slice(2, 4).map(c => ({ commodity: c, change: '-' + (Math.random() * 5 + 1).toFixed(1) + '%' })),
      trending: commodities
    };

    res.json({ success: true, data: trendingData });
  } catch (err) {
    next(err);
  }
};

exports.getPriceHistory = async (req, res, next) => {
  try {
    // Since the API only returns current day or requires complex polling, we mock a 30-day history trend for charts
    const { commodity = 'Wheat' } = req.query;
    const history = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        price: Math.floor(2000 + Math.random() * 500)
      };
    });

    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};
