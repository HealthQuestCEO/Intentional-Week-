import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatTimerDisplay } from '../../utils/dateUtils';
import { TIMER_PRESETS } from '../../utils/constants';

export function MeditationTimer() {
  const [duration, setDuration] = useState(5); // minutes
  const [seconds, setSeconds] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setSeconds(duration * 60);
    setIsComplete(false);
  }, [duration]);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            // Play completion sound
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds]);

  const playChime = () => {
    // Create a simple chime sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 528; // Hz - "miracle tone"
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(duration * 60);
    setIsComplete(false);
  };

  const progress = ((duration * 60 - seconds) / (duration * 60)) * 100;

  return (
    <div className="flex flex-col items-center">
      {/* Duration selector */}
      <div className="flex gap-2 mb-6">
        {TIMER_PRESETS.meditation.map((mins) => (
          <button
            key={mins}
            onClick={() => setDuration(mins)}
            disabled={isRunning}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${duration === mins
                ? 'bg-teasel-lilac text-white'
                : 'bg-gray-100 text-charcoal/60 hover:bg-gray-200'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {mins}m
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="relative w-48 h-48 mb-6">
        {/* Progress ring */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="#B8B4C8"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={553}
            strokeDashoffset={553 - (progress / 100) * 553}
            className="transition-all duration-1000"
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold text-charcoal">
            {formatTimerDisplay(seconds)}
          </span>
          {isComplete && (
            <span className="text-sm text-teasel-lilac mt-2">Complete!</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          disabled={isComplete}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isRunning
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              : 'bg-teasel-lilac text-white hover:bg-teasel-lilac/90'
            }
          `}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button
          onClick={handleReset}
          className="w-14 h-14 rounded-full bg-gray-100 text-charcoal/60 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Tip */}
      <p className="mt-6 text-sm text-charcoal/50 text-center max-w-xs">
        Find a comfortable position, close your eyes, and focus on your breath.
      </p>
    </div>
  );
}

export default MeditationTimer;
