import { Link } from 'react-router-dom'
import { useWeather } from '../context/WeatherContext'
import { useQuery } from '@tanstack/react-query'
import { getTrending } from '../services/marketApi'

const yieldData = [40, 55, 75, 90, 60, 70, 85, 75]
const monthLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG']

const quickStats = [
  {
    icon: 'analytics', label: 'Overall Farm Score', value: '92.4',
    badge: '+4.2%', badgeType: 'primary', subtitle: null,
    progress: 92, iconBg: 'rgba(249, 115, 22, 0.1)', iconColor: '#f97316',
  },
  {
    icon: 'eco', label: 'Crop Health', value: 'Optimal',
    badge: null, badgeIcon: 'trending_up', subtitle: 'All 14 sectors performing well',
    iconBg: 'rgba(86, 94, 116, 0.1)', iconColor: '#565e74',
  },
  {
    icon: 'wb_sunny', label: 'Weather Forecast', value: 'Partly Cloudy',
    badge: '28°C', badgeType: 'neutral', subtitle: 'Next rain expected in 3 days',
    iconBg: 'rgba(0, 99, 152, 0.1)', iconColor: '#006398',
  },
  {
    icon: 'opacity', label: 'Soil Moisture', value: '64%',
    badge: 'Low Sector 4', badgeType: 'error', subtitle: null,
    iconBg: 'rgba(249, 115, 22, 0.1)', iconColor: '#f97316',
    progress: 64, progressSegmented: true,
  },
  {
    icon: 'payments', label: 'Market Prices', value: 'Loading...',
    badge: null, subtitle: 'Fetching live market data',
    iconBg: '#f1f5f9', iconColor: '#64748b',
    trendText: true,
  },
]

const alerts = [
  { type: 'error', icon: 'warning', title: 'Low Soil Moisture', desc: 'Sector 4 is at 24%. Automatic irrigation failed.', action: 'Action Required' },
  { type: 'primary', icon: 'auto_awesome', title: 'Optimal Harvest Window', desc: 'AI predicts Sector 2 Wheat is ready for harvest in 48h.' },
  { type: 'neutral', icon: 'cloud_sync', title: 'Weather Shift Detected', desc: 'Unseasonal humidity detected. Monitor for fungus growth.' },
  { type: 'neutral', icon: 'task_alt', title: 'Market Price Update', desc: 'Corn futures reached target price of $4.50/bu.', muted: true },
]

const envStats = [
  { label: 'Nitrogen Level', value: '0.82', unit: 'mg/kg', tag: 'Optimal Range', tagType: 'neutral' },
  { label: 'Pest Density', value: 'Low', unit: '', tag: 'No Action', tagType: 'neutral', primary: true },
  { label: 'Irrigation Status', value: 'Auto', unit: '', tag: 'Active', tagType: 'primary' },
  { label: 'Resource Efficiency', value: '94%', unit: '', tag: 'Top 1%', tagType: 'primary' },
]

export default function Dashboard() {
  const { currentWeather, forecastData, loading: weatherLoading } = useWeather();
  const nextRain = forecastData?.find(d => d.rain > 50);

  const { data: trendingRes, isLoading: trendingLoading } = useQuery({
    queryKey: ['dashboardTrending'],
    queryFn: getTrending,
    staleTime: 5 * 60 * 1000,
  });

  const topTrend = trendingRes?.data?.[0];

  const dynamicStats = [...quickStats];
  dynamicStats[2] = {
    icon: currentWeather?.icon || 'wb_sunny', 
    label: 'Weather Forecast', 
    value: weatherLoading ? 'Loading...' : (currentWeather?.condition || 'Unknown'),
    badge: weatherLoading ? '--°C' : `${currentWeather?.temp || '--'}°C`, 
    badgeType: 'neutral', 
    subtitle: nextRain ? `Next rain expected on ${nextRain.day}` : 'No heavy rain expected soon',
    iconBg: 'rgba(0, 99, 152, 0.1)', iconColor: '#006398',
  };

  dynamicStats[4] = {
    icon: 'payments', 
    label: 'Market Prices', 
    value: trendingLoading ? 'Loading...' : (topTrend?.commodity || 'Stable'),
    badge: null, 
    subtitle: topTrend ? `${topTrend.commodity} is trading at ₹${topTrend.modalPrice || topTrend.price || '--'}/q` : 'Market data up to date',
    iconBg: '#f1f5f9', iconColor: '#64748b',
    trendText: true,
    trendCustom: topTrend?.change 
      ? `${topTrend.commodity} prices are ${topTrend.change > 0 ? 'up' : 'down'} ${Math.abs(topTrend.change)}% today` 
      : 'No significant changes today',
  };

  return (
    <div style={{ padding: 32, paddingBottom: 80, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}
      >
        <div>
          <p style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Dashboard Overview
          </p>
          <h2 style={{ fontSize: 48, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em', lineHeight: 1 }}>Farm Dashboard</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'none' }}>
            <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 18 }}>calendar_today</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <button className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'none', cursor: 'pointer', border: '1px solid #e0c0b1' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(249, 115, 22, 0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 18 }}>download</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Export Data</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bento Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {dynamicStats.map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card"
            style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: stat.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ color: stat.iconColor, fontSize: 22 }}>{stat.icon}</span>
              </div>
              {stat.badge && (
                <span style={{
                  fontSize: 10, fontFamily: 'Geist, monospace', fontWeight: 600,
                  padding: '2px 8px', borderRadius: 999,
                  background: stat.badgeType === 'error' ? 'rgba(186,26,26,0.08)' : stat.badgeType === 'primary' ? 'rgba(249,115,22,0.1)' : '#f1f5f9',
                  color: stat.badgeType === 'error' ? '#ba1a1a' : stat.badgeType === 'primary' ? '#f97316' : '#64748b',
                }}>
                  {stat.badge}
                </span>
              )}
              {stat.badgeIcon && (
                <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 18 }}>{stat.badgeIcon}</span>
              )}
            </div>
            <div>
              <p style={{ fontFamily: 'Geist, monospace', fontSize: 10, fontWeight: 600, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</p>
              <h3 style={{ fontSize: 28, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em', marginTop: 2 }}>{stat.value}</h3>
            </div>
            {stat.subtitle && <p style={{ fontSize: 10, color: '#584237', marginTop: 8 }}>{stat.subtitle}</p>}
            {stat.trendText && <p style={{ fontSize: 10, color: '#f97316', marginTop: 8 }}>{stat.trendCustom || 'No trends available'}</p>}
            {stat.progress !== undefined && !stat.progressSegmented && (
              <div style={{ marginTop: 12, background: '#f1f5f9', height: 4, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#f97316', width: `${stat.progress}%`, borderRadius: 2 }} />
              </div>
            )}
            {stat.progressSegmented && (
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                <div style={{ height: 4, background: '#f97316', flex: 1, borderRadius: 2 }} />
                <div style={{ height: 4, background: '#f97316', flex: 1, borderRadius: 2 }} />
                <div style={{ height: 4, background: '#e2e8f0', flex: 1, borderRadius: 2 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Yield Chart */}
        <div
          className="glass-card"
          style={{ padding: 24, gridColumn: '1 / 2' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: '#251913', letterSpacing: '-0.01em' }}>Harvest Predictions</h4>
              <p style={{ fontSize: 13, color: '#584237', marginTop: 2 }}>Expected crop yield for this season</p>
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 8 }}>
              <button style={{ padding: '4px 12px', fontSize: 12, fontWeight: 700, background: '#f97316', color: 'white', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Harvest</button>
              <button style={{ padding: '4px 12px', fontSize: 12, fontWeight: 700, background: 'transparent', color: '#64748b', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Growth</button>
            </div>
          </div>

          {/* Chart Mockup */}
          <div style={{ position: 'relative', height: 220 }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: '2%', padding: '0 16px 32px' }}>
              {yieldData.map((h, i) => (
                <div key={i} style={{ flex: 1, position: 'relative', height: `${h}%`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: i === 3 ? '#f97316' : '#f1f5f9',
                    borderRadius: '6px 6px 0 0',
                    border: i === 3 ? 'none' : 'none',
                    animation: i === 3 ? 'pulse 2s infinite' : 'none',
                  }} />
                </div>
              ))}
            </div>
            {/* Grid lines */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 0 32px', pointerEvents: 'none', opacity: 0.5 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ borderTop: '1px solid #f1f5f9' }} />
              ))}
            </div>
            {/* Month labels */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16,
              fontFamily: 'Geist, monospace', fontSize: 10, color: '#584237', letterSpacing: '0.05em',
            }}>
              {monthLabels.map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>

        {/* Alert Feed */}
        <div
          className="glass-card"
          style={{ padding: 24, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h4 style={{ fontSize: 18, fontWeight: 600, color: '#251913', letterSpacing: '-0.01em' }}>Today's Alerts</h4>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#f97316', animation: 'ping 1s infinite', display: 'block' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
            {alerts.map((alert, i) => (
              <div key={i}
                className={`alert-${alert.type}`}
                style={{ opacity: alert.muted ? 0.65 : 1 }}
              >
                <div style={{ display: 'flex', gap: 12 }}>
                  <span className="material-symbols-outlined" style={{
                    color: alert.type === 'error' ? '#ba1a1a' : alert.type === 'primary' ? '#f97316' : '#94a3b8',
                    fontSize: 20, marginTop: 2,
                  }}>{alert.icon}</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#251913' }}>{alert.title}</p>
                    <p style={{ fontSize: 11, color: '#584237', marginTop: 4, lineHeight: 1.5 }}>{alert.desc}</p>
                    {alert.action && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#ba1a1a', display: 'block', marginTop: 6, fontFamily: 'Geist, monospace' }}>{alert.action}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button style={{
            width: '100%', marginTop: 16, padding: '8px 0',
            fontSize: 12, fontWeight: 700, color: '#f97316',
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderRadius: 8, transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.05)'; e.currentTarget.style.border = '1px solid rgba(249,115,22,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = 'none' }}
          >
            View All Alerts
          </button>
        </div>
      </div>

      {/* Bottom Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Environmental Analysis */}
        <div
          className="glass-card"
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h4 style={{ fontSize: 18, fontWeight: 600, color: '#251913', letterSpacing: '-0.01em' }}>Weather & Soil Status</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: '#94a3b8' }} />
                <span style={{ fontSize: 10, fontFamily: 'Geist, monospace', color: '#584237' }}>TEMP</span>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: '#f97316' }} />
                <span style={{ fontSize: 10, fontFamily: 'Geist, monospace', color: '#584237' }}>RAIN</span>
              </div>
            </div>
          </div>

          <div style={{ height: 160, position: 'relative', borderTop: '1px solid #f1f5f9', marginTop: 8 }}>
            <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <path d="M0 80 Q 50 10, 100 70 T 200 40 T 300 80 T 400 20" fill="none" stroke="#94a3b8" strokeWidth="2" />
              <path d="M0 100 L0 90 Q 50 95, 100 80 T 200 90 T 300 70 T 400 95 L 400 100 Z" fill="#f97316" fillOpacity="0.15" stroke="#f97316" strokeWidth="1.5" />
            </svg>

            {/* AI Insight */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(249,115,22,0.12)', borderRadius: 14,
              padding: '12px 16px', maxWidth: 240, textAlign: 'center',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#f97316', fontFamily: 'Geist, monospace', marginBottom: 4 }}>AI INSIGHT</p>
              <p style={{ fontSize: 11, lineHeight: 1.5, color: '#251913' }}>High humidity reducing irrigation needs by 15% this week.</p>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {envStats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card"
              style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}
            >
              <p style={{ fontFamily: 'Geist, monospace', fontSize: 10, fontWeight: 600, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</p>
              <h4 style={{ fontSize: 22, fontWeight: 700, color: stat.primary ? '#f97316' : '#251913' }}>
                {stat.value} {stat.unit && <span style={{ fontSize: 12, fontWeight: 400, color: '#584237' }}>{stat.unit}</span>}
              </h4>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 4, display: 'inline-block', width: 'fit-content',
                background: stat.tagType === 'primary' ? 'rgba(249,115,22,0.1)' : '#f1f5f9',
                color: stat.tagType === 'primary' ? '#f97316' : '#64748b',
                fontFamily: 'Geist, monospace', fontWeight: 600,
              }}>{stat.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
