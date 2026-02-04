import { useState } from 'react';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import { QUICK_WINS } from '../../utils/constants';
import { getRandomItem } from '../../utils/helpers';
import { Button } from '../common/Button';

export function QuickWins() {
  const [currentWin, setCurrentWin] = useState(null);
  const [completed, setCompleted] = useState([]);

  const getNewWin = () => {
    // Filter out completed wins if possible
    const available = QUICK_WINS.filter(w => !completed.includes(w));
    const pool = available.length > 0 ? available : QUICK_WINS;
    setCurrentWin(getRandomItem(pool));
  };

  const markComplete = () => {
    if (currentWin) {
      setCompleted(prev => [...prev, currentWin]);
      setCurrentWin(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-sunrise-yellow/20 flex items-center justify-center mb-6">
        <Sparkles className="w-10 h-10 text-sunrise-yellow" />
      </div>

      {currentWin ? (
        <div className="text-center max-w-xs">
          {/* Current quick win */}
          <div className="bg-sunrise-yellow/10 rounded-xl p-6 mb-4">
            <p className="text-lg font-medium text-charcoal">{currentWin}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={getNewWin}
              icon={RefreshCw}
            >
              Different one
            </Button>
            <Button
              onClick={markComplete}
              icon={Check}
            >
              Done!
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-charcoal/70 mb-4">
            Need a quick boost? Get a simple task to complete right now.
          </p>
          <Button onClick={getNewWin} icon={Sparkles} size="lg">
            Give me a quick win
          </Button>
        </div>
      )}

      {/* Completed count */}
      {completed.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-charcoal/50">
            🎉 {completed.length} quick {completed.length === 1 ? 'win' : 'wins'} today!
          </p>
        </div>
      )}

      {/* All quick wins list (collapsed) */}
      <details className="mt-6 w-full max-w-xs">
        <summary className="text-sm text-charcoal/50 cursor-pointer hover:text-charcoal">
          See all quick wins
        </summary>
        <ul className="mt-2 text-sm text-charcoal/60 space-y-1">
          {QUICK_WINS.map((win, i) => (
            <li key={i} className="flex items-center gap-2">
              {completed.includes(win) ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <span className="w-4 h-4" />
              )}
              <span className={completed.includes(win) ? 'line-through text-charcoal/40' : ''}>
                {win}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export default QuickWins;
