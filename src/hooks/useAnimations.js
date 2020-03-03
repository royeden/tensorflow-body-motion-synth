// Thank you for everything Dan <3 https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Adapted Dan's hook to use requestAnimationFrame
// Thanks https://github.com/beautifulinteractions/beautiful-react-hooks/blob/master/src/useRequestAnimationFrame.js
// Thanks https://css-tricks.com/using-requestanimationframe-with-react-hooks/

// This should be the best of both worlds, but it's still pretty messy
// REQUEST IDLE CALLBACK IS EXPERIMENTAL, works but delays everything on optimize

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
    optimize = false
   }
) {
  const savedCallback = useRef();

  const shouldFallback = useMemo(
    () =>
      forceFallback ||
      (!optimize && canUseRequestAnimationFrame) ||
      (optimize && canUseRequestIdleCallback),
    [forceFallback, optimize]
  );

  const previousIteration = useRef({
    optimize,
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
        savedId = optimize
          ? requestIdleCallback(tick, idleCallbackOptions)
          : requestAnimationFrame(tick);
      }
    }
    if (run) {
      const previous = previousIteration.current;
      if (
        previous.shouldFallback !== shouldFallback ||
        (previous.optimize !== optimize &&
          (canUseRequestAnimationFrame || canUseRequestIdleCallback))
      ) {
        if (!previous.shouldFallback && shouldFallback) {
          if (previous.optimize) cancelIdleCallback(savedId);
          else cancelAnimationFrame(savedId);
        } else {
          if (previous.shouldFallback) clearInterval(savedId);
          if (!previous.optimize && optimize) cancelAnimationFrame(savedId);
          else cancelIdleCallback(savedId);
        }
        previous.forceFallback = forceFallback;
        previous.optimize = optimize;
      }
      savedId = shouldFallback
        ? setInterval(tick, fallbackTimeout)
        : optimize
        ? requestIdleCallback(tick, idleCallbackOptions)
        : requestAnimationFrame(tick);
      return () =>
        shouldFallback
          ? clearInterval(savedId)
          : optimize
          ? cancelIdleCallback(savedId)
          : cancelAnimationFrame(savedId);
    }
  }, [fallbackTimeout, forceFallback, optimize, run, shouldFallback]);
}

export default useAnimations;
