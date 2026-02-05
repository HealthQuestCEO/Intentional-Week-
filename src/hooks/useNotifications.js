import { useState, useEffect, useCallback } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission as requestBrowserPermission,
  showNotification,
  scheduleReminder,
  cancelReminder
} from '../services/notifications';
import {
  requestNotificationPermission as requestFCMPermission,
  onForegroundMessage,
  showNotification as showFCMNotification
} from '../services/firebase';

export function useNotifications() {
  const [permission, setPermission] = useState(getNotificationPermission());
  const [fcmToken, setFcmToken] = useState(null);
  const [scheduledReminders, setScheduledReminders] = useState([]);

  useEffect(() => {
    // Update permission if it changes
    setPermission(getNotificationPermission());
  }, []);

  // Listen for foreground messages
  useEffect(() => {
    if (permission !== 'granted') return;

    const unsubscribe = onForegroundMessage((payload) => {
      // Show notification when app is in foreground
      showFCMNotification(
        payload.notification?.title || 'Intentional Week',
        {
          body: payload.notification?.body,
          data: payload.data
        }
      );
    });

    return unsubscribe;
  }, [permission]);

  const requestPermission = useCallback(async () => {
    // Request browser permission first
    const result = await requestBrowserPermission();
    setPermission(result.permission);

    // If granted, also get FCM token
    if (result.permission === 'granted') {
      const fcmResult = await requestFCMPermission();
      if (fcmResult.token) {
        setFcmToken(fcmResult.token);
        // Store token in localStorage for later use
        localStorage.setItem('intentional-week-fcm-token', fcmResult.token);
      }
    }

    return result;
  }, []);

  const notify = useCallback((title, options) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }
    return showNotification(title, options);
  }, [permission]);

  const schedule = useCallback((id, title, body, delayMinutes) => {
    const timeoutId = scheduleReminder(title, body, delayMinutes);
    setScheduledReminders(prev => [...prev, { id, timeoutId }]);
    return timeoutId;
  }, []);

  const cancel = useCallback((id) => {
    const reminder = scheduledReminders.find(r => r.id === id);
    if (reminder) {
      cancelReminder(reminder.timeoutId);
      setScheduledReminders(prev => prev.filter(r => r.id !== id));
    }
  }, [scheduledReminders]);

  const cancelAll = useCallback(() => {
    scheduledReminders.forEach(r => cancelReminder(r.timeoutId));
    setScheduledReminders([]);
  }, [scheduledReminders]);

  return {
    isSupported: isNotificationSupported(),
    permission,
    isGranted: permission === 'granted',
    fcmToken,
    requestPermission,
    notify,
    schedule,
    cancel,
    cancelAll,
    scheduledReminders
  };
}
