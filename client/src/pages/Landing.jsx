import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const features = [
  { icon: 'biotech', title: 'Precision AI Monitoring', desc: 'Utilize hyper-spectral satellite imagery and ground-level sensors to detect nutrient deficiencies, pests, and hydration levels before they impact yield.', large: true },
  { icon: 'thunderstorm', title: 'Weather Intelligence', desc: 'Hyper-local micro-climate forecasting integrated directly into your planting and harvest schedules.' },
  { icon: 'insights', title: 'Market Analytics', desc: 'Real-time global commodity tracking and predictive price modeling for maximum ROI on your harvest.' },
  { icon: 'smart_toy', title: 'Autonomous Coordination', desc: 'Sync your fleet of smart tractors, drones, and irrigation systems with a unified AI conductor for hands-free operational excellence.', large: true },
]

const stats = [
  { value: '50,000+', label: 'Farmers Helped' },
  { value: '94.7%', label: 'AI Accuracy' },
  { value: '18 States', label: 'India Coverage' },
  { value: '₹2.4Cr', label: 'Savings Generated' },
]

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Wheat Farmer, Punjab', text: 'Ajraksha detected blast disease in my wheat crop 10 days before it spread. Saved my entire harvest worth ₹4 lakhs.', rating: 5, avatar: 'R' },
  { name: 'Priya Sharma', role: 'Horticulture Officer, MP', text: 'The market intelligence feature is incredible. I advise 500 farmers now using real-time price predictions.', rating: 5, avatar: 'P' },
  { name: 'Mohammed Farouk', role: 'Organic Farmer, Karnataka', text: 'Soil analysis helped me switch to organic farming. My tomato yield increased by 40% in first season.', rating: 5, avatar: 'M' },
]

export default function Landing() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(prev => (prev + 1) % testimonials.length), 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 10, y: (e.clientY / window.innerHeight - 0.5) * 10 })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f6', overflowX: 'hidden' }}>
      {/* Top Navigation */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(249, 115, 22, 0.1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(249, 115, 22, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 24, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>agriculture</span>
            </div>
            <span style={{ fontFamily: 'Inter', fontSize: 22, fontWeight: 800, color: '#f97316', letterSpacing: '-0.02em' }}>Ajraksha</span>
          </div>

          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'AI Assistant', path: '/ai' },
              { label: 'Market', path: '/market' },
              { label: 'Schemes', path: '/schemes' }
            ].map((item, i) => (
              <Link key={item.label} to={item.path}
                style={{
                  fontSize: 15, fontWeight: i === 0 ? 700 : 400,
                  color: i === 0 ? '#f97316' : '#584237',
                  textDecoration: 'none',
                  borderBottom: i === 0 ? '2px solid #f97316' : '2px solid transparent',
                  paddingBottom: 2,
                  transition: 'color 0.2s',
                }}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#584237' }}>
              <span className="material-symbols-outlined">search</span>
            </button>
            <Link to="/auth">
              <button style={{
                background: '#f97316', color: 'white',
                padding: '10px 24px', borderRadius: 10,
                border: 'none', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)' }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        paddingTop: 120, paddingBottom: 64, position: 'relative', overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent)',
          top: '-10%', left: '-10%', borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent)',
          bottom: '0%', right: '-5%', borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div
          style={{ maxWidth: 800, textAlign: 'center', position: 'relative', zIndex: 10, padding: '0 32px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            background: 'rgba(249, 115, 22, 0.08)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            marginBottom: 24,
          }}>
            <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 16, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>auto_awesome</span>
            <span style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next-Gen Agricultural Intelligence</span>
          </div>

          <h1 style={{ fontSize: 56, fontWeight: 700, color: '#251913', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24 }}>
            AI-Powered{' '}
            <span style={{
              background: 'linear-gradient(90deg, #f97316, #ffb690)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Smart Agriculture
            </span>
            {' '}Platform
          </h1>

          <p style={{ fontSize: 18, color: '#584237', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Optimize your farm's performance with real-time predictive analytics, precision monitoring, and AI-driven insights tailored for large-scale agricultural enterprises.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <Link to="/dashboard">
              <button style={{
                background: '#f97316', color: 'white',
                padding: '16px 32px', borderRadius: 12,
                border: 'none', fontWeight: 700, fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(249,115,22,0.3)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(249,115,22,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(249,115,22,0.3)' }}
              >
                Explore Platform
              </button>
            </Link>
            <Link to="/ai">
              <button style={{
                background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(249,115,22,0.2)',
                color: '#251913', padding: '16px 32px', borderRadius: 12,
                fontWeight: 700, fontSize: 16, cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
              >
                Talk to AI
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, maxWidth: 600, margin: '0 auto' }}>
            {stats.map((stat, i) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f97316', letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#584237', fontFamily: 'Geist, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Stat Cards */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 64, width: '100%', maxWidth: 960, padding: '0 32px' }}
        >
          {[
            { label: 'Crop Health', value: '98%', trend: '+2.4%', icon: 'eco', progress: 98 },
            { label: 'Soil Score', value: 'Optimal', sub: 'Nitrogen: 85 mg/kg', icon: 'grass', moisture: 'Moist' },
            { label: 'Market Prices', value: 'Up 12%', sub: 'Predicted High: $15.42/bu', icon: 'trending_up', crop: 'Soybeans' },
          ].map((card, i) => (
            <div
              key={card.label}
              className="glass-card luminous-border"
              style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Geist, monospace', fontSize: 10, fontWeight: 600, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{card.label}</span>
                <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 20 }}>{card.icon}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#f97316', letterSpacing: '-0.03em' }}>{card.value}</span>
                {card.trend && <span style={{ fontFamily: 'Geist, monospace', fontSize: 12, color: '#f97316', marginBottom: 4 }}>{card.trend}</span>}
                {card.moisture && <span style={{ fontFamily: 'Geist, monospace', fontSize: 12, color: '#f97316', marginBottom: 4 }}>{card.moisture}</span>}
                {card.crop && <span style={{ fontFamily: 'Geist, monospace', fontSize: 12, color: '#f97316', marginBottom: 4 }}>{card.crop}</span>}
              </div>
              {card.progress && (
                <div style={{ background: '#ffeae0', height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
                  <div style={{ height: '100%', background: '#f97316', width: `${card.progress}%` }} />
                </div>
              )}
              {card.sub && <div style={{ fontSize: 13, color: '#584237', marginTop: 4 }}>{card.sub}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section style={{ padding: '80px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, textAlign: 'center', color: '#251913', letterSpacing: '-0.02em', marginBottom: 48 }}>
          Intelligent Core Capabilities
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          {/* Large - AI Monitoring */}
          <div


            className="glass-card luminous-border"
            style={{ gridColumn: '1 / 9', padding: 40, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 28 }}>biotech</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: '#251913', letterSpacing: '-0.01em', marginBottom: 16 }}>Precision AI Monitoring</h3>
              <p style={{ fontSize: 16, color: '#584237', lineHeight: 1.6, maxWidth: 480 }}>
                Utilize hyper-spectral satellite imagery and ground-level sensors to detect nutrient deficiencies, pests, and hydration levels before they impact yield.
              </p>
            </div>
            <div style={{ position: 'absolute', right: -24, bottom: -24, opacity: 0.05, pointerEvents: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 200, color: '#f97316' }}>monitoring</span>
            </div>
          </div>

          {/* Small - Weather */}
          <div


            className="glass-card luminous-border"
            style={{ gridColumn: '9 / 13', padding: 32, display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 28 }}>thunderstorm</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#251913', letterSpacing: '-0.01em', marginBottom: 12 }}>Weather Intelligence</h3>
            <p style={{ fontSize: 14, color: '#584237', lineHeight: 1.6 }}>
              Hyper-local micro-climate forecasting integrated directly into your planting and harvest schedules.
            </p>
          </div>

          {/* Small - Market */}
          <div


            className="glass-card luminous-border"
            style={{ gridColumn: '1 / 5', padding: 32, display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 28 }}>insights</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#251913', letterSpacing: '-0.01em', marginBottom: 12 }}>Market Analytics</h3>
            <p style={{ fontSize: 14, color: '#584237', lineHeight: 1.6 }}>
              Real-time global commodity tracking and predictive price modeling for maximum ROI on your harvest.
            </p>
          </div>

          {/* Large - Automation */}
          <div


            className="glass-card luminous-border"
            style={{ gridColumn: '5 / 13', padding: 40, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 28 }}>smart_toy</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: '#251913', letterSpacing: '-0.01em', marginBottom: 16 }}>Autonomous Coordination</h3>
              <p style={{ fontSize: 16, color: '#584237', lineHeight: 1.6, maxWidth: 480 }}>
                Sync your fleet of smart tractors, drones, and irrigation systems with a unified AI conductor for hands-free operational excellence.
              </p>
            </div>
            <div style={{ position: 'absolute', right: -24, bottom: -24, opacity: 0.05, pointerEvents: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 200, color: '#f97316' }}>settings_suggest</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 32px', background: 'rgba(255, 241, 235, 0.3)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, textAlign: 'center', color: '#251913', letterSpacing: '-0.02em', marginBottom: 64 }}>
            Seamless Integration Flow
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {[
              { step: '1', title: 'Deploy Sensors', desc: 'Quickly connect your IoT hardware and satellite feeds to the Ajraksha cloud platform.' },
              { step: '2', title: 'Analyze Data', desc: 'Our proprietary ML models process millions of data points to create a digital twin of your farm.' },
              { step: '3', title: 'Execute Strategy', desc: 'Receive actionable daily commands via the dashboard or automate them directly via hardware integration.' },
            ].map((item, i) => (
              <div
                key={item.step}


                style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 999,
                    border: '2px solid #f97316', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 16, color: '#f97316',
                    background: '#ffffff', flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}>
                    {item.step}
                  </div>
                  {i < 2 && <div style={{ width: 2, height: 48, background: 'linear-gradient(to bottom, #f97316, transparent)', marginTop: 8 }} />}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 600, color: '#251913', letterSpacing: '-0.01em', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 15, color: '#584237', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Mockup */}
      <section style={{ padding: '80px 32px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div className="glass-card luminous-border" style={{ borderRadius: 24, padding: 16, border: '1px solid rgba(249,115,22,0.15)', position: 'relative' }}>
            {/* Floating AI chip */}
            <div style={{
              position: 'absolute', top: -20, right: 48,
              background: '#f97316', color: 'white',
              padding: '10px 20px', borderRadius: 999,
              fontWeight: 700, fontSize: 13, zIndex: 20,
              boxShadow: '0 8px 25px rgba(249,115,22,0.4)',
              display: 'flex', alignItems: 'center', gap: 8,
              transform: 'rotate(2deg)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bolt</span>
              AI Recommendation: Increase Irrigation in Sector 7
            </div>

            <div style={{ background: '#ffffff', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(249,115,22,0.1)', boxShadow: '0 24px 48px rgba(0,0,0,0.08)' }}>
              {/* Fake chrome bar */}
              <div style={{ height: 56, borderBottom: '1px solid rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', background: '#fff1eb' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 999, background: '#f87171' }} />
                  <div style={{ width: 12, height: 12, borderRadius: 999, background: '#fbbf24' }} />
                  <div style={{ width: 12, height: 12, borderRadius: 999, background: '#4ade80' }} />
                </div>
                <div style={{ background: 'rgba(249,115,22,0.08)', padding: '4px 16px', borderRadius: 4, fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Central Command v4.2
                </div>
                <div />
              </div>

              {/* Fake dashboard content */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 16, padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ height: 96, background: '#ffeae0', borderRadius: 12 }} />
                  <div style={{ height: 192, background: '#ffeae0', borderRadius: 12 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{
                    height: 320, borderRadius: 20,
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(255,219,202,0.4))',
                    border: '1px solid rgba(249,115,22,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 12,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'rgba(249,115,22,0.25)', animation: 'bounce 2s infinite' }}>satellite_alt</span>
                    <p style={{ fontFamily: 'Geist, monospace', fontSize: 11, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.07em' }}>LIVE SAT-FEED 04</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ height: 160, background: '#ffeae0', borderRadius: 12 }} />
                  <div style={{ height: 128, background: '#ffeae0', borderRadius: 12 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, textAlign: 'center', color: '#251913', letterSpacing: '-0.02em', marginBottom: 48 }}>
            Trusted by 50,000+ Farmers
          </h2>

          <div style={{ position: 'relative', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
              <div
                key={activeTestimonial}
                className="glass-card"
                style={{ padding: 48, textAlign: 'center', width: '100%', position: 'absolute' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 24 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 22, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>star</span>
                  ))}
                </div>
                <p style={{ fontSize: 18, color: '#584237', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 32 }}>
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 999,
                    background: 'linear-gradient(135deg, #f97316, #ffb690)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 20,
                  }}>
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#251913' }}>{testimonials[activeTestimonial].name}</div>
                    <div style={{ fontSize: 12, color: '#584237', fontFamily: 'Geist, monospace', marginTop: 2 }}>{testimonials[activeTestimonial].role}</div>
                  </div>
                </div>
              </div>
            
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 300 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                height: 8, borderRadius: 999, border: 'none', cursor: 'pointer',
                width: i === activeTestimonial ? 28 : 8,
                background: i === activeTestimonial ? '#f97316' : 'rgba(249,115,22,0.2)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px' }}>
        <div


          className="glass-card luminous-border"
          style={{
            maxWidth: 900, margin: '0 auto', padding: 80, textAlign: 'center',
            position: 'relative', overflow: 'hidden', borderRadius: 24,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.07), transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em', marginBottom: 16, position: 'relative', zIndex: 1 }}>
            Start farming smarter <span style={{ color: '#f97316' }}>today</span>
          </h2>
          <p style={{ fontSize: 18, color: '#584237', marginBottom: 40, position: 'relative', zIndex: 1 }}>
            Join 50,000+ farmers already using Ajraksha. Free to start.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link to="/auth">
              <button style={{
                background: '#f97316', color: 'white', padding: '16px 40px', borderRadius: 12,
                border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(249,115,22,0.35)', transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                Create Free Account
              </button>
            </Link>
            <Link to="/dashboard">
              <button style={{
                background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(249,115,22,0.2)', color: '#251913',
                padding: '16px 40px', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'}
              >
                View Demo Dashboard
              </button>
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#8c7164', marginTop: 24, fontFamily: 'Geist, monospace', position: 'relative', zIndex: 1 }}>
            No credit card required · Free forever for small farms
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#fff1eb', borderTop: '1px solid rgba(249,115,22,0.1)', padding: '64px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, background: 'rgba(249,115,22,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 20 }}>agriculture</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#f97316', letterSpacing: '-0.01em' }}>Ajraksha</span>
            </div>
            <p style={{ fontSize: 14, color: '#584237', lineHeight: 1.7, maxWidth: 300 }}>
              Empowering Intelligent Vitality through advanced agricultural science and digital orchestration.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              {['Product', 'Resources'].map(link => (
                <a key={link} href="#" style={{ fontSize: 14, color: '#584237', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f97316'; e.currentTarget.style.borderBottomColor = '#f97316' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#584237'; e.currentTarget.style.borderBottomColor = 'transparent' }}
                >{link}</a>
              ))}
            </div>
          </div>
          {[
            { title: 'Contact Us', items: ['info@ajraksha.ai', '+1 (555) AGRI-TECH'] },
            { title: 'Legal', items: ['Privacy Policy', 'Terms of Service'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>{col.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(item => (
                  <a key={item} href="#" style={{ fontSize: 14, color: '#584237', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                    onMouseLeave={e => e.currentTarget.style.color = '#584237'}
                  >{item}</a>
                ))}
              </div>
            </div>
          ))}
          <div>
            <h4 style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Newsletter</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="Email address" style={{
                flex: 1, padding: '10px 14px', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8,
                background: '#ffffff', fontSize: 13, color: '#251913', outline: 'none',
              }} />
              <button style={{
                background: '#f97316', color: 'white', border: 'none',
                borderRadius: 8, padding: '10px 14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', borderTop: '1px solid rgba(249,115,22,0.1)', marginTop: 48, paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#584237' }}>© 2024 Ajraksha AI. Empowering Intelligent Vitality.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['public', 'linked_camera', 'terminal'].map(icon => (
              <span key={icon} className="material-symbols-outlined" style={{ color: '#584237', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                onMouseLeave={e => e.currentTarget.style.color = '#584237'}
              >{icon}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
