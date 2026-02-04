import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../common/Button';

const PRESETS = [5, 10, 15, 30, 60];

export function WalkReminder() {
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [isScheduled, setIsScheduled] = useState(false);
  const { isSupported, isGranted, requestPermission, schedule } = useNotifications();

  const handleSchedule = async () => {
    if (!isGranted) {
      const result = await requestPermission();
      if (!result.granted) {
        alert('Please enable notifications to use walk reminders');
        return;
      }
    }

    schedule(
      'walk-reminder',
      'Time for a walk!',
      "Step away from your screen and take a quick walk. Even 5 minutes helps!",
      selectedMinutes
    );

    setIsScheduled(true);

    // Reset after the scheduled time
    setTimeout(() => {
      setIsScheduled(false);
    }, selectedMinutes * 60 * 1000);
  };

  if (!isSupported) {
    return (
      <div className="text-center text-charcoal/50">
        <p>Notifications are not supported in this browser.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-gelato-mint/20 flex items-center justify-center mb-6">
        <span className="text-4xl">🚶</span>
      </div>

      {isScheduled ? (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">Reminder set!</span>
          </div>
          <p className="text-sm text-charcoal/60">
            You'll be reminded in {selectedMinutes} minutes
          </p>
          <button
            onClick={() => setIsScheduled(false)}
            className="mt-4 text-sm text-balanced-teal hover:underline"
          >
            Cancel reminder
          </button>
        </div>
      ) : (
        <>
          {/* Time presets */}
          <p className="text-sm text-charcoal/70 mb-3">Remind me in:</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {PRESETS.map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedMinutes(mins)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedMinutes === mins
                    ? 'bg-gelato-mint text-white'
                    : 'bg-gray-100 text-charcoal/60 hover:bg-gray-200'
                  }
                `}
              >
                {mins < 60 ? `${mins}m` : '1h'}
              </button>
            ))}
          </div>

          {/* Schedule button */}
          <Button onClick={handleSchedule} icon={Bell}>
            Set Walk Reminder
          </Button>

          {/* Tip */}
          <p className="mt-6 text-sm text-charcoal/50 text-center max-w-xs">
            Regular movement breaks improve focus and reduce fatigue.
            Even a 2-minute walk counts!
          </p>
        </>
      )}
    </div>
  );
}

export default WalkReminder;
