import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from '../components/NotificationBell'
import NotificationToaster from '../components/NotificationToaster'
import { useNotifications } from '../hooks/useNotifications'

const navItems = [
  { path: '/dashboard', icon: 'home', label: 'Home' },
  { path: '/crop-doctor', icon: 'medical_services', label: 'Crop Doctor' },
  { path: '/soil-analysis', icon: 'grass', label: 'Soil' },
  { path: '/weather', icon: 'cloudy_snowing', label: 'Weather' },
  { path: '/market', icon: 'trending_up', label: 'Market' },
  { path: '/farm-diary', icon: 'menu_book', label: 'Diary' },
  { path: '/ai', icon: 'smart_toy', label: 'Assistant' },
]

const topNavLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/ai', label: 'AI Assistant' },
  { path: '/market', label: 'Market' },
  { path: '/schemes', label: 'Schemes' },
]

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { notifications, clearNotification } = useNotifications()

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff8f6' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #ffeae0', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: '#fff8f6' }}>
      {/* Top Navigation Bar */}
      <header
        className="top-navbar"
        style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 50,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(249, 115, 22, 0.1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 32px', maxWidth: '100%' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Hamburger for mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#584237' }}
              className="md-hide"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(249, 115, 22, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 24 }}>agriculture</span>
            </div>
            <span style={{ fontFamily: 'Inter', fontSize: 22, fontWeight: 800, color: '#f97316', letterSpacing: '-0.02em' }}>Ajraksha</span>
          </div>

          {/* Top nav links (desktop) */}
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {topNavLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: 15, fontWeight: isActive(link.path) ? 700 : 400,
                  color: isActive(link.path) ? '#f97316' : '#584237',
                  textDecoration: 'none',
                  borderBottom: isActive(link.path) ? '2px solid #f97316' : '2px solid transparent',
                  paddingBottom: 2,
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#584237' }}>
              <span className="material-symbols-outlined">search</span>
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f97316', fontSize: 32 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside style={{
        position: 'fixed', left: 0, top: 0,
        height: '100%', width: 256, zIndex: 40,
        background: '#ffffff',
        borderRight: '1px solid #e0c0b1',
        display: 'flex', flexDirection: 'column',
        padding: 16, gap: 8,
        paddingTop: 80,
      }}>
        {/* Brand in sidebar */}
        <div style={{ marginBottom: 24, paddingLeft: 8 }}>
          <h1 style={{ fontFamily: 'Inter', fontSize: 24, fontWeight: 700, color: '#f97316', letterSpacing: '-0.01em' }}>Ajraksha</h1>
          <p style={{ fontFamily: 'Geist, monospace', fontSize: 10, fontWeight: 500, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, marginTop: 2 }}>Smart Farming</p>
        </div>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 12,
                textDecoration: 'none',
                fontFamily: 'Geist, monospace', fontSize: 13, fontWeight: 500,
                transition: 'all 0.2s ease',
                background: isActive(item.path) ? '#f97316' : 'transparent',
                color: isActive(item.path) ? '#ffffff' : '#584237',
                fontWeight: isActive(item.path) ? 700 : 500,
              }}
              onMouseEnter={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(249, 115, 22, 0.08)'
                  e.currentTarget.style.color = '#f97316'
                }
              }}
              onMouseLeave={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#584237'
                }
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 22, ...(isActive(item.path) ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : {}) }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Pro Status Card */}
        <div style={{
          marginTop: 'auto',
          background: 'rgba(249, 115, 22, 0.06)',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          borderRadius: 16, padding: 16,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: 'rgba(249, 115, 22, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(249, 115, 22, 0.2)',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 20 }}>auto_awesome</span>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', fontFamily: 'Geist, monospace' }}>Pro Status</p>
              <p style={{ fontSize: 9, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 1, fontFamily: 'Geist, monospace' }}>Premium Features</p>
            </div>
          </div>
          <button style={{
            width: '100%', padding: '8px 0',
            background: '#f97316', color: 'white',
            border: 'none', borderRadius: 8,
            fontWeight: 700, fontSize: 12,
            cursor: 'pointer', fontFamily: 'Geist, monospace',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Upgrade to Pro
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 256, minHeight: '100vh', paddingTop: 65, display: 'flex', flexDirection: 'column' }}>
        {/* Inner App Bar */}
        <div style={{
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #e0c0b1',
          position: 'sticky', top: 65, zIndex: 30,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
            <span className="material-symbols-outlined" style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#584237', fontSize: 18,
            }}>search</span>
            <input
              type="text"
              placeholder="Search farm insights..."
              style={{
                width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 9, paddingBottom: 9,
                border: 'none', borderRadius: 999,
                background: '#ffeae0',
                fontSize: 13, color: '#251913',
                outline: 'none', fontFamily: 'Inter',
              }}
            />
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Notification Bell */}
            <NotificationBell />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#251913' }}>{user.name}</p>
                <p style={{ fontSize: 10, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{user.role === 'admin' ? 'Administrator' : 'Farmer'}</p>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 999,
                border: '2px solid rgba(249, 115, 22, 0.2)',
                background: 'rgba(249, 115, 22, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#f97316' }}>person</span>
              </div>
              <button 
                onClick={logout}
                title="Sign Out"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#ba1a1a', marginLeft: 8,
                  width: 36, height: 36, borderRadius: 999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(186, 26, 26, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        
          <div
            key={location.pathname}
            style={{ flex: 1 }}
          >
            <Outlet />
          </div>
        

        {/* Footer */}
        <footer style={{ padding: '48px 32px', background: '#ffffff', borderTop: '1px solid #e0c0b1', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#584237' }}>© 2024 Ajraksha AI. Empowering Intelligent Vitality.</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {['share', 'mail'].map(icon => (
                <button key={icon} style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: '#f8f9fa', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#584237', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)'; e.currentTarget.style.color = '#f97316' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.color = '#584237' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 50,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #e0c0b1',
        display: 'flex', justifyContent: 'space-around',
        padding: '12px 0',
      }} className="md:hidden">
        {navItems.slice(0, 4).map(item => (
          <Link key={item.path} to={item.path} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            textDecoration: 'none',
            color: isActive(item.path) ? '#f97316' : '#94a3b8',
            fontSize: 10, fontWeight: isActive(item.path) ? 700 : 400,
          }}>
            <span className="material-symbols-outlined"
              style={{ fontSize: 22, ...(isActive(item.path) ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : {}) }}
            >{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* FAB Button */}
      <button style={{
        position: 'fixed', bottom: 32, right: 32,
        width: 56, height: 56, borderRadius: 999,
        background: '#f97316', color: 'white',
        border: 'none', cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 40, transition: 'transform 0.2s ease',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => navigate('/ai')}
        title="Talk to AI"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>smart_toy</span>
      </button>

      {/* Foreground notification toasts */}
      <NotificationToaster notifications={notifications} onDismiss={clearNotification} />
    </div>
  )
}
