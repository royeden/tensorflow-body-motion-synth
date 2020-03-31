import React, { useCallback } from "react";

import { FREQUENCY_LIMITS } from "../constants/music";
import { map, mapWithinBoundary } from "../utils/math";

import SynthBodyControls from "./synthBodyControls";
import SynthFrequencyNotesControls from "./synthFrequencyNotesControls";

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
  const handleFrequencyPositionChange = useCallback(
    position => {
      const x = position.x && mapWithinBoundary(position.x, 0, width);
      const y = position.y && mapWithinBoundary(position.y, 0, height);
      const mappedX = x
        ? map(
            x,
            0,
            width,
            y ? FREQUENCY_LIMITS.max / 2 : FREQUENCY_LIMITS.max,
            FREQUENCY_LIMITS.min
          )
        : 0;
      const mappedY = y
        ? map(
            y,
            0,
            height,
            x ? FREQUENCY_LIMITS.max / 2 : FREQUENCY_LIMITS.max,
            FREQUENCY_LIMITS.min
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
