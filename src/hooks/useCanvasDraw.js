import { useCallback } from "react";

import { ANIMATION_FRAMES } from "../constants/animation";
import { IS_MOBILE } from "../utils/mobileDetect";
import { drawImage } from "../utils/canvas";

import useAnimations from "./useAnimations";

export function useCanvasDraw(
  canvas,
  video,
  run,
  imageCallback,
  {
    fallbackTimeout = ANIMATION_FRAMES,
    flip = !IS_MOBILE,
    forceFallback = false,
    optimizePerformance = IS_MOBILE
  }
) {
  const callback = useCallback(() => {
    if (canvas && video) {
      drawImage(canvas, video, flip);
      if (imageCallback) imageCallback(canvas.toDataURL("image/png"));
    }
  }, [canvas, flip, imageCallback, video]);
  useAnimations(callback, run, {
    fallbackTimeout,
    forceFallback,
    optimizePerformance
  });
}

export default useCanvasDraw;
