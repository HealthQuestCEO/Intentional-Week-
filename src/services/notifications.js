/**
 * Check if notifications are supported
 */
export function isNotificationSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    return { granted: false, error: 'Notifications not supported' };
  }

  try {
    const permission = await Notification.requestPermission();
    return {
      granted: permission === 'granted',
      permission,
      error: null
    };
  } catch (error) {
    return {
      granted: false,
      permission: 'denied',
      error: error.message
    };
  }
}

/**
 * Show a notification
 */
export function showNotification(title, options = {}) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  const defaultOptions = {
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'intentional-week',
    renotify: true,
    ...options
  };

  try {
    return new Notification(title, defaultOptions);
  } catch (error) {
    // Fallback for mobile - use service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, defaultOptions);
      });
    }
    return null;
  }
}

/**
 * Schedule a reminder notification
 */
export function scheduleReminder(title, body, delayMinutes) {
  const delayMs = delayMinutes * 60 * 1000;

  return setTimeout(() => {
    showNotification(title, { body });
  }, delayMs);
}

/**
 * Cancel a scheduled reminder
 */
export function cancelReminder(timeoutId) {
  clearTimeout(timeoutId);
}

/**
 * Notification messages for each rule
 */
export const NOTIFICATION_MESSAGES = {
  bedtime: {
    title: 'Time to wind down',
    body: 'Your bedtime is approaching. Start your evening routine.'
  },
  planOnFridays: {
    title: 'Time for weekly planning',
    body: 'Take a few minutes to plan your week ahead.'
  },
  moveBy3pm: {
    title: 'Have you moved today?',
    body: 'Try to get some movement in before 3pm!'
  },
  habits: {
    title: 'Keep your streak going',
    body: 'Have you worked on your habits today?'
  },
  backupSlot: {
    title: 'Your backup slot is tomorrow',
    body: 'Remember you have buffer time built in.'
  },
  adventures: {
    title: 'Plan your adventures',
    body: 'What will your big and little adventures be this week?'
  },
  nightForYou: {
    title: 'Tonight is YOUR night!',
    body: 'Enjoy your personal time this evening.'
  },
  batchTasks: {
    title: 'Batching time!',
    body: 'Time to knock out those small tasks together.'
  },
  effortfulFirst: {
    title: 'Effortful before effortless',
    body: 'Do something meaningful before defaulting to screens.'
  }
};

/**
 * Test notification
 */
export function sendTestNotification() {
  return showNotification('Intentional Week', {
    body: 'Notifications are working! You\'ll receive reminders based on your settings.'
  });
}
