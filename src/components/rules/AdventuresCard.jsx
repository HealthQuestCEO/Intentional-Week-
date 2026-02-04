import { useWeekData } from '../../hooks/useWeekData';
import { Input, Checkbox } from '../common/Input';
import { Compass, Sparkles } from 'lucide-react';

export function AdventuresCard({ currentDate }) {
  const { weekData, updateRule } = useWeekData(currentDate);
  const adventures = weekData?.adventures || {
    big: { description: '', completed: false },
    little: { description: '', completed: false }
  };

  const handleBigChange = (field, value) => {
    updateRule('adventures', {
      big: { ...adventures.big, [field]: value }
    });
  };

  const handleLittleChange = (field, value) => {
    updateRule('adventures', {
      little: { ...adventures.little, [field]: value }
    });
  };

  return (
    <div className="space-y-4">
      {/* Big adventure */}
      <div className="bg-sweet-akito-rose/10 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-4 h-4 text-sweet-akito-rose" />
          <span className="text-sm font-medium text-charcoal">Big Adventure</span>
        </div>
        <Input
          placeholder="What's your big adventure this week?"
          value={adventures.big.description}
          onChange={(e) => handleBigChange('description', e.target.value)}
          className="mb-2"
        />
        {adventures.big.description && (
          <Checkbox
            label="Completed!"
            checked={adventures.big.completed}
            onChange={(e) => handleBigChange('completed', e.target.checked)}
          />
        )}
      </div>

      {/* Little adventure */}
      <div className="bg-sweet-akito-rose/5 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-sweet-akito-rose" />
          <span className="text-sm font-medium text-charcoal">Little Adventure</span>
        </div>
        <Input
          placeholder="What's your little adventure this week?"
          value={adventures.little.description}
          onChange={(e) => handleLittleChange('description', e.target.value)}
          className="mb-2"
        />
        {adventures.little.description && (
          <Checkbox
            label="Completed!"
            checked={adventures.little.completed}
            onChange={(e) => handleLittleChange('completed', e.target.checked)}
          />
        )}
      </div>

      {/* Ideas */}
      {!adventures.big.description && !adventures.little.description && (
        <div className="text-sm text-charcoal/60">
          <p className="font-medium mb-1">Ideas:</p>
          <ul className="list-disc list-inside space-y-1 text-charcoal/50">
            <li>Big: Day trip, new restaurant, concert</li>
            <li>Little: New coffee shop, sunset walk, call an old friend</li>
          </ul>
        </div>
      )}

      {/* Summary */}
      {(adventures.big.completed || adventures.little.completed) && (
        <div className="text-center text-sm">
          <span className={`
            px-3 py-1 rounded-full
            ${adventures.big.completed && adventures.little.completed
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
            }
          `}>
            {adventures.big.completed && adventures.little.completed
              ? '🎉 Both adventures complete!'
              : '1 of 2 adventures done'
            }
          </span>
        </div>
      )}
    </div>
  );
}

export default AdventuresCard;
