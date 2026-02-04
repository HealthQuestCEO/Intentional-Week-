import { useState, useEffect, useCallback } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  showNotification,
  scheduleReminder,
  cancelReminder
} from '../services/notifications';

export function useNotifications() {
  const [permission, setPermission] = useState(getNotificationPermission());
  const [scheduledReminders, setScheduledReminders] = useState([]);

  useEffect(() => {
    // Update permission if it changes
    setPermission(getNotificationPermission());
  }, []);

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result.permission);
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
    requestPermission,
    notify,
    schedule,
    cancel,
    cancelAll,
    scheduledReminders
  };
}
