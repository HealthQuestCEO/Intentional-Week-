import { Check } from 'lucide-react';
import { useWeekData } from '../../hooks/useWeekData';
import { Input } from '../common/Input';
import { DAYS_OF_WEEK } from '../../utils/constants';
import { getWeekDays, checkIsToday } from '../../utils/dateUtils';

export function EffortfulFirstCard({ currentDate }) {
  const { weekData, updateRule } = useWeekData(currentDate);
  const effortfulFirst = weekData?.effortfulFirst || { activity: '', days: {} };
  const weekDays = getWeekDays(currentDate);

  const handleActivityChange = (activity) => {
    updateRule('effortfulFirst', { activity });
  };

  const handleDayToggle = (day) => {
    const current = effortfulFirst.days[day];
    updateRule('effortfulFirst', {
      days: { ...effortfulFirst.days, [day]: !current }
    });
  };

  const todayIndex = weekDays.findIndex(d => checkIsToday(d));
  const todayDay = todayIndex >= 0 ? DAYS_OF_WEEK[todayIndex] : null;
  const didEffortfulToday = todayDay && effortfulFirst.days[todayDay];

  return (
    <div className="space-y-4">
      {/* Activity input */}
      <Input
        label="My effortful activity"
        placeholder="Reading, guitar, crafts, journaling..."
        value={effortfulFirst.activity}
        onChange={(e) => handleActivityChange(e.target.value)}
      />

      {/* Today's quick action */}
      {todayDay && effortfulFirst.activity && (
        <div className="bg-pale-coral/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">Today</p>
              <p className="text-xs text-charcoal/60">
                Did you do "{effortfulFirst.activity}" before screens?
              </p>
            </div>
            <button
              onClick={() => handleDayToggle(todayDay)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${didEffortfulToday
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-charcoal/60 hover:bg-gray-200'
                }
              `}
            >
              {didEffortfulToday ? '✓ Yes!' : 'Mark done'}
            </button>
          </div>
        </div>
      )}

      {/* Weekly tracker */}
      <div>
        <p className="text-sm text-charcoal/70 mb-2">This week:</p>
        <div className="flex gap-2">
          {weekDays.map((date, i) => {
            const day = DAYS_OF_WEEK[i];
            const isDone = effortfulFirst.days[day];
            const isToday = checkIsToday(date);

            return (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg
                  transition-all hover:scale-105
                  ${isToday ? 'ring-2 ring-pale-coral' : ''}
                  ${isDone
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-50 text-charcoal/40 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-xs font-medium">{day}</span>
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-charcoal/60 text-center">
        {Object.values(effortfulFirst.days).filter(Boolean).length} of 7 days — effortful first
      </div>

      {/* Tip */}
      {!effortfulFirst.activity && (
        <div className="bg-pale-coral/10 rounded-lg p-3">
          <p className="text-sm text-charcoal/70">
            <strong>Tip:</strong> Before scrolling or watching TV, do something that
            takes a bit more effort but is more rewarding—reading, a hobby, exercise.
          </p>
        </div>
      )}
    </div>
  );
}

export default EffortfulFirstCard;
