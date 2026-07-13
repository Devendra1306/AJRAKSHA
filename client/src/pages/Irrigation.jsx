import { useState } from 'react'

export default function Irrigation() {
  const [sector, setSector] = useState(1)
  const [autoMode, setAutoMode] = useState(true)

  const sectors = [
    { id: 1, name: 'Sector A', crop: 'Wheat', moisture: 64, status: 'optimal', active: true },
    { id: 2, name: 'Sector B', crop: 'Rice', moisture: 24, status: 'low', active: false },
    { id: 3, name: 'Sector C', crop: 'Cotton', moisture: 78, status: 'optimal', active: false },
    { id: 4, name: 'Sector D', crop: 'Soybean', moisture: 45, status: 'medium', active: true },
  ]

  return (
    <div style={{ padding: 32, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Smart Control</p>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em' }}>Irrigation Manager</h1>
          <p style={{ fontSize: 16, color: '#584237', marginTop: 8 }}>AI-controlled smart irrigation with sector-by-sector moisture monitoring.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#251913' }}>Auto Mode</span>
          <div onClick={() => setAutoMode(!autoMode)} style={{
            width: 52, height: 28, borderRadius: 999, cursor: 'pointer', transition: 'all 0.3s ease',
            background: autoMode ? '#f97316' : '#e0c0b1', position: 'relative', flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: 4, left: autoMode ? 28 : 4,
              width: 20, height: 20, borderRadius: 999, background: 'white',
              transition: 'left 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {sectors.map((s, i) => (
          <div key={s.id}
            onClick={() => setSector(s.id)}
            className="glass-card"
            style={{ borderRadius: 20, padding: 20, cursor: 'pointer', border: sector === s.id ? '2px solid #f97316' : '1px solid #e0c0b1', transition: 'all 0.2s ease' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: s.status === 'low' ? 'rgba(186,26,26,0.1)' : 'rgba(249,115,22,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: s.status === 'low' ? '#ba1a1a' : '#f97316', fontSize: 20 }}>water_drop</span>
              </div>
              {s.active && (
                <span style={{ width: 8, height: 8, borderRadius: 999, background: '#16a34a', display: 'block', marginTop: 4 }} />
              )}
            </div>
            <p style={{ fontFamily: 'Geist, monospace', fontSize: 10, fontWeight: 600, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{s.name}</p>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.status === 'low' ? '#ba1a1a' : '#251913' }}>{s.moisture}%</div>
            <p style={{ fontSize: 12, color: '#584237', marginTop: 4 }}>{s.crop}</p>
            <div style={{ marginTop: 10, height: 4, background: '#fce3d9', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: s.status === 'low' ? '#ba1a1a' : '#f97316', width: `${s.moisture}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
          <h4 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>
            {sectors.find(s => s.id === sector)?.name} Control Panel
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Flow Rate', value: '42 L/hr' },
              { label: 'Duration', value: '35 min' },
              { label: 'Next Schedule', value: '06:00 AM' },
              { label: 'Water Used', value: '1,280 L' },
            ].map(m => (
              <div key={m.label} style={{ padding: 14, background: '#fff1eb', borderRadius: 12 }}>
                <p style={{ fontFamily: 'Geist, monospace', fontSize: 10, fontWeight: 600, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#251913' }}>{m.value}</p>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%', padding: '14px 0', background: '#f97316', color: 'white',
            border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
          }}>
            <span className="material-symbols-outlined">water_drop</span>
            Start Manual Irrigation
          </button>
        </div>

        <div className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
          <h4 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>AI Recommendations</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: 'warning', color: '#ba1a1a', bg: 'rgba(186,26,26,0.05)', title: 'Sector B Critical', desc: 'Moisture at 24% - below threshold. Immediate irrigation required.' },
              { icon: 'schedule', color: '#f97316', bg: 'rgba(249,115,22,0.05)', title: 'Optimal Schedule', desc: 'Best irrigation window: 4:30-6:00 AM to minimize evaporation.' },
              { icon: 'eco', color: '#16a34a', bg: 'rgba(22,163,74,0.05)', title: 'Water Savings', desc: 'AI auto-adjust saved 340L vs manual schedule this week.' },
            ].map(alert => (
              <div key={alert.title} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: alert.bg, border: `1px solid ${alert.color}20`, borderRadius: 12 }}>
                <span className="material-symbols-outlined" style={{ color: alert.color, fontSize: 20, flexShrink: 0, marginTop: 2 }}>{alert.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#251913', marginBottom: 3 }}>{alert.title}</p>
                  <p style={{ fontSize: 12, color: '#584237', lineHeight: 1.5 }}>{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
