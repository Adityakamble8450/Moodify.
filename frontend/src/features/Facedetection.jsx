import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export default function FaceEmotionDetector() {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("Loading...");
  const [scores, setScores] = useState({});
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  

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

    const getBlendshapeScore = (blendshapes, name) => {
      const shape = blendshapes.find(
        (item) => item.categoryName === name
      );
      return shape ? shape.score : 0;
    };

    const detectEmotion = async () => {
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

            const smile = getBlendshapeScore(
              blendshapes,
              "mouthSmileLeft"
            ) + getBlendshapeScore(
              blendshapes,
              "mouthSmileRight"
            );

            const jawOpen = getBlendshapeScore(
              blendshapes,
              "jawOpen"
            );

            const browUp =
              getBlendshapeScore(
                blendshapes,
                "browInnerUp"
              ) +
              getBlendshapeScore(
                blendshapes,
                "browOuterUpLeft"
              ) +
              getBlendshapeScore(
                blendshapes,
                "browOuterUpRight"
              );

            const mouthFrown =
              getBlendshapeScore(
                blendshapes,
                "mouthFrownLeft"
              ) +
              getBlendshapeScore(
                blendshapes,
                "mouthFrownRight"
              );

            let detectedEmotion = "Neutral";

            // 😀 HAPPY
            if (smile > 0.7) {
              detectedEmotion = "Happy 😀";
            }

            // 😲 SURPRISE
            else if (jawOpen > 0.6 && browUp > 0.5) {
              detectedEmotion = "Surprised 😲";
            }

            // 😢 SAD
            else if (mouthFrown > 0.001) {
              detectedEmotion = "Sad 😢";
            }

            setEmotion(detectedEmotion);
            setScores({
              smile: smile.toFixed(2),
              jawOpen: jawOpen.toFixed(2),
              browUp: browUp.toFixed(2),
              mouthFrown: mouthFrown.toFixed(2),
            });
          } else {
            setEmotion("No Face Detected");
          }
        }

        animationFrameId = requestAnimationFrame(processFrame);
      };

      processFrame();
    };

    setupCamera();
    loadFaceLandmarker();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
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