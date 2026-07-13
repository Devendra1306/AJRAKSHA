const router = require('express').Router();

const NodeCache = require('node-cache');

// Cache for 2 hours (7200 seconds)
const weatherCache = new NodeCache({ stdTTL: 7200 });

// Helper to map WMO code to Material Symbol Icon
const getIcon = (code) => {
  if (code === 0) return 'wb_sunny';
  if (code >= 1 && code <= 3) return 'partly_cloudy_day';
  if (code >= 45 && code <= 48) return 'foggy';
  if (code >= 51 && code <= 67) return 'rainy'; // Drizzle / Rain
  if (code >= 71 && code <= 77) return 'ac_unit'; // Snow
  if (code >= 80 && code <= 82) return 'rainy'; // Showers
  if (code >= 95) return 'thunderstorm';
  return 'wb_cloudy';
};

const getCondition = (code) => {
  if (code === 0) return 'Sunny';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
};

router.get('/', async (req, res) => {
  try {
    const { lat = 23.52, lon = 77.81 } = req.query; // Default to Vidisha, MP
    const cacheKey = `weather_${Math.round(lat * 10) / 10}_${Math.round(lon * 10) / 10}`;
    
    let data = weatherCache.get(cacheKey);
    
    if (!data) {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&hourly=visibility&timezone=auto`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather API failed');
      const raw = await response.json();
      
      let locationName = "Current Location";
      try {
        const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.city || geoData.locality) {
             locationName = `${geoData.city || geoData.locality}, ${geoData.principalSubdivision}`;
          }
        }
      } catch (err) {
        console.error("Reverse geocoding failed", err.message);
      }
      
      const current = {
        temp: Math.round(raw.current.temperature_2m),
        feelsLike: Math.round(raw.current.apparent_temperature),
        humidity: raw.current.relative_humidity_2m,
        windSpeed: raw.current.wind_speed_10m,
        condition: getCondition(raw.current.weather_code),
        icon: getIcon(raw.current.weather_code),
        visibility: raw.hourly.visibility ? Math.round(raw.hourly.visibility[0] / 1000) : 8,
        locationName
      };

      const forecast = raw.daily.time.slice(0, 5).map((date, i) => {
        return {
          day: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
          high: Math.round(raw.daily.temperature_2m_max[i]),
          low: Math.round(raw.daily.temperature_2m_min[i]),
          rain: raw.daily.precipitation_probability_max[i],
          icon: getIcon(raw.daily.weather_code[i]),
          condition: getCondition(raw.daily.weather_code[i])
        };
      });

      data = { current, forecast };
      weatherCache.set(cacheKey, data);
    }
    
    res.json(data);
  } catch (err) {
    console.error('Weather API Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
