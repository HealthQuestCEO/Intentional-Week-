import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getWeekData, saveWeekData, createEmptyWeek } from '../services/storage';
import { getWeekKey, getDateKey, getDayName } from '../utils/dateUtils';
import { deepClone } from '../utils/helpers';

export function useWeekData(weekDate = new Date()) {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weekKey, setWeekKey] = useState(getWeekKey(weekDate));

  // Load week data
  useEffect(() => {
    if (!user) {
      setWeekData(null);
      setLoading(false);
      return;
    }

    const key = getWeekKey(weekDate);
    setWeekKey(key);

    const data = getWeekData(user.uid, key);
    setWeekData(data || createEmptyWeek());
    setLoading(false);
  }, [user, weekDate]);

  // Save helper
  const save = useCallback((data) => {
    if (!user) return false;
    const success = saveWeekData(user.uid, weekKey, data);
    if (success) {
      setWeekData(data);
    }
    return success;
  }, [user, weekKey]);

  // Update a specific rule's data
  const updateRule = useCallback((ruleId, ruleData) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    newData[ruleId] = { ...newData[ruleId], ...ruleData };
    return save(newData);
  }, [weekData, save]);

  // Bedtime helpers
  const logBedtime = useCallback((day, hit, actual = null) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    newData.bedtime.logs[day] = { hit, actual };
    return save(newData);
  }, [weekData, save]);

  const setBedtimeTarget = useCallback((target) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    newData.bedtime.target = target;
    return save(newData);
  }, [weekData, save]);

  // Friday Plan helpers
  const updateFridayPlan = useCallback((section, data) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    if (typeof data === 'object') {
      newData.fridayPlan[section] = { ...newData.fridayPlan[section], ...data };
    } else {
      newData.fridayPlan[section] = data;
    }
    return save(newData);
  }, [weekData, save]);

  const markFridayPlanDone = useCallback((done = true) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    newData.fridayPlan.done = done;
    return save(newData);
  }, [weekData, save]);

  // Move by 3pm helpers
  const logMovement = useCallback((day, moved, activity = null) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    newData.moveBy3pm[day] = { moved, activity };
    return save(newData);
  }, [weekData, save]);

  // Habit helpers
  const addHabit = useCallback((habitName) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    newData.habits.push({
      id: Date.now().toString(),
      name: habitName,
      days: {}
    });
    return save(newData);
  }, [weekData, save]);

  const removeHabit = useCallback((habitId) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    newData.habits = newData.habits.filter(h => h.id !== habitId);
    return save(newData);
  }, [weekData, save]);

  const logHabitDay = useCallback((habitId, day, done) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    const habit = newData.habits.find(h => h.id === habitId);
    if (habit) {
      habit.days[day] = done;
    }
    return save(newData);
  }, [weekData, save]);

  // Task helpers (for Friday Plan - any section)
  const addTask = useCallback((task, section = 'career') => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    if (!newData.fridayPlan[section].tasks) {
      newData.fridayPlan[section].tasks = [];
    }
    newData.fridayPlan[section].tasks.push({
      id: Date.now().toString(),
      name: task.name,
      status: 'not-started'
    });
    return save(newData);
  }, [weekData, save]);

  const updateTask = useCallback((taskId, updates, section = 'career') => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    if (!newData.fridayPlan[section].tasks) return false;
    const taskIndex = newData.fridayPlan[section].tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      newData.fridayPlan[section].tasks[taskIndex] = {
        ...newData.fridayPlan[section].tasks[taskIndex],
        ...updates
      };
    }
    return save(newData);
  }, [weekData, save]);

  const removeTask = useCallback((taskId, section = 'career') => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    if (!newData.fridayPlan[section].tasks) return false;
    newData.fridayPlan[section].tasks = newData.fridayPlan[section].tasks.filter(t => t.id !== taskId);
    return save(newData);
  }, [weekData, save]);

  // Timer log helpers
  const addTimerLog = useCallback((log) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    newData.timerLogs.push({
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    return save(newData);
  }, [weekData, save]);

  const removeTimerLog = useCallback((logId, index) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    // If log has id, filter by id. Otherwise use index
    if (logId) {
      newData.timerLogs = newData.timerLogs.filter(log => log.id !== logId);
    } else if (index !== undefined) {
      newData.timerLogs.splice(index, 1);
    }
    return save(newData);
  }, [weekData, save]);

  // Event helpers (for weekly planner)
  const addEvent = useCallback((event) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    if (!newData.events) newData.events = [];
    newData.events.push({
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    });
    return save(newData);
  }, [weekData, save]);

  const updateEvent = useCallback((eventId, updates) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    if (!newData.events) newData.events = [];
    const eventIndex = newData.events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      newData.events[eventIndex] = { ...newData.events[eventIndex], ...updates };
    }
    return save(newData);
  }, [weekData, save]);

  const removeEvent = useCallback((eventId) => {
    if (!weekData) return false;
    const newData = deepClone(weekData);
    if (!newData.events) newData.events = [];
    newData.events = newData.events.filter(e => e.id !== eventId);
    return save(newData);
  }, [weekData, save]);

  // Check today's status for various rules
  const getTodayStatus = useCallback(() => {
    if (!weekData) return {};
    const today = getDayName(new Date());

    return {
      movedToday: weekData.moveBy3pm[today]?.moved || false,
      bedtimeLastNight: weekData.bedtime.logs[today]?.hit || false,
      effortfulToday: weekData.effortfulFirst.days[today] || false
    };
  }, [weekData]);

  return {
    weekData,
    weekKey,
    loading,
    save,
    updateRule,
    // Bedtime
    logBedtime,
    setBedtimeTarget,
    // Friday Plan
    updateFridayPlan,
    markFridayPlanDone,
    // Movement
    logMovement,
    // Habits
    addHabit,
    removeHabit,
    logHabitDay,
    // Tasks
    addTask,
    updateTask,
    removeTask,
    // Timer
    addTimerLog,
    removeTimerLog,
    // Events
    addEvent,
    updateEvent,
    removeEvent,
    // Status
    getTodayStatus
  };
}
