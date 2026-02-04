import { useState, useEffect, useCallback, useRef } from 'react';
import { TIMER_PRESETS } from '../utils/constants';

export function useTimer(onComplete = null) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('simple'); // 'simple' or 'pomodoro'
  const [pomodoroState, setPomodoroState] = useState({
    session: 1,
    isBreak: false,
    isLongBreak: false
  });
  const [targetSeconds, setTargetSeconds] = useState(null);
  const [tag, setTag] = useState(null);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;

          // Check if target reached (countdown mode)
          if (targetSeconds && newSeconds >= targetSeconds) {
            setIsRunning(false);
            clearInterval(intervalRef.current);

            // Handle pomodoro completion
            if (mode === 'pomodoro') {
              handlePomodoroComplete();
            }

            if (onComplete) {
              onComplete({
                seconds: newSeconds,
                tag,
                mode,
                pomodoroState
              });
            }
          }

          return newSeconds;
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
  }, [isRunning, targetSeconds, mode, onComplete, tag, pomodoroState]);

  const handlePomodoroComplete = useCallback(() => {
    const { session, isBreak, isLongBreak } = pomodoroState;
    const presets = TIMER_PRESETS.pomodoro;

    if (isBreak || isLongBreak) {
      // Break is over, start next work session
      setPomodoroState({
        session: isLongBreak ? 1 : session,
        isBreak: false,
        isLongBreak: false
      });
      setTargetSeconds(presets.work * 60);
    } else {
      // Work session is over
      if (session >= presets.sessionsBeforeLongBreak) {
        // Time for long break
        setPomodoroState({
          session: session,
          isBreak: false,
          isLongBreak: true
        });
        setTargetSeconds(presets.longBreak * 60);
      } else {
        // Short break
        setPomodoroState({
          session: session + 1,
          isBreak: true,
          isLongBreak: false
        });
        setTargetSeconds(presets.shortBreak * 60);
      }
    }

    setSeconds(0);
  }, [pomodoroState]);

  const start = useCallback(() => {
    startTimeRef.current = new Date();
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const stop = useCallback(() => {
    const elapsedSeconds = seconds;
    setIsRunning(false);
    setSeconds(0);
    setTargetSeconds(null);

    return {
      seconds: elapsedSeconds,
      minutes: Math.round(elapsedSeconds / 60),
      tag,
      mode,
      startTime: startTimeRef.current,
      endTime: new Date()
    };
  }, [seconds, tag, mode]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
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
    setMode('simple');
    setTargetSeconds(null);
    reset();
  }, [reset]);

  const setPomodoroMode = useCallback(() => {
    setMode('pomodoro');
    setPomodoroState({
      session: 1,
      isBreak: false,
      isLongBreak: false
    });
    setSeconds(0);
    setTargetSeconds(TIMER_PRESETS.pomodoro.work * 60);
  }, []);

  const setCountdown = useCallback((minutes) => {
    setTargetSeconds(minutes * 60);
    setSeconds(0);
  }, []);

  const tagTimer = useCallback((newTag) => {
    setTag(newTag);
  }, []);

  // Calculate remaining time for countdown
  const remainingSeconds = targetSeconds ? Math.max(0, targetSeconds - seconds) : null;

  // Calculate progress percentage for pomodoro
  const progress = targetSeconds ? (seconds / targetSeconds) * 100 : null;

  return {
    // State
    seconds,
    isRunning,
    mode,
    pomodoroState,
    targetSeconds,
    remainingSeconds,
    progress,
    tag,

    // Actions
    start,
    pause,
    stop,
    reset,
    setSimpleMode,
    setPomodoroMode,
    setCountdown,
    tagTimer
  };
}
