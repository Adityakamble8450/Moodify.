export const getBlendshapeScore = (blendshapes, name) => {
  const shape = blendshapes.find((item) => item.categoryName === name);
  return shape ? shape.score : 0;
};

export const detectEmotionFromBlendshapes = (blendshapes) => {
  const smile =
    getBlendshapeScore(blendshapes, "mouthSmileLeft") +
    getBlendshapeScore(blendshapes, "mouthSmileRight");

  const jawOpen = getBlendshapeScore(blendshapes, "jawOpen");

  const browUp =
    getBlendshapeScore(blendshapes, "browInnerUp") +
    getBlendshapeScore(blendshapes, "browOuterUpLeft") +
    getBlendshapeScore(blendshapes, "browOuterUpRight");

  const mouthFrown =
    getBlendshapeScore(blendshapes, "mouthFrownLeft") +
    getBlendshapeScore(blendshapes, "mouthFrownRight");

  let detectedEmotion = "Neutral";

  if (smile > 0.7) {
    detectedEmotion = "Happy";
  } else if (jawOpen > 0.6 && browUp > 0.5) {
    detectedEmotion = "Surprised";
  } else if (mouthFrown > 0.05) {
    detectedEmotion = "Sad";
  }

  return {
    emotion: detectedEmotion,
    scores: {
      smile: smile.toFixed(2),
      jawOpen: jawOpen.toFixed(2),
      browUp: browUp.toFixed(2),
      mouthFrown: mouthFrown.toFixed(2),
    },
  };
};
