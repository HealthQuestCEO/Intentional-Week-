import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const PHASES = [
  { name: 'Inhale', duration: 4 },
  { name: 'Hold', duration: 4 },
  { name: 'Exhale', duration: 4 },
  { name: 'Hold', duration: 4 },
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
            // Move to next phase
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
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
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

  // Calculate the circle size based on phase
  const getCircleScale = () => {
    if (!isRunning) return 1;
    const baseScale = phase.name === 'Inhale' ? 0.6 + (progress / 100) * 0.4 :
                     phase.name === 'Exhale' ? 1 - (progress / 100) * 0.4 :
                     phase.name === 'Hold' && currentPhase === 1 ? 1 : 0.6;
    return baseScale;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Breathing circle */}
      <div className="relative w-48 h-48 mb-6">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-balanced-teal/10" />

        {/* Animated breathing circle */}
        <div
          className="absolute inset-4 rounded-full bg-balanced-teal/30 transition-transform duration-1000 ease-in-out flex items-center justify-center"
          style={{ transform: `scale(${getCircleScale()})` }}
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-balanced-teal">{countdown}</p>
            <p className="text-sm text-balanced-teal/70">{phase.name}</p>
          </div>
        </div>

        {/* Corner indicators for "box" */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-balanced-teal rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-balanced-teal rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-balanced-teal rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-balanced-teal rounded-br-lg" />
      </div>

      {/* Phase indicators */}
      <div className="flex gap-2 mb-6">
        {PHASES.map((p, i) => (
          <div
            key={i}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-colors
              ${i === currentPhase
                ? 'bg-balanced-teal text-white'
                : 'bg-gray-100 text-charcoal/50'
              }
            `}
          >
            {p.name}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-colors
            ${isRunning
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              : 'bg-balanced-teal text-white hover:bg-balanced-teal/90'
            }
          `}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-full bg-gray-100 text-charcoal/60 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Cycles counter */}
      {cycles > 0 && (
        <p className="mt-4 text-sm text-charcoal/60">
          {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed
        </p>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-charcoal/50 max-w-xs">
        <p>4-4-4-4 breathing pattern</p>
        <p>Inhale, hold, exhale, hold — each for 4 seconds</p>
      </div>
    </div>
  );
}

export default BoxBreathing;
