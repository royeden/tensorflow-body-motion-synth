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

const loading = (
  <LoadingContainer>
    <Loading />
  </LoadingContainer>
);

function App() {
  return (
    <ErrorLayout>
      <Suspense fallback={loading}>
        <ModelProvider>
          <Suspense fallback={loading}>
            <CameraProvider>
              <Suspense fallback={loading}>
                <AudioProvider>
                  <Suspense fallback={loading}>
                    <CameraDisplay />
                  </Suspense>
                  <Suspense fallback={loading}>
                    <CameraControls />
                  </Suspense>
                  <Suspense fallback={loading}>
                    <PeopleControls />
                  </Suspense>
                </AudioProvider>
              </Suspense>
            </CameraProvider>
          </Suspense>
        </ModelProvider>
      </Suspense>
    </ErrorLayout>
  );
}

export default App;
