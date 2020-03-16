import React, { useContext } from "react";

import { cameraContext } from "../context/cameraContext";
import { modelContext } from "../context/modelContext";

import Input from "./input";

function CameraControls() {
  const {
    canvasOpacity,
    setCanvasOpacity,
    toggleVideoActive,
    videoActive
  } = useContext(cameraContext);
  const {
    modelLoaded,
    modelColorsOpacity,
    setModelColorsOpacity,
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
      <br />
      <Input
        defaultValue={canvasOpacity}
        label="Model Opacity"
        labelIdPrefix="camera_opacity"
        max="1"
        min="0.5"
        onChange={value => setCanvasOpacity(parseFloat(value, 10))}
        step="0.1"
        type="range"
      />
      <Input
        defaultValue={modelColorsOpacity}
        label="Model Colors Opacity"
        labelIdPrefix="model_opacity"
        max="1"
        min="0"
        onChange={value => setModelColorsOpacity(parseFloat(value, 10))}
        step="0.1"
        type="range"
      />
    </div>
  );
}

export default CameraControls;
