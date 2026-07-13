import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

let messaging = null;

/**
 * Lazily initialize FCM messaging (requires browser + service worker support)
 */
const getMessagingInstance = () => {
  if (!messaging && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
  return messaging;
};

/**
 * Register the firebase-messaging service worker
 */
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    });
    return registration;
  } catch (err) {
    console.error('Service Worker registration failed:', err);
    return null;
  }
};

/**
 * Request notification permission, generate FCM token, register on backend
 * Returns: { token, permission }
 */
export const requestPermissionAndGetToken = async () => {
  if (typeof window === 'undefined') return { token: null, permission: 'denied' };

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission denied');
    return { token: null, permission };
  }

  const msg = getMessagingInstance();
  if (!msg) return { token: null, permission };

  try {
    const swRegistration = await registerServiceWorker();
    const token = await getToken(msg, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      await registerTokenOnBackend(token);
    }

    return { token, permission };
  } catch (err) {
    console.error('FCM token error:', err);
    return { token: null, permission, error: err.message };
  }
};

/**
 * Send FCM token to backend for storage
 */
export const registerTokenOnBackend = async (token) => {
  const storedToken = localStorage.getItem('ajraksha_token');
  if (!storedToken) return; // Not logged in, skip

  try {
    const res = await fetch('/api/notifications/register-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({ token, platform: 'web' }),
    });
    if (!res.ok) throw new Error(`Backend registration failed: ${res.status}`);
    localStorage.setItem('ajraksha_fcm_token', token);
  } catch (err) {
    console.warn('Token backend registration error:', err.message);
  }
};

/**
 * Listen for foreground messages
 * Returns an unsubscribe function
 */
export const listenForeground = (callback) => {
  const msg = getMessagingInstance();
  if (!msg) return () => {};
  return onMessage(msg, (payload) => {
    callback(payload);
  });
};

export { getMessagingInstance };
