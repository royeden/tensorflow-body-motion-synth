import React from "react";

import { AudioProvider } from "./context/audioContext";
import { CameraProvider } from "./context/cameraContext";
import { ModelProvider } from "./context/modelContext";
import Display from "./components/display";
import ConfigurationPanel from "./components/configurationPanel";

function App() {
  return (
    <ModelProvider>
      <CameraProvider>
        <AudioProvider>
          <h1>Test</h1>
          <ConfigurationPanel />
          <Display />
        </AudioProvider>
      </CameraProvider>
    </ModelProvider>
  );
}

export default App;
