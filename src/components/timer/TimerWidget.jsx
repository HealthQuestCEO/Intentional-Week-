import { useState } from 'react';
import { Timer as TimerIcon, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Timer } from './Timer';

export function TimerWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 w-14 h-14 bg-balanced-teal text-white rounded-full shadow-lg flex items-center justify-center hover:bg-balanced-teal/90 transition-colors"
      >
        <TimerIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`
      fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50
      bg-white rounded-2xl shadow-xl border border-gray-100
      transition-all duration-300
      ${isExpanded ? 'w-80' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <TimerIcon className="w-5 h-5 text-balanced-teal" />
          <span className="font-medium text-charcoal">Timer</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-charcoal/60" />
            ) : (
              <ChevronUp className="w-4 h-4 text-charcoal/60" />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-charcoal/60" />
          </button>
        </div>
      </div>

      {/* Timer content */}
      <div className="p-4">
        <Timer expanded={isExpanded} />
      </div>
    </div>
  );
}

export default TimerWidget;
