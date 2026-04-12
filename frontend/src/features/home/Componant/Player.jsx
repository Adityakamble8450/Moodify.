import React, { useEffect, useRef, useState } from "react";

const Player = ({ song }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current || !song?.url) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    const audio = audioRef.current;
    audio.src = song.url;
    audio.load();
    setCurrentTime(0);

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => {
        console.error("Audio autoplay failed:", error);
        setIsPlaying(false);
      });
  }, [song]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio play failed:", error);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolume = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skip = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      Math.max(audioRef.current.currentTime + seconds, 0),
      duration
    );
  };

  const changeRate = (rate) => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (sec) => {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const moodColors = {
    Happy: { from: "#f59e0b", to: "#f97316", glow: "#f59e0b" },
    Sad: { from: "#60a5fa", to: "#818cf8", glow: "#60a5fa" },
    Surprised: { from: "#a78bfa", to: "#ec4899", glow: "#a78bfa" },
    Neutral: { from: "#7F77DD", to: "#D4537E", glow: "#7F77DD" },
  };

  const colors = moodColors[song?.mood] || moodColors.Neutral;
  const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (!song) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-[#16161f]/80 backdrop-blur-xl border border-white/[0.07] rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1e1e2a] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13" stroke="#555570" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" stroke="#555570" strokeWidth="1.5" />
              <circle cx="18" cy="16" r="3" stroke="#555570" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="text-[#555570] text-sm">Detect your mood to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="relative bg-[#16161f]/90 backdrop-blur-xl border border-white/[0.07] rounded-3xl p-7 overflow-hidden">
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20 blur-[60px] pointer-events-none"
          style={{ background: colors.glow }}
        />

        <div className="relative flex items-center gap-5 mb-7">
          <div
            className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-xl"
            style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2" />
              <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg leading-tight truncate mb-1">
              {song.title || "Unknown Track"}
            </h3>
            <p className="text-[#8888aa] text-sm truncate">{song.artist || "Unknown Artist"}</p>
            <div
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: `${colors.from}22`,
                color: colors.from,
                border: `1px solid ${colors.from}44`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: colors.from }} />
              {song.mood || "Moodify"}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="relative h-1.5 bg-[#1e1e2a] rounded-full mb-2 cursor-pointer">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%`, background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-[#555570]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 mb-6">
          <button
            onClick={() => skip(-10)}
            className="w-10 h-10 rounded-xl bg-[#1e1e2a] border border-white/[0.07] flex items-center justify-center text-[#8888aa] hover:text-white hover:bg-[#252532] hover:border-white/[0.14] transition-all duration-200 group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 12a9 9 0 109-9H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 7v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="8" y="16" fontSize="6" fill="currentColor" fontWeight="600">10</text>
            </svg>
          </button>

          <button
            onClick={() => skip(-5)}
            className="w-10 h-10 rounded-xl bg-[#1e1e2a] border border-white/[0.07] flex items-center justify-center text-[#8888aa] hover:text-white hover:bg-[#252532] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 20L9 12l10-8v16zM7 4H5v16h2V4z" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              boxShadow: `0 8px 24px ${colors.glow}44`,
            }}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => skip(5)}
            className="w-10 h-10 rounded-xl bg-[#1e1e2a] border border-white/[0.07] flex items-center justify-center text-[#8888aa] hover:text-white hover:bg-[#252532] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 4l10 8-10 8V4zM17 4h2v16h-2V4z" />
            </svg>
          </button>

          <button
            onClick={() => skip(10)}
            className="w-10 h-10 rounded-xl bg-[#1e1e2a] border border-white/[0.07] flex items-center justify-center text-[#8888aa] hover:text-white hover:bg-[#252532] hover:border-white/[0.14] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 12a9 9 0 11-9-9h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M21 7v5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="8" y="16" fontSize="6" fill="currentColor" fontWeight="600">10</text>
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-xs text-[#555570] mr-1">Speed</span>
          {rates.map((rate) => (
            <button
              key={rate}
              onClick={() => changeRate(rate)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                playbackRate === rate
                  ? "text-white border"
                  : "bg-[#1e1e2a] text-[#8888aa] border border-white/[0.07] hover:text-white hover:bg-[#252532]"
              }`}
              style={
                playbackRate === rate
                  ? {
                      background: `${colors.from}22`,
                      borderColor: `${colors.from}66`,
                      color: colors.from,
                    }
                  : {}
              }
            >
              {rate}x
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleMute} className="text-[#8888aa] hover:text-white transition-colors">
            {isMuted || volume === 0 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <div className="relative flex-1 h-1.5 bg-[#1e1e2a] rounded-full">
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ width: `${isMuted ? 0 : volume * 100}%`, background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-xs text-[#555570] w-7 text-right">{isMuted ? 0 : Math.round(volume * 100)}</span>
        </div>
      </div>
    </div>
  );
};

export default Player;
