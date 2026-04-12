import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { detectEmotionFromBlendshapes } from "../utils/emotionUtils";
import { getSong } from "../services/song.api";
import Player from "../Componant/Player";

const MOOD_CONFIG = {
  Happy: { color: "#f59e0b", bg: "#f59e0b22", border: "#f59e0b44", emoji: "😀", label: "Happy" },
  Sad: { color: "#60a5fa", bg: "#60a5fa22", border: "#60a5fa44", emoji: "😢", label: "Sad" },
  Surprised: { color: "#a78bfa", bg: "#a78bfa22", border: "#a78bfa44", emoji: "😲", label: "Surprised" },
  Neutral: { color: "#7F77DD", bg: "#7F77DD22", border: "#7F77DD44", emoji: "😐", label: "Neutral" },
};

const EMOTION_TO_API_MOOD = {
  Happy: "happy",
  Sad: "sad",
  Surprised: "surprised",
};

export default function FaceEmotionDetector() {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [emotion, setEmotion] = useState(null);
  const [scores, setScores] = useState({});
  const [song, setSong] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [songLoading, setSongLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          outputFaceBlendshapes: true,
          numFaces: 1,
        });

        setIsModelReady(true);
      } catch (err) {
        console.error("Model load failed:", err);
      }
    };

    loadModel();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });

        await videoRef.current.play();
        setIsCameraReady(true);
        setCameraOn(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const fetchSong = async (detectedEmotion) => {
    const apiMood = EMOTION_TO_API_MOOD[detectedEmotion];

    if (!apiMood) {
      setSong(null);
      return;
    }

    setSongLoading(true);

    try {
      const data = await getSong({ mood: apiMood });

      if (data?.song) {
        setSong({ ...data.song, mood: detectedEmotion });
      } else {
        setSong(null);
      }
    } catch (err) {
      console.error("Song fetch error:", err);
      setSong(null);
    } finally {
      setSongLoading(false);
    }
  };

  const handleDetect = async () => {
    if (!isCameraReady || !isModelReady) return;

    setIsLoading(true);
    setIsDetecting(true);
    setEmotion(null);
    setScores({});
    setSong(null);

    let detected = false;
    let latestDetectedEmotion = null;
    const startTime = performance.now();
    const DETECT_DURATION = 3000;

    const processFrame = () => {
      const video = videoRef.current;
      if (!video || !faceLandmarkerRef.current) return;

      const elapsed = performance.now() - startTime;

      if (video.readyState >= 2) {
        const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());

        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          const blendshapes = results.faceBlendshapes[0].categories;
          const { emotion: detectedEmotion, scores: detectedScores } =
            detectEmotionFromBlendshapes(blendshapes);

          setEmotion(detectedEmotion);
          setScores(detectedScores);
          latestDetectedEmotion = detectedEmotion;
          detected = true;
        } else {
          setEmotion("No Face Detected");
        }
      }

      if (elapsed < DETECT_DURATION) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      setIsLoading(false);
      setIsDetecting(false);

      if (detected && latestDetectedEmotion) {
        fetchSong(latestDetectedEmotion);
      }
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);
  };

  const moodCfg = MOOD_CONFIG[emotion] || null;

  return (
    <main className="min-h-screen bg-[#0d0d14] px-4 py-10 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[#7F77DD] opacity-15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-[#D4537E] opacity-15 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7F77DD] to-[#D4537E] flex items-center justify-center shadow-lg shadow-[#7F77DD]/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2" />
              <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#7F77DD] to-[#D4537E] bg-clip-text text-transparent tracking-tight">
            Moodify
          </span>
          <span className="ml-auto text-xs text-[#555570] px-3 py-1.5 rounded-full bg-[#1e1e2a] border border-white/[0.07]">
            {isModelReady ? "Model ready" : "Loading model..."}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-5">
            <div className="bg-[#16161f]/80 backdrop-blur-xl border border-white/[0.07] rounded-3xl overflow-hidden">
              <div className="relative aspect-video bg-[#0d0d14] flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-500 ${cameraOn ? "opacity-100" : "opacity-0"}`}
                />

                {!cameraOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-[#1e1e2a] border border-white/[0.07] flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M23 7l-7 5 7 5V7z" stroke="#555570" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="1" y="5" width="15" height="14" rx="2" stroke="#555570" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <p className="text-[#555570] text-sm">Camera not started</p>
                  </div>
                )}

                {isDetecting && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 rounded-full border-2 border-[#7F77DD]/60 animate-ping" />
                    <div className="absolute w-40 h-40 rounded-full border border-[#D4537E]/40 animate-pulse" />
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7F77DD] to-transparent animate-bounce" />
                  </div>
                )}

                {emotion && emotion !== "No Face Detected" && moodCfg && (
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md border"
                    style={{ background: moodCfg.bg, borderColor: moodCfg.border, color: moodCfg.color }}
                  >
                    {moodCfg.emoji} {emotion}
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col gap-3">
                {!cameraOn ? (
                  <button
                    onClick={startCamera}
                    className="w-full h-11 rounded-xl bg-[#1e1e2a] border border-white/[0.07] text-[#8888aa] text-sm font-medium hover:text-white hover:bg-[#252532] hover:border-white/[0.14] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M23 7l-7 5 7 5V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Start Camera
                  </button>
                ) : (
                  <button
                    onClick={handleDetect}
                    disabled={!isModelReady || isDetecting}
                    className="w-full h-12 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #7F77DD, #D4537E)",
                      boxShadow: "0 6px 20px rgba(127, 119, 221, 0.35)",
                    }}
                  >
                    {isDetecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Detecting mood...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Detect My Mood
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {emotion && emotion !== "No Face Detected" && (
              <div className="bg-[#16161f]/80 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs text-[#555570] font-medium uppercase tracking-wider mb-4">Emotion Scores</p>
                <div className="flex flex-col gap-3">
                  {Object.entries(scores).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#8888aa] capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="text-white font-medium">{val}</span>
                      </div>
                      <div className="h-1.5 bg-[#1e1e2a] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(parseFloat(val) * 100, 100)}%`,
                            background: moodCfg
                              ? `linear-gradient(90deg, ${moodCfg.color}, ${moodCfg.color}88)`
                              : "linear-gradient(90deg, #7F77DD, #D4537E)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {emotion === "No Face Detected" && (
              <div className="bg-[#16161f]/80 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
                    <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-red-400 text-sm">No face detected. Make sure your face is visible.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {songLoading ? (
              <div className="bg-[#16161f]/80 backdrop-blur-xl border border-white/[0.07] rounded-3xl p-10 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-[#7F77DD]/30 border-t-[#7F77DD] rounded-full animate-spin" />
                <p className="text-[#8888aa] text-sm">Finding songs for your mood...</p>
              </div>
            ) : (
              <Player song={song} />
            )}

            {!song && !songLoading && (
              <div className="bg-[#16161f]/80 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs text-[#555570] font-medium uppercase tracking-wider mb-4">Moods we detect</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(MOOD_CONFIG).map(([mood, cfg]) => (
                    <div
                      key={mood}
                      className="flex items-center gap-2.5 p-3 rounded-xl border"
                      style={{ background: cfg.bg, borderColor: cfg.border }}
                    >
                      <span className="text-xl">{cfg.emoji}</span>
                      <span className="text-sm font-medium" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
