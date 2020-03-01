import { useEffect, useRef } from "react";

import { mapWithinBoundary } from "../utils/math";
import { FREQUENCY_LIMITS } from "../constants/music";

export function useOscillator(audioContext, play, frequency, type) {
  const audioContextRef = useRef(audioContext);
  const oscillatorRef = useRef(audioContextRef.current.createOscillator());
  const frequencyRef = useRef(frequency);
  const connectedRef = useRef(play);

  useEffect(() => {
    if (frequency !== frequencyRef.current) {
      frequencyRef.current = frequency;
      oscillatorRef.current.frequency.setValueAtTime(
        mapWithinBoundary(
          frequency,
          FREQUENCY_LIMITS.min,
          FREQUENCY_LIMITS.max
        ),
        audioContextRef.current.currentTime
      );
    }
  }, [frequency]);

  useEffect(() => {
    oscillatorRef.current.type = type;
  }, [type]);

  useEffect(() => {
    const context = audioContextRef.current;
    const oscillator = oscillatorRef.current;
    if (play !== connectedRef.current) {
      if (play) {
        oscillator.connect(context.destination);
      } else {
        oscillator.disconnect(context);
      }
      connectedRef.current = play;
    }
  }, [play]);

  useEffect(() => {
    const context = audioContextRef.current;
    const oscillator = oscillatorRef.current;
    const connected = connectedRef.current;
    oscillator.start();
    if (connectedRef.current) oscillator.connect(context.destination);
    return () => {
      if (connected) oscillator.disconnect(context);
      oscillator.stop();
    };
  }, []);
}
