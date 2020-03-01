import { useEffect, useState, useRef } from "react";

import { A4_440 } from "../constants/music";
import { getFrequencyFromTemperamentScaleNote } from "../utils/music";

export function useTemperamentScale(
  initialNotePosition = A4_440.position,
  {
    baseNoteFrequency = A4_440.frequency,
    baseNotePosition = A4_440.position,
    tet = 12
  }
) {
  const config = {
    baseNoteFrequency,
    baseNotePosition,
    tet
  };

  const initialNotePositionRef = useRef(initialNotePosition);
  const configRef = useRef(config);

  const [frequency, setFrequency] = useState(
    getFrequencyFromTemperamentScaleNote(initialNotePosition, config)
  );

  useEffect(() => {
    const prevConfig = configRef.current;
    if (
      [
        config.baseNoteFrequency !== prevConfig.baseNoteFrequency,
        config.baseNotePosition !== prevConfig.baseNotePosition,
        config.tet !== prevConfig.tet
      ].find(Boolean)
    ) {
      configRef.current = config;
      getFrequencyFromTemperamentScaleNote(
        initialNotePositionRef.current,
        config
      );
    }
  }, [config, config.baseNoteFrequency, config.baseNotePosition, config.tet]);

  const getNote = (desiredNotePosition = initialNotePosition) => {
    const newFrequency = getFrequencyFromTemperamentScaleNote(
      desiredNotePosition,
      config
    );
    if (newFrequency !== frequency) {
      setFrequency(newFrequency);
    }
    return newFrequency;
  };

  return [frequency, setFrequency, getNote];
}
