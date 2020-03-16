import { useCallback } from "react";

import { ANIMATION_FRAMES } from "../constants/animation";
import { IS_MOBILE } from "../utils/mobileDetect";
import { drawImage, setCanvasToImage } from "../utils/canvas";

import useAnimations from "./useAnimations";

export function useCanvasDraw(
  canvas,
  image,
  video,
  run,
  {
    fallbackTimeout = ANIMATION_FRAMES,
    flip = !IS_MOBILE,
    forceFallback = false,
    optimizePerformance = IS_MOBILE
  }
) {
  const callback = useCallback(async () => {
    if (canvas && video) {
      drawImage(canvas, video, flip);
      if (image) await setCanvasToImage(canvas, image);
    }
  }, [canvas, flip, image, video]);
  useAnimations(callback, run, {
    fallbackTimeout,
    forceFallback,
    optimizePerformance
  });
}

export default useCanvasDraw;
