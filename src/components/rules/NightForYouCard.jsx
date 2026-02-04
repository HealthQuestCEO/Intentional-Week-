import { useWeekData } from '../../hooks/useWeekData';
import { Input, Select, Checkbox } from '../common/Input';
import { DAYS_FULL } from '../../utils/constants';

export function NightForYouCard({ currentDate }) {
  const { weekData, updateRule } = useWeekData(currentDate);
  const nightForYou = weekData?.nightForYou || {
    night: '',
    activity: '',
    took: false
  };

  const handleChange = (field, value) => {
    updateRule('nightForYou', { [field]: value });
  };

  const dayOptions = DAYS_FULL.map(day => ({
    value: day,
    label: day
  }));

  return (
    <div className="space-y-4">
      {/* Select night */}
      <Select
        label="Which night is yours?"
        value={nightForYou.night}
        onChange={(e) => handleChange('night', e.target.value)}
        options={dayOptions}
        placeholder="Choose a night..."
      />

      {/* Activity */}
      {nightForYou.night && (
        <Input
          label="What will you do?"
          placeholder="Reading, guitar, bath, hobby..."
          value={nightForYou.activity}
          onChange={(e) => handleChange('activity', e.target.value)}
        />
      )}

      {/* Completion */}
      {nightForYou.night && nightForYou.activity && (
        <div className="bg-teasel-lilac/20 rounded-lg p-3">
          <Checkbox
            label="I took my night!"
            checked={nightForYou.took}
            onChange={(e) => handleChange('took', e.target.checked)}
          />
        </div>
      )}

      {/* Status message */}
      {nightForYou.took && (
        <div className="text-center">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            🌟 You did it! You took time for yourself.
          </span>
        </div>
      )}

      {/* Tip */}
      {!nightForYou.night && (
        <div className="bg-teasel-lilac/10 rounded-lg p-3">
          <p className="text-sm text-charcoal/70">
            <strong>Tip:</strong> Pick a consistent night each week that's just for you.
            No obligations, no chores—just something you enjoy.
          </p>
        </div>
      )}
    </div>
  );
}

export default NightForYouCard;
