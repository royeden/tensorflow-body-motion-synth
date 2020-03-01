import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { MODEL_PARTS } from "../constants/model";
import {
  A4_440,
  BASE_TET,
  FREQUENCY_DIRECTIONS,
  SYNTH_WAVE_TYPES,
  FREQUENCY_LIMITS,
  TET_LIMITS
} from "../constants/music";
import { audioContext } from "../context/audioContext";
import { cameraContext } from "../context/cameraContext";
import { modelContext } from "../context/modelContext";
import { map, mapWithinBoundary } from "../utils/math";
import { noOp } from "../constants/functions";
import { useOscillator } from "../hooks/useOscillator";
import { useTemperamentScale } from "../hooks/useTemperamentScale";
import { useToggle } from "../hooks/useToggle";

import Select from "./select";
import Input from "./input";

// TODO fragment into pieces

function Synth({ id, person, personId, removeSynth }) {
  const { audioContextObject } = useContext(audioContext);
  const {
    canvas: { width, height },
    isMobile
  } = useContext(cameraContext);
  const { trackingActive } = useContext(modelContext);
  const [bodyPart, setBodyPart] = useState("");
  const [baseFrequency, setBaseFrequency] = useState(A4_440.frequency);
  const [frequencyDirection, setFrequencyDirection] = useState("");
  const [synthWaveType, setSynthWaveType] = useState(SYNTH_WAVE_TYPES[0]);
  const [tet, setTet] = useState(BASE_TET);
  const [frequency, setFrequency, getNote] = useTemperamentScale(
    A4_440.position,
    {
      baseNoteFrequency: baseFrequency,
      tet
    }
  );
  const [persist, togglePersist] = useToggle(true);
  const [muted, toggleMuted] = useToggle(true);
  const [resetSynthOnUpdate, toggleResetSynthOnUpdate] = useToggle(true);

  const validation = useCallback(
    value => value >= FREQUENCY_LIMITS.min && value <= FREQUENCY_LIMITS.max,
    []
  );
  const tetValidation = useCallback(
    value => value >= TET_LIMITS.min && value <= TET_LIMITS.max,
    []
  );

  const handleRemove = useCallback(() => removeSynth(id), [id, removeSynth]);

  const keypoints = person ? person.pose.keypoints : false;
  const trackedBodyPart =
    keypoints && bodyPart && keypoints.find(({ part }) => part === bodyPart);
  const frequencyDirectionTransformer = useMemo(
    () =>
      frequencyDirection
        ? FREQUENCY_DIRECTIONS.find(
            option => option.value === frequencyDirection
          ).transformer
        : noOp,
    [frequencyDirection]
  );

  const trackedFrequency = useMemo(
    () =>
      trackedBodyPart &&
      trackedBodyPart.score >= 0.3 &&
      frequencyDirectionTransformer(trackedBodyPart.position, {
        width,
        height
      }),
    [frequencyDirectionTransformer, height, trackedBodyPart, width]
  );

  useEffect(() => {
    if (trackedFrequency) {
      const x =
        trackedFrequency.x && mapWithinBoundary(trackedFrequency.x, 0, width);
      const y =
        trackedFrequency.y && mapWithinBoundary(trackedFrequency.y, 0, height);
      const mappedX = x ? map(x, 0, width, 1, y ? 44 : 88) : 0;
      const mappedY = y ? map(y, 0, height, 1, x ? 44 : 88) : 0;
      const note = Math.round(mappedX + mappedY);
      getNote(note);
    }
  }, [getNote, height, trackedFrequency, width]);

  const canPlay =
    !muted &&
    (persist ||
      (trackingActive &&
        trackedBodyPart &&
        frequencyDirection &&
        synthWaveType &&
        trackedFrequency &&
        frequency));

  useOscillator(audioContextObject.current, canPlay, frequency, synthWaveType);

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
        defaultValue={baseFrequency}
        min={FREQUENCY_LIMITS.min}
        max={FREQUENCY_LIMITS.max}
        id={`Synth_${personId}_${id}_frequency`}
        name="frequency"
        type="number"
        validation={validation}
        onChange={value => {
          const parsedValue = parseFloat(value, 10);
          setBaseFrequency(parsedValue);
          if (resetSynthOnUpdate) setFrequency(parsedValue);
        }}
        value={baseFrequency}
      />
      <label htmlFor={`Synth_${personId}_${id}_persist`}>
        Persist when tracking stops:
      </label>
      <Input
        id={`Synth_${personId}_${id}_persist`}
        defaultValue={persist}
        checked={persist}
        type="checkbox"
        onChange={togglePersist}
      />
      <label htmlFor={`Synth_${personId}_${id}_reset_synth_on_update`}>
        Reset synth on update:
      </label>
      <Input
        id={`Synth_${personId}_${id}_reset_synth_on_update`}
        defaultValue={resetSynthOnUpdate}
        checked={resetSynthOnUpdate}
        type="checkbox"
        onChange={toggleResetSynthOnUpdate}
      />
      <label htmlFor={`Synth_${personId}_${id}_tet`}>Tet:</label>
      <Input
        id={`Synth_${personId}_${id}_tet`}
        defaultValue={tet}
        type="number"
        validation={tetValidation}
        onChange={value => setTet(parseInt(value, 10))}
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
      <p>Frequency : {frequency}</p>
      <p>
        Frequency Direction:{" "}
        {frequencyDirection || "no frequency direction selected"}
      </p>
      <p>Synth Type: {synthWaveType || "no type selected"}</p>
      <button onClick={() => setFrequency(baseFrequency)}>Reset synth</button>
      <button onClick={toggleMuted}>Toggle {muted && "un"}mute</button>
      <button onClick={handleRemove}>Remove this synth</button>
    </div>
  );
}

export default Synth;
