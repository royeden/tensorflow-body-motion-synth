import React, { useContext } from "react";
import styled, { css } from "styled-components";

import { IS_MOBILE } from "../utils/mobileDetect";
import { cameraContext } from "../context/cameraContext";
import { modelContext } from "../context/modelContext";

const hideCanvasMixin = css`
  display: none;
`;

const mobileCanvasMixin = css`
  min-height: 300px;
  min-width: 300px;
`;

const webCanvasMixin = css`
  min-height: 500px;
  min-width: 500px;
`;

const cameraMixin = css`
  position: absolute;
`;

const flipCameraMixin = css`
  transform: rotateY(180deg);
`;

const CameraContainer = styled.div`
  align-items: center;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100vw;
  ${IS_MOBILE ? mobileCanvasMixin : webCanvasMixin}
`;

const CanvasCamera = styled.canvas`
  ${cameraMixin}
  ${({ videoActive }) => (videoActive ? "" : hideCanvasMixin)}
  ${({ display }) => display === "false" && "display: none;"};
  opacity: ${({ opacity }) => opacity};
`;

const VideoCamera = styled.video`
  ${cameraMixin}
  ${({ videoActive }) => (!videoActive && hideCanvasMixin)}
  ${!IS_MOBILE && flipCameraMixin}
`;

const FallbackMessage = styled.h1`
  color: #fff;
`;

function CameraDisplay() {
  const {
    canvasOpacity,
    canvas,
    peopleTracked,
    toggleVideoActive,
    video,
    videoActive
  } = useContext(cameraContext);
  const { trackingActive } = useContext(modelContext);
  return (
    <>
      <CameraContainer>
        <VideoCamera
          autoPlay
          onPlayCapture={toggleVideoActive}
          ref={video}
          videoActive={videoActive}
        />
        <CanvasCamera
          {...canvas}
          display={String(trackingActive)}
          opacity={canvasOpacity}
          videoActive={videoActive}
        />

        {!videoActive && (
          <FallbackMessage>Waiting for stream to start...</FallbackMessage>
        )}
      </CameraContainer>
      <h1>People: {peopleTracked.length}</h1>
    </>
  );
}

export default CameraDisplay;
