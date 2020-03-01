import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
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

const HiddenCanvas = styled.canvas`
  display: none;
`;

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
  const hiddenCanvasRef = useRef();
  const hiddenImageRef = useRef();
  const hiddenVideoRef = useRef();

  const isMobile = useStream(hiddenVideoRef);

  const [width, height] = useVideoDimensions(hiddenVideoRef, videoActive);

  // Cleanup
  useEffect(() => {
    if (!videoActive && peopleTracked.length > 0) setPeopleTracked([]);
  }, [peopleTracked.length, videoActive]);

  useCanvasDraw(
    hiddenCanvasRef.current,
    hiddenVideoRef.current,
    videoActive,
    setImageSrc,
    { flip: !isMobile }
  );
  useCanvasDraw(
    canvasRef.current,
    hiddenVideoRef.current,
    !trackingActive && videoActive,
    false,
    { flip: !isMobile }
  );
  useModelDraw(
    canvasRef.current,
    hiddenImageRef.current,
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
          if (nose.score > 0.4)
            drawText(canvasRef.current, id + 1, nose.position);
        }
      });
    }
  }, videoActive && imageSrc && trackingActive);

  return (
    <>
      <HiddenCanvas height={height} width={width} ref={hiddenCanvasRef} />
      <HiddenImage ref={hiddenImageRef} src={imageSrc} alt="" />
      <HiddenVideo
        autoPlay
        onPlayCapture={toggleVideoActive}
        ref={hiddenVideoRef}
      >
        {videoActive ? "Video Active" : "Waiting for stream"}
      </HiddenVideo>
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
