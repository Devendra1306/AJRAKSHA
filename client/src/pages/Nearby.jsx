import { useState } from 'react'

const categories = [
  { key: 'hospital', label: 'Hospitals', emoji: 'local_hospital' },
  { key: 'seed', label: 'Seed Stores', emoji: 'psychology' },
  { key: 'fertilizer', label: 'Fertilizer Shops', emoji: 'science' },
  { key: 'mandi', label: 'Mandis', emoji: 'storefront' },
  { key: 'office', label: 'Agri Offices', emoji: 'account_balance' },
  { key: 'equipment', label: 'Equipment Rentals', emoji: 'agriculture' },
]

const places = [
  { id: 1, name: 'Kisaan Seed Center', category: 'seed', distance: '0.8 km', rating: 4.5, open: true, phone: '+91 98765 43210', address: 'Main Market, Sector 12', hours: '8 AM - 8 PM' },
  { id: 2, name: 'Azadpur Mandi', category: 'mandi', distance: '2.1 km', rating: 4.2, open: true, phone: '+91 11 2734 2000', address: 'Azadpur, New Delhi', hours: '4 AM - 10 PM' },
  { id: 3, name: 'Krishi Vigyan Kendra', category: 'office', distance: '3.2 km', rating: 4.7, open: true, phone: '+91 11 2345 6789', address: 'Block C, Agricultural Area', hours: '9 AM - 5 PM' },
  { id: 4, name: 'Green Fertilizers', category: 'fertilizer', distance: '1.5 km', rating: 4.3, open: false, phone: '+91 99887 65432', address: 'Market Road, Block B', hours: '9 AM - 7 PM' },
  { id: 5, name: 'District Hospital', category: 'hospital', distance: '4.5 km', rating: 3.9, open: true, phone: '+91 11 2222 3333', address: 'Civil Lines, District HQ', hours: '24 Hours' },
  { id: 6, name: 'Farm Equipment Hub', category: 'equipment', distance: '5.1 km', rating: 4.6, open: true, phone: '+91 98654 32100', address: 'Industrial Area, Phase 2', hours: '7 AM - 6 PM' },
]

export default function Nearby() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = activeCategory === 'all' ? places : places.filter(p => p.category === activeCategory)

  return (
    <div style={{ padding: 32, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Geolocation Services</p>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em' }}>Nearby Services</h1>
          <p style={{ fontSize: 16, color: '#584237', marginTop: 8 }}>Find mandis, seed stores, hospitals, and agriculture offices near you.</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12,
          background: 'transparent', border: '1px solid #e0c0b1', color: '#584237', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.05)'; e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e0c0b1'; e.currentTarget.style.color = '#584237' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>my_location</span>
          Use My Location
        </button>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 16 }}>
        <button onClick={() => setActiveCategory('all')}
          style={{
            flexShrink: 0, padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: 'Geist, monospace', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6,
            background: activeCategory === 'all' ? '#f97316' : '#ffeae0',
            color: activeCategory === 'all' ? '#ffffff' : '#584237',
          }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>map</span> All
        </button>
        {categories.map(cat => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
            style={{
              flexShrink: 0, padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'Geist, monospace', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6,
              background: activeCategory === cat.key ? '#f97316' : '#ffeae0',
              color: activeCategory === cat.key ? '#ffffff' : '#584237',
            }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: 24 }}>
        {/* Map Placeholder */}
        <div className="glass-card" style={{ minHeight: 500, borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.5, zIndex: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#f97316' }}>map</span>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#251913', fontSize: 14, fontWeight: 600 }}>Interactive Map</p>
              <p style={{ color: '#584237', fontSize: 12 }}>Requires Google Maps API Key</p>
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.05), transparent 70%), linear-gradient(135deg, rgba(255,234,224,0.4), rgba(255,248,246,0.8))' }} />
          {/* Fake map pins */}
          {[{ top: '30%', left: '25%' }, { top: '50%', left: '55%' }, { top: '40%', left: '70%' }, { top: '65%', left: '35%' }].map((pos, i) => (
            <div key={i}
              style={{
                position: 'absolute', ...pos, width: 36, height: 36, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #f97316, #ffb690)', boxShadow: '0 4px 14px rgba(249,115,22,0.4)', zIndex: 20
              }}>
              <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 20, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>location_on</span>
            </div>
          ))}
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: 500, paddingRight: 4 }}>
          {filtered.map((place, i) => (
            <div key={place.id}
              onClick={() => setSelected(selected === place.id ? null : place.id)}
              className="glass-card"
              style={{
                padding: 20, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s ease',
                border: selected === place.id ? '2px solid rgba(249,115,22,0.5)' : '1px solid #e0c0b1',
                background: selected === place.id ? '#fff1eb' : '#ffffff',
              }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: 'rgba(249,115,22,0.1)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 24 }}>{categories.find(c => c.key === place.category)?.emoji || 'location_on'}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, color: '#251913', fontSize: 15 }}>{place.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#eab308', fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span style={{ fontSize: 12, color: '#584237', fontWeight: 600 }}>{place.rating}</span>
                        </div>
                        <span style={{ fontSize: 12, color: '#e0c0b1' }}>•</span>
                        <span style={{ fontSize: 12, color: '#584237' }}>{place.distance}</span>
                        <span style={{ fontSize: 12, color: '#e0c0b1' }}>•</span>
                        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Geist, monospace', color: place.open ? '#16a34a' : '#ba1a1a', textTransform: 'uppercase' }}>
                          {place.open ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                    <button style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(249,115,22,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 18 }}>directions</span>
                    </button>
                  </div>
                  <p style={{ fontSize: 13, color: '#584237', marginTop: 8 }}>{place.address}</p>
                  
                  
                    {selected === place.id && (
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(224,192,177,0.4)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#251913' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f97316' }}>call</span> {place.phone}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#251913' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f97316' }}>schedule</span> {place.hours}
                          </div>
                          <button style={{
                            marginTop: 8, width: '100%', padding: '10px 0', background: '#f97316', color: 'white',
                            border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                          }}>Get Directions</button>
                        </div>
                      </div>
                    )}
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
