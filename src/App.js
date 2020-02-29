import React from "react";

import Camera from "./components/camera";
import ConfigurationPanel from "./components/configurationPanel";
import { AudioProvider } from "./context/audioContext";
import { CameraProvider } from "./context/cameraContext";
import { ModelProvider } from "./context/modelContext";

function App() {
  return (
    <ModelProvider>
      <CameraProvider>
        <AudioProvider>
          <ConfigurationPanel />
          <Camera />
        </AudioProvider>
      </CameraProvider>
    </ModelProvider>
  );
}

export default App;
