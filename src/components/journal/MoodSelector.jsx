import { MOOD_EMOJIS } from '../../utils/constants';

export function MoodSelector({ value, onChange, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const moodValues = [1, 2, 3, 4, 5];

  return (
    <div className="flex justify-center gap-2 md:gap-4">
      {moodValues.map((moodValue) => {
        const mood = MOOD_EMOJIS[moodValue];
        const isSelected = value === moodValue;

        return (
          <button
            key={moodValue}
            onClick={() => onChange(moodValue)}
            className={`
              ${sizeClasses[size]} rounded-xl flex items-center justify-center
              transition-all duration-200
              ${isSelected
                ? 'ring-4 ring-balanced-teal ring-offset-2 scale-110 bg-balanced-teal/10'
                : 'hover:scale-105 hover:bg-gray-100'
              }
            `}
            title={mood.label}
          >
            <MoodEmoji mood={mood} size={size} />
          </button>
        );
      })}
    </div>
  );
}

export function MoodEmoji({ mood, size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-lg',
    sm: 'w-8 h-8 text-2xl',
    md: 'w-10 h-10 text-3xl',
    lg: 'w-16 h-16 text-5xl',
  };

  // Fallback emoji mapping
  const emojiMap = {
    'crying-face': '😢',
    'worried-face': '😟',
    'slightly-smiling-face': '🙂',
    'grinning-face-with-big-eyes': '😃',
    'star-struck': '🤩',
  };

  return (
    <span className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      {emojiMap[mood.name] || '😐'}
    </span>
  );
}

export function MoodDisplay({ value, size = 'md', showLabel = false }) {
  if (!value) return null;

  const mood = MOOD_EMOJIS[value];
  if (!mood) return null;

  return (
    <div className="flex items-center gap-2">
      <MoodEmoji mood={mood} size={size} />
      {showLabel && (
        <span className="text-sm text-charcoal/60">{mood.label}</span>
      )}
    </div>
  );
}

export default MoodSelector;
