import { useState } from 'react'

export default function Fertilizer() {
  const [crop, setCrop] = useState('wheat')
  const [stage, setStage] = useState('vegetative')
  const [predicted, setPredicted] = useState(false)

  const fertilizers = [
    { name: 'Urea (46-0-0)', type: 'Chemical', dosage: '65 kg/acre', timing: 'Split in 2 doses', cost: '₹1,850', organic: false, npk: '46-0-0' },
    { name: 'DAP (18-46-0)', type: 'Chemical', dosage: '50 kg/acre', timing: 'Basal application', cost: '₹2,600', organic: false, npk: '18-46-0' },
    { name: 'Vermicompost', type: 'Organic', dosage: '2 tons/acre', timing: 'Pre-sowing', cost: '₹3,200', organic: true, npk: '1.5-0.5-0.8' },
  ]

  return (
    <div style={{ padding: 32, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Nutrient Management</p>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em' }}>Fertilizer Advisor</h1>
        <p style={{ fontSize: 16, color: '#584237', marginTop: 8 }}>AI-optimized fertilizer schedules based on crop type, growth stage, and soil analysis.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24 }}>
        {/* Input */}
        <div className="glass-card" style={{ borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Crop Details</h3>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251913', marginBottom: 8 }}>Crop</label>
            <select value={crop} onChange={e => setCrop(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0c0b1', borderRadius: 10, background: '#fff8f6', fontSize: 14, color: '#251913', outline: 'none' }}>
              {[['wheat', 'Wheat'], ['rice', 'Rice'], ['cotton', 'Cotton'], ['soybean', 'Soybean']].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251913', marginBottom: 8 }}>Growth Stage</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['seedling', 'Seedling'], ['vegetative', 'Vegetative'], ['flowering', 'Flowering'], ['fruiting', 'Fruiting']].map(([v, l]) => (
                <button key={v} onClick={() => setStage(v)} style={{
                  padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: stage === v ? '#f97316' : '#ffeae0',
                  color: stage === v ? 'white' : '#584237',
                  transition: 'all 0.2s ease',
                }}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251913', marginBottom: 8 }}>Soil Type</label>
            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0c0b1', borderRadius: 10, background: '#fff8f6', fontSize: 14, color: '#251913', outline: 'none' }}>
              <option>Loamy (Sandy Loam)</option>
              <option>Clay Heavy</option>
              <option>Sandy</option>
              <option>Black Cotton Soil</option>
            </select>
          </div>

          <button onClick={() => setPredicted(true)} style={{
            width: '100%', padding: '16px 0', background: '#f97316', color: 'white',
            border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span className="material-symbols-outlined">science</span>
            Get Fertilizer Plan
          </button>
        </div>

        {/* Results */}
        {predicted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Warning */}
            <div style={{ padding: 16, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 22, flexShrink: 0 }}>info</span>
              <p style={{ fontSize: 13, color: '#251913' }}>
                <strong>AI Advisory:</strong> Based on Rabi season, {crop} at {stage} stage requires higher nitrogen input. Avoid phosphorus oversupply based on your soil pH of 6.5.
              </p>
            </div>

            {fertilizers.map((fert, i) => (
              <div key={fert.name} className="glass-card" style={{ borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, background: fert.organic ? 'rgba(22,163,74,0.1)' : 'rgba(249,115,22,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: fert.organic ? '#16a34a' : '#f97316', fontSize: 24 }}>{fert.organic ? 'eco' : 'science'}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 17, fontWeight: 700, color: '#251913' }}>{fert.name}</h4>
                      <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, fontFamily: 'Geist, monospace', fontWeight: 700, background: fert.organic ? 'rgba(22,163,74,0.1)' : 'rgba(249,115,22,0.1)', color: fert.organic ? '#16a34a' : '#f97316' }}>{fert.type}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#251913' }}>{fert.cost}</div>
                    <p style={{ fontSize: 11, color: '#584237' }}>per acre</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[['NPK Ratio', fert.npk], ['Dosage', fert.dosage], ['Timing', fert.timing]].map(([l, v]) => (
                    <div key={l} style={{ padding: '10px 14px', background: '#fff1eb', borderRadius: 10 }}>
                      <p style={{ fontSize: 10, fontFamily: 'Geist, monospace', fontWeight: 600, color: '#584237', textTransform: 'uppercase', marginBottom: 4 }}>{l}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#251913' }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ borderRadius: 24, padding: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 20 }}>
            <div style={{ width: 80, height: 80, background: 'rgba(249,115,22,0.1)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#f97316' }}>science</span>
            </div>
            <p style={{ fontSize: 14, color: '#584237', lineHeight: 1.6 }}>Configure your crop details to get a personalized fertilizer plan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
