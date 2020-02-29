import React, { useContext } from "react";
import styled, { css } from "styled-components";

import { cameraContext } from "../context/cameraContext";

const flipCanvasMixin = css`
  transform: rotateY(180deg);
`;

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
  min-height: 480px;
  min-width: 640px;
`;

const CanvasContainer = styled.div`
  align-items: center;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100vw;
  ${({ isMobile }) => (isMobile ? mobileCanvasMixin : webCanvasMixin)}
`;

const CanvasDisplay = styled.canvas`
  ${({ isMobile }) => (isMobile ? scaleCanvasMixin : flipCanvasMixin)}
  ${({ videoActive }) => (videoActive ? "" : hideCanvasMixin)}
`;

const FallbackMessage = styled.h1`
  color: #fff;
`;

function Display(props) {
  const { canvas, isMobile, videoActive } = useContext(cameraContext);
  return (
    <CanvasContainer>
      <CanvasDisplay
        {...canvas}
        isMobile={isMobile}
        videoActive={videoActive}
      />
      {!videoActive && (
        <FallbackMessage>Waiting for stream to start...</FallbackMessage>
      )}
    </CanvasContainer>
  );
}

export default Display;
