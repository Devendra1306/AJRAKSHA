import { useState } from 'react';
import { useWeather } from '../context/WeatherContext';

const FARM_ALERTS = [
  { title: 'Rain Expected in 3 Days', desc: 'Heavy rainfall 65–85mm. Hold off irrigation & delay fertiliser application.', icon: 'water_drop', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  { title: 'High Humidity Alert', desc: 'Humidity at 72% — monitor cotton crop for fungal disease risk.', icon: 'warning', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { title: 'Wind Advisory', desc: '18 km/h winds expected. Avoid pesticide spray to prevent drift.', icon: 'air', color: '#8b5cf6', bg: '#f5f3ff', border: '#c4b5fd' },
];

const AI_INSIGHTS = [
  { icon: 'eco', text: 'Delay sowing by 4–5 days — rainfall window is optimal post-Thursday.' },
  { icon: 'water', text: 'Skip irrigation this week. Soil moisture will be replenished by rain.' },
  { icon: 'bug_report', text: 'Apply fungicide before Wednesday to prevent blight in humid conditions.' },
];

// Simple temperature graph SVG
function TempGraph({ forecast = [] }) {
  const temps = forecast.map(f => f.high);
  const min = Math.min(...temps) - 2;
  const max = Math.max(...temps) + 2;
  const range = max - min || 1;
  const w = 320, h = 80;
  const points = temps.map((v, i) => {
    const x = 20 + (i / (temps.length - 1)) * (w - 40);
    const y = h - 12 - ((v - min) / range) * (h - 24);
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const area = `${path} L ${points[points.length - 1][0]} ${h} L ${points[0][0]} ${h} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#tempGrad)" />
      <path d={path} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="#f97316" />
          <text x={x} y={y - 9} textAnchor="middle" fontSize="11" fill="#251913" fontWeight="600">{temps[i]}°</text>
        </g>
      ))}
      {forecast.map((f, i) => (
        <text key={i} x={20 + (i / (forecast.length - 1)) * (w - 40)} y={h - 1}
          textAnchor="middle" fontSize="10" fill="#584237" fontFamily="Geist Mono, monospace">{f.day}</text>
      ))}
    </svg>
  );
}

export default function Weather() {
  const [activeDay, setActiveDay] = useState(0);
  const { forecastData, currentWeather, loading } = useWeather();
  
  const today = forecastData[activeDay];
  
  // Calculate display values based on selected day
  const displayTemp = activeDay === 0 ? currentWeather.temp : today.high;
  const displayCondition = activeDay === 0 ? currentWeather.condition : today.condition;
  const displayIcon = activeDay === 0 ? currentWeather.icon : today.icon;
  const displayFeelsLike = activeDay === 0 ? `Feels like ${currentWeather.feelsLike}°C` : `Precipitation chance ${today.rain}%`;

  const metrics = [
    { label: 'Humidity', value: activeDay === 0 ? `${currentWeather.humidity}%` : '--', icon: 'water_drop', color: '#3b82f6' },
    { label: 'Wind Speed', value: activeDay === 0 ? `${currentWeather.windSpeed} km/h` : '--', icon: 'air', color: '#8b5cf6' },
    { label: 'Feels Like', value: activeDay === 0 ? `${currentWeather.feelsLike}°C` : '--', icon: 'thermostat', color: '#f59e0b' },
    { label: 'Visibility', value: activeDay === 0 ? `${currentWeather.visibility} km` : '--', icon: 'visibility', color: '#10b981' },
  ];

  return (
    <div style={{ background: '#fff8f6', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 32 }}>wb_sunny</span>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#251913', margin: 0 }}>Weather Intelligence</h1>
          </div>
          <p style={{ color: '#584237', fontSize: 15, marginBottom: 32, marginLeft: 44 }}>
            {loading ? 'Fetching local forecast...' : 'Hyper-local forecasts for your farm'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Main Weather Card */}
            <div
              style={{
                borderRadius: 24,
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 60%, #c2410c 100%)',
                padding: '32px 32px',
                color: '#fff',
                boxShadow: '0 8px 40px rgba(249,115,22,0.35)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circles */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ position: 'absolute', top: 20, right: 20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, opacity: 0.9 }}>location_on</span>
                    <span style={{ fontSize: 15, opacity: 0.9, fontWeight: 500 }}>{currentWeather.locationName || 'Current Location'}</span>
                  </div>
                  <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1, letterSpacing: '-3px', marginBottom: 4 }}>{displayTemp}°C</div>
                  <div style={{ fontSize: 18, fontWeight: 500, opacity: 0.92 }}>{displayCondition}</div>
                  <div style={{ fontSize: 13, opacity: 0.78, marginTop: 6 }}>{displayFeelsLike} · High {today.high}° · Low {today.low}°</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 90, opacity: 0.85 }}>{displayIcon}</span>
                </div>
              </div>

              {/* Metrics row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                {metrics.map((m, i) => (
                  <div key={m.label} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.18)' : 'none', padding: '0 8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, opacity: 0.85 }}>{m.icon}</span>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{m.value}</div>
                    <div style={{ fontSize: 10, opacity: 0.75, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#f97316', display: 'block', marginBottom: 12 }}>5-Day Forecast</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                {forecastData.map((f, i) => (
                  <div
                    key={f.day}
                    onClick={() => setActiveDay(i)}
                    className="glass-card"
                    style={{
                      background: activeDay === i ? '#fff1eb' : '#fff',
                      border: activeDay === i ? '1.5px solid #f97316' : '1px solid #e0c0b1',
                      borderRadius: 16, padding: '16px 10px', textAlign: 'center',
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: activeDay === i ? '0 4px 20px rgba(249,115,22,0.15)' : '0 2px 12px rgba(157,67,0,0.06)',
                    }}
                  >
                    <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: activeDay === i ? '#f97316' : '#584237', marginBottom: 8 }}>{f.day}</div>
                    <span className="material-symbols-outlined" style={{ fontSize: 32, color: activeDay === i ? '#f97316' : '#584237' }}>{f.icon}</span>
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#251913' }}>{f.high}°</span>
                      <span style={{ fontSize: 12, color: '#584237', marginLeft: 4 }}>{f.low}°</span>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#3b82f6' }}>water_drop</span>
                      <span style={{ fontSize: 11, color: '#584237' }}>{f.rain}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Temperature Trend */}
            <div
              className="glass-card"
              style={{ background: '#fff', border: '1px solid #e0c0b1', borderRadius: 20, padding: '20px 24px', boxShadow: '0 4px 20px rgba(157,67,0,0.06)' }}
            >
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#f97316', display: 'block', marginBottom: 16 }}>Temperature Trend</span>
              <TempGraph forecast={forecastData} />
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Farm Alerts */}
            <div>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#f97316', display: 'block', marginBottom: 12 }}>Farm Alerts</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {FARM_ALERTS.map((a, i) => (
                  <div
                    key={i}
                    style={{ background: a.bg, border: `1px solid ${a.border}`, borderRadius: 16, padding: '14px 16px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: a.color }}>{a.icon}</span>
                      <span style={{ fontWeight: 600, color: '#251913', fontSize: 14 }}>{a.title}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#584237', margin: 0, lineHeight: 1.5 }}>{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div
              className="glass-card"
              style={{ background: '#fff', border: '1px solid #e0c0b1', borderRadius: 20, padding: '20px 20px', boxShadow: '0 4px 20px rgba(157,67,0,0.06)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#f97316' }}>smart_toy</span>
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#f97316' }}>AI Crop Insights</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {AI_INSIGHTS.map((ins, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: '#fff8f6', borderRadius: 12, border: '1px solid #f3e8e2' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#f97316', marginTop: 1 }}>{ins.icon}</span>
                    <p style={{ margin: 0, fontSize: 13, color: '#251913', lineHeight: 1.55 }}>{ins.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Crop Risk Summary */}
            <div
              className="glass-card"
              style={{ background: '#fff', border: '1px solid #e0c0b1', borderRadius: 20, padding: '20px 20px', boxShadow: '0 4px 20px rgba(157,67,0,0.06)' }}
            >
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#f97316', display: 'block', marginBottom: 14 }}>Crop Risk This Week</span>
              {[
                { crop: 'Cotton', risk: 75, color: '#dc2626' },
                { crop: 'Wheat', risk: 30, color: '#f59e0b' },
                { crop: 'Soybean', risk: 20, color: '#16a34a' },
              ].map((c, i) => (
                <div key={c.crop} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#251913' }}>{c.crop}</span>
                    <span style={{ fontSize: 12, color: c.color, fontWeight: 600 }}>{c.risk}% risk</span>
                  </div>
                  <div style={{ height: 6, background: '#f3e8e2', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      style={{ height: '100%', background: c.color, borderRadius: 4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
