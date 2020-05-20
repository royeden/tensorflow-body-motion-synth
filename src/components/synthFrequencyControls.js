import React, { useCallback } from "react";

import { FREQUENCY_LIMITS } from "../constants/music";
import { map, mapWithinBoundary } from "../utils/math";

import SynthBodyControls from "./synthBodyControls";
import SynthFrequencyNotesControls from "./synthFrequencyNotesControls";
import { getFrequencyFromAnyPosition } from "../utils/music";

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
  width,
}) {
  const handleFrequencyPositionChange = useCallback(
    (position) => {
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
          ? getFrequencyFromAnyPosition(mappedX + mappedY, {
              tet,
              baseNoteFrequency: baseFrequency,
            })
          : FREQUENCY_LIMITS.min
      );
    },
    [baseFrequency, height, setFrequency, tet, width]
  );

  const handleNotePositionChange = useCallback(
    (position) => {
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
        <SynthFrequencyNotesControls
          baseFrequency={baseFrequency}
          centerNote={centerNote}
          id={id}
          maxNote={maxNote}
          minNote={minNote}
          personId={personId}
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
    </>
  );
}

export default SynthFrequencyControls;
