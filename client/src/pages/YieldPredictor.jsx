import { useState } from 'react';

const CROPS = ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize', 'Mustard', 'Sugarcane'];
const SEASONS = ['Rabi (Winter)', 'Kharif (Monsoon)', 'Zaid (Summer)'];
const SOIL_TYPES = ['Clay Loam', 'Sandy Loam', 'Black Cotton Soil', 'Red Laterite', 'Alluvial'];

const RISK_CONFIG = {
  LOW: { label: 'LOW RISK', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: 'verified' },
  MEDIUM: { label: 'MEDIUM RISK', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: 'warning' },
  HIGH: { label: 'HIGH RISK', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: 'error' },
};

// Compute mock yield based on inputs
function computeResults(form) {
  const base = { Wheat: 4.2, Rice: 3.8, Cotton: 2.1, Soybean: 2.5, Maize: 5.1, Mustard: 1.8, Sugarcane: 68 };
  const soilMult = form.soilHealth / 100;
  const rainMult = Math.min(form.rainfall / 600, 1.3);
  const rawYield = (base[form.crop] || 4) * (0.6 + soilMult * 0.4) * (0.75 + rainMult * 0.25);
  const finalYield = +(rawYield * (1 + (form.area > 5 ? 0.05 : 0))).toFixed(1);
  const pricePerTon = { Wheat: 21400, Rice: 18500, Cotton: 62000, Soybean: 41000, Maize: 17800, Mustard: 53400, Sugarcane: 3500 };
  const revenue = +(finalYield * form.area * (pricePerTon[form.crop] || 20000) / 100000).toFixed(2);
  const risk = form.soilHealth > 65 && form.rainfall > 400 ? 'LOW' : form.soilHealth > 40 ? 'MEDIUM' : 'HIGH';
  return { yield: finalYield, revenue, risk };
}

// Yield comparison bar chart
function YieldBarChart({ crop, predicted }) {
  const national = { Wheat: 3.5, Rice: 2.7, Cotton: 1.8, Soybean: 1.4, Maize: 3.2, Mustard: 1.3, Sugarcane: 70 };
  const nat = national[crop] || 3;
  const maxVal = Math.max(nat, predicted) * 1.2;
  const bars = [
    { label: 'National Avg', value: nat, color: '#e0c0b1' },
    { label: 'Your Est.', value: predicted, color: '#f97316' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {bars.map(b => (
        <div key={b.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: '#584237', fontWeight: 500 }}>{b.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#251913' }}>{b.value} t/ha</span>
          </div>
          <div style={{ height: 10, background: '#f3e8e2', borderRadius: 6, overflow: 'hidden' }}>
            <div
              style={{ height: '100%', background: b.color, borderRadius: 6 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Monthly yield trend SVG
function YieldTrendChart({ peak }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const vals = [0.2, 0.8, 1.8, 3.2, peak * 0.9, peak];
  const min = 0, max = peak * 1.1 || 7;
  const w = 320, h = 90;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return [x, y];
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 20}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#yieldGrad)" />
      <path d={path} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill="#f97316" />
        </g>
      ))}
      {months.map((m, i) => (
        <text key={m} x={(i / (months.length - 1)) * w} y={h + 16}
          textAnchor="middle" fontSize="10" fill="#584237" fontFamily="Geist Mono, monospace">{m}</text>
      ))}
    </svg>
  );
}

export default function YieldPredictor() {
  const [form, setForm] = useState({
    crop: 'Wheat', area: 5, season: 'Rabi (Winter)',
    soilHealth: 74, rainfall: 580, soilType: 'Clay Loam',
  });
  const [results, setResults] = useState(computeResults({ crop: 'Wheat', area: 5, season: 'Rabi (Winter)', soilHealth: 74, rainfall: 580 }));
  const [predicted, setPredicted] = useState(true);

  const handleChange = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
  };

  const handlePredict = () => {
    setResults(computeResults(form));
    setPredicted(true);
  };

  const riskConfig = RISK_CONFIG[results.risk];

  return (
    <div style={{ background: '#fff8f6', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 32 }}>area_chart</span>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#251913', margin: 0 }}>Yield Predictor</h1>
          </div>
          <p style={{ color: '#584237', fontSize: 15, marginBottom: 32, marginLeft: 44 }}>
            AI-powered harvest forecasting for Indian crops
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>

          {/* LEFT: Input Form */}
          <div
            className="glass-card"
            style={{ background: '#fff', border: '1px solid #e0c0b1', borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 28px rgba(157,67,0,0.07)' }}
          >
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#f97316', display: 'block', marginBottom: 22 }}>Prediction Inputs</span>

            {/* Crop */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#584237', display: 'block', marginBottom: 7 }}>Crop</label>
              <select
                value={form.crop}
                onChange={e => handleChange('crop', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0c0b1', borderRadius: 12, fontSize: 14, color: '#251913', background: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', cursor: 'pointer' }}
              >
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Area */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#584237', display: 'block', marginBottom: 7 }}>Farm Area (Hectares)</label>
              <input
                type="number" min="0.5" max="100" step="0.5"
                value={form.area}
                onChange={e => handleChange('area', +e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1.5px solid #e0c0b1', borderRadius: 12, fontSize: 14, color: '#251913', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              />
            </div>

            {/* Season */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#584237', display: 'block', marginBottom: 7 }}>Season</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SEASONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleChange('season', s)}
                    style={{
                      flex: '1 1 auto', padding: '7px 10px', borderRadius: 10, cursor: 'pointer',
                      border: form.season === s ? 'none' : '1.5px solid #e0c0b1',
                      background: form.season === s ? '#f97316' : '#fff',
                      color: form.season === s ? '#fff' : '#584237',
                      fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.17s',
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Soil Type */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#584237', display: 'block', marginBottom: 7 }}>Soil Type</label>
              <select
                value={form.soilType}
                onChange={e => handleChange('soilType', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0c0b1', borderRadius: 12, fontSize: 14, color: '#251913', background: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', cursor: 'pointer' }}
              >
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Soil Health Slider */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#584237', display: 'block', marginBottom: 7 }}>
                Soil Health Score
                <span style={{ float: 'right', color: form.soilHealth > 65 ? '#16a34a' : form.soilHealth > 40 ? '#d97706' : '#dc2626', fontWeight: 700, fontSize: 12 }}>
                  {form.soilHealth}/100
                </span>
              </label>
              <input
                type="range" min="10" max="100"
                value={form.soilHealth}
                onChange={e => handleChange('soilHealth', +e.target.value)}
                style={{ width: '100%', accentColor: '#f97316', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                <span style={{ fontSize: 10, color: '#dc2626' }}>Poor</span>
                <span style={{ fontSize: 10, color: '#16a34a' }}>Excellent</span>
              </div>
            </div>

            {/* Rainfall */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#584237', display: 'block', marginBottom: 7 }}>Expected Rainfall (mm)</label>
              <input
                type="number" min="50" max="2000" step="10"
                value={form.rainfall}
                onChange={e => handleChange('rainfall', +e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1.5px solid #e0c0b1', borderRadius: 12, fontSize: 14, color: '#251913', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              />
            </div>

            <button
              onClick={handlePredict}
              style={{
                width: '100%', padding: '14px', border: 'none', borderRadius: 14,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>calculate</span>
              Predict Yield
            </button>
          </div>

          {/* RIGHT: Results Panel */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {/* Big Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                {
                  label: 'Expected Yield',
                  value: `${results.yield} t/ha`,
                  sub: `${form.crop} · ${form.area} hectares`,
                  icon: 'agriculture',
                  gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  textColor: '#fff',
                },
                {
                  label: 'Est. Revenue',
                  value: `₹${results.revenue} L`,
                  sub: 'At current MSP rates',
                  icon: 'payments',
                  gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  textColor: '#fff',
                },
                {
                  label: 'Total Production',
                  value: `${(results.yield * form.area).toFixed(1)} T`,
                  sub: `${form.area} ha × ${results.yield} t/ha`,
                  icon: 'inventory',
                  gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  textColor: '#fff',
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{ borderRadius: 20, padding: '22px 20px', background: stat.gradient, color: stat.textColor, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 24, opacity: 0.85 }}>{stat.icon}</span>
                  <div style={{ fontSize: 26, fontWeight: 800, margin: '8px 0 4px', letterSpacing: '-0.5px' }}>{stat.value}</div>
                  <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', opacity: 0.85 }}>{stat.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.72, marginTop: 4 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Risk Badge + Key Factors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div
                className="glass-card"
                style={{ background: '#fff', border: '1px solid #e0c0b1', borderRadius: 20, padding: '20px 22px', boxShadow: '0 4px 20px rgba(157,67,0,0.06)' }}
              >
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#584237', display: 'block', marginBottom: 16 }}>Risk Assessment</span>
                
                  <div
                    key={results.risk}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: riskConfig.bg, border: `1.5px solid ${riskConfig.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: riskConfig.color, fontSize: 26 }}>{riskConfig.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: riskConfig.color }}>{riskConfig.label}</div>
                      <div style={{ fontSize: 12, color: '#584237', marginTop: 2 }}>
                        {results.risk === 'LOW' ? 'Conditions are favorable' : results.risk === 'MEDIUM' ? 'Some risk factors present' : 'High risk — review inputs'}
                      </div>
                    </div>
                  </div>
                
                {[
                  { label: 'Soil Health', value: form.soilHealth, max: 100 },
                  { label: 'Rainfall Adequacy', value: Math.min(form.rainfall / 8, 100), max: 100 },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#584237' }}>{f.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#251913' }}>{Math.round(f.value)}%</span>
                    </div>
                    <div style={{ height: 6, background: '#f3e8e2', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{ height: '100%', background: '#f97316', borderRadius: 4 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Yield Comparison */}
              <div
                className="glass-card"
                style={{ background: '#fff', border: '1px solid #e0c0b1', borderRadius: 20, padding: '20px 22px', boxShadow: '0 4px 20px rgba(157,67,0,0.06)' }}
              >
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#584237', display: 'block', marginBottom: 16 }}>Vs. National Average</span>
                <YieldBarChart crop={form.crop} predicted={results.yield} />
                <div style={{ marginTop: 16, padding: '10px 12px', background: '#fff8f6', borderRadius: 10, border: '1px solid #f3e8e2' }}>
                  <span style={{ fontSize: 13, color: '#251913', fontWeight: 500 }}>
                    Your estimate is{' '}
                    <strong style={{ color: '#f97316' }}>
                      {(((results.yield / ({ Wheat: 3.5, Rice: 2.7, Cotton: 1.8, Soybean: 1.4, Maize: 3.2, Mustard: 1.3, Sugarcane: 70 }[form.crop] || 3)) - 1) * 100).toFixed(0)}% above
                    </strong>{' '}national average
                  </span>
                </div>
              </div>
            </div>

            {/* Yield Trend Chart */}
            <div
              className="glass-card"
              style={{ background: '#fff', border: '1px solid #e0c0b1', borderRadius: 20, padding: '22px 24px', boxShadow: '0 4px 20px rgba(157,67,0,0.06)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#f97316' }}>Seasonal Yield Projection</span>
                <span style={{ fontSize: 12, color: '#584237', fontWeight: 500 }}>{form.crop} · {form.season.split(' ')[0]}</span>
              </div>
              <YieldTrendChart peak={results.yield} />
            </div>

            {/* AI Recommendations */}
            <div
              className="glass-card"
              style={{ background: '#fff', border: '1px solid #e0c0b1', borderRadius: 20, padding: '20px 22px', boxShadow: '0 4px 20px rgba(157,67,0,0.06)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#f97316' }}>smart_toy</span>
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#f97316' }}>AI Recommendations</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: 'water_drop', text: `Irrigation needed: ${Math.max(0, 600 - form.rainfall)} mm supplemental`, color: '#3b82f6' },
                  { icon: 'eco', text: `Apply NPK 120:60:40 kg/ha for ${form.crop}`, color: '#16a34a' },
                  { icon: 'calendar_today', text: `Optimal harvest: ${form.season === 'Rabi (Winter)' ? 'March–April' : form.season === 'Kharif (Monsoon)' ? 'Oct–Nov' : 'June–July'}`, color: '#f97316' },
                  { icon: 'sell', text: `Best selling window: 4–6 weeks post harvest`, color: '#8b5cf6' },
                ].map((r, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: '#fff8f6', borderRadius: 12, border: '1px solid #f3e8e2' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: r.color, marginTop: 1, flexShrink: 0 }}>{r.icon}</span>
                    <span style={{ fontSize: 12, color: '#251913', lineHeight: 1.5 }}>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
