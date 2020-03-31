// TODO make even more simple and composable components

import React, { createContext, useCallback, useMemo, useState } from "react";

import Input from "../components/input";
import Select from "../components/select";
import useTemperamentScale from "../hooks/useTemperamentScale";
import useToggle from "../hooks/useToggle";
import {
  A4_440,
  BASE_TET,
  FREQUENCY_LIMITS,
  SYNTH_WAVE_TYPES,
  TET_LIMITS
} from "../constants/music";
import { IS_MOBILE } from "../utils/mobileDetect";
import { MODEL_PARTS } from "../constants/model";
import { TRACKING_DIRECTIONS } from "../utils/tracking";

export const baseSynthContext = createContext({
  baseFrequency: A4_440.frequency,
  bodyPart: "",
  centerNote: A4_440.position,
  frequency: A4_440.frequency,
  maxNote: 88,
  minNote: 0,
  muted: true,
  notes: true,
  persist: true,
  resetSynthOnUpdate: true,
  roundPosition: true,
  synthWaveType: SYNTH_WAVE_TYPES[0],
  tet: BASE_TET,
  trackingDirection: "",
});

const { Provider } = baseSynthContext;

export function BaseSynthProvider({ children }) {
  // Sound options
  const [baseFrequency, setBaseFrequency] = useState(A4_440.frequency);
  const [synthWaveType, setSynthWaveType] = useState(SYNTH_WAVE_TYPES[0]);
  // Note options
  const [centerNote, setCenterNote] = useState(A4_440.position);
  const [maxNote, setMaxNote] = useState(88);
  const [minNote, setMinNote] = useState(0);
  const [tet, setTet] = useState(BASE_TET);
  const [frequency, setFrequency] = useTemperamentScale(A4_440.position, {
    baseNoteFrequency: baseFrequency,
    baseNotePosition: centerNote,
    tet
  });
  // Synth toggle options
  const [muted, toggleMuted] = useToggle(true);
  const [notes, toggleNotes] = useToggle(true);
  const [persist, togglePersist] = useToggle(true);
  const [resetSynthOnUpdate, toggleResetSynthOnUpdate] = useToggle(true);
  // Body part tracking options
  const [bodyPart, setBodyPart] = useState("");
  const [roundPosition, toggleRoundPosition] = useToggle(true);
  const [trackingDirection, setTrackingDirection] = useState("");

  const synthOptions = useMemo(
    () =>
      SYNTH_WAVE_TYPES.map(type => ({
        key: `Synth_Base_synth_wave_${type}`,
        disabled: type === "custom",
        label: type,
        value: type
      })),
    []
  );

  const maxNoteValidation = useCallback(
    value => value >= minNote && value <= 166,
    [minNote]
  );
  const centerNoteValidation = useCallback(
    value => value >= minNote && value <= maxNote,
    [maxNote, minNote]
  );
  const minNoteValidation = useCallback(
    value => value && value >= 0 && value <= maxNote,
    [maxNote]
  );

  const frequencyValidation = useCallback(
    value => value >= FREQUENCY_LIMITS.min && value <= FREQUENCY_LIMITS.max,
    []
  );
  const tetValidation = useCallback(
    value => value >= TET_LIMITS.min && value <= TET_LIMITS.max,
    []
  );

  const handleMinNoteChange = useCallback(
    value => {
      const parsedValue = parseFloat(value, 10);
      setMinNote(parsedValue);
      if (resetSynthOnUpdate) setFrequency(baseFrequency);
    },
    [baseFrequency, resetSynthOnUpdate, setFrequency, setMinNote]
  );

  const handleMaxNoteChange = useCallback(
    value => {
      const parsedValue = parseFloat(value, 10);
      setMaxNote(parsedValue);
      if (resetSynthOnUpdate) setFrequency(baseFrequency);
    },
    [baseFrequency, resetSynthOnUpdate, setFrequency, setMaxNote]
  );
  const handleCenterNoteChange = useCallback(
    value => {
      const parsedValue = parseFloat(value, 10);
      setCenterNote(parsedValue);
      if (resetSynthOnUpdate) setFrequency(baseFrequency);
    },
    [baseFrequency, resetSynthOnUpdate, setCenterNote, setFrequency]
  );
  const handlBaseFrequencyChange = useCallback(
    value => {
      const parsedValue = parseFloat(value, 10);
      setBaseFrequency(parsedValue);
      if (resetSynthOnUpdate) setFrequency(parsedValue);
    },
    [resetSynthOnUpdate, setBaseFrequency, setFrequency]
  );

  const handleTetChange = useCallback(value => setTet(parseInt(value, 10)), [
    setTet
  ]);

  const modelOptions = useMemo(
    () =>
      MODEL_PARTS.map(({ label, value }) => ({
        key: `Synth_Base_model_${label}`,
        label,
        value: value(!IS_MOBILE)
      })),
    []
  );

  const trackingDirectionOptions = useMemo(
    () =>
      TRACKING_DIRECTIONS.map(({ transformer, ...option }) => ({
        key: `Synth_Base_frequency_direction_${option.value}`,
        ...option
      })),
    []
  );

  return (
    <Provider
      value={{
        baseFrequency,
        bodyPart,
        centerNote,
        frequency,
        maxNote,
        minNote,
        muted,
        notes,
        persist,
        resetSynthOnUpdate,
        roundPosition,
        synthWaveType,
        tet,
        trackingDirection
      }}
    >
      <h1>Base Synth (Any synth you add will inherit this configuration):</h1>
      <Select
        label="Synth type:"
        labelPrefix="Synth_Base_synth_type"
        onChange={setSynthWaveType}
        options={synthOptions}
        value={synthWaveType}
      />
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
        labelIdPrefix={`Synth_Base_round_position`}
        onChange={toggleRoundPosition}
        type="checkbox"
      />
      {notes && (
        <>
          <Input
            defaultValue={minNote}
            label="Min note:"
            labelIdPrefix={`Synth_Base_min_note`}
            min={0}
            max={166}
            onChange={handleMinNoteChange}
            type="number"
            validation={minNoteValidation}
          />
          <Input
            defaultValue={centerNote}
            label="Center note:"
            labelIdPrefix={`Synth_Base_center_note`}
            min={0}
            max={166}
            onChange={handleCenterNoteChange}
            type="number"
            validation={centerNoteValidation}
          />
          <Input
            defaultValue={maxNote}
            label="Max note:"
            labelIdPrefix={`Synth_Base_max_note`}
            min={0}
            max={166}
            onChange={handleMaxNoteChange}
            type="number"
            validation={maxNoteValidation}
          />
          <Input
            defaultValue={tet}
            label="Tet:"
            labelIdPrefix={`Synth_Base_tet`}
            onChange={handleTetChange}
            type="number"
            validation={tetValidation}
          />
          <Input
            defaultValue={baseFrequency}
            label="Base Frequency"
            labelIdPrefix={`Synth_Base_frequency`}
            max={FREQUENCY_LIMITS.max}
            min={FREQUENCY_LIMITS.min}
            onChange={handlBaseFrequencyChange}
            type="number"
            validation={frequencyValidation}
          />
        </>
      )}
      <Input
        checked={resetSynthOnUpdate}
        defaultValue={resetSynthOnUpdate}
        label="Reset synth on update:"
        labelIdPrefix={`Synth_Base_reset_synth_on_update`}
        onChange={toggleResetSynthOnUpdate}
        type="checkbox"
      />
      <Input
        checked={notes}
        defaultValue={notes}
        label="Use chromatic notes:"
        labelIdPrefix={`Synth_Base_use_notes`}
        onChange={toggleNotes}
        type="checkbox"
      />
      <Input
        checked={persist}
        defaultValue={persist}
        label="Persist when not tracking:"
        labelIdPrefix={`Synth_Base_persist`}
        onChange={togglePersist}
        type="checkbox"
      />
      <button onClick={toggleMuted}>Toggle {muted && "un"}mute</button>
      {children}
    </Provider>
  );
}
