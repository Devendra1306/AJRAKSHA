// Firebase Messaging Service Worker
// This file must be at the PUBLIC root: /public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAorQzRRYplNRojcyNd9c8yoa9eFKt_TY8',
  authDomain: 'ajraksha-bedcb.firebaseapp.com',
  projectId: 'ajraksha-bedcb',
  storageBucket: 'ajraksha-bedcb.firebasestorage.app',
  messagingSenderId: '1077651081174',
  appId: '1:1077651081174:web:ace50532960ef0a56c4677',
});

const messaging = firebase.messaging();

// ── Category → Route mapping ─────────────────────────────────────────────
const ROUTE_MAP = {
  weather: '/weather',
  market: '/market',
  disease: '/crop-doctor',
  irrigation: '/irrigation',
  government: '/schemes',
  pest: '/pest-detection',
  fertilizer: '/fertilizer',
  diary: '/farm-diary',
  ai_report: '/ai',
  general: '/dashboard',
};

const getRoute = (data) => {
  if (data?.clickAction) return data.clickAction;
  return ROUTE_MAP[data?.category] || '/dashboard';
};

// ── Background message handler ────────────────────────────────────────────
messaging.onBackgroundMessage((payload) => {
  const { notification = {}, data = {} } = payload;

  const title = notification.title || '🌾 AJRAKSHA';
  const body = notification.body || 'You have a new notification.';
  const icon = notification.icon || '/icons/icon-192x192.png';
  const badge = '/icons/badge-72x72.png';
  const route = getRoute(data);

  self.registration.showNotification(title, {
    body,
    icon,
    badge,
    image: notification.image,
    tag: data.category || 'ajraksha',
    requireInteraction: true,
    data: { route, ...data },
    actions: [
      { action: 'open', title: '👁 View' },
      { action: 'dismiss', title: '✕ Dismiss' },
    ],
  });
});

// ── Notification click handler ─────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const route = event.notification.data?.route || '/dashboard';
  const urlToOpen = new URL(route, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing tab if open
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Else open new tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
