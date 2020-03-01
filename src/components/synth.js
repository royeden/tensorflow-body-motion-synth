import React, { useCallback, useContext, useMemo, useState } from "react";

import { MODEL_PARTS } from "../constants/model";
import {
  A4_440,
  FREQUENCY_DIRECTIONS,
  SYNTH_WAVE_TYPES
} from "../constants/music";
import { audioContext } from "../context/audioContext";
import { cameraContext } from "../context/cameraContext";
import { noOp } from "../constants/functions";
import { useToggle } from "../hooks/useToggle";

import Select from "./select";
import Input from "./input";

const min = 20;
const max = 20000;

// TODO move select to a component
// TODO add custom inputs

function Synth({ id, initialFrequency, person, personId, removeSynth }) {
  const { audioContextObject } = useContext(audioContext);
  const { isMobile } = useContext(cameraContext);
  const [bodyPart, setBodyPart] = useState("");
  const [frequency, setFrequency] = useState(A4_440.frequency);
  const [frequencyDirection, setFrequencyDirection] = useState("");
  const [synthWaveType, setSynthWaveType] = useState("");

  const validation = useCallback(value => value >= min && value <= max, []);

  const handleRemove = useCallback(() => removeSynth(id), [id, removeSynth]);

  const keypoints = person ? person.pose.keypoints : false;
  const trackedBodyPart =
    keypoints && bodyPart && keypoints.find(({ part }) => part === bodyPart);

  const frequencyDirectionTransformer = useCallback(
    () =>
      frequencyDirection
        ? FREQUENCY_DIRECTIONS.find(
            option => option.value === frequencyDirection
          )
        : noOp,
    [frequencyDirection]
  );

  const frequencyDirectionOptions = useMemo(
    () =>
      FREQUENCY_DIRECTIONS.map(({ transformer, ...option }) => ({
        key: `Synth_${personId}_${id}_frequency_direction_${option.value}`,
        ...option
      })),
    [id, personId]
  );

  const modelOptions = useMemo(
    () =>
      MODEL_PARTS.map(({ label, value }) => ({
        key: `Synth_${personId}_${id}_model_${label}`,
        label,
        value: value(!isMobile)
      })),
    [id, isMobile, personId]
  );

  const synthOptions = useMemo(
    () =>
      SYNTH_WAVE_TYPES.map(type => ({
        key: `Synth_${personId}_${id}_synth_wave_${type}`,
        disabled: type === "custom",
        label: type,
        value: type
      })),
    [id, personId]
  );

  return (
    <div>
      <h1>
        Synth {id} for Person {personId + 1}
      </h1>
      <Select
        onChange={event => setBodyPart(event.target.value)}
        options={modelOptions}
        placeholder="Choose an option"
      />
      <Select
        onChange={event => setSynthWaveType(event.target.value)}
        options={synthOptions}
        placeholder="Choose an option"
      />
      <Select
        onChange={event => setFrequencyDirection(event.target.value)}
        options={frequencyDirectionOptions}
        placeholder="Choose an option"
      />
      <label htmlFor={`Synth_${personId}_${id}_frequency`}>
        Base Frequency
      </label>
      <Input
        defaultValue={A4_440.frequency}
        min={min}
        max={max}
        id={`Synth_${personId}_${id}_frequency`}
        name="frequency"
        type="number"
        validation={validation}
        onChange={setFrequency}
        value={frequency}
      />
      {/* Todo remove these, they're for debugging */}
      <p>
        Position:{" "}
        {keypoints
          ? bodyPart
            ? `[ x: ${trackedBodyPart.position.x}, y: ${trackedBodyPart.position.y} ]`
            : "No body part selected"
          : "No person tracked"}
      </p>
      <p>
        Score:{" "}
        {keypoints
          ? bodyPart
            ? trackedBodyPart.score
            : "No body part selected"
          : "No person tracked"}
      </p>
      <p>
        Frequency Direction:{" "}
        {frequencyDirection || "no frequency direction selected"}
      </p>
      <p>Synth Type: {synthWaveType || "no type selected"}</p>
      <button onClick={handleRemove}>Remove this synth</button>
    </div>
  );
}

export default Synth;
