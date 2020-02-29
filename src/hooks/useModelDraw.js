import * as bodyPix from "@tensorflow-models/body-pix";

import { ANIMATION_FRAMES } from "../constants/animation";
import { apiSupported } from "../utils/apiSupported";

import { useAnimation } from "./useAnimation";

export function useModelDraw(
  canvas,
  image,
  model,
  isMobile,
  draw,
  segmentationsCallback,
  forceFallback = apiSupported("requestIdleCallback")
) {
  useAnimation(
    async () => {
      if (canvas && image && draw) {
        const segmentations = await model.segmentMultiPersonParts(image, {
          scoreThreshold: isMobile ? 0.2 : 0.4,
          refineSteps: isMobile ? 8 : 10
        });
        const coloredPartImage = bodyPix.toColoredPartMask(segmentations);
        const opacity = 0.7;
        const flipHorizontal = false;
        const maskBlurAmount = 0;
        bodyPix.drawMask(
          canvas,
          image,
          coloredPartImage,
          opacity,
          maskBlurAmount,
          flipHorizontal
        );

        if (segmentationsCallback) segmentationsCallback(segmentations);
      }
    },
    draw,
    ANIMATION_FRAMES,
    forceFallback
  );
}
