import * as bodyPix from "@tensorflow-models/body-pix";

import { ANIMATION_FRAMES } from "../constants/animation";
import { apiSupported } from "../utils/apiSupported";

// If you wish for an optimized version, use idle callbacks instead
import { useAnimation } from "./useAnimation";

export function useModelDraw(
  canvas,
  image,
  model,
  isMobile,
  draw,
  segmentationsCallback,
  options = {
    flip: false,
    forceFallback: apiSupported("requestIdleCallback")
  }
) {
  const { flip, forceFallback } = options;
  useAnimation(
    async () => {
      if (canvas && image && draw) {
        const segmentations = await model.segmentMultiPersonParts(image, {
          scoreThreshold: isMobile ? 0.3 : 0.4,
          refineSteps: isMobile ? 9 : 10
        });
        const coloredPartImage = bodyPix.toColoredPartMask(segmentations);
        const opacity = 0.5;
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
    },
    draw,
    ANIMATION_FRAMES,
    forceFallback
  );
}
