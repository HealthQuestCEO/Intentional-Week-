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
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Simple timer tick - minimal dependencies
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

  // Handle target reached (separate effect for pomodoro countdown)
  useEffect(() => {
    if (mode === 'pomodoro' && targetSeconds && seconds >= targetSeconds) {
      setIsRunning(false);

      const presets = TIMER_PRESETS.pomodoro;

      if (pomodoroState.isBreak || pomodoroState.isLongBreak) {
        // Break is over, start next work session
        setPomodoroState(prev => ({
          session: prev.isLongBreak ? 1 : prev.session,
          isBreak: false,
          isLongBreak: false
        }));
        setTargetSeconds(presets.work * 60);
      } else {
        // Work session is over
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

      if (onCompleteRef.current) {
        onCompleteRef.current({
          seconds,
          minutes: Math.round(seconds / 60),
          tag,
          mode,
          pomodoroState
        });
      }
    }
  }, [seconds, targetSeconds, mode, pomodoroState, tag]);

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
