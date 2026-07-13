import { useState } from 'react'

export default function SoilAnalysis() {
  const [ph, setPh] = useState(6.5)
  const [nitrogen, setNitrogen] = useState(42)
  const [phosphorus, setPhosphorus] = useState(18)
  const [potassium, setPotassium] = useState(155)
  const [moisture, setMoisture] = useState(24)

  return (
    <div style={{ padding: 32, paddingBottom: 80 }}>
      <header style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em', marginBottom: 12 }}>
          Soil Intelligence Analysis
        </h1>
        <p style={{ fontSize: 17, color: '#584237', lineHeight: 1.7, maxWidth: 640 }}>
          Professional telemetry processing. Monitor field health with precision metrics and AI-driven soil optimization strategies.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: Input Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Telemetry Inputs */}
          <div
            className="glass-card"
            style={{ borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>settings_input_component</span>
                Telemetry Inputs
              </h3>
              <span style={{ fontSize: 12, color: '#584237', background: '#ffeae0', padding: '4px 10px', borderRadius: 6 }}>Real-time calibration</span>
            </div>

            {/* pH Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <label style={{ fontWeight: 600, fontSize: 15, color: '#251913' }}>Soil pH Level</label>
                <span style={{ background: '#ffdbca', padding: '4px 12px', borderRadius: 999, color: '#341100', fontFamily: 'Geist, monospace', fontSize: 12, fontWeight: 600, border: '1px solid rgba(249,115,22,0.2)' }}>
                  {ph.toFixed(1)} {ph < 6 ? 'Acidic' : ph > 8 ? 'Alkaline' : 'Neutral'}
                </span>
              </div>
              <input
                type="range" min="0" max="14" step="0.1" value={ph}
                onChange={e => setPh(parseFloat(e.target.value))}
                style={{ width: '100%', height: 6, appearance: 'none', background: '#ffeae0', borderRadius: 3, outline: 'none', cursor: 'pointer' }}
              />
              <style>{`input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #f97316; cursor: pointer; border: 2px solid white; box-shadow: 0 0 10px rgba(249,115,22,0.3); }`}</style>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'Geist, monospace', fontSize: 10, color: '#584237', fontWeight: 700, letterSpacing: '0.06em' }}>
                <span>ACIDIC (0)</span>
                <span>ALKALINE (14)</span>
              </div>
            </div>

            {/* N, P, K, Moisture sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                { label: 'Nitrogen (N)', value: nitrogen, setter: setNitrogen, unit: 'mg/kg' },
                { label: 'Phosphorus (P)', value: phosphorus, setter: setPhosphorus, unit: 'mg/kg' },
                { label: 'Potassium (K)', value: potassium, setter: setPotassium, unit: 'mg/kg', max: 300 },
                { label: 'Moisture', value: moisture, setter: setMoisture, unit: '%' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <label style={{ fontWeight: 600, fontSize: 14, color: '#251913' }}>{s.label}</label>
                    <span style={{ color: '#f97316', fontWeight: 700, fontSize: 14 }}>{s.value} {s.unit}</span>
                  </div>
                  <input
                    type="range" min="0" max={s.max || 100} value={s.value}
                    onChange={e => s.setter(parseInt(e.target.value))}
                    style={{ width: '100%', height: 6, appearance: 'none', background: '#ffeae0', borderRadius: 3, outline: 'none', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>

            <button style={{
              width: '100%', padding: '16px 0',
              background: '#f97316', color: 'white',
              border: 'none', borderRadius: 16,
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <span className="material-symbols-outlined">sync</span>
              Sync Digital Twin & Recalculate
            </button>
          </div>

          {/* Conservation Advisory */}
          <div
            className="glass-card"
            style={{ borderRadius: 24, padding: 24 }}
          >
            <h3 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>water_drop</span>
              Conservation Advisory
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: 'psychology', title: 'Mulching Strategy', desc: 'Apply 3-4 inches of organic mulch to reduce evaporation.' },
                { icon: 'timer', title: 'Irrigation Window', desc: 'Optimal watering: 04:00 AM – 06:00 AM.' },
              ].map(tip => (
                <div key={tip.title} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: 16, borderRadius: 16, background: '#fff1eb',
                  border: '1px solid rgba(224,192,177,0.3)',
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 22, padding: 8, background: '#ffdbca', borderRadius: 10, flexShrink: 0 }}>{tip.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: '#251913', fontSize: 14, marginBottom: 4 }}>{tip.title}</p>
                    <p style={{ fontSize: 13, color: '#584237', lineHeight: 1.5 }}>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Score & Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Soil Health Gauge */}
          <div
            className="glass-card"
            style={{ borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
          >
            <h3 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 32 }}>Soil Health Score</h3>

            <div style={{ position: 'relative', width: 200, height: 200 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#fce3d9" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="url(#gradient-orange)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset="70"
                  style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                />
                <defs>
                  <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#9d4300', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 52, fontWeight: 700, color: '#251913', letterSpacing: '-0.03em' }}>82</span>
                <span style={{ fontFamily: 'Geist, monospace', fontSize: 10, fontWeight: 600, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>Vitality Index</span>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', padding: '8px 20px', borderRadius: 999,
                background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)',
                color: '#f97316', fontWeight: 700, fontSize: 14,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 6, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>auto_awesome</span>
                Optimal Condition
              </span>
              <p style={{ marginTop: 16, fontSize: 14, color: '#584237', lineHeight: 1.6 }}>
                Your soil vitality is in the top 15% for the current agro-climatic zone.
              </p>
            </div>
          </div>

          {/* Prescriptive Insights */}
          <div
            className="glass-card"
            style={{ borderRadius: 24, padding: 24, flex: 1 }}
          >
            <h3 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>list_alt</span>
              Prescriptive Insights
            </h3>

            {/* Recommended Crops */}
            <div style={{ background: '#fff1eb', borderRadius: 16, padding: 20, border: '1px solid rgba(224,192,177,0.3)', marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Recommended Cultivation</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Golden Wheat', 'Hybrid Maize', 'Soybeans'].map(crop => (
                  <span key={crop} style={{
                    padding: '6px 16px', background: '#ffffff', borderRadius: 8,
                    border: '1px solid #e0c0b1', fontSize: 13, fontWeight: 600, color: '#251913',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}>{crop}</span>
                ))}
              </div>
            </div>

            {/* Fertilizers */}
            <div style={{ background: '#fff1eb', borderRadius: 16, padding: 20, border: '1px solid rgba(224,192,177,0.3)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Nutrient Supplementation</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { name: 'Bone Meal (High P)', priority: 'High Priority', priorityColor: '#f97316', pct: 85 },
                  { name: 'Kelp Meal (Minerals)', priority: 'Secondary', priorityColor: '#584237', pct: 40 },
                ].map(item => (
                  <div key={item.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#251913' }}>{item.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: item.priorityColor }}>{item.priority}</span>
                    </div>
                    <div style={{ height: 6, background: '#fce3d9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.pct}%`, background: item.pct > 60 ? '#f97316' : '#c4b5a3', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Download CTA */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 32px', background: '#251913', color: 'white',
              border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 14,
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#584237'}
              onMouseLeave={e => e.currentTarget.style.background = '#251913'}
            >
              <span className="material-symbols-outlined">picture_as_pdf</span>
              Download Analytics Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
