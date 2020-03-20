import React, { useCallback, useContext, useMemo, useState } from "react";

import {
  A4_440,
  BASE_TET,
  FREQUENCY_LIMITS,
  SYNTH_WAVE_TYPES,
  TET_LIMITS
} from "../constants/music";
import { audioContext } from "../context/audioContext";
import { cameraContext } from "../context/cameraContext";
import { map, mapWithinBoundary } from "../utils/math";
import useOscillator from "../hooks/useOscillator";
import useTemperamentScale from "../hooks/useTemperamentScale";
import useToggle from "../hooks/useToggle";

import Input from "./input";
import Select from "./select";
import SynthBodyControls from "./synthBodyControls";

function Synth({ id, person, personId, removeSynth }) {
  const { audioContextObject } = useContext(audioContext);
  const {
    canvas: { width, height }
  } = useContext(cameraContext);
  const [canPlay, setCanPlay] = useState(false);

  const [minNote, setMinNote] = useState(0);
  const [centerNote, setCenterNote] = useState(A4_440.position);
  const [maxNote, setMaxNote] = useState(88);
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
  const [persist, togglePersist] = useToggle(true);
  const [resetSynthOnUpdate, toggleResetSynthOnUpdate] = useToggle(true);

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

  const handlePositionChange = useCallback(
    position => {
      const x = position.x && mapWithinBoundary(position.x, 0, width);
      const y = position.y && mapWithinBoundary(position.y, 0, height);
      const mappedX = x
        ? map(x, 0, width, minNote, y ? maxNote / 2 : maxNote)
        : 0;
      const mappedY = y
        ? map(y, 0, height, minNote, x ? maxNote / 2 : maxNote)
        : 0;
      const note = Math.round(mappedX + mappedY);
      getNote(note);
    },
    [getNote, height, maxNote, minNote, width]
  );

  const handleMinNoteChange = useCallback(
    value => {
      const parsedValue = parseFloat(value, 10);
      setMinNote(parsedValue);
      if (resetSynthOnUpdate) setFrequency(baseFrequency);
    },
    [baseFrequency, resetSynthOnUpdate, setFrequency]
  );

  const handleMaxNoteChange = useCallback(
    value => {
      const parsedValue = parseFloat(value, 10);
      setMaxNote(parsedValue);
      if (resetSynthOnUpdate) setFrequency(baseFrequency);
    },
    [baseFrequency, resetSynthOnUpdate, setFrequency]
  );
  const handleCenterNoteChange = useCallback(
    value => {
      const parsedValue = parseFloat(value, 10);
      setCenterNote(parsedValue);
      if (resetSynthOnUpdate) setFrequency(baseFrequency);
    },
    [baseFrequency, resetSynthOnUpdate, setFrequency]
  );
  const handlBaseFrequencyChange = useCallback(value => {
    const parsedValue = parseFloat(value, 10);
    setBaseFrequency(parsedValue);
    if (resetSynthOnUpdate) setFrequency(parsedValue);
  }, [resetSynthOnUpdate, setFrequency]);

  const handlTetChange = useCallback(value => setTet(parseInt(value, 10)), []);

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
      <SynthBodyControls
        canPlay={canPlay}
        id={id}
        onPositionChange={handlePositionChange}
        person={person}
        personId={personId}
        setCanPlay={setCanPlay}
      />
      <Input
        defaultValue={minNote}
        label="Min note:"
        labelIdPrefix={`Synth_${personId}_${id}_min_note`}
        min={0}
        max={166}
        onChange={handleMinNoteChange}
        type="number"
        validation={minNoteValidation}
      />
      <Input
        defaultValue={centerNote}
        label="Center note:"
        labelIdPrefix={`Synth_${personId}_${id}_center_note`}
        min={0}
        max={166}
        onChange={handleCenterNoteChange}
        type="number"
        validation={centerNoteValidation}
      />
      <Input
        defaultValue={maxNote}
        label="Max note:"
        labelIdPrefix={`Synth_${personId}_${id}_max_note`}
        min={0}
        max={166}
        onChange={handleMaxNoteChange}
        type="number"
        validation={maxNoteValidation}
      />
      <Input
        defaultValue={baseFrequency}
        label="Base Frequency"
        labelIdPrefix={`Synth_${personId}_${id}_frequency`}
        max={FREQUENCY_LIMITS.max}
        min={FREQUENCY_LIMITS.min}
        onChange={handlBaseFrequencyChange}
        type="number"
        validation={frequencyValidation}
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
        defaultValue={tet}
        label="Tet:"
        labelIdPrefix={`Synth_${personId}_${id}_tet`}
        onChange={handlTetChange}
        type="number"
        validation={tetValidation}
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
