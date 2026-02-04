import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '../layout/Layout';
import { useWeekData } from '../../hooks/useWeekData';
import { useJournal } from '../../hooks/useStorage';
import { Modal } from '../common/Modal';
import { MoodEmoji } from '../journal/MoodSelector';
import { RULES, MOOD_EMOJIS, DAYS_OF_WEEK } from '../../utils/constants';
import {
  getWeekDays,
  getWeekRangeDisplay,
  formatDate,
  getDateKey,
  getDayName,
  checkIsToday,
  previousWeek,
  nextWeek
} from '../../utils/dateUtils';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const { weekData } = useWeekData(currentDate);
  const { getEntry } = useJournal();

  const weekDays = getWeekDays(currentDate);

  const handlePrevWeek = () => setCurrentDate(prev => previousWeek(prev));
  const handleNextWeek = () => setCurrentDate(prev => nextWeek(prev));

  // Get rule completion status for a day
  const getDayRuleStatus = (dayName) => {
    if (!weekData) return [];

    const completed = [];

    // Bedtime
    if (weekData.bedtime?.logs[dayName]?.hit) {
      completed.push('bedtime');
    }

    // Movement
    if (weekData.moveBy3pm?.[dayName]?.moved) {
      completed.push('moveBy3pm');
    }

    // Effortful first
    if (weekData.effortfulFirst?.days[dayName]) {
      completed.push('effortfulFirst');
    }

    // Friday plan (only on Friday)
    if (dayName === 'Fri' && weekData.fridayPlan?.done) {
      completed.push('planFridays');
    }

    // Habits (check if any habit was done on this day)
    const habitsDone = weekData.habits?.some(h => h.days?.[dayName]);
    if (habitsDone) {
      completed.push('habits');
    }

    return completed;
  };

  const selectedDayData = selectedDay ? {
    dayName: getDayName(selectedDay),
    dateKey: getDateKey(selectedDay),
    rules: getDayRuleStatus(getDayName(selectedDay)),
    journal: getEntry(getDateKey(selectedDay))
  } : null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-charcoal mb-6">Calendar</h1>

        {/* Week navigation */}
        <div className="bg-white rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-charcoal" />
            </button>
            <h2 className="font-semibold text-charcoal">
              {getWeekRangeDisplay(currentDate)}
            </h2>
            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-charcoal" />
            </button>
          </div>

          {/* Week grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date, i) => {
              const dayName = DAYS_OF_WEEK[i];
              const isToday = checkIsToday(date);
              const rulesCompleted = getDayRuleStatus(dayName);
              const journalEntry = getEntry(getDateKey(date));

              return (
                <button
                  key={dayName}
                  onClick={() => setSelectedDay(date)}
                  className={`
                    p-3 rounded-xl text-center transition-all hover:scale-105
                    ${isToday ? 'ring-2 ring-balanced-teal bg-balanced-teal/5' : 'bg-gray-50 hover:bg-gray-100'}
                  `}
                >
                  <p className={`text-xs font-medium mb-1 ${isToday ? 'text-balanced-teal' : 'text-charcoal/50'}`}>
                    {dayName}
                  </p>
                  <p className={`text-lg font-semibold mb-2 ${isToday ? 'text-balanced-teal' : 'text-charcoal'}`}>
                    {formatDate(date, 'd')}
                  </p>

                  {/* Rule dots */}
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {rulesCompleted.map((ruleId) => {
                      const rule = RULES.find(r => r.id === ruleId);
                      return (
                        <div
                          key={ruleId}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: rule?.color }}
                          title={rule?.shortName}
                        />
                      );
                    })}
                    {rulesCompleted.length === 0 && (
                      <div className="w-2 h-2" /> // Placeholder for height
                    )}
                  </div>

                  {/* Journal mood */}
                  {journalEntry?.mood && (
                    <MoodEmoji mood={MOOD_EMOJIS[journalEntry.mood.value]} size="xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rule legend */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-sm font-medium text-charcoal mb-3">Legend</h3>
          <div className="flex flex-wrap gap-3">
            {RULES.map((rule) => (
              <div key={rule.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: rule.color }}
                />
                <span className="text-xs text-charcoal/60">{rule.shortName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day detail modal */}
        <Modal
          isOpen={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          title={selectedDay ? formatDate(selectedDay, 'EEEE, MMMM d') : ''}
          size="md"
        >
          {selectedDayData && (
            <DayDetail
              dayName={selectedDayData.dayName}
              rules={selectedDayData.rules}
              journal={selectedDayData.journal}
              weekData={weekData}
            />
          )}
        </Modal>
      </div>
    </Layout>
  );
}

function DayDetail({ dayName, rules, journal, weekData }) {
  return (
    <div className="space-y-4">
      {/* Rules completed */}
      <div>
        <h4 className="text-sm font-medium text-charcoal mb-2">Rules tracked</h4>
        {rules.length > 0 ? (
          <div className="space-y-2">
            {rules.map((ruleId) => {
              const rule = RULES.find(r => r.id === ruleId);
              return (
                <div
                  key={ruleId}
                  className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ backgroundColor: `${rule?.color}15` }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: rule?.color }}
                  />
                  <span className="text-sm text-charcoal">{rule?.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-charcoal/50">No rules tracked this day</p>
        )}
      </div>

      {/* Journal entry */}
      {journal && (
        <div>
          <h4 className="text-sm font-medium text-charcoal mb-2">Journal</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MoodEmoji mood={MOOD_EMOJIS[journal.mood?.value]} size="sm" />
              <span className="text-sm text-charcoal/70">
                {MOOD_EMOJIS[journal.mood?.value]?.label}
              </span>
            </div>
            {journal.freeWrite && (
              <p className="text-sm text-charcoal/70 line-clamp-3">
                {journal.freeWrite}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Timer logs for the day */}
      {weekData?.timerLogs?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-charcoal mb-2">Time logged</h4>
          <div className="space-y-1">
            {weekData.timerLogs
              .filter(log => {
                // Filter logs for this day (simplified - would need proper date matching)
                return true;
              })
              .slice(0, 5)
              .map((log, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span className="text-charcoal/70">{log.activity}</span>
                  <span className="text-charcoal/50">{log.minutes}m</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
