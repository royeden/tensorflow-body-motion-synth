// Deprecated

import { useCallback } from "react";

import { ANIMATION_FRAMES } from "../constants/animation";
import { IS_MOBILE } from "../utils/mobileDetect";
import { drawText } from "../utils/canvas";
import { noOp } from "../constants/functions";

import useAnimations from "./useAnimations";

function useBodyPartTracker(
  canvas,
  run,
  {
    bodyPart = "nose",
    fallbackTimeout = ANIMATION_FRAMES,
    forceFallback = false,
    optimizePerformance = IS_MOBILE,
    peopleTracked = [],
    text = noOp,
    threshold = 0.4
  }
) {
  const callback = useCallback(() => {
    if (peopleTracked.length > 0) {
      peopleTracked.forEach(({ pose }, id) => {
        if (pose.keypoints && pose.keypoints.length > 0) {
          const trackedPart = pose.keypoints.find(
            ({ part }) => part === bodyPart
          );
          if (trackedPart.score > threshold)
            drawText(canvas, text({ pose, id }), trackedPart.position);
        }
      });
    }
  }, [bodyPart, canvas, peopleTracked, text, threshold]);
  useAnimations(callback, run, {
    fallbackTimeout,
    forceFallback,
    optimizePerformance
  });
}

export default useBodyPartTracker;
