import { useState } from 'react'

const schemes = [
  { icon: 'payments', name: 'PM-KISAN Scheme', dept: 'Ministry of Agriculture', benefit: '₹6,000/year direct benefit to farmers', deadline: 'Ongoing', eligible: true, tag: 'Income Support' },
  { icon: 'water_drop', name: 'Pradhan Mantri Krishi Sinchayee Yojana', dept: 'Jal Shakti Ministry', benefit: 'Subsidized drip/sprinkler irrigation equipment', deadline: 'Mar 31, 2025', eligible: true, tag: 'Irrigation' },
  { icon: 'local_florist', name: 'Rashtriya Krishi Vikas Yojana', dept: 'State Agriculture Dept', benefit: 'Up to ₹50,000 per farmer for modernization', deadline: 'Dec 31, 2024', eligible: false, tag: 'Modernization' },
  { icon: 'shield', name: 'Pradhan Mantri Fasal Bima Yojana', dept: 'Agriculture Ministry', benefit: 'Crop insurance at 2% premium rate', deadline: 'Kharif season', eligible: true, tag: 'Insurance' },
  { icon: 'science', name: 'Soil Health Card Scheme', dept: 'Agriculture Ministry', benefit: 'Free soil testing & nutrient recommendations', deadline: 'Ongoing', eligible: true, tag: 'Soil Health' },
  { icon: 'solar_power', name: 'PM Kusum Scheme', dept: 'MNRE', benefit: 'Solar pump subsidy up to ₹1.2 Lakhs', deadline: 'Mar 2025', eligible: false, tag: 'Energy' },
]

export default function Schemes() {
  const [activeFilter, setActiveFilter] = useState('All')
  const filters = ['All', 'Eligible', 'Income Support', 'Insurance', 'Irrigation']

  const filtered = activeFilter === 'Eligible' ? schemes.filter(s => s.eligible) :
    activeFilter === 'All' ? schemes : schemes.filter(s => s.tag === activeFilter)

  return (
    <div style={{ padding: 32, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Central & State</p>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em' }}>Government Schemes</h1>
        <p style={{ fontSize: 16, color: '#584237', marginTop: 8 }}>AI-curated government subsidies and schemes matching your farm profile.</p>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Eligible Schemes', value: schemes.filter(s => s.eligible).length, icon: 'check_circle', color: '#16a34a' },
          { label: 'Total Benefits', value: '₹2.3 Lakhs', icon: 'account_balance', color: '#f97316' },
          { label: 'Pending Apply', value: '2', icon: 'pending_actions', color: '#006398' },
        ].map((s, i) => (
          <div key={s.label} className="glass-card" style={{ padding: '20px 24px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 24 }}>{s.icon}</span>
            </div>
            <div>
              <p style={{ fontFamily: 'Geist, monospace', fontSize: 10, fontWeight: 600, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</p>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Geist, monospace',
            background: activeFilter === f ? '#f97316' : '#ffeae0',
            color: activeFilter === f ? '#ffffff' : '#584237',
            transition: 'all 0.2s ease',
          }}>{f}</button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {filtered.map((scheme, i) => (
          <div key={scheme.name} className="glass-card" style={{ borderRadius: 20, padding: 24, opacity: scheme.eligible ? 1 : 0.75 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, background: 'rgba(249,115,22,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 24 }}>{scheme.icon}</span>
                </div>
                <div>
                  <span style={{ fontSize: 10, fontFamily: 'Geist, monospace', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{scheme.tag}</span>
                </div>
              </div>
              <span style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 999, fontFamily: 'Geist, monospace', fontWeight: 700,
                background: scheme.eligible ? 'rgba(22,163,74,0.1)' : '#f1f5f9',
                color: scheme.eligible ? '#16a34a' : '#64748b',
              }}>
                {scheme.eligible ? '✓ Eligible' : 'Check'}
              </span>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#251913', marginBottom: 6, lineHeight: 1.4 }}>{scheme.name}</h3>
            <p style={{ fontSize: 12, color: '#584237', marginBottom: 12 }}>{scheme.dept}</p>
            <p style={{ fontSize: 13, color: '#251913', lineHeight: 1.6, marginBottom: 16, padding: '10px 12px', background: '#fff1eb', borderRadius: 10 }}>
              {scheme.benefit}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#584237', fontFamily: 'Geist, monospace' }}>
                <span style={{ color: '#f97316' }}>●</span> Deadline: {scheme.deadline}
              </span>
              {scheme.eligible && (
                <button style={{
                  padding: '8px 16px', background: '#f97316', color: 'white', border: 'none', borderRadius: 8,
                  fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
