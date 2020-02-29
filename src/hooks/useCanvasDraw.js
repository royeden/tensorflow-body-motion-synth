import { drawImage } from "../utils/canvas";
import { getFramesPerSecond } from "../utils/animation";

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
    getFramesPerSecond(55), // This animation should always run slower than the other one
    forceFallback
  );
}
