import React, { useContext, useEffect, useMemo, useState } from "react";

import useToggle from "../hooks/useToggle";
import { MODEL_PARTS } from "../constants/model";
import { IS_MOBILE } from "../utils/mobileDetect";
import { TRACKING_DIRECTIONS } from "../utils/tracking";
import { cameraContext } from "../context/cameraContext";
import { noOp } from "../constants/functions";

import Input from "./input";
import Select from "./select";

function SynthBodyControls({
  canPlay,
  id,
  onPositionChange,
  person,
  personId,
  setCanPlay
}) {
  const {
    canvas: { width, height }
  } = useContext(cameraContext);

  const [bodyPart, setBodyPart] = useState("");
  const keypoints = person ? person.pose.keypoints : false;
  const trackedBodyPart =
    keypoints && bodyPart && keypoints.find(({ part }) => part === bodyPart);
  const modelOptions = useMemo(
    () =>
      MODEL_PARTS.map(({ label, value }) => ({
        key: `Synth_${personId}_${id}_model_${label}`,
        label,
        value: value(!IS_MOBILE)
      })),
    [id, personId]
  );

  const [roundPosition, toggleRoundPosition] = useToggle(true);
  const [trackingDirection, setTrackingDirection] = useState("");
  const trackingDirectionOptions = useMemo(
    () =>
      TRACKING_DIRECTIONS.map(({ transformer, ...option }) => ({
        key: `Synth_${personId}_${id}_frequency_direction_${option.value}`,
        ...option
      })),
    [id, personId]
  );

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
      onPositionChange(trackedBodyPoint);
      if (!canPlay) setCanPlay(true);
    } else {
      if (canPlay) setCanPlay(false);
    }
  }, [canPlay, onPositionChange, setCanPlay, trackedBodyPoint]);

  return (
    <>
      <Select
        label="Body part:"
        labelPrefix="Body_part_select"
        onChange={event => setBodyPart(event.target.value)}
        options={modelOptions}
        placeholder="Choose an option"
      />
      <Select
        label="Tracking direction:"
        labelPrefix="Tracking_direction_select"
        onChange={event => setTrackingDirection(event.target.value)}
        options={trackingDirectionOptions}
        placeholder="Choose an option"
      />
      <Input
        checked={roundPosition}
        defaultValue={roundPosition}
        label="Round position:"
        labelIdPrefix={`Synth_${personId}_${id}_round_position`}
        onChange={toggleRoundPosition}
        type="checkbox"
      />
    </>
  );
}

export default SynthBodyControls;
