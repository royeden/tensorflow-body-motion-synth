import { useCallback } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";

import { ANIMATION_FRAMES } from "../constants/animation";
import { IS_MOBILE } from "../utils/mobileDetect";

import useAnimations from "./useAnimations";

const MODEL_COLORS = [
  /* Right head, left head, right arm top-right, right arm top-left */
  [255, 0, 0],
  [0, 255, 0],
  [255, 0, 0],
  [0, 255, 255],
  /* Left arm top-left, left arm top-right, right arm bottom-right, right arm bottom-left */
  [0, 255, 0],
  [0, 0, 255],
  [0, 255, 255],
  [255, 0, 0],
  /* Left arm bottom-left, left arm bottom-right, right hand, left Hand */
  [0, 0, 255],
  [0, 255, 0],
  [255, 127, 0],
  [255, 0, 255],
  /* Torso front, torso back, right leg top-front, right leg top-back */
  [255, 255, 0],
  [127, 0, 127],
  [0, 255, 255],
  [255, 0, 0],
  /* Left leg top-front, left leg top-back, right leg bottom-front, right leg bottom-back */
  [0, 0, 255],
  [0, 255, 0],
  [255, 0, 0],
  [0, 255, 255],
  /* Left leg bottom-front, left leg bottom-back, right foot, left foot */
  [0, 255, 0],
  [0, 0, 255],
  [255, 127, 0],
  [255, 0, 255]
];

function useModelDraw(
  canvas,
  image,
  model,
  run,
  segmentationsCallback,
  {
    fallbackTimeout = ANIMATION_FRAMES,
    flip = false,
    forceFallback = false,
    lowRes = IS_MOBILE,
    opacity = 0.5,
    optimizePerformance = IS_MOBILE
  }
) {
  const callback = useCallback(async () => {
    if (canvas && image) {
      const segmentations = await model.segmentMultiPersonParts(image, {
        scoreThreshold: lowRes ? 0.3 : 0.4,
        refineSteps: lowRes ? 9 : 10
      });

      const coloredPartImage = bodyPix.toColoredPartMask(
        segmentations,
        MODEL_COLORS
      );
      const maskBlurAmount = 0;
      bodyPix.drawMask(
        canvas,
        image,
        coloredPartImage,
        opacity,
        maskBlurAmount,
        flip
      );

      if (segmentationsCallback) segmentationsCallback(segmentations);
    }
  }, [canvas, flip, image, lowRes, model, opacity, segmentationsCallback]);
  useAnimations(callback, run, {
    fallbackTimeout,
    forceFallback,
    optimizePerformance
  });
}

export default useModelDraw;
