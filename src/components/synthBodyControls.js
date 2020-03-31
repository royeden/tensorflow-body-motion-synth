import React, { useContext, useEffect, useMemo } from "react";

import { IS_MOBILE } from "../utils/mobileDetect";
import { TRACKING_DIRECTIONS } from "../utils/tracking";
import { cameraContext } from "../context/cameraContext";
import { noOp } from "../constants/functions";

import SynthBodyPartControls from "./synthBodyPartControls";

function SynthBodyControls({
  bodyPart,
  canPlay,
  id,
  onPositionChange,
  person,
  personId,
  roundPosition,
  setBodyPart,
  setCanPlay,
  setTrackingDirection,
  toggleRoundPosition,
  trackingDirection
}) {
  const {
    canvas: { width, height }
  } = useContext(cameraContext);
  const keypoints = person ? person.pose.keypoints : false;
  const trackedBodyPart =
    keypoints && bodyPart && keypoints.find(({ part }) => part === bodyPart);

  const trackingDirectionTransformer = useMemo(
    () =>
      trackingDirection
        ? TRACKING_DIRECTIONS.find(
            option => option.value === trackingDirection
          ).transformer(!IS_MOBILE)
        : noOp,
    [trackingDirection]
  );

  const trackedBodyPoint = useMemo(
    () =>
      trackedBodyPart &&
      // TODO move to prop threshold
      trackedBodyPart.score >= 0.3 &&
      trackingDirectionTransformer(
        roundPosition
          ? {
              x: Math.round(trackedBodyPart.position.x),
              y: Math.round(trackedBodyPart.position.y)
            }
          : trackedBodyPart.position,
        {
          width,
          height
        }
      ),
    [
      trackingDirectionTransformer,
      height,
      roundPosition,
      trackedBodyPart,
      width
    ]
  );

  useEffect(() => {
    if (trackedBodyPoint && onPositionChange) {
      console.log(trackedBodyPoint)
      onPositionChange(trackedBodyPoint);
      if (!canPlay) setCanPlay(true);
    } else {
      if (canPlay) setCanPlay(false);
    }
  }, [canPlay, onPositionChange, setCanPlay, trackedBodyPoint]);

  return (
    <SynthBodyPartControls
      bodyPart={bodyPart}
      id={id}
      personId={personId}
      roundPosition={roundPosition}
      setBodyPart={setBodyPart}
      setTrackingDirection={setTrackingDirection}
      toggleRoundPosition={toggleRoundPosition}
      trackingDirection={trackingDirection}
    />
  );
}

export default SynthBodyControls;
