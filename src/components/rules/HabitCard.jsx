import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { useWeekData } from '../../hooks/useWeekData';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { DAYS_OF_WEEK } from '../../utils/constants';

export function HabitCard({ currentDate }) {
  const { weekData, addHabit, removeHabit, logHabitDay } = useWeekData(currentDate);
  const [newHabitName, setNewHabitName] = useState('');
  const habits = weekData?.habits || [];

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddHabit();
    }
  };

  const getHabitProgress = (habit) => {
    const daysHit = Object.values(habit.days || {}).filter(Boolean).length;
    return daysHit;
  };

  return (
    <div className="space-y-4">
      {/* Add new habit */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a habit to track 3x/week"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          onClick={handleAddHabit}
          disabled={!newHabitName.trim()}
          size="sm"
          icon={Plus}
        >
          Add
        </Button>
      </div>

      {/* Habit list */}
      {habits.length === 0 ? (
        <p className="text-sm text-charcoal/50 text-center py-4">
          No habits yet. Add up to 3 habits to track this week.
        </p>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => {
            const progress = getHabitProgress(habit);
            const isComplete = progress >= 3;

            return (
              <div key={habit.id} className="bg-gray-50 rounded-lg p-3">
                {/* Habit header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-charcoal">{habit.name}</span>
                    {isComplete && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Done!
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeHabit(habit.id)}
                    className="p-1 text-charcoal/40 hover:text-red-500 transition-colors"
                    aria-label="Remove habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Day toggles */}
                <div className="flex gap-1">
                  {DAYS_OF_WEEK.map((day) => {
                    const isDone = habit.days?.[day];

                    return (
                      <button
                        key={day}
                        onClick={() => logHabitDay(habit.id, day, !isDone)}
                        className={`
                          flex-1 py-1.5 rounded text-xs font-medium transition-colors
                          ${isDone
                            ? 'bg-sunrise-yellow text-white'
                            : 'bg-white text-charcoal/40 hover:bg-gray-100'
                          }
                        `}
                      >
                        {day[0]}
                      </button>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isComplete ? 'bg-green-500' : 'bg-sunrise-yellow'}`}
                      style={{ width: `${Math.min(100, (progress / 3) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-charcoal/50 mt-1 text-right">
                    {progress}/3 this week
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {habits.length >= 3 && (
        <p className="text-xs text-charcoal/50 text-center">
          Maximum 3 habits per week for focused tracking
        </p>
      )}
    </div>
  );
}

export default HabitCard;
