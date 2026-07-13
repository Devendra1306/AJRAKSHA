import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_META = {
  weather:     { emoji: '🌧', label: 'Weather Alert',       color: '#3b82f6' },
  market:      { emoji: '📈', label: 'Market Update',       color: '#10b981' },
  disease:     { emoji: '🌿', label: 'Crop Disease',        color: '#ef4444' },
  irrigation:  { emoji: '💧', label: 'Irrigation',          color: '#06b6d4' },
  government:  { emoji: '🏛', label: 'Govt Scheme',         color: '#8b5cf6' },
  pest:        { emoji: '🐛', label: 'Pest Warning',        color: '#f59e0b' },
  fertilizer:  { emoji: '🌱', label: 'Fertilizer',         color: '#84cc16' },
  diary:       { emoji: '📒', label: 'Farm Diary',          color: '#f97316' },
  ai_report:   { emoji: '🤖', label: 'AI Report',           color: '#6366f1' },
  general:     { emoji: '🌾', label: 'AJRAKSHA',            color: '#f97316' },
};

// ── Single Toast ─────────────────────────────────────────────────────────────
function NotificationToast({ notification, onDismiss }) {
  const navigate = useNavigate();
  const { title, body, category, clickAction, timestamp } = notification;
  const meta = CATEGORY_META[category] || CATEGORY_META.general;
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Entrance animation
    requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 6 seconds
    const timer = setTimeout(() => handleDismiss(), 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 350);
  };

  const handleClick = () => {
    navigate(clickAction || '/dashboard');
    handleDismiss();
  };

  const timeStr = timestamp
    ? new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(
        new Date(timestamp)
      )
    : '';

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        display: 'flex',
        gap: 12,
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(249,115,22,0.15)',
        borderLeft: `4px solid ${meta.color}`,
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(249,115,22,0.08)',
        cursor: 'pointer',
        maxWidth: 360,
        width: '100%',
        userSelect: 'none',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        opacity: visible && !exiting ? 1 : 0,
        transform: visible && !exiting ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
      }}
    >
      {/* Emoji icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: `${meta.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        {meta.emoji}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: meta.color,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {meta.label}
          </span>
          <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap' }}>{timeStr}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>
          {title}
        </p>
        {body && (
          <p style={{
            margin: '3px 0 0', fontSize: 12, color: '#6b7280', lineHeight: 1.4,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {body}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#d1d5db', fontSize: 16, lineHeight: 1, padding: 2,
          borderRadius: 4, transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.target.style.color = '#6b7280')}
        onMouseLeave={(e) => (e.target.style.color = '#d1d5db')}
      >
        ✕
      </button>
    </div>
  );
}

// ── Toast Container ───────────────────────────────────────────────────────────
export default function NotificationToaster({ notifications, onDismiss }) {
  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {notifications.slice(0, 5).map((n) => (
        <div key={n.id} style={{ pointerEvents: 'all' }}>
          <NotificationToast notification={n} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
