import React, { createContext, useEffect, useRef } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";

import { useToggle } from "../hooks/useToggle";
import { noOp } from "../constants/functions";

export const modelContext = createContext({
  model: null,
  modelLoaded: false,
  toggleTrackingActive: noOp,
  trackingActive: false
});

const { Provider } = modelContext;

export function ModelProvider({ children }) {
  const model = useRef(null);
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
      value={{ model, modelLoaded, toggleTrackingActive, trackingActive }}
    >
      {children}
    </Provider>
  );
}
