import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import { detectEmotionFromBlendshapes } from "../utils/emotionUtils";

export default function FaceEmotionDetector() {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("Loading...");
  const [scores, setScores] = useState({});

  useEffect(() => {
    let faceLandmarker;
    let animationFrameId;

    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });

        videoRef.current.play();
      }
    };

    const detectEmotion = () => {
      const video = videoRef.current;
      if (!video || !faceLandmarker) return;

      const processFrame = () => {
        if (video.readyState >= 2) {
          const results = faceLandmarker.detectForVideo(
            video,
            performance.now()
          );

          if (
            results.faceBlendshapes &&
            results.faceBlendshapes.length > 0
          ) {
            const blendshapes =
              results.faceBlendshapes[0].categories;

            const { emotion, scores } =
              detectEmotionFromBlendshapes(blendshapes);

            setEmotion(emotion);
            setScores(scores);
          } else {
            setEmotion("No Face Detected");
          }
        }

        animationFrameId = requestAnimationFrame(processFrame);
      };

      processFrame();
    };

    const loadFaceLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        outputFaceBlendshapes: true,
        numFaces: 1,
      });

      detectEmotion();
    };

    setupCamera();
    loadFaceLandmarker();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "500px",
          borderRadius: "12px",
        }}
      />

      <h1>{emotion}</h1>

      <pre>{JSON.stringify(scores, null, 2)}</pre>
    </div>
  );
}