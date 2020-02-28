import { useState } from "react";
import { A4_440 } from "../constants/music";
import { getFrequencyFromTemperamentScaleNote } from "../utils/music";

export function useTemperamentScale(
  initialNotePosition = A4_440.position,
  config = {
    baseNoteFrequency: A4_440.frequency,
    baseNotePosition: A4_440.position,
    tet: 12
  }
) {
  const [frequency, setFrequency] = useState(
    getFrequencyFromTemperamentScaleNote(initialNotePosition, config)
  );

  const getNote = (desiredNotePosition = initialNotePosition) => {
    const newFrequency = getFrequencyFromTemperamentScaleNote(
      desiredNotePosition,
      config
    );
    if (newFrequency !== frequency) {
      setFrequency(newFrequency)
    };
    return newFrequency;
  };

  return [frequency, getNote];
}
