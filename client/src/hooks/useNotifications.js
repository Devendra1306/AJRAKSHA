import { useState, useEffect, useCallback, useRef } from 'react';
import { requestPermissionAndGetToken, listenForeground } from '../firebase/messaging';

/**
 * useNotifications — manages FCM permission, token, and foreground notifications.
 *
 * Usage:
 *   const { permission, notifications, unreadCount, requestPermission, clearNotification } = useNotifications();
 */
export const useNotifications = () => {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [token, setToken] = useState(localStorage.getItem('ajraksha_fcm_token') || null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const unsubscribeRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /**
   * Request notification permission + generate token
   */
  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await requestPermissionAndGetToken();
      setPermission(result.permission);
      if (result.token) setToken(result.token);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a notification to the in-memory list
   */
  const addNotification = useCallback((payload) => {
    const { notification = {}, data = {} } = payload;
    const entry = {
      id: Date.now().toString(),
      title: notification.title || 'AJRAKSHA',
      body: notification.body || '',
      image: notification.image,
      category: data.category || 'general',
      clickAction: data.clickAction || '/dashboard',
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [entry, ...prev].slice(0, 50)); // cap at 50
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  /**
   * Auto-start foreground listener if permission is already granted
   */
  useEffect(() => {
    if (permission !== 'granted') return;

    // Start foreground listener
    if (unsubscribeRef.current) unsubscribeRef.current();
    unsubscribeRef.current = listenForeground(addNotification);

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [permission]);

  return {
    permission,
    token,
    notifications,
    unreadCount,
    isLoading,
    requestPermission,
    markRead,
    clearNotification,
    clearAll,
  };
};
