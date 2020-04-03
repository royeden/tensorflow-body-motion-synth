import React, { createContext, useEffect, useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";

import useToggle from "../hooks/useToggle";
import { IS_MOBILE } from "../utils/mobileDetect";
import { noOp } from "../constants/functions";

export const modelContext = createContext({
  model: null,
  modelLoaded: false,
  modelColorsOpacity: 0.7,
  setModelColorsOpacity: noOp,
  toggleTrackingActive: noOp,
  trackingActive: false
});

const { Provider } = modelContext;

export function ModelProvider({ children }) {
  const model = useRef(null);
  const [modelColorsOpacity, setModelColorsOpacity] = useState(0.7);
  const [modelLoaded, toggleModelLoaded] = useToggle();
  const [trackingActive, toggleTrackingActive] = useToggle();

  useEffect(() => {
    if (!modelLoaded) {
      async function getModel() {
        model.current = await bodyPix.load(
          IS_MOBILE
            ? {
                architecture: "MobileNetV1",
                outputStride: 16,
                multiplier: 0.5,
                quantBytes: 1
              }
            : {
              architecture: "MobileNetV1",
              outputStride: 16,
              multiplier: 0.75,
              quantBytes: 2
            }
        );
        console.log("Loaded model");
        toggleModelLoaded();
      }
      getModel();
    }
  }, [modelLoaded, toggleModelLoaded]);

  return (
    <Provider
      value={{
        model,
        modelLoaded,
        modelColorsOpacity,
        setModelColorsOpacity,
        toggleTrackingActive,
        trackingActive
      }}
    >
      {children}
    </Provider>
  );
}
