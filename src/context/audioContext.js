import React, { createContext, useContext, useEffect, useRef } from "react";

import { AudioContext } from "../audio/audioContext";
import { createRefDescription } from "../constants/objects";

import { modelContext } from "./modelContext";

export const audioContext = createContext({
  audioContextObject: createRefDescription(new AudioContext()),
});

const { Provider } = audioContext;

export function AudioProvider({ children }) {
  const { modelLoaded } = useContext(modelContext);
  const audioContextObject = useRef(null);
  useEffect(() => {
    if (modelLoaded) {
      audioContextObject.current = new AudioContext();
      console.log("Initialized audio context");
    }
  }, [modelLoaded]);
  return <Provider value={{ audioContextObject }}>{children}</Provider>;
}

export default AudioProvider;
