import { useState } from 'react'

export default function CropRecommendation() {
  const [predicted, setPredicted] = useState(false)
  const [temp, setTemp] = useState(28)
  const [humidity, setHumidity] = useState(65)
  const [ph, setPh] = useState(6.8)

  const crops = [
    { name: 'Wheat', confidence: 96, yield: '5.2 tons/ha', duration: '120 days', demand: 'Very High', profit: '₹38,000/ha', icon: 'grain', pros: ['High MSP', 'Easy storage', 'Govt. support'], color: '#f97316' },
    { name: 'Mustard', confidence: 88, yield: '2.4 tons/ha', duration: '90 days', demand: 'High', profit: '₹26,000/ha', icon: 'local_florist', pros: ['Low water', 'Fast harvest', 'Double crop'], color: '#eab308' },
    { name: 'Chickpea', confidence: 82, yield: '1.8 tons/ha', duration: '100 days', demand: 'Medium', profit: '₹22,000/ha', icon: 'eco', pros: ['N-fixation', 'Drought tolerant', 'Market stable'], color: '#16a34a' },
  ]

  return (
    <div style={{ padding: 32, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>AI-Powered</p>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em' }}>Crop Recommendation</h1>
        <p style={{ fontSize: 16, color: '#584237', marginTop: 8 }}>Get AI-optimized crop suggestions based on your soil, climate, and market conditions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24 }}>
        {/* Input */}
        <div className="glass-card" style={{ borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Environment Parameters</h3>

          {[
            { label: `Temperature: ${temp}°C`, value: temp, setter: setTemp, min: 10, max: 45 },
            { label: `Humidity: ${humidity}%`, value: humidity, setter: setHumidity, min: 10, max: 100 },
            { label: `Soil pH: ${ph}`, value: ph, setter: setPh, min: 4, max: 10, step: 0.1 },
          ].map(s => (
            <div key={s.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#251913' }}>{s.label}</label>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step || 1} value={s.value} onChange={e => s.setter(parseFloat(e.target.value))}
                style={{ width: '100%', height: 6, appearance: 'none', background: '#ffeae0', borderRadius: 3, outline: 'none', cursor: 'pointer' }} />
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251913', marginBottom: 8 }}>Season</label>
            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0c0b1', borderRadius: 10, background: '#fff8f6', fontSize: 14, color: '#251913', outline: 'none' }}>
              <option>Rabi (Winter)</option>
              <option>Kharif (Monsoon)</option>
              <option>Zaid (Summer)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251913', marginBottom: 8 }}>Region</label>
            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0c0b1', borderRadius: 10, background: '#fff8f6', fontSize: 14, color: '#251913', outline: 'none' }}>
              <option>Punjab, North India</option>
              <option>Karnataka, South India</option>
              <option>Rajasthan, Central India</option>
            </select>
          </div>

          <button onClick={() => setPredicted(true)} style={{
            width: '100%', padding: '16px 0', background: '#f97316', color: 'white',
            border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span className="material-symbols-outlined">auto_awesome</span>
            Get AI Recommendation
          </button>
        </div>

        {/* Results */}
        {predicted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {crops.map((crop, i) => (
              <div key={crop.name} className="glass-card" style={{ borderRadius: 20, padding: 24, border: i === 0 ? '2px solid rgba(249,115,22,0.3)' : '1px solid #e0c0b1' }}>
                {i === 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ padding: '4px 12px', background: '#f97316', color: 'white', borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: 'Geist, monospace' }}>⭐ TOP RECOMMENDATION</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${crop.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: crop.color, fontSize: 28 }}>{crop.icon}</span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 22, fontWeight: 700, color: '#251913' }}>{crop.name}</h3>
                      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                        <span style={{ fontSize: 12, color: '#584237' }}>{crop.duration}</span>
                        <span style={{ fontSize: 12, color: '#584237' }}>•</span>
                        <span style={{ fontSize: 12, color: '#584237' }}>Demand: {crop.demand}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: crop.color }}>{crop.confidence}%</div>
                    <p style={{ fontSize: 10, color: '#584237', fontFamily: 'Geist, monospace', textTransform: 'uppercase' }}>Match Score</p>
                  </div>
                </div>

                <div style={{ height: 6, background: '#fce3d9', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
                  <div
                    style={{ height: '100%', background: crop.color, borderRadius: 3 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                  {[
                    { label: 'Expected Yield', value: crop.yield },
                    { label: 'Profit Estimate', value: crop.profit },
                    { label: 'Market Demand', value: crop.demand },
                  ].map(m => (
                    <div key={m.label} style={{ padding: '10px 14px', background: '#fff1eb', borderRadius: 10 }}>
                      <p style={{ fontSize: 10, fontFamily: 'Geist, monospace', fontWeight: 600, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#251913' }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {crop.pros.map(p => (
                    <span key={p} style={{ padding: '4px 10px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 999, fontSize: 11, color: '#f97316', fontWeight: 600 }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ borderRadius: 24, padding: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 20 }}>
            <div style={{ width: 80, height: 80, background: 'rgba(249,115,22,0.1)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#f97316' }}>eco</span>
            </div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#251913', marginBottom: 8 }}>Set Your Parameters</h3>
              <p style={{ fontSize: 14, color: '#584237', lineHeight: 1.6, maxWidth: 280 }}>Configure your farm conditions on the left to get personalized AI crop recommendations.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
