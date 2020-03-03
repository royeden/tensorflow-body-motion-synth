import { useCallback } from "react";

import { IS_MOBILE } from "../utils/mobileDetect";
import { drawImage } from "../utils/canvas";

import useAnimations from "./useAnimations";

export function useCanvasDraw(
  canvas,
  video,
  run,
  imageCallback,
  { flip = !IS_MOBILE, forceFallback = false, optimize = IS_MOBILE }
) {
  const callback = useCallback(() => {
    if (canvas && video) {
      drawImage(canvas, video, flip);
      if (imageCallback) imageCallback(canvas.toDataURL("image/png"));
    }
  }, [canvas, flip, imageCallback, video]);
  useAnimations(callback, run, { forceFallback, optimize });
}

export default useCanvasDraw;
