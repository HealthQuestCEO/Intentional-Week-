import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getUserData,
  saveUserData,
  getJournalEntry,
  saveJournalEntry,
  getAllJournalEntries,
  getSettings,
  updateSettings
} from '../services/storage';

export function useStorage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const data = getUserData(user.uid);
    setUserData(data);
    setLoading(false);
  }, [user]);

  const refreshData = useCallback(() => {
    if (!user) return;
    const data = getUserData(user.uid);
    setUserData(data);
  }, [user]);

  const saveData = useCallback((data) => {
    if (!user) return false;
    const success = saveUserData(user.uid, data);
    if (success) {
      setUserData(data);
    }
    return success;
  }, [user]);

  return {
    userData,
    loading,
    refreshData,
    saveData
  };
}

export function useJournal() {
  const { user } = useAuth();

  const getEntry = useCallback((dateKey) => {
    if (!user) return null;
    return getJournalEntry(user.uid, dateKey);
  }, [user]);

  const saveEntry = useCallback((dateKey, entry) => {
    if (!user) return false;
    return saveJournalEntry(user.uid, dateKey, entry);
  }, [user]);

  const getAllEntries = useCallback(() => {
    if (!user) return {};
    return getAllJournalEntries(user.uid);
  }, [user]);

  const searchEntries = useCallback((query, filters = {}) => {
    if (!user) return [];

    const entries = getAllJournalEntries(user.uid);
    const results = [];

    Object.entries(entries).forEach(([date, entry]) => {
      // Filter by mood
      if (filters.mood && entry.mood?.value !== filters.mood) {
        return;
      }

      // Filter by date range
      if (filters.startDate && date < filters.startDate) {
        return;
      }
      if (filters.endDate && date > filters.endDate) {
        return;
      }

      // Search in content
      if (query) {
        const searchContent = [
          entry.freeWrite,
          entry.prompts?.onYourMind,
          entry.prompts?.gratefulFor,
          entry.prompts?.wentWell,
          entry.prompts?.doDifferently
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchContent.includes(query.toLowerCase())) {
          return;
        }
      }

      results.push({ date, ...entry });
    });

    // Sort by date descending
    return results.sort((a, b) => b.date.localeCompare(a.date));
  }, [user]);

  return {
    getEntry,
    saveEntry,
    getAllEntries,
    searchEntries
  };
}

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (!user) {
      setSettings(null);
      return;
    }

    const userSettings = getSettings(user.uid);
    setSettings(userSettings);
  }, [user]);

  const update = useCallback((newSettings) => {
    if (!user) return false;
    const success = updateSettings(user.uid, newSettings);
    if (success) {
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
    return success;
  }, [user]);

  const updateReminder = useCallback((ruleId, reminderSettings) => {
    if (!settings) return false;
    const newReminders = {
      ...settings.reminders,
      [ruleId]: { ...settings.reminders[ruleId], ...reminderSettings }
    };
    return update({ reminders: newReminders });
  }, [settings, update]);

  return {
    settings,
    update,
    updateReminder
  };
}
