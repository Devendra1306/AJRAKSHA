import { useState } from 'react'

export default function PestDetection() {
  const [uploadState, setUploadState] = useState('idle')

  const handleAnalyze = () => {
    setUploadState('analyzing')
    setTimeout(() => setUploadState('result'), 1800)
  }

  const detectedPests = [
    { name: 'Aphids (Myzus persicae)', confidence: 94, severity: 'Moderate', color: '#f97316', icon: 'pest_control' },
    { name: 'Whitefly (Bemisia tabaci)', confidence: 76, severity: 'Low', color: '#eab308', icon: 'pest_control_rodents' },
  ]

  return (
    <div style={{ padding: 32, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Vision AI</p>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em' }}>Pest Detection</h1>
        <p style={{ fontSize: 16, color: '#584237', marginTop: 8 }}>AI-powered pest identification using computer vision. Identify 200+ pest species in seconds.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Upload */}
        <div>
          
            {uploadState === 'idle' && (
              <div key="upload"
                className="glass-card"
                onClick={handleAnalyze}
                style={{
                  borderRadius: 24, padding: 64, border: '2px dashed rgba(249,115,22,0.2)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer',
                }}
              >
                <div style={{ width: 80, height: 80, background: '#ffeae0', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 40 }}>center_focus_strong</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#251913', marginBottom: 8 }}>Upload Pest Image</h3>
                <p style={{ fontSize: 14, color: '#584237', lineHeight: 1.6, maxWidth: 300, marginBottom: 28 }}>
                  Take a clear photo of the affected plant or the pest itself. Supports JPG, PNG, HEIC up to 25MB.
                </p>
                <button style={{
                  padding: '14px 36px', background: '#f97316', color: 'white',
                  border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(249,115,22,0.3)',
                }}>Identify Pest</button>
              </div>
            )}
            {uploadState === 'analyzing' && (
              <div key="analyzing"
                className="glass-card"
                style={{ borderRadius: 24, padding: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
              >
                <div style={{ width: 64, height: 64, border: '4px solid rgba(249,115,22,0.2)', borderTopColor: '#f97316', borderRadius: 999, marginBottom: 24, animation: 'spin 1s linear infinite' }} />
                <h3 style={{ color: '#f97316', fontWeight: 700, fontSize: 20 }}>Analyzing specimen...</h3>
                <p style={{ color: '#584237', marginTop: 8 }}>Matching against 50,000+ pest signatures</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {uploadState === 'result' && (
              <div key="result" className="glass-card" style={{ borderRadius: 24, overflow: 'hidden' }}>
                <div style={{ height: 220, background: 'linear-gradient(135deg, #fce3d9, #fff1eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 80, color: 'rgba(249,115,22,0.3)' }}>pest_control</span>
                  <div style={{ position: 'absolute', top: 16, right: 16 }}>
                    <span style={{ padding: '4px 12px', background: 'rgba(249,115,22,0.85)', color: 'white', borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: 'Geist, monospace' }}>94% Confidence</span>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  {detectedPests.map((pest, i) => (
                    <div key={pest.name} style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <h4 style={{ fontWeight: 700, color: '#251913', fontSize: 15 }}>{pest.name}</h4>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: `${pest.color}15`, color: pest.color, fontFamily: 'Geist, monospace', fontWeight: 700 }}>
                            {pest.severity} Severity
                          </span>
                        </div>
                        <span style={{ fontWeight: 700, color: pest.color, fontSize: 20 }}>{pest.confidence}%</span>
                      </div>
                      <div style={{ height: 6, background: '#fce3d9', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: pest.color, width: `${pest.confidence}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          
        </div>

        {/* Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {uploadState === 'result' ? (
            <div className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
              <h4 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>Treatment Protocol</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { step: '1', label: 'Biological Control', desc: 'Introduce natural predators – ladybirds, lacewings for aphid control.', icon: 'eco', color: '#16a34a' },
                  { step: '2', label: 'Neem Oil Spray', desc: 'Apply 2% neem oil solution at dusk. Repeat every 5-7 days.', icon: 'local_florist', color: '#f97316' },
                  { step: '3', label: 'Chemical Backup', desc: 'Imidacloprid 17.8% SL at 0.5 ml/L if infestation persists.', icon: 'science', color: '#006398' },
                ].map(s => (
                  <div key={s.step} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: '#fff1eb', borderRadius: 14, border: '1px solid rgba(224,192,177,0.4)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 18 }}>{s.icon}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#251913', fontSize: 14, marginBottom: 4 }}>{s.label}</p>
                      <p style={{ fontSize: 13, color: '#584237', lineHeight: 1.5 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
              <h4 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Common Farm Pests</h4>
              {['Aphids', 'Whitefly', 'Fall Armyworm', 'Thrips', 'Leaf Miner', 'Mealybugs'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(224,192,177,0.3)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 18 }}>pest_control</span>
                  <span style={{ fontSize: 14, color: '#251913' }}>{p}</span>
                  <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 16, marginLeft: 'auto' }}>chevron_right</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
