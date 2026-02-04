import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useJournal } from '../../hooks/useStorage';
import { MoodEmoji } from './MoodSelector';
import { Modal } from '../common/Modal';
import { JournalEntry } from './JournalEntry';
import { MOOD_EMOJIS } from '../../utils/constants';
import {
  getMonthDays,
  formatDate,
  getDateKey,
  checkIsToday,
  previousMonth,
  nextMonth,
  getWeekStart
} from '../../utils/dateUtils';
import { startOfMonth, getDay } from 'date-fns';

export function MoodCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const { getAllEntries, getEntry } = useJournal();

  const entries = getAllEntries();
  const monthDays = getMonthDays(currentMonth);
  const firstDayOfMonth = startOfMonth(currentMonth);
  const startingDayIndex = getDay(firstDayOfMonth); // 0 = Sunday
  const adjustedStartIndex = startingDayIndex === 0 ? 6 : startingDayIndex - 1; // Adjust for Monday start

  const handlePrevMonth = () => setCurrentMonth(prev => previousMonth(prev));
  const handleNextMonth = () => setCurrentMonth(prev => nextMonth(prev));

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const selectedEntry = selectedDate ? getEntry(getDateKey(selectedDate)) : null;

  return (
    <div className="bg-white rounded-xl p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-charcoal" />
        </button>
        <h3 className="font-semibold text-charcoal">
          {formatDate(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-charcoal" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-charcoal/50 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the month starts */}
        {Array.from({ length: adjustedStartIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {monthDays.map((date) => {
          const dateKey = getDateKey(date);
          const entry = entries[dateKey];
          const isToday = checkIsToday(date);
          const hasMood = entry?.mood?.value;

          return (
            <button
              key={dateKey}
              onClick={() => handleDayClick(date)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center
                transition-all hover:scale-105
                ${isToday ? 'ring-2 ring-balanced-teal' : ''}
                ${hasMood ? 'bg-gray-50' : 'hover:bg-gray-50'}
              `}
            >
              <span className={`text-xs ${isToday ? 'font-bold text-balanced-teal' : 'text-charcoal/60'}`}>
                {formatDate(date, 'd')}
              </span>
              {hasMood && (
                <MoodEmoji mood={MOOD_EMOJIS[entry.mood.value]} size="xs" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-charcoal/50 mb-2">Mood legend:</p>
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="flex items-center gap-1">
              <MoodEmoji mood={MOOD_EMOJIS[value]} size="xs" />
              <span className="text-xs text-charcoal/50">{MOOD_EMOJIS[value].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day detail modal */}
      <Modal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        title={selectedDate ? formatDate(selectedDate, 'EEEE, MMMM d, yyyy') : ''}
        size="lg"
      >
        {selectedDate && (
          selectedEntry ? (
            <EntryView entry={selectedEntry} date={selectedDate} />
          ) : (
            <JournalEntry
              date={selectedDate}
              onSave={() => setSelectedDate(null)}
              onClose={() => setSelectedDate(null)}
            />
          )
        )}
      </Modal>
    </div>
  );
}

function EntryView({ entry, date }) {
  const mood = MOOD_EMOJIS[entry.mood?.value];

  return (
    <div className="space-y-4">
      {/* Mood */}
      {mood && (
        <div className="flex items-center justify-center gap-3 py-4">
          <MoodEmoji mood={mood} size="lg" />
          <span className="text-xl font-medium text-charcoal">{mood.label}</span>
        </div>
      )}

      {/* Prompts */}
      {entry.prompts && Object.entries(entry.prompts).map(([key, value]) => {
        if (!value) return null;
        const promptLabel = {
          onYourMind: "What's on your mind?",
          gratefulFor: "What are you grateful for?",
          wentWell: "What went well today?",
          doDifferently: "What's one thing you'd do differently?"
        }[key];

        return (
          <div key={key} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-charcoal/50 mb-1">{promptLabel}</p>
            <p className="text-sm text-charcoal">{value}</p>
          </div>
        );
      })}

      {/* Free write */}
      {entry.freeWrite && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-charcoal/50 mb-1">Notes</p>
          <p className="text-sm text-charcoal whitespace-pre-wrap">{entry.freeWrite}</p>
        </div>
      )}

      {/* Timestamp */}
      <p className="text-xs text-charcoal/40 text-center">
        Logged at {formatDate(entry.timestamp, 'h:mm a')}
      </p>
    </div>
  );
}

export default MoodCalendar;
