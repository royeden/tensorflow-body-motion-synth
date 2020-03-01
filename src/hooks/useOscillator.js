import { useEffect, useRef, useState } from "react";

import { useToggle } from "./useToggle";

export function useOscillator(audioContext, play, frequency, type) {
  if (!audioContext)
    throw new Error(
      "Invalid or non-existent audio context was passed to this hook"
    );
  const oscillatorRef = useRef(audioContext.createOscillator());
  const frequencyRef = useRef(frequency);
  const [connected, setConnected] = useState(false);
  const [started, toggleStarted] = useToggle(false);

  // setup hook
  useEffect(() => {
    if (!started) {
      toggleStarted();
      oscillatorRef.current.start();
      setConnected(true);
      oscillatorRef.current.connect(audioContext.destination);
      frequencyRef.current = frequency;
      oscillatorRef.current.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );
    }
  }, [audioContext.currentTime, audioContext.destination, frequency, started, toggleStarted]);

  useEffect(() => {
    if (frequency !== frequencyRef.current) {
      frequencyRef.current = frequency;
      oscillatorRef.current.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );
    }
  }, [audioContext.currentTime, frequency]);

  useEffect(() => {
    oscillatorRef.current.type = type;
  }, [type]);

  useEffect(() => {
    const oscillator = oscillatorRef.current;
    if (play && !connected) {
      oscillator.connect(audioContext.destination);
      setConnected(true);
    } else if (!play && connected) {
      oscillator.disconnect(audioContext.destination);
      setConnected(false);
    }
    // cleanup
    return () => {
      if (connected) oscillator.disconnect(audioContext);
    };
  }, [audioContext, connected, play]);

  useEffect(() => {
    const oscillator = oscillatorRef.current;
    // cleanup
    return () => {
      oscillator.stop();
    };
  }, [audioContext, connected, started]);
}
