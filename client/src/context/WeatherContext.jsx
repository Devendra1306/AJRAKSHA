import { createContext, useContext, useState, useEffect } from 'react';

import { useAuth } from './AuthContext';

const WeatherContext = createContext(null);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};

const DEFAULT_FORECAST = [
  { day: 'Mon', icon: 'wb_sunny', condition: 'Sunny', high: 32, low: 22, rain: 5 },
  { day: 'Tue', icon: 'partly_cloudy_day', condition: 'Partly Cloudy', high: 30, low: 21, rain: 20 },
  { day: 'Wed', icon: 'grain', condition: 'Light Rain', high: 27, low: 19, rain: 65 },
  { day: 'Thu', icon: 'thunderstorm', condition: 'Thunderstorm', high: 25, low: 18, rain: 85 },
  { day: 'Fri', icon: 'foggy', condition: 'Foggy', high: 26, low: 18, rain: 30 },
];

export const WeatherProvider = ({ children }) => {
  const { user } = useAuth();
  const [forecastData, setForecastData] = useState(DEFAULT_FORECAST);
  const [currentWeather, setCurrentWeather] = useState({
    temp: 28, feelsLike: 31, humidity: 72, windSpeed: 18, visibility: 8, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', locationName: 'Fetching location...'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if user is logged in
    if (!user) return;

    const fetchWeather = async (lat, lon) => {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        setForecastData(data.forecast);
        setCurrentWeather(data.current);
      } catch (err) {
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(23.52, 77.81) // Fallback
      );
    } else {
      fetchWeather(23.52, 77.81);
    }
  }, [user]);

  return (
    <WeatherContext.Provider value={{ forecastData, currentWeather, loading }}>
      {children}
    </WeatherContext.Provider>
  );
};
