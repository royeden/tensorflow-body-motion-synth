import React, { useMemo } from "react";

import { MODEL_PARTS } from "../constants/model";
import { IS_MOBILE } from "../utils/mobileDetect";
import { TRACKING_DIRECTIONS } from "../utils/tracking";

import Input from "./input";
import Select from "./select";

function SynthBodyPartControls({
  bodyPart,
  id,
  personId,
  roundPosition,
  setBodyPart,
  setTrackingDirection,
  toggleRoundPosition,
  trackingDirection
}) {
  const modelOptions = useMemo(
    () =>
      MODEL_PARTS.map(({ label, value }) => ({
        key: `Synth_${personId}_${id}_model_${label}`,
        label,
        value: value(!IS_MOBILE)
      })),
    [id, personId]
  );

  const trackingDirectionOptions = useMemo(
    () =>
      TRACKING_DIRECTIONS.map(({ transformer, ...option }) => ({
        key: `Synth_${personId}_${id}_frequency_direction_${option.value}`,
        ...option
      })),
    [id, personId]
  );

  return (
    <>
      <Select
        label="Body part:"
        labelPrefix="Body_part_select"
        onChange={setBodyPart}
        options={modelOptions}
        placeholder="Choose an option"
        value={bodyPart}
      />
      <Select
        label="Tracking direction:"
        labelPrefix="Tracking_direction_select"
        onChange={setTrackingDirection}
        options={trackingDirectionOptions}
        placeholder="Choose an option"
        value={trackingDirection}
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

export default SynthBodyPartControls;
