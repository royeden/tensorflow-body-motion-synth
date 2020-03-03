import React, { createContext, useEffect, useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";

import { noOp } from "../constants/functions";
import useToggle from "../hooks/useToggle";

export const modelContext = createContext({
  model: null,
  modelLoaded: false,
  modelOpacity: 0.5,
  setModelOpacity: noOp,
  toggleTrackingActive: noOp,
  trackingActive: false
});

const { Provider } = modelContext;

export function ModelProvider({ children }) {
  const model = useRef(null);
  const [modelOpacity, setModelOpacity] = useState(0.5);
  const [modelLoaded, toggleModelLoaded] = useToggle();
  const [trackingActive, toggleTrackingActive] = useToggle();

  useEffect(() => {
    if (!trackingActive && !modelLoaded) {
      async function getModel() {
        model.current = await bodyPix.load();
        console.log("Loaded model");
        toggleModelLoaded();

        // toggleTrackingActive();
      }
      getModel();
    }
  }, [modelLoaded, toggleModelLoaded, toggleTrackingActive, trackingActive]);

  return (
    <Provider
      value={{
        model,
        modelLoaded,
        modelOpacity,
        setModelOpacity,
        toggleTrackingActive,
        trackingActive
      }}
    >
      {children}
    </Provider>
  );
}
