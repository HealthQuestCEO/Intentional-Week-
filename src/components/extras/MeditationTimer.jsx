import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Video, Music } from 'lucide-react';
import { formatTimerDisplay } from '../../utils/dateUtils';
import { TIMER_PRESETS } from '../../utils/constants';

export function MeditationTimer() {
  const [duration, setDuration] = useState(5); // minutes
  const [seconds, setSeconds] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [mediaMode, setMediaMode] = useState('audio'); // 'audio' or 'video'
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const intervalRef = useRef(null);
  const videoRef = useRef(null);

  // Check if video file exists
  useEffect(() => {
    fetch('/videos/meditation-loop.mp4', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setVideoAvailable(true);
      })
      .catch(() => setVideoAvailable(false));
  }, []);

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

  // Control video playback based on timer state
  useEffect(() => {
    if (videoRef.current && videoAvailable && mediaMode === 'video') {
      if (isRunning) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isRunning, videoAvailable, mediaMode]);

  // Reset video when complete
  useEffect(() => {
    if (isComplete && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isComplete]);

  const playChime = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 528;
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
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleStart = () => {
    setIsRunning(!isRunning);
  };

  const progress = ((duration * 60 - seconds) / (duration * 60)) * 100;

  return (
    <div className="flex flex-col items-center">
      {/* Media mode toggle */}
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setMediaMode('audio')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${mediaMode === 'audio'
              ? 'bg-white text-charcoal shadow-sm'
              : 'text-charcoal/60 hover:text-charcoal'
            }
          `}
        >
          <Music className="w-4 h-4" />
          Music
        </button>
        {videoAvailable && (
          <button
            onClick={() => setMediaMode('video')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${mediaMode === 'video'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-charcoal/60 hover:text-charcoal'
              }
            `}
          >
            <Video className="w-4 h-4" />
            Video
          </button>
        )}
      </div>

      {/* SoundCloud embed for audio mode */}
      {mediaMode === 'audio' && showPlayer && (
        <div className="w-full max-w-md mb-4 rounded-xl overflow-hidden">
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/10492903&color=%23B8B4C8&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
            title="Meditation Music"
          />
        </div>
      )}

      {/* Video background */}
      {mediaMode === 'video' && videoAvailable && (
        <div
          className={`
            transition-all duration-500 overflow-hidden rounded-2xl mb-4
            ${isRunning ? 'w-full max-w-md aspect-video' : 'w-48 h-28'}
          `}
        >
          <video
            ref={videoRef}
            src="/videos/meditation-loop.mp4"
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Toggle player visibility for audio mode */}
      {mediaMode === 'audio' && (
        <button
          onClick={() => setShowPlayer(!showPlayer)}
          className="text-sm text-charcoal/60 hover:text-charcoal mb-4"
        >
          {showPlayer ? 'Hide player' : 'Show player'}
        </button>
      )}

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
          onClick={handleStart}
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
        {mediaMode === 'audio'
          ? 'Press play on the music player, then start your timer. Close your eyes and breathe.'
          : 'Focus on the video and your breath. Let thoughts come and go.'}
      </p>
    </div>
  );
}

export default MeditationTimer;
