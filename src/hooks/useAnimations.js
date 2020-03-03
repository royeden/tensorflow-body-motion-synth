// Thank you for everything Dan <3 https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Adapted Dan's hook to use requestAnimationFrame
// Thanks https://github.com/beautifulinteractions/beautiful-react-hooks/blob/master/src/useRequestAnimationFrame.js
// Thanks https://css-tricks.com/using-requestanimationframe-with-react-hooks/

// This should be the best of both worlds, but it's still pretty messy
// REQUEST IDLE CALLBACK IS EXPERIMENTAL, works but delays everything on optimizePerformance

import { useEffect, useMemo, useRef } from "react";

import { ANIMATION_FRAMES } from "../constants/animation";
import { apiSupported } from "../utils/apiSupported";

const canUseRequestAnimationFrame = apiSupported("requestAnimationFrame");
const canUseRequestIdleCallback = apiSupported("requestIdleCallback");

const idleCallbackOptions = { timeout: ANIMATION_FRAMES };

function useAnimations(
  callback,
  run,
  {
    fallbackTimeout = ANIMATION_FRAMES, // this is used in cases where we need to configure the interval fps
    forceFallback = false,
    optimizePerformance = false
   }
) {
  const savedCallback = useRef();

  const shouldFallback = useMemo(
    () =>
      forceFallback ||
      (!optimizePerformance && canUseRequestAnimationFrame) ||
      (optimizePerformance && canUseRequestIdleCallback),
    [forceFallback, optimizePerformance]
  );

  const previousIteration = useRef({
    optimizePerformance,
    shouldFallback
  });

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
        savedId = optimizePerformance
          ? requestIdleCallback(tick, idleCallbackOptions)
          : requestAnimationFrame(tick);
      }
    }
    if (run) {
      const previous = previousIteration.current;
      if (
        previous.shouldFallback !== shouldFallback ||
        (previous.optimizePerformance !== optimizePerformance &&
          (canUseRequestAnimationFrame || canUseRequestIdleCallback))
      ) {
        if (!previous.shouldFallback && shouldFallback) {
          if (previous.optimizePerformance) cancelIdleCallback(savedId);
          else cancelAnimationFrame(savedId);
        } else {
          if (previous.shouldFallback) clearInterval(savedId);
          if (!previous.optimizePerformance && optimizePerformance) cancelAnimationFrame(savedId);
          else cancelIdleCallback(savedId);
        }
        previous.forceFallback = forceFallback;
        previous.optimizePerformance = optimizePerformance;
      }
      savedId = shouldFallback
        ? setInterval(tick, fallbackTimeout)
        : optimizePerformance
        ? requestIdleCallback(tick, idleCallbackOptions)
        : requestAnimationFrame(tick);
      return () =>
        shouldFallback
          ? clearInterval(savedId)
          : optimizePerformance
          ? cancelIdleCallback(savedId)
          : cancelAnimationFrame(savedId);
    }
  }, [fallbackTimeout, forceFallback, optimizePerformance, run, shouldFallback]);
}

export default useAnimations;
