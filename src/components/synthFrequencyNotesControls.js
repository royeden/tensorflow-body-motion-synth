import React, { useCallback } from "react";

import { FREQUENCY_LIMITS, TET_LIMITS } from "../constants/music";

import Input from "./input";

function SynthFrequencyNotesControls({
  baseFrequency,
  centerNote,
  id,
  maxNote,
  minNote,
  personId,
  resetSynthOnUpdate,
  setBaseFrequency,
  setCenterNote,
  setFrequency,
  setMaxNote,
  setMinNote,
  setTet,
  tet
}) {
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

  return (
    <>
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
        defaultValue={tet}
        label="Tet:"
        labelIdPrefix={`Synth_${personId}_${id}_tet`}
        onChange={handleTetChange}
        type="number"
        validation={tetValidation}
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
    </>
  );
}

export default SynthFrequencyNotesControls;
