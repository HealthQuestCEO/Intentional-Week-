import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useWeekData } from '../../hooks/useWeekData';
import { TimePicker } from '../common/Input';
import { DAYS_OF_WEEK } from '../../utils/constants';
import { getWeekDays, getDayName, checkIsToday } from '../../utils/dateUtils';

export function BedtimeCard({ currentDate }) {
  const { weekData, setBedtimeTarget, logBedtime } = useWeekData(currentDate);
  const [editingTarget, setEditingTarget] = useState(false);

  const bedtime = weekData?.bedtime || { target: '22:30', logs: {} };
  const weekDays = getWeekDays(currentDate);

  const handleTargetChange = (e) => {
    setBedtimeTarget(e.target.value);
    setEditingTarget(false);
  };

  const handleDayToggle = (day) => {
    const current = bedtime.logs[day];
    if (current?.hit) {
      // Toggle off
      logBedtime(day, false, null);
    } else {
      // Toggle on
      logBedtime(day, true, bedtime.target);
    }
  };

  return (
    <div className="space-y-4">
      {/* Target bedtime */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-charcoal/70">Target bedtime:</span>
        {editingTarget ? (
          <TimePicker
            value={bedtime.target}
            onChange={handleTargetChange}
            onBlur={() => setEditingTarget(false)}
            className="w-28"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setEditingTarget(true)}
            className="text-lg font-semibold text-balanced-teal hover:underline"
          >
            {bedtime.target}
          </button>
        )}
      </div>

      {/* Weekly tracker */}
      <div>
        <p className="text-sm text-charcoal/70 mb-2">This week:</p>
        <div className="flex gap-2">
          {weekDays.map((date, i) => {
            const day = DAYS_OF_WEEK[i];
            const log = bedtime.logs[day];
            const isHit = log?.hit;
            const isToday = checkIsToday(date);

            return (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg
                  transition-all hover:scale-105
                  ${isToday ? 'ring-2 ring-balanced-teal' : ''}
                  ${isHit
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-50 text-charcoal/40 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-xs font-medium">{day}</span>
                {isHit ? (
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
        {Object.values(bedtime.logs).filter(l => l?.hit).length} of 7 nights on track
      </div>
    </div>
  );
}

export default BedtimeCard;
