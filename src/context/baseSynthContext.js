import React, { createContext, useMemo, useState } from "react";

import Input from "../components/input";
import Select from "../components/select";
import SynthBodyPartControls from "../components/synthBodyPartControls";
import SynthFrequencyNotesControls from "../components/synthFrequencyNotesControls";
import useTemperamentScale from "../hooks/useTemperamentScale";
import useToggle from "../hooks/useToggle";
import {
  A4_440,
  BASE_TET,
  SYNTH_WAVE_TYPES
} from "../constants/music";

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
  trackingDirection: ""
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
  // TODO remove this
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
        key: `Synth_base_synth_synth_wave_${type}`,
        disabled: type === "custom",
        label: type,
        value: type
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
        defaultValue={synthWaveType}
        label="Synth type:"
        labelIdPrefix="Synth_base_synth_synth_type"
        onChange={setSynthWaveType}
        options={synthOptions}
      />
      <SynthBodyPartControls
        bodyPart={bodyPart}
        id="synth"
        personId="base"
        roundPosition={roundPosition}
        setBodyPart={setBodyPart}
        setTrackingDirection={setTrackingDirection}
        toggleRoundPosition={toggleRoundPosition}
        trackingDirection={trackingDirection}
      />
      {notes && (
        <SynthFrequencyNotesControls
          baseFrequency={baseFrequency}
          centerNote={centerNote}
          id="synth"
          maxNote={maxNote}
          minNote={minNote}
          personId="base"
          resetSynthOnUpdate={resetSynthOnUpdate}
          setBaseFrequency={setBaseFrequency}
          setCenterNote={setCenterNote}
          setFrequency={setFrequency}
          setMaxNote={setMaxNote}
          setMinNote={setMinNote}
          setTet={setTet}
          tet={tet}
        />
      )}
      <Input
        checked={resetSynthOnUpdate}
        defaultValue={resetSynthOnUpdate}
        label="Reset synth on update:"
        labelIdPrefix={`Synth_base_synth_reset_synth_on_update`}
        onChange={toggleResetSynthOnUpdate}
        type="checkbox"
      />
      <Input
        checked={notes}
        defaultValue={notes}
        label="Use chromatic notes:"
        labelIdPrefix={`Synth_base_synth_use_notes`}
        onChange={toggleNotes}
        type="checkbox"
      />
      <Input
        checked={persist}
        defaultValue={persist}
        label="Persist when not tracking:"
        labelIdPrefix={`Synth_base_synth_persist`}
        onChange={togglePersist}
        type="checkbox"
      />
      <button onClick={toggleMuted}>Toggle {muted && "un"}mute</button>
      {children}
    </Provider>
  );
}
