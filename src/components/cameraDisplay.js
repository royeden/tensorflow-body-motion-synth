import React, { useContext } from "react";
import styled, { css } from "styled-components";

import { IS_MOBILE } from "../utils/mobileDetect";
import { cameraContext } from "../context/cameraContext";
import { modelContext } from "../context/modelContext";

const hideCanvasMixin = css`
  display: none;
`;

const scaleCanvasMixin = css`
  transform: scale(1.5);
`;

const mobileCanvasMixin = css`
  min-height: 250px;
  min-width: 250px;
`;

const webCanvasMixin = css`
  min-height: 500px;
  min-width: 500px;
`;

const cameraMixin = css`
  position: absolute;
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
  ${IS_MOBILE ? scaleCanvasMixin : ""}
  ${({ videoActive }) => (videoActive ? "" : hideCanvasMixin)}
  ${({ display }) => display === "false" && "display: none;"};
  opacity: ${({ opacity }) => opacity};
`;

const VideoCamera = styled.video`
  ${cameraMixin}
  ${IS_MOBILE ? scaleCanvasMixin : ""}
  ${({ videoActive }) => (videoActive ? "" : hideCanvasMixin)}
  transform: rotateY(180deg);
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
