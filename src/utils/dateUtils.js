import { format, startOfWeek, endOfWeek, addDays, getISOWeek, getYear, parseISO, isToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';

/**
 * Get the ISO week string for a date (e.g., "2026-W06")
 */
export function getWeekKey(date = new Date()) {
  const year = getYear(date);
  const week = getISOWeek(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

/**
 * Get the date key for a specific day (e.g., "2026-02-04")
 */
export function getDateKey(date = new Date()) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get the start of the current week (Monday)
 */
export function getWeekStart(date = new Date()) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/**
 * Get the end of the current week (Sunday)
 */
export function getWeekEnd(date = new Date()) {
  return endOfWeek(date, { weekStartsOn: 1 });
}

/**
 * Get all days in the current week
 */
export function getWeekDays(date = new Date()) {
  const start = getWeekStart(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Get the day name (Mon, Tue, etc.)
 */
export function getDayName(date, short = true) {
  return format(date, short ? 'EEE' : 'EEEE');
}

/**
 * Format a date for display
 */
export function formatDate(date, formatStr = 'MMM d, yyyy') {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, formatStr);
}

/**
 * Format time from minutes to display string (e.g., 125 -> "2h 5m")
 */
export function formatMinutes(minutes) {
  if (!minutes || minutes === 0) return '—';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format time for timer display (e.g., 125 -> "02:05")
 */
export function formatTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if a date is today
 */
export function checkIsToday(date) {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return isToday(date);
}

/**
 * Check if two dates are the same day
 */
export function isSameDate(date1, date2) {
  if (typeof date1 === 'string') date1 = parseISO(date1);
  if (typeof date2 === 'string') date2 = parseISO(date2);
  return isSameDay(date1, date2);
}

/**
 * Get all days in a month
 */
export function getMonthDays(date = new Date()) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

/**
 * Navigation helpers
 */
export function nextWeek(date = new Date()) {
  return addWeeks(date, 1);
}

export function previousWeek(date = new Date()) {
  return subWeeks(date, 1);
}

export function nextMonth(date = new Date()) {
  return addMonths(date, 1);
}

export function previousMonth(date = new Date()) {
  return subMonths(date, 1);
}

/**
 * Get a human-readable week range (e.g., "Feb 3 - 9, 2026")
 */
export function getWeekRangeDisplay(date = new Date()) {
  const start = getWeekStart(date);
  const end = getWeekEnd(date);

  const startMonth = format(start, 'MMM');
  const endMonth = format(end, 'MMM');
  const startDay = format(start, 'd');
  const endDay = format(end, 'd');
  const year = format(end, 'yyyy');

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

/**
 * Parse a time string (e.g., "22:30") to hours and minutes
 */
export function parseTimeString(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Format hours and minutes to time string
 */
export function formatTimeString(hours, minutes) {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
