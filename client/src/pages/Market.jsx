import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTodayPrices, getTrending, getHistory } from '../services/marketApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Skeleton = ({ width, height, borderRadius = 8, style }) => (
  <div style={{
    width, height, borderRadius, background: '#e2e8f0',
    animation: 'pulse 1.5s infinite ease-in-out', ...style
  }} />
);

export default function Market() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('All');
  const [filterCommodity, setFilterCommodity] = useState('All');

  const { data: todayRes, isLoading: todayLoading } = useQuery({
    queryKey: ['todayPrices'],
    queryFn: getTodayPrices,
    staleTime: 5 * 60 * 1000,
  });

  const { data: trendingRes, isLoading: trendingLoading } = useQuery({
    queryKey: ['trendingMarket'],
    queryFn: getTrending,
    staleTime: 5 * 60 * 1000,
  });

  const { data: historyRes, isLoading: historyLoading } = useQuery({
    queryKey: ['marketHistory'],
    queryFn: getHistory,
    staleTime: 5 * 60 * 1000,
  });

  const aiInsight = todayRes?.aiInsight?.insight || "AI Market Insight: Prices are mostly stable. Uptrend observed in commercial crops due to recent weather shifts.";
  const pricesData = todayRes?.data || [];
  const trendingData = trendingRes?.data || [];
  const historyData = historyRes?.data || [
    { date: 'Mon', Wheat: 2050, Cotton: 5800 },
    { date: 'Tue', Wheat: 2080, Cotton: 5950 },
    { date: 'Wed', Wheat: 2060, Cotton: 6050 },
    { date: 'Thu', Wheat: 2110, Cotton: 5980 },
    { date: 'Fri', Wheat: 2095, Cotton: 6100 },
    { date: 'Sat', Wheat: 2130, Cotton: 6150 },
    { date: 'Sun', Wheat: 2140, Cotton: 6200 },
  ];

  const filteredData = useMemo(() => {
    return pricesData.filter(item => {
      const matchSearch = (item.commodity || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.market || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.district || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchState = filterState === 'All' || item.state === filterState;
      const matchCommodity = filterCommodity === 'All' || item.commodity === filterCommodity;
      return matchSearch && matchState && matchCommodity;
    });
  }, [pricesData, searchTerm, filterState, filterCommodity]);

  const statesList = ['All', ...new Set(pricesData.map(d => d.state).filter(Boolean))];
  const commoditiesList = ['All', ...new Set(pricesData.map(d => d.commodity).filter(Boolean))];

  const topGainers = [...pricesData].sort((a, b) => ((b.modal_price || 0) - (b.min_price || 0)) - ((a.modal_price || 0) - (a.min_price || 0))).slice(0, 2);
  const topLosers = [...pricesData].sort((a, b) => ((a.modal_price || 0) - (a.min_price || 0)) - ((b.modal_price || 0) - (b.min_price || 0))).slice(0, 2);

  return (
    <div style={{ background: '#fff8f6', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header & AI Insight */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 32 }}>monitoring</span>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#251913', margin: 0 }}>Market Dashboard</h1>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(to right, #f0fdf4, #ecfdf5)', border: '1px solid #bbf7d0', 
            borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32,
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.05)'
          }}>
            <span className="material-symbols-outlined" style={{ color: '#16a34a', fontSize: 24 }}>auto_awesome</span>
            <div>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#166534', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.05em' }}>AI MARKET INSIGHT</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#14532d' }}>{aiInsight}</p>
            </div>
          </div>
        </div>

        {/* Top Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {todayLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={120} borderRadius={16} />)
          ) : (
            <>
              {/* Today's Market */}
              <div className="glass-card" style={{ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #e0c0b1' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#584237', textTransform: 'uppercase', marginBottom: 8 }}>Today's Active Markets</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#251913' }}>{new Set(pricesData.map(d=>d.market)).size || 0}</div>
                <div style={{ fontSize: 12, color: '#16a34a', marginTop: 8 }}>Across {statesList.length - 1} States</div>
              </div>
              
              {/* Top Gainers */}
              <div className="glass-card" style={{ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #e0c0b1' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#584237', textTransform: 'uppercase', marginBottom: 8 }}>Top Gainer</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#251913' }}>{topGainers[0]?.commodity || 'N/A'}</div>
                <div style={{ fontSize: 13, color: '#16a34a', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span>
                  ₹{topGainers[0]?.modal_price || 0} / q
                </div>
              </div>

              {/* Top Losers */}
              <div className="glass-card" style={{ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #e0c0b1' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#584237', textTransform: 'uppercase', marginBottom: 8 }}>Top Loser</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#251913' }}>{topLosers[0]?.commodity || 'N/A'}</div>
                <div style={{ fontSize: 13, color: '#dc2626', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_down</span>
                  ₹{topLosers[0]?.modal_price || 0} / q
                </div>
              </div>

              {/* Trending */}
              <div className="glass-card" style={{ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #e0c0b1' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#584237', textTransform: 'uppercase', marginBottom: 8 }}>Most Traded</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#251913' }}>{trendingData?.trending?.[0] || 'Wheat'}</div>
                <div style={{ fontSize: 12, color: '#f97316', marginTop: 8 }}>High Volume Expected</div>
              </div>
            </>
          )}
        </div>

        {/* Chart Section */}
        <div className="glass-card" style={{ padding: 24, borderRadius: 20, background: '#fff', border: '1px solid #e0c0b1', marginBottom: 32 }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 600, color: '#251913' }}>Price Trends (Weekly)</h3>
          {historyLoading ? (
            <Skeleton height={300} width="100%" />
          ) : (
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCotton" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="Wheat" stroke="#f97316" fillOpacity={1} fill="url(#colorWheat)" strokeWidth={3} />
                  <Area type="monotone" dataKey="Cotton" stroke="#a855f7" fillOpacity={1} fill="url(#colorCotton)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Filters and Table */}
        <div className="glass-card" style={{ padding: 24, borderRadius: 20, background: '#fff', border: '1px solid #e0c0b1' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', fontSize: 20 }}>search</span>
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search market, commodity, or district..."
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 16px 12px 44px',
                  border: '1.5px solid #e0c0b1', borderRadius: 12,
                  fontSize: 14, color: '#251913', outline: 'none'
                }}
              />
            </div>
            <select
              value={filterState} onChange={e => setFilterState(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e0c0b1', background: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              {statesList.map(s => <option key={s} value={s}>{s === 'All' ? 'All States' : s}</option>)}
            </select>
            <select
              value={filterCommodity} onChange={e => setFilterCommodity(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e0c0b1', background: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              {commoditiesList.map(c => <option key={c} value={c}>{c === 'All' ? 'All Commodities' : c}</option>)}
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Commodity', 'Market', 'Location', 'Min Price', 'Max Price', 'Modal Price', 'Arrival Date'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} style={{ padding: '14px 16px' }}><Skeleton height={20} width="80%" /></td>
                      ))}
                    </tr>
                  ))
                ) : filteredData.length > 0 ? (
                  filteredData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#251913' }}>{row.commodity || '-'}</td>
                      <td style={{ padding: '14px 16px', color: '#584237' }}>{row.market || '-'}</td>
                      <td style={{ padding: '14px 16px', color: '#584237' }}>{row.district ? `${row.district}, ${row.state}` : '-'}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>₹{row.min_price || '-'}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>₹{row.max_price || '-'}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#16a34a' }}>₹{row.modal_price || '-'}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>{row.arrival_date || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
                      No market data found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
