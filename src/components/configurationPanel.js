import React, { useContext } from "react";

import { cameraContext } from "../context/cameraContext";
import { modelContext } from "../context/modelContext";

function ConfigurationPanel(props) {
  const { videoActive, toggleVideoActive } = useContext(cameraContext);
  const { trackingActive, toggleTrackingActive } = useContext(modelContext);
  return (
    <div>
      <button onClick={toggleVideoActive}>
        {videoActive ? "Stop" : "Start"} Video
      </button>
      <button onClick={toggleTrackingActive}>
        {trackingActive ? "Stop" : "Start"} Tracking
      </button>
    </div>
  );
}

export default ConfigurationPanel;
