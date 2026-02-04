import { Check } from 'lucide-react';
import { useWeekData } from '../../hooks/useWeekData';
import { Input } from '../common/Input';
import { DAYS_OF_WEEK } from '../../utils/constants';
import { getWeekDays, getDayName, checkIsToday } from '../../utils/dateUtils';

export function MoveBy3pmCard({ currentDate }) {
  const { weekData, logMovement } = useWeekData(currentDate);
  const moveBy3pm = weekData?.moveBy3pm || {};
  const weekDays = getWeekDays(currentDate);

  const handleDayToggle = (day) => {
    const current = moveBy3pm[day];
    if (current?.moved) {
      logMovement(day, false, null);
    } else {
      logMovement(day, true, null);
    }
  };

  const handleActivityChange = (day, activity) => {
    logMovement(day, true, activity);
  };

  const todayIndex = weekDays.findIndex(d => checkIsToday(d));
  const todayDay = todayIndex >= 0 ? DAYS_OF_WEEK[todayIndex] : null;
  const todayData = todayDay ? moveBy3pm[todayDay] : null;

  return (
    <div className="space-y-4">
      {/* Today's status */}
      {todayDay && (
        <div className="bg-gelato-mint/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-charcoal">Today</span>
            <button
              onClick={() => handleDayToggle(todayDay)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${todayData?.moved
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-charcoal/60 hover:bg-gray-200'
                }
              `}
            >
              {todayData?.moved ? '✓ Moved!' : 'Not yet'}
            </button>
          </div>
          {todayData?.moved && (
            <Input
              placeholder="What did you do? (optional)"
              value={todayData?.activity || ''}
              onChange={(e) => handleActivityChange(todayDay, e.target.value)}
              className="text-sm"
            />
          )}
        </div>
      )}

      {/* Weekly tracker */}
      <div>
        <p className="text-sm text-charcoal/70 mb-2">This week:</p>
        <div className="flex gap-2">
          {weekDays.map((date, i) => {
            const day = DAYS_OF_WEEK[i];
            const data = moveBy3pm[day];
            const isMoved = data?.moved;
            const isToday = checkIsToday(date);

            return (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg
                  transition-all hover:scale-105
                  ${isToday ? 'ring-2 ring-gelato-mint' : ''}
                  ${isMoved
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-50 text-charcoal/40 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-xs font-medium">{day}</span>
                {isMoved ? (
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
        {Object.values(moveBy3pm).filter(m => m?.moved).length} of 7 days moved
      </div>
    </div>
  );
}

export default MoveBy3pmCard;
