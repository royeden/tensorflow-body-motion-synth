import React, { useCallback, useContext, useMemo, useState } from "react";

import {
  A4_440,
  BASE_TET,
  SYNTH_WAVE_TYPES
} from "../constants/music";
import { audioContext } from "../context/audioContext";
import { cameraContext } from "../context/cameraContext";
import useOscillator from "../hooks/useOscillator";
import useTemperamentScale from "../hooks/useTemperamentScale";
import useToggle from "../hooks/useToggle";

import Input from "./input";
import Select from "./select";
import SynthFrequencyControls from "./synthFrequencyControls";

function Synth({ id, person, personId, removeSynth }) {
  const { audioContextObject } = useContext(audioContext);
  const {
    canvas: { width, height }
  } = useContext(cameraContext);
  const [canPlay, setCanPlay] = useState(false);

  const [centerNote, setCenterNote] = useState(A4_440.position);
  const [baseFrequency, setBaseFrequency] = useState(A4_440.frequency);
  const [synthWaveType, setSynthWaveType] = useState(SYNTH_WAVE_TYPES[0]);
  const [tet, setTet] = useState(BASE_TET);
  const [frequency, setFrequency, getNote] = useTemperamentScale(
    A4_440.position,
    {
      baseNoteFrequency: baseFrequency,
      baseNotePosition: centerNote,
      tet
    }
  );
  const [muted, toggleMuted] = useToggle(true);
  const [notes, toggleNotes] = useToggle(true);
  const [persist, togglePersist] = useToggle(true);
  const [resetSynthOnUpdate, toggleResetSynthOnUpdate] = useToggle(true);

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
        label="Synth type:"
        labelPrefix="Synth_type_select"
        onChange={setSynthWaveType}
        options={synthOptions}
      />
      <SynthFrequencyControls
        baseFrequency={baseFrequency}
        canPlay={canPlay}
        centerNote={centerNote}
        getNote={getNote}
        height={height}
        id={id}
        notes={notes}
        person={person}
        personId={personId}
        resetSynthOnUpdate={resetSynthOnUpdate}
        setBaseFrequency={setBaseFrequency}
        setCanPlay={setCanPlay}
        setCenterNote={setCenterNote}
        setFrequency={setFrequency}
        setTet={setTet}
        tet={tet}
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
