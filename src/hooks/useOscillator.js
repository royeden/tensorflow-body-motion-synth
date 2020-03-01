import { useEffect, useRef, useState } from "react";

import { useToggle } from "./useToggle";

export function useOscillator(audioContext, play, frequency, type) {
  const internalAudioContext = useRef(audioContext);
  const oscillatorRef = useRef(internalAudioContext.current.createOscillator());
  const frequencyRef = useRef(frequency);

  useEffect(() => {
    if (frequency !== frequencyRef.current) {
      frequencyRef.current = frequency;
      oscillatorRef.current.frequency.setValueAtTime(
        frequency,
        internalAudioContext.current.currentTime
      );
    }
  }, [frequency]);

  useEffect(() => {
    oscillatorRef.current.type = type;
  }, [type]);

  useEffect(() => {
    const context = internalAudioContext.current;
    const oscillator = oscillatorRef.current;
    oscillator.start();
    // TODO don't connect automatically;
    oscillator.connect(context.destination);
    return () => {
      oscillator.disconnect(context);
      oscillator.stop();
    };
  }, []);
}
