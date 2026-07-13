const API_BASE_URL = '/api/market';

const fetchJson = async (endpoint, params = {}) => {
  const url = new URL(API_BASE_URL + endpoint, window.location.origin);
  Object.entries(params).forEach(([k, v]) => v && url.searchParams.append(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Market API Error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};

export const getTodayPrices = () => fetchJson('/today');
export const getCommodity = (commodity) => fetchJson(`/commodity/${encodeURIComponent(commodity)}`);
export const searchMarket = (params) => fetchJson('/search', params);
export const getTrending = () => fetchJson('/trending');
export const getHistory = () => fetchJson('/history');

export default {
  getTodayPrices,
  getCommodity,
  searchMarket,
  getTrending,
  getHistory,
};
