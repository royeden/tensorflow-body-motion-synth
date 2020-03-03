import React, { useContext } from "react";

import { cameraContext } from "../context/cameraContext";
import { modelContext } from "../context/modelContext";

import Input from "./input";

function CameraControls() {
  const { videoActive, toggleVideoActive } = useContext(cameraContext);
  const {
    modelLoaded,
    modelOpacity,
    setModelOpacity,
    trackingActive,
    toggleTrackingActive
  } = useContext(modelContext);
  return (
    <div>
      <button onClick={toggleVideoActive}>
        {videoActive ? "Stop" : "Start"} Video
      </button>
      <button disabled={!modelLoaded} onClick={toggleTrackingActive}>
        {trackingActive ? "Pause" : "Resume"} Tracking
      </button>
      <label htmlFor="model_opacity">Model opacity</label>
      <p>0</p>
      <Input
        id="model_opacity"
        max="1"
        min="0"
        onChange={value => setModelOpacity(parseFloat(value, 10))}
        step="0.1"
        type="range"
        value={modelOpacity}
      />
      <p>1</p>
    </div>
  );
}

export default CameraControls;
