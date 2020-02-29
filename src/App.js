import React from "react";

import Camera from "./components/camera";
import CameraControls from "./components/cameraControls";
import PeopleControls from "./components/peopleControls";
import { AudioProvider } from "./context/audioContext";
import { CameraProvider } from "./context/cameraContext";
import { ModelProvider } from "./context/modelContext";

function App() {
  return (
    <ModelProvider>
      <CameraProvider>
        <AudioProvider>
          <Camera />
          <CameraControls />
          <PeopleControls />
        </AudioProvider>
      </CameraProvider>
    </ModelProvider>
  );
}

export default App;
