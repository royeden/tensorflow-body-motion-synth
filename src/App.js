import React from "react";

import CameraDisplay from "./components/cameraDisplay";
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
          <CameraDisplay />
          <CameraControls />
          <PeopleControls />
        </AudioProvider>
      </CameraProvider>
    </ModelProvider>
  );
}

export default App;
