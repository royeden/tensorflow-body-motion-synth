// Thank you for everything Dan <3 https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Adapted Dan's hook to use requestIdleCallback
// Thanks https://github.com/beautifulinteractions/beautiful-react-hooks/blob/master/src/useRequestAnimationFrame.js
// Thanks https://css-tricks.com/using-requestanimationframe-with-react-hooks/

// EXPERIMENTAL HOOK, works but delays everything

import { useEffect, useRef } from "react";

import { ANIMATION_FRAMES } from "../constants/animation";
import { apiSupported } from "../utils/apiSupported";

const canUse = apiSupported("requestIdleCallback");

const options = { timeout: ANIMATION_FRAMES };

export function useIdleAnimation(
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
        savedId = requestIdleCallback(tick, options);
      }
    }
    if (run) {
      savedId = shouldFallback
        ? setInterval(tick, fallbackTimeout)
        : requestIdleCallback(tick, options);
      return () =>
        shouldFallback ? clearInterval(savedId) : cancelIdleCallback(savedId);
    }
  }, [fallbackTimeout, run, shouldFallback]);
}
