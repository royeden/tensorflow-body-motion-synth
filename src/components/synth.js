import React, { useCallback, useContext, useMemo, useState } from "react";

import useOscillator from "../hooks/useOscillator";
import useTemperamentScale from "../hooks/useTemperamentScale";
import useToggle from "../hooks/useToggle";
import { A4_440, SYNTH_WAVE_TYPES } from "../constants/music";
import { audioContext } from "../context/audioContext";
import { baseSynthContext } from "../context/baseSynthContext";
import { cameraContext } from "../context/cameraContext";

import Input from "./input";
import Select from "./select";
import SynthFrequencyControls from "./synthFrequencyControls";

function Synth({ id, person, personId, removeSynth }) {
  const { audioContextObject } = useContext(audioContext);
  const baseSynth = useContext(baseSynthContext);
  const {
    canvas: { width, height }
  } = useContext(cameraContext);

  const [canPlay, setCanPlay] = useState(false);
  // Sound options
  const [baseFrequency, setBaseFrequency] = useState(baseSynth.baseFrequency);
  const [synthWaveType, setSynthWaveType] = useState(baseSynth.synthWaveType);
  // Note options
  const [centerNote, setCenterNote] = useState(baseSynth.centerNote);
  const [maxNote, setMaxNote] = useState(baseSynth.maxNote);
  const [minNote, setMinNote] = useState(baseSynth.minNote);
  const [tet, setTet] = useState(baseSynth.tet);
  const [frequency, setFrequency, getNote] = useTemperamentScale(
    A4_440.position,
    {
      baseNoteFrequency: baseFrequency,
      baseNotePosition: centerNote,
      tet
    }
  );
  // Synth toggle options
  const [muted, toggleMuted] = useToggle(baseSynth.muted);
  const [notes, toggleNotes] = useToggle(baseSynth.notes);
  const [persist, togglePersist] = useToggle(baseSynth.persist);
  const [resetSynthOnUpdate, toggleResetSynthOnUpdate] = useToggle(
    baseSynth.resetSynthOnUpdate
  );
  // Body part tracking options
  const [bodyPart, setBodyPart] = useState(baseSynth.bodyPart);
  const [roundPosition, toggleRoundPosition] = useToggle(
    baseSynth.roundPosition
  );
  const [trackingDirection, setTrackingDirection] = useState(
    baseSynth.trackingDirection
  );

  const handleRemove = useCallback(() => removeSynth(id), [id, removeSynth]);

  useOscillator(
    audioContextObject.current,
    !muted && (canPlay || persist),
    frequency,
    synthWaveType
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
      <h4>Frequency: {frequency}</h4>
      <Select
        defaultValue={synthWaveType}
        label="Synth type:"
        labelIdPrefix={`Synth_${personId}_${id}_synth_type`}
        onChange={setSynthWaveType}
        options={synthOptions}
      />
      <SynthFrequencyControls
        baseFrequency={baseFrequency}
        bodyPart={bodyPart}
        canPlay={canPlay}
        centerNote={centerNote}
        getNote={getNote}
        height={height}
        id={id}
        maxNote={maxNote}
        minNote={minNote}
        notes={notes}
        person={person}
        personId={personId}
        resetSynthOnUpdate={resetSynthOnUpdate}
        roundPosition={roundPosition}
        setBaseFrequency={setBaseFrequency}
        setBodyPart={setBodyPart}
        setCanPlay={setCanPlay}
        setCenterNote={setCenterNote}
        setFrequency={setFrequency}
        setMaxNote={setMaxNote}
        setMinNote={setMinNote}
        setTet={setTet}
        setTrackingDirection={setTrackingDirection}
        tet={tet}
        toggleRoundPosition={toggleRoundPosition}
        trackingDirection={trackingDirection}
        width={width}
      />
      <Input
        checked={resetSynthOnUpdate}
        defaultValue={resetSynthOnUpdate}
        label="Reset synth on update:"
        labelIdPrefix={`Synth_${personId}_${id}_reset_synth_on_update`}
        onChange={toggleResetSynthOnUpdate}
        type="checkbox"
      />
      <Input
        checked={notes}
        defaultValue={notes}
        label="Use chromatic notes:"
        labelIdPrefix={`Synth_${personId}_${id}_use_notes`}
        onChange={toggleNotes}
        type="checkbox"
      />
      <Input
        checked={persist}
        defaultValue={persist}
        label="Persist when not tracking:"
        labelIdPrefix={`Synth_${personId}_${id}_persist`}
        onChange={togglePersist}
        type="checkbox"
      />
      <button onClick={() => setFrequency(baseFrequency)}>Reset synth</button>
      <button onClick={toggleMuted}>Toggle {muted && "un"}mute</button>
      <button onClick={handleRemove}>Remove this synth</button>
    </div>
  );
}

export default Synth;
