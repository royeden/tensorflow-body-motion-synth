import { ANIMATION_FRAMES } from "../constants/animation";
import { drawImage } from "../utils/canvas";

import { useIdleAnimation } from "./useIdleAnimation";

export function useCanvasDraw(
  canvas,
  video,
  draw,
  imageCallback,
  forceFallback
) {
  useIdleAnimation(
    () => {
      if (canvas && video && draw) {
        drawImage(canvas, video);
        if (imageCallback) imageCallback(canvas.toDataURL("image/png"));
      }
    },
    draw,
    ANIMATION_FRAMES,
    forceFallback
  );
}
