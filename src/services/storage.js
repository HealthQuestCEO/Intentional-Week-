import { getWeekKey, getDateKey } from '../utils/dateUtils';
import { deepClone } from '../utils/helpers';
import { DEFAULT_REMINDERS } from '../utils/constants';

// Storage keys
const STORAGE_KEY = 'intentional-week-data';
const BLOB_API = '/api/blob';

// ============================================
// Netlify Blob API (Cloud Storage)
// ============================================

/**
 * Fetch user data from Netlify Blob
 */
export async function fetchUserDataFromBlob(userId) {
  try {
    const response = await fetch(`${BLOB_API}?userId=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from blob');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Blob fetch failed, using localStorage:', error.message);
    return null;
  }
}

/**
 * Save user data to Netlify Blob
 */
export async function saveUserDataToBlob(userId, data) {
  try {
    const response = await fetch(`${BLOB_API}?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });

    if (!response.ok) {
      throw new Error('Failed to save to blob');
    }

    return true;
  } catch (error) {
    console.warn('Blob save failed:', error.message);
    return false;
  }
}

// ============================================
// Local Storage (Fallback & Cache)
// ============================================

/**
 * Get user data from localStorage
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
 * Save user data to localStorage
 */
export function saveUserData(userId, data) {
  try {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allData[userId] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));

    // Also save to blob in background (fire and forget)
    saveUserDataToBlob(userId, data).catch(err =>
      console.warn('Background blob save failed:', err)
    );

    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
}

/**
 * Initialize user data - tries blob first, then localStorage
 */
export async function initializeUserData(user) {
  // Try to load from blob first
  let existingData = await fetchUserDataFromBlob(user.uid);

  // If blob has data, update localStorage and return
  if (existingData) {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allData[user.uid] = existingData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    return existingData;
  }

  // Check localStorage
  existingData = getUserData(user.uid);
  if (existingData) {
    // Sync localStorage to blob
    saveUserDataToBlob(user.uid, existingData);
    return existingData;
  }

  // Create new user data
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
 * Sync data from blob to localStorage (call on app load)
 */
export async function syncFromBlob(userId) {
  const blobData = await fetchUserDataFromBlob(userId);
  if (blobData) {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allData[userId] = blobData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    return blobData;
  }
  return getUserData(userId);
}

// ============================================
// Week Data
// ============================================

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
  let userData = getUserData(userId);

  // Auto-initialize if user data doesn't exist
  if (!userData) {
    userData = {
      userId: userId,
      profile: { createdAt: new Date().toISOString() },
      settings: {
        reminders: deepClone(DEFAULT_REMINDERS),
        quietHours: { start: '22:00', end: '07:00' },
        googleCalendarSync: false
      },
      weeks: {},
      journal: {}
    };
  }

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
        tasks: []
      },
      self: {
        notes: '',
        tasks: []
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
    timerLogs: [],
    events: []
  };
}

// ============================================
// Journal
// ============================================

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
  let userData = getUserData(userId);
  if (!userData) {
    userData = {
      userId: userId,
      profile: { createdAt: new Date().toISOString() },
      settings: {
        reminders: deepClone(DEFAULT_REMINDERS),
        quietHours: { start: '22:00', end: '07:00' },
        googleCalendarSync: false
      },
      weeks: {},
      journal: {}
    };
  }

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
 * Delete journal entry
 */
export function deleteJournalEntry(userId, dateKey) {
  const userData = getUserData(userId);
  if (!userData || !userData.journal) return false;

  delete userData.journal[dateKey];
  return saveUserData(userId, userData);
}

// ============================================
// Settings
// ============================================

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

// ============================================
// Timer
// ============================================

/**
 * Add timer log entry
 */
export function addTimerLog(userId, weekKey, log) {
  let userData = getUserData(userId);
  if (!userData) {
    userData = {
      userId: userId,
      profile: { createdAt: new Date().toISOString() },
      settings: {
        reminders: deepClone(DEFAULT_REMINDERS),
        quietHours: { start: '22:00', end: '07:00' },
        googleCalendarSync: false
      },
      weeks: {},
      journal: {}
    };
  }

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
