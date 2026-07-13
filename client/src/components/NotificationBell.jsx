import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

const CATEGORY_META = {
  weather:    { emoji: '🌧', label: 'Weather',    color: '#3b82f6', route: '/weather' },
  market:     { emoji: '📈', label: 'Market',     color: '#10b981', route: '/market' },
  disease:    { emoji: '🌿', label: 'Crop',       color: '#ef4444', route: '/crop-doctor' },
  irrigation: { emoji: '💧', label: 'Irrigation', color: '#06b6d4', route: '/irrigation' },
  government: { emoji: '🏛', label: 'Scheme',     color: '#8b5cf6', route: '/schemes' },
  pest:       { emoji: '🐛', label: 'Pest',       color: '#f59e0b', route: '/pest-detection' },
  fertilizer: { emoji: '🌱', label: 'Fertilizer', color: '#84cc16', route: '/fertilizer' },
  diary:      { emoji: '📒', label: 'Diary',      color: '#f97316', route: '/farm-diary' },
  ai_report:  { emoji: '🤖', label: 'AI',         color: '#6366f1', route: '/ai' },
  general:    { emoji: '🌾', label: 'Update',     color: '#f97316', route: '/dashboard' },
};

export default function NotificationBell() {
  const navigate = useNavigate();
  const { permission, notifications, unreadCount, requestPermission, markRead, clearNotification, clearAll } =
    useNotifications();
  const [open, setOpen] = useState(false);

  const handleBellClick = async () => {
    if (permission === 'default') {
      await requestPermission();
    }
    setOpen((v) => !v);
  };

  const handleNotifClick = (notif) => {
    markRead(notif.id);
    navigate(notif.clickAction || '/dashboard');
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={handleBellClick}
        title={permission === 'denied' ? 'Notifications blocked' : 'Notifications'}
        style={{
          position: 'relative', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
          color: unreadCount > 0 ? '#f97316' : '#94a3b8',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
          {permission === 'denied' ? 'notifications_off' : 'notifications'}
        </span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#ef4444', color: '#fff', borderRadius: 99,
            fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', border: '2px solid #fff',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 998 }}
          />

          <div style={{
            position: 'absolute', top: 48, right: 0, zIndex: 999,
            width: 360, maxHeight: 480, overflowY: 'auto',
            background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(249,115,22,0.12)', borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderBottom: '1px solid rgba(249,115,22,0.08)',
              position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)', borderRadius: '16px 16px 0 0',
            }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{
                    marginLeft: 8, background: '#f97316', color: '#fff',
                    fontSize: 10, fontWeight: 700, borderRadius: 99, padding: '1px 6px',
                  }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 11, color: '#f97316', fontWeight: 600,
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Permission denied state */}
            {permission === 'denied' && (
              <div style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#d1d5db', display: 'block', marginBottom: 8 }}>
                  notifications_off
                </span>
                <p style={{ margin: 0, fontSize: 13 }}>Notifications blocked in browser settings.</p>
              </div>
            )}

            {/* Empty state */}
            {permission !== 'denied' && notifications.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#d1d5db', display: 'block', marginBottom: 8 }}>
                  inbox
                </span>
                <p style={{ margin: 0, fontSize: 13 }}>You're all caught up!</p>
              </div>
            )}

            {/* Notification list */}
            {notifications.map((n) => {
              const meta = CATEGORY_META[n.category] || CATEGORY_META.general;
              return (
                <div
                  key={n.id}
                  onClick={() => handleNotifClick(n)}
                  style={{
                    display: 'flex', gap: 12, padding: '12px 16px',
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                    cursor: 'pointer', background: n.read ? 'transparent' : 'rgba(249,115,22,0.03)',
                    transition: 'background 0.15s',
                    alignItems: 'flex-start',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(249,115,22,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(249,115,22,0.03)')}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: `${meta.color}18`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 18,
                  }}>
                    {meta.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: n.read ? 500 : 700, color: '#1a1a1a' }}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>
                        {n.body}
                      </p>
                    )}
                    <p style={{ margin: '4px 0 0', fontSize: 10, color: '#9ca3af' }}>
                      {n.timestamp
                        ? new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(
                            new Date(n.timestamp)
                          )
                        : ''}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); clearNotification(n.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: 14, padding: 2 }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
