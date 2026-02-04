import { getWeekKey, getDateKey } from '../utils/dateUtils';
import { deepClone } from '../utils/helpers';
import { DEFAULT_REMINDERS } from '../utils/constants';

// For MVP, we'll use localStorage with the same data structure
// This can be swapped for Netlify Blob later
const STORAGE_KEY = 'intentional-week-data';

/**
 * Get user data from storage
 */
export function getUserData(userId) {
  try {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return allData[userId] || null;
  } catch (error) {
    console.error('Error reading user data:', error);
    return null;
  }
}

/**
 * Save user data to storage
 */
export function saveUserData(userId, data) {
  try {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allData[userId] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
}

/**
 * Initialize user data structure
 */
export function initializeUserData(user) {
  const existingData = getUserData(user.uid);
  if (existingData) {
    return existingData;
  }

  const initialData = {
    userId: user.uid,
    profile: {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString()
    },
    settings: {
      reminders: deepClone(DEFAULT_REMINDERS),
      quietHours: { start: '22:00', end: '07:00' },
      googleCalendarSync: false
    },
    weeks: {},
    journal: {}
  };

  saveUserData(user.uid, initialData);
  return initialData;
}

/**
 * Get week data
 */
export function getWeekData(userId, weekKey = null) {
  const userData = getUserData(userId);
  if (!userData) return null;

  const key = weekKey || getWeekKey();
  return userData.weeks[key] || createEmptyWeek();
}

/**
 * Save week data
 */
export function saveWeekData(userId, weekKey, weekData) {
  const userData = getUserData(userId);
  if (!userData) return false;

  userData.weeks[weekKey] = weekData;
  return saveUserData(userId, userData);
}

/**
 * Create empty week structure
 */
export function createEmptyWeek() {
  return {
    bedtime: {
      target: '22:30',
      logs: {}
    },
    fridayPlan: {
      done: false,
      career: {
        notes: '',
        tasks: []
      },
      relationships: {
        notes: '',
        plans: []
      },
      self: {
        notes: '',
        plans: []
      }
    },
    moveBy3pm: {},
    habits: [],
    backupSlot: {
      slot: '',
      used: null,
      note: ''
    },
    adventures: {
      big: { description: '', completed: false },
      little: { description: '', completed: false }
    },
    nightForYou: {
      night: '',
      activity: '',
      took: false
    },
    batchTasks: {
      tasks: [],
      completed: []
    },
    effortfulFirst: {
      activity: '',
      days: {}
    },
    timerLogs: []
  };
}

/**
 * Get journal entry for a specific date
 */
export function getJournalEntry(userId, dateKey = null) {
  const userData = getUserData(userId);
  if (!userData) return null;

  const key = dateKey || getDateKey();
  return userData.journal[key] || null;
}

/**
 * Save journal entry
 */
export function saveJournalEntry(userId, dateKey, entry) {
  const userData = getUserData(userId);
  if (!userData) return false;

  userData.journal[dateKey] = {
    ...entry,
    timestamp: new Date().toISOString()
  };
  return saveUserData(userId, userData);
}

/**
 * Get all journal entries
 */
export function getAllJournalEntries(userId) {
  const userData = getUserData(userId);
  if (!userData) return {};
  return userData.journal || {};
}

/**
 * Update user settings
 */
export function updateSettings(userId, settings) {
  const userData = getUserData(userId);
  if (!userData) return false;

  userData.settings = {
    ...userData.settings,
    ...settings
  };
  return saveUserData(userId, userData);
}

/**
 * Get user settings
 */
export function getSettings(userId) {
  const userData = getUserData(userId);
  if (!userData) return null;
  return userData.settings;
}

/**
 * Add timer log entry
 */
export function addTimerLog(userId, weekKey, log) {
  const userData = getUserData(userId);
  if (!userData) return false;

  if (!userData.weeks[weekKey]) {
    userData.weeks[weekKey] = createEmptyWeek();
  }

  userData.weeks[weekKey].timerLogs.push({
    ...log,
    timestamp: new Date().toISOString()
  });

  return saveUserData(userId, userData);
}

/**
 * Update a specific task's actual time
 */
export function updateTaskTime(userId, weekKey, taskId, actualMinutes) {
  const userData = getUserData(userId);
  if (!userData || !userData.weeks[weekKey]) return false;

  const tasks = userData.weeks[weekKey].fridayPlan.career.tasks;
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex].actualMinutes = (tasks[taskIndex].actualMinutes || 0) + actualMinutes;
    return saveUserData(userId, userData);
  }

  return false;
}
