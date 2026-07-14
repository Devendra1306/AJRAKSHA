import { useState, useRef } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const recentDiagnosis = [
  { name: 'Tomato Late Blight', date: 'May 14, 2024', conf: '98%', img: null },
  { name: 'Maize Leaf Blight', date: 'May 10, 2024', conf: '92%', img: null },
  { name: 'Healthy Sample', date: 'May 02, 2024', conf: '100%', img: null },
]

export default function CropDoctor() {
  const [uploadState, setUploadState] = useState('idle') // idle | analyzing | result | error
  const [resultData, setResultData] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef(null)

  const processFile = async (file) => {
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target.result);
    reader.readAsDataURL(file);

    setUploadState('analyzing');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/crop/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const data = await response.json();
      setResultData(data);
      setUploadState('result');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during analysis');
      setUploadState('error');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div style={{ padding: 32, paddingBottom: 80 }}>
      {/* Header */}
      <header style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em', marginBottom: 12 }}>
          Crop Health Intelligence
        </h1>
        <p style={{ fontSize: 17, color: '#584237', lineHeight: 1.7, maxWidth: 640 }}>
          Identify plant diseases instantly with 99.4% accuracy using our deep-learning diagnostic engine. Professional clinical reports generated in seconds.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Upload / Result Section */}
        <section>
          <input 
            type="file" 
            ref={fileRef} 
            onChange={handleFileChange} 
            onClick={(e) => e.stopPropagation()}
            accept="image/jpeg, image/png, image/heic" 
            style={{ display: 'none' }} 
          />
          
            {uploadState === 'idle' && (
              <div
                key="upload"
                className="glass-card"
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  borderRadius: 24, padding: 64, minHeight: 400,
                  border: '2px dashed rgba(249,115,22,0.2)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease',
                }}
              >
                <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 24 }}>
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(249,115,22,0.1)',
                    borderRadius: 999, filter: 'blur(16px)',
                  }} />
                  <div style={{
                    position: 'relative', width: '100%', height: '100%',
                    background: '#ffeae0', borderRadius: 999,
                    border: '1px solid rgba(249,115,22,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 48 }}>add_a_photo</span>
                  </div>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: '#251913', marginBottom: 8 }}>Upload Leaf Specimen</h3>
                <p style={{ fontSize: 15, color: '#584237', lineHeight: 1.6, maxWidth: 360, marginBottom: 32 }}>
                  Drag and drop high-resolution clinical photos of affected leaves. Supporting .jpg, .png, .heic (Max 25MB)
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    fileRef.current?.click();
                  }}
                  style={{
                    padding: '14px 40px', background: '#f97316', color: 'white',
                    border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(249,115,22,0.3)', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  Analyze Specimen
                </button>
              </div>
            )}

            {uploadState === 'analyzing' && (
              <div
                key="analyzing"
                className="glass-card"
                style={{
                  borderRadius: 24, padding: 64, minHeight: 400,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: 64, height: 64,
                  border: '4px solid rgba(249,115,22,0.2)',
                  borderTopColor: '#f97316',
                  borderRadius: 999, marginBottom: 24,
                  animation: 'spin 1s linear infinite',
                }} />
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f97316', marginBottom: 8 }}>Sequencing Patterns...</h3>
                <p style={{ fontSize: 15, color: '#584237' }}>Matching pathology against global database</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {uploadState === 'error' && (
              <div
                key="error"
                className="glass-card"
                style={{
                  borderRadius: 24, padding: 64, minHeight: 400,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#ef4444', marginBottom: 24 }}>error</span>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#251913', marginBottom: 8 }}>Analysis Failed</h3>
                <p style={{ fontSize: 15, color: '#584237', marginBottom: 32 }}>{errorMsg}</p>
                <button onClick={() => setUploadState('idle')} style={{
                  padding: '14px 40px', background: '#f97316', color: 'white',
                  border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}>Try Again</button>
              </div>
            )}

            {uploadState === 'result' && resultData && (
              <div
                key="result"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}
              >
                {/* Image */}
                <div className="glass-card" style={{ borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '1/1', position: 'relative', background: 'linear-gradient(135deg, #fce3d9, #fff1eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: selectedImage ? `url(${selectedImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {!selectedImage && <span className="material-symbols-outlined" style={{ fontSize: 80, color: 'rgba(249,115,22,0.3)' }}>local_florist</span>}
                    <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
                      <span style={{ padding: '4px 10px', background: '#f97316', color: 'white', borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: 'Geist, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Analysis Complete</span>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#251913', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: 6, display: 'inline-block', marginTop: 8 }}>Sample: #2849</h2>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="glass-card" style={{ borderRadius: 24, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                      <h3 style={{ fontSize: 26, fontWeight: 700, color: '#251913', marginBottom: 4 }}>{resultData.disease}</h3>
                      <p style={{ fontSize: 13, color: '#f97316', fontFamily: 'Geist, monospace', fontStyle: 'italic' }}>Severity: {resultData.severity} | Crop: {resultData.crop}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 36, fontWeight: 700, color: '#f97316' }}>{resultData.confidence}%</div>
                      <p style={{ fontSize: 10, color: '#584237', fontFamily: 'Geist, monospace', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Confidence Score</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 10, background: '#fce3d9', borderRadius: 5, overflow: 'hidden', marginBottom: 24 }}>
                    <div
                      style={{ height: '100%', background: '#f97316', borderRadius: 5, width: `${resultData.confidence}%` }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <h4 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span> Clinical Symptoms
                      </h4>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {resultData.symptoms?.map((s, i) => (
                          <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#584237' }}>
                            <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 18, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24", flexShrink: 0, marginTop: 1 }}>check_circle</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#565e74', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>recommend</span> Treatment Protocol
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ padding: 12, background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 10 }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: '#f97316', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organic Solution</p>
                          <p style={{ fontSize: 12, color: '#251913', lineHeight: 1.5 }}>{resultData.organicSolution || 'N/A'}</p>
                        </div>
                        <div style={{ padding: 12, background: 'rgba(86,94,116,0.06)', border: '1px solid rgba(86,94,116,0.15)', borderRadius: 10 }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: '#565e74', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chemical Solution</p>
                          <p style={{ fontSize: 12, color: '#251913', lineHeight: 1.5 }}>{resultData.chemicalSolution || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 20, borderTop: '1px solid #e0c0b1', paddingTop: 20 }}>
                    <button onClick={() => { setUploadState('idle'); setSelectedImage(null); setResultData(null); }} style={{
                      flex: 1, padding: '14px 0', background: '#f97316', color: 'white',
                      border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(249,115,22,0.3)', transition: 'all 0.2s ease',
                    }}>Scan Another Specimen</button>
                    <button className="btn-outline" style={{ padding: '14px 16px', borderRadius: 12 }}>
                      <span className="material-symbols-outlined">share</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          
        </section>

        {/* History Sidebar */}
        <section>
          <div className="glass-card" style={{ borderRadius: 24, padding: 24, maxHeight: 500, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h4 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Recent Diagnosis</h4>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#584237', cursor: 'pointer' }}>more_vert</span>
            </div>

            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {recentDiagnosis.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12,
                  border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ffeae0'; e.currentTarget.style.borderColor = '#e0c0b1' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, #fce3d9, #fff1eb)',
                    border: '1px solid #e0c0b1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ color: 'rgba(249,115,22,0.5)', fontSize: 28 }}>local_florist</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontWeight: 700, color: '#251913', fontSize: 14 }}>{item.name}</h5>
                    <p style={{ fontSize: 12, color: '#584237', marginTop: 2 }}>{item.date} • {item.conf} Conf.</p>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 18, opacity: 0 }} className="chevron">chevron_right</span>
                </div>
              ))}
            </div>

            <button style={{
              marginTop: 16, width: '100%', padding: '12px 0',
              color: '#f97316', fontWeight: 700, fontSize: 12,
              background: 'transparent', border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: 10, cursor: 'pointer', fontFamily: 'Geist, monospace', textTransform: 'uppercase', letterSpacing: '0.06em',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              View All Records
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
