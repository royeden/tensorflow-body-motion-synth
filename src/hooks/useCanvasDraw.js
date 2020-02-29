import { ANIMATION_FRAMES } from "../constants/animation";
import { drawImage } from "../utils/canvas";

import { useIdleAnimation } from "./useIdleAnimation";

export function useCanvasDraw(
  canvas,
  video,
  draw,
  imageCallback,
  options = {
    flip: false,
    forceFallback: false
  }
) {
  const { flip, forceFallback } = options;
  useIdleAnimation(
    () => {
      if (canvas && video && draw) {
        drawImage(canvas, video, flip);
        if (imageCallback) imageCallback(canvas.toDataURL("image/png"));
      }
    },
    draw,
    ANIMATION_FRAMES,
    forceFallback
  );
}
