import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [mode, setMode] = useState('login') // login | register
  const { login, register } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [location, setLocation] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await register({ name, email, password, location })
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#fff8f6',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent)', top: '-10%', right: '-10%', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent)', bottom: '-5%', left: '-5%', borderRadius: '50%', pointerEvents: 'none' }} />

      <div
        style={{ width: '100%', maxWidth: 480, padding: '0 24px', position: 'relative', zIndex: 10 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 28, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>agriculture</span>
              </div>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#f97316', letterSpacing: '-0.02em' }}>Ajraksha</span>
            </div>
          </Link>
          <p style={{ fontSize: 14, color: '#584237', fontFamily: 'Geist, monospace', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Smart Farming Made Simple</p>
        </div>

        <div className="glass-card" style={{ borderRadius: 24, padding: 40 }}>
          {/* Tab Toggle */}
          <div style={{ display: 'flex', background: '#ffeae0', borderRadius: 12, padding: 4, marginBottom: 32 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '10px 0', borderRadius: 10,
                border: 'none', cursor: 'pointer',
                background: mode === m ? '#f97316' : 'transparent',
                color: mode === m ? '#ffffff' : '#584237',
                fontWeight: 700, fontSize: 14,
                transition: 'all 0.3s ease',
                textTransform: 'capitalize',
              }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          
            <form
              key={mode}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: 8, color: '#dc2626', fontSize: 13, fontWeight: 500 }}>
                  {error}
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251913', marginBottom: 6 }}>Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aaryan Sharma" className="input-field" required />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251913', marginBottom: 6 }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251913', marginBottom: 6 }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field" required />
              </div>
              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251913', marginBottom: 6 }}>Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Punjab, India" className="input-field" />
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '16px 0',
                background: loading ? '#fdba74' : '#f97316', color: 'white',
                border: 'none', borderRadius: 12,
                fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
                transition: 'all 0.2s ease',
                marginTop: 8,
              }}
                onMouseEnter={e => !loading && (e.currentTarget.style.filter = 'brightness(1.1)')}
                onMouseLeave={e => !loading && (e.currentTarget.style.filter = 'brightness(1)')}
              >
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In to Dashboard' : 'Create Account')}
              </button>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#584237' }}>
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{
                  color: '#f97316', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13,
                }}>
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </form>
          
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#8c7164', marginTop: 20, fontFamily: 'Geist, monospace' }}>
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}
