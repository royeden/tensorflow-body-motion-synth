import React, { createContext, useContext, useRef, useState } from "react";
import styled from "styled-components";

import { createRefDescription } from "../constants/objects";
import { noOp } from "../constants/functions";
import { drawText } from "../utils/canvas";
import { useCanvasDraw } from "../hooks/useCanvasDraw";
import { useAnimation } from "../hooks/useAnimation";
import { useModelDraw } from "../hooks/useModelDraw";
import { useStream } from "../hooks/useStream";
import { useToggle } from "../hooks/useToggle";
import { useVideoDimensions } from "../hooks/useVideoDimensions";

import { modelContext } from "./modelContext";

export const cameraContext = createContext({
  canvas: { ref: createRefDescription(), height: 0, width: 0 },
  isMobile: false,
  peopleTracked: [],
  toggleVideoActive: noOp,
  videoActive: noOp
});

const HiddenVideo = styled.video`
  display: none;
`;

const HiddenImage = styled.img`
  display: none;
`;

const { Provider } = cameraContext;

export function CameraProvider({ children }) {
  const { model, trackingActive } = useContext(modelContext);

  const [imageSrc, setImageSrc] = useState("");
  const [peopleTracked, setPeopleTracked] = useState([]);
  const [videoActive, toggleVideoActive] = useToggle();

  const canvasRef = useRef();
  const imageRef = useRef();
  const videoRef = useRef();

  const isMobile = useStream(videoRef);

  const [width, height] = useVideoDimensions(videoRef, videoActive);

  useCanvasDraw(canvasRef.current, videoRef.current, videoActive, setImageSrc);
  useModelDraw(
    canvasRef.current,
    imageRef.current,
    model.current,
    isMobile,
    videoActive && imageSrc && trackingActive,
    setPeopleTracked
  );
  useAnimation(() => {
    if (peopleTracked.length > 0) {
      peopleTracked.forEach(({ pose }, id) => {
        if (pose.keypoints && pose.keypoints.length > 0) {
          const nose = pose.keypoints.find(({ part }) => part === "nose");
          if (nose.score > 0.4) drawText(canvasRef.current, id, nose.position);
        }
      });
    }
  }, videoActive && imageSrc && trackingActive);

  return (
    <>
      <HiddenVideo autoPlay onPlayCapture={toggleVideoActive} ref={videoRef}>
        {videoActive ? "Video Active" : "Waiting for stream"}
      </HiddenVideo>
      <HiddenImage ref={imageRef} src={imageSrc} alt="" />
      <Provider
        value={{
          canvas: { ref: canvasRef, height, width },
          isMobile,
          peopleTracked,
          toggleVideoActive,
          videoActive
        }}
      >
        {children}
      </Provider>
    </>
  );
}
