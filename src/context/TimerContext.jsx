import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { TIMER_PRESETS } from '../utils/constants';

const TimerContext = createContext(null);

export function TimerProvider({ children }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('simple');
  const [pomodoroState, setPomodoroState] = useState({
    session: 1,
    isBreak: false,
    isLongBreak: false
  });
  const [targetSeconds, setTargetSeconds] = useState(null);
  const [tag, setTag] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [stoppedTime, setStoppedTime] = useState(null);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Handle pomodoro completion
  useEffect(() => {
    if (mode === 'pomodoro' && targetSeconds && seconds >= targetSeconds) {
      setIsRunning(false);
      playSound('complete');

      const presets = TIMER_PRESETS.pomodoro;

      if (pomodoroState.isBreak || pomodoroState.isLongBreak) {
        setPomodoroState(prev => ({
          session: prev.isLongBreak ? 1 : prev.session,
          isBreak: false,
          isLongBreak: false
        }));
        setTargetSeconds(presets.work * 60);
      } else {
        if (pomodoroState.session >= presets.sessionsBeforeLongBreak) {
          setPomodoroState(prev => ({
            ...prev,
            isBreak: false,
            isLongBreak: true
          }));
          setTargetSeconds(presets.longBreak * 60);
        } else {
          setPomodoroState(prev => ({
            session: prev.session + 1,
            isBreak: true,
            isLongBreak: false
          }));
          setTargetSeconds(presets.shortBreak * 60);
        }
      }
      setSeconds(0);
    }
  }, [seconds, targetSeconds, mode, pomodoroState]);

  const playSound = (type) => {
    // Will implement with actual sounds
    try {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {
      console.log('Sound not available');
    }
  };

  const start = useCallback(() => {
    startTimeRef.current = new Date();
    setIsRunning(true);
    setShowAdjustModal(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const stop = useCallback(() => {
    const elapsedSeconds = seconds;
    setIsRunning(false);
    setStoppedTime(elapsedSeconds);
    setShowAdjustModal(true); // Show adjustment modal

    return {
      seconds: elapsedSeconds,
      minutes: Math.round(elapsedSeconds / 60),
      tag,
      mode,
      startTime: startTimeRef.current,
      endTime: new Date()
    };
  }, [seconds, tag, mode]);

  const confirmTime = useCallback((adjustedMinutes) => {
    const result = {
      seconds: adjustedMinutes * 60,
      minutes: adjustedMinutes,
      tag,
      mode,
      startTime: startTimeRef.current,
      endTime: new Date()
    };
    setSeconds(0);
    setStoppedTime(null);
    setShowAdjustModal(false);
    return result;
  }, [tag, mode]);

  const cancelAdjust = useCallback(() => {
    setSeconds(0);
    setStoppedTime(null);
    setShowAdjustModal(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
    setShowAdjustModal(false);
    setStoppedTime(null);
    if (mode === 'pomodoro') {
      setPomodoroState({
        session: 1,
        isBreak: false,
        isLongBreak: false
      });
      setTargetSeconds(TIMER_PRESETS.pomodoro.work * 60);
    } else {
      setTargetSeconds(null);
    }
  }, [mode]);

  const setSimpleMode = useCallback(() => {
    setIsRunning(false);
    setMode('simple');
    setTargetSeconds(null);
    setSeconds(0);
  }, []);

  const setPomodoroMode = useCallback(() => {
    setIsRunning(false);
    setMode('pomodoro');
    setPomodoroState({
      session: 1,
      isBreak: false,
      isLongBreak: false
    });
    setSeconds(0);
    setTargetSeconds(TIMER_PRESETS.pomodoro.work * 60);
  }, []);

  const remainingSeconds = targetSeconds ? Math.max(0, targetSeconds - seconds) : null;
  const progress = targetSeconds ? (seconds / targetSeconds) * 100 : null;

  const value = {
    seconds,
    isRunning,
    mode,
    pomodoroState,
    targetSeconds,
    remainingSeconds,
    progress,
    tag,
    showAdjustModal,
    stoppedTime,
    setTag,
    start,
    pause,
    stop,
    reset,
    confirmTime,
    cancelAdjust,
    setSimpleMode,
    setPomodoroMode,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

export function useGlobalTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useGlobalTimer must be used within a TimerProvider');
  }
  return context;
}
