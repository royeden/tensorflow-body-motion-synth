import React, { useCallback } from "react";

import { FREQUENCY_LIMITS, TET_LIMITS } from "../constants/music";
import { map, mapWithinBoundary } from "../utils/math";

import Input from "./input";
import SynthBodyControls from "./synthBodyControls";

function SynthFrequencyControls({
  baseFrequency,
  bodyPart,
  canPlay,
  centerNote,
  getNote,
  height,
  id,
  maxNote,
  minNote,
  notes,
  person,
  personId,
  roundPosition,
  resetSynthOnUpdate,
  setBaseFrequency,
  setBodyPart,
  setCanPlay,
  setCenterNote,
  setFrequency,
  setMaxNote,
  setMinNote,
  setTet,
  setTrackingDirection,
  tet,
  toggleRoundPosition,
  trackingDirection,
  width
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

  const handleFrequencyPositionChange = useCallback(
    position => {
      const x = position.x && mapWithinBoundary(position.x, 0, width);
      const y = position.y && mapWithinBoundary(position.y, 0, height);
      const mappedX = x
        ? map(
            x,
            0,
            width,
            FREQUENCY_LIMITS.min,
            y ? FREQUENCY_LIMITS.max / 2 : FREQUENCY_LIMITS.max
          )
        : 0;
      const mappedY = y
        ? map(
            y,
            0,
            height,
            FREQUENCY_LIMITS.min,
            x ? FREQUENCY_LIMITS.max / 2 : FREQUENCY_LIMITS.max
          )
        : 0;
      setFrequency(
        mappedX > 0 || mappedY > 0
          ? // TODO figure out how to scale accordingly, remeber that frequency is a logarythmic scale
            (mappedX + mappedY) * (1 / Math.log(mappedX + mappedY))
          : FREQUENCY_LIMITS.min
      );
    },
    [height, setFrequency, width]
  );

  const handleNotePositionChange = useCallback(
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
      <SynthBodyControls
        bodyPart={bodyPart}
        canPlay={canPlay}
        id={id}
        onPositionChange={
          notes ? handleNotePositionChange : handleFrequencyPositionChange
        }
        person={person}
        personId={personId}
        roundPosition={roundPosition}
        setBodyPart={setBodyPart}
        setCanPlay={setCanPlay}
        setTrackingDirection={setTrackingDirection}
        toggleRoundPosition={toggleRoundPosition}
        trackingDirection={trackingDirection}
      />
      {notes && (
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
      )}
    </>
  );
}

export default SynthFrequencyControls;
