import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const PHASES = [
  { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly' },
  { name: 'Hold', duration: 4, instruction: 'Hold your breath' },
  { name: 'Exhale', duration: 4, instruction: 'Breathe out slowly' },
  { name: 'Hold', duration: 4, instruction: 'Hold empty' },
];

export function BoxBreathing() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCurrentPhase((phase) => {
              const nextPhase = (phase + 1) % PHASES.length;
              if (nextPhase === 0) {
                setCycles((c) => c + 1);
              }
              return nextPhase;
            });
            return PHASES[(currentPhase + 1) % PHASES.length].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, currentPhase]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhase(0);
    setCountdown(PHASES[0].duration);
    setCycles(0);
  };

  const phase = PHASES[currentPhase];
  const progress = ((phase.duration - countdown) / phase.duration) * 100;

  // Calculate circle scale based on breathing phase
  const getCircleScale = () => {
    if (!isRunning) return 0.7;

    switch (phase.name) {
      case 'Inhale':
        return 0.7 + (progress / 100) * 0.3; // 0.7 -> 1.0
      case 'Hold':
        return currentPhase === 1 ? 1.0 : 0.7; // Stay at current size
      case 'Exhale':
        return 1.0 - (progress / 100) * 0.3; // 1.0 -> 0.7
      default:
        return 0.7;
    }
  };

  // Get circle color based on phase
  const getCircleColor = () => {
    switch (phase.name) {
      case 'Inhale':
        return 'bg-balanced-teal';
      case 'Exhale':
        return 'bg-teasel-lilac';
      case 'Hold':
        return currentPhase === 1 ? 'bg-gelato-mint' : 'bg-rainfall';
      default:
        return 'bg-balanced-teal';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Box frame with animated dot */}
      <div className="relative w-56 h-56 mb-6">
        {/* The box outline */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Box path */}
          <rect
            x="20"
            y="20"
            width="160"
            height="160"
            fill="none"
            stroke="#3D7A7A"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.3"
          />

          {/* Animated dot that travels around the box */}
          {isRunning && (
            <circle
              r="8"
              fill="#3D7A7A"
              className="animate-pulse"
            >
              <animateMotion
                dur={`${PHASES.reduce((a, p) => a + p.duration, 0)}s`}
                repeatCount="indefinite"
                path="M 20,20 L 180,20 L 180,180 L 20,180 Z"
              />
            </circle>
          )}
        </svg>

        {/* Central breathing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`
              rounded-full transition-all duration-1000 ease-in-out
              flex items-center justify-center
              ${getCircleColor()}
            `}
            style={{
              width: `${getCircleScale() * 140}px`,
              height: `${getCircleScale() * 140}px`,
              opacity: 0.8,
            }}
          >
            <div className="text-center text-white">
              <p className="text-4xl font-bold">{countdown}</p>
              <p className="text-sm opacity-80">{phase.name}</p>
            </div>
          </div>
        </div>

        {/* Corner labels */}
        <span className="absolute top-1 left-1 text-xs text-balanced-teal/60">Inhale</span>
        <span className="absolute top-1 right-1 text-xs text-balanced-teal/60">Hold</span>
        <span className="absolute bottom-1 right-1 text-xs text-balanced-teal/60">Exhale</span>
        <span className="absolute bottom-1 left-1 text-xs text-balanced-teal/60">Hold</span>
      </div>

      {/* Instruction text */}
      <p className="text-lg text-charcoal mb-4 h-7">
        {isRunning ? phase.instruction : 'Press play to begin'}
      </p>

      {/* Phase progress bar */}
      <div className="flex gap-1 mb-6 w-full max-w-xs">
        {PHASES.map((p, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden"
          >
            <div
              className={`h-full transition-all duration-300 ${
                i < currentPhase
                  ? 'bg-balanced-teal w-full'
                  : i === currentPhase
                  ? 'bg-balanced-teal'
                  : 'w-0'
              }`}
              style={{
                width: i === currentPhase ? `${progress}%` : i < currentPhase ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all
            ${isRunning
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              : 'bg-balanced-teal text-white hover:bg-balanced-teal/90 hover:scale-105'
            }
          `}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>
        <button
          onClick={handleReset}
          className="w-14 h-14 rounded-full bg-gray-100 text-charcoal/60 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Cycles counter */}
      {cycles > 0 && (
        <div className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-charcoal/50 max-w-xs">
        <p className="font-medium mb-1">4-4-4-4 Box Breathing</p>
        <p>A calming technique used by Navy SEALs. Each phase lasts 4 seconds.</p>
      </div>
    </div>
  );
}

export default BoxBreathing;
