// Thank you for everything Dan <3 https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Adapted Dan's hook to use requestAnimationFrame
// Thanks https://github.com/beautifulinteractions/beautiful-react-hooks/blob/master/src/useRequestAnimationFrame.js
// Thanks https://css-tricks.com/using-requestanimationframe-with-react-hooks/

import { useEffect, useRef } from "react";

import { ANIMATION_FRAMES } from "../constants/animation";
import { apiSupported } from "../utils/apiSupported";

const canUse = apiSupported("requestAnimationFrame");

export function useAnimation(
  callback,
  run,
  fallbackTimeout = ANIMATION_FRAMES, // this is used in cases where we need to configure the interval fps
  forceFallback = false
) {
  const savedCallback = useRef();

  const shouldFallback = !canUse || forceFallback;

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let savedId;
    function tick() {
      savedCallback.current();
      if (!shouldFallback) {
        savedId = requestAnimationFrame(tick);
      }
    }
    if (run) {
      savedId = shouldFallback
        ? setInterval(tick, fallbackTimeout)
        : requestAnimationFrame(tick);
      return () =>
        shouldFallback ? clearInterval(savedId) : cancelAnimationFrame(savedId);
    }
  }, [fallbackTimeout, run, shouldFallback]);
}
