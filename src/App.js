import React, { lazy, Suspense } from "react";
import styled from "styled-components";

import Loading from "./components/loading";
import ErrorLayout from "./ErrorLayout";

const CameraDisplay = lazy(() => import("./components/cameraDisplay"));
const CameraControls = lazy(() => import("./components/cameraControls"));
const PeopleControls = lazy(() => import("./components/peopleControls"));
const AudioProvider = lazy(() => import("./context/audioContext"));
const CameraProvider = lazy(() => import("./context/cameraContext"));
const ModelProvider = lazy(() => import("./context/modelContext"));

const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100vw;
`;

function App() {
  return (
    <ErrorLayout>
      <Suspense
        fallback={
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        }
      >
        <ModelProvider>
          <CameraProvider>
            <AudioProvider>
              <CameraDisplay />
              <CameraControls />
              <PeopleControls />
            </AudioProvider>
          </CameraProvider>
        </ModelProvider>
      </Suspense>
    </ErrorLayout>
  );
}

export default App;
