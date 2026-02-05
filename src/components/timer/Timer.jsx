import { useState } from 'react';
import { Play, Pause, RotateCcw, Square, Coffee, Clock, Check } from 'lucide-react';
import { useGlobalTimer } from '../../context/TimerContext';
import { useWeekData } from '../../hooks/useWeekData';
import { useAuth } from '../../hooks/useAuth';
import { formatTimerDisplay } from '../../utils/dateUtils';
import { TIMER_PRESETS } from '../../utils/constants';

export function Timer({ expanded = false }) {
  const { user } = useAuth();
  const { weekData, addTimerLog } = useWeekData();
  const [selectedTask, setSelectedTask] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [adjustedMinutes, setAdjustedMinutes] = useState(0);

  const {
    seconds,
    isRunning,
    mode,
    pomodoroState,
    remainingSeconds,
    progress,
    showAdjustModal,
    stoppedTime,
    start,
    pause,
    stop,
    reset,
    confirmTime,
    cancelAdjust,
    setSimpleMode,
    setPomodoroMode,
  } = useGlobalTimer();

  const tasks = weekData?.fridayPlan?.career?.tasks || [];

  const displayTime = mode === 'pomodoro' && remainingSeconds !== null
    ? formatTimerDisplay(remainingSeconds)
    : formatTimerDisplay(seconds);

  const handleStop = () => {
    const result = stop();
    // Set initial adjusted minutes from stopped time
    setAdjustedMinutes(Math.round(result.seconds / 60));
  };

  const handleConfirmTime = () => {
    const result = confirmTime(adjustedMinutes);
    if (adjustedMinutes > 0 && user) {
      addTimerLog({
        activity: selectedTask || customTag || 'Untitled',
        minutes: adjustedMinutes,
        date: new Date().toISOString().split('T')[0],
        mode: result.mode,
        tag: selectedTask || customTag
      });
    }
  };

  const handleCancelAdjust = () => {
    cancelAdjust();
    setAdjustedMinutes(0);
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={setSimpleMode}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
            mode === 'simple'
              ? 'bg-white text-charcoal shadow-sm'
              : 'text-charcoal/60 hover:text-charcoal'
          }`}
        >
          Simple
        </button>
        <button
          onClick={setPomodoroMode}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
            mode === 'pomodoro'
              ? 'bg-white text-charcoal shadow-sm'
              : 'text-charcoal/60 hover:text-charcoal'
          }`}
        >
          Pomodoro
        </button>
      </div>

      {/* Timer display */}
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-charcoal">
          {displayTime}
        </div>

        {/* Pomodoro status */}
        {mode === 'pomodoro' && (
          <div className="mt-2 flex items-center justify-center gap-2">
            {pomodoroState.isBreak || pomodoroState.isLongBreak ? (
              <>
                <Coffee className="w-4 h-4 text-balanced-teal" />
                <span className="text-sm text-charcoal/60">
                  {pomodoroState.isLongBreak ? 'Long break' : 'Short break'}
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-balanced-teal" />
                <span className="text-sm text-charcoal/60">
                  Focus session {pomodoroState.session} of {TIMER_PRESETS.pomodoro.sessionsBeforeLongBreak}
                </span>
              </>
            )}
          </div>
        )}

        {/* Progress bar for pomodoro */}
        {mode === 'pomodoro' && progress !== null && (
          <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                pomodoroState.isBreak || pomodoroState.isLongBreak
                  ? 'bg-green-400'
                  : 'bg-balanced-teal'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {isRunning ? (
          <button
            onClick={pause}
            className="w-14 h-14 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition-colors"
          >
            <Pause className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={start}
            className="w-14 h-14 rounded-full bg-balanced-teal text-white flex items-center justify-center hover:bg-balanced-teal/90 transition-colors"
          >
            <Play className="w-6 h-6 ml-1" />
          </button>
        )}
        <button
          onClick={handleStop}
          disabled={seconds === 0}
          className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Finish & Log Time"
        >
          <Square className="w-5 h-5 fill-current" />
        </button>
        <button
          onClick={reset}
          className="w-14 h-14 rounded-full bg-gray-100 text-charcoal/60 flex items-center justify-center hover:bg-gray-200 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Finish button label */}
      {seconds > 0 && !isRunning && (
        <p className="text-center text-sm text-charcoal/60">
          Press the red button to finish and log your time
        </p>
      )}

      {/* Tag selection (expanded view) */}
      {expanded && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          {/* Task selection */}
          {tasks.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                Link to task
              </label>
              <select
                value={selectedTask}
                onChange={(e) => {
                  setSelectedTask(e.target.value);
                  setCustomTag('');
                }}
                className="w-full text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-balanced-teal"
              >
                <option value="">Select a task...</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.name}>
                    {task.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Custom tag */}
          <div>
            <label className="block text-xs font-medium text-charcoal/60 mb-1">
              Or add a custom tag
            </label>
            <input
              type="text"
              placeholder="What are you working on?"
              value={customTag}
              onChange={(e) => {
                setCustomTag(e.target.value);
                setSelectedTask('');
              }}
              className="w-full text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-balanced-teal"
            />
          </div>
        </div>
      )}

      {/* Time Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-expand">
            <h3 className="text-lg font-bold text-charcoal mb-2">
              Adjust Time
            </h3>
            <p className="text-charcoal/60 text-sm mb-4">
              Recorded: {Math.round(stoppedTime / 60)} minutes. Adjust if needed.
            </p>

            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setAdjustedMinutes(Math.max(0, adjustedMinutes - 5))}
                className="w-10 h-10 rounded-full bg-gray-100 text-charcoal flex items-center justify-center hover:bg-gray-200"
              >
                -5
              </button>
              <button
                onClick={() => setAdjustedMinutes(Math.max(0, adjustedMinutes - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 text-charcoal flex items-center justify-center hover:bg-gray-200"
              >
                -1
              </button>
              <div className="text-3xl font-bold text-charcoal min-w-[80px] text-center">
                {adjustedMinutes}
                <span className="text-sm font-normal text-charcoal/60 ml-1">min</span>
              </div>
              <button
                onClick={() => setAdjustedMinutes(adjustedMinutes + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 text-charcoal flex items-center justify-center hover:bg-gray-200"
              >
                +1
              </button>
              <button
                onClick={() => setAdjustedMinutes(adjustedMinutes + 5)}
                className="w-10 h-10 rounded-full bg-gray-100 text-charcoal flex items-center justify-center hover:bg-gray-200"
              >
                +5
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmTime}
                className="flex-1 flex items-center justify-center gap-2 bg-balanced-teal text-white px-4 py-3 rounded-xl font-medium hover:bg-balanced-teal/90 transition-colors"
              >
                <Check className="w-5 h-5" />
                Log Time
              </button>
              <button
                onClick={handleCancelAdjust}
                className="px-4 py-3 text-charcoal/60 hover:text-charcoal font-medium"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timer;
