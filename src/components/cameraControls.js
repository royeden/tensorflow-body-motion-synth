import React, { useContext } from "react";

import { cameraContext } from "../context/cameraContext";
import { modelContext } from "../context/modelContext";

function CameraControls(props) {
  const { videoActive, toggleVideoActive } = useContext(cameraContext);
  const { modelLoaded, trackingActive, toggleTrackingActive } = useContext(modelContext);
  return (
    <div>
      <button onClick={toggleVideoActive}>
        {videoActive ? "Stop" : "Start"} Video
      </button>
      <button disabled={!modelLoaded} onClick={toggleTrackingActive}>
        {trackingActive ? "Pause" : "Resume"} Tracking
      </button>
    </div>
  );
}

export default CameraControls;
