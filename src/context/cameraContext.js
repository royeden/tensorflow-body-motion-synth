import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import styled from "styled-components";

import { createRefDescription } from "../constants/objects";
import { noOp } from "../constants/functions";
import useCanvasDraw from "../hooks/useCanvasDraw";
import useModelDraw from "../hooks/useModelDraw";
import useStream from "../hooks/useStream";
import useToggle from "../hooks/useToggle";
import useVideoDimensions from "../hooks/useVideoDimensions";

import { modelContext } from "./modelContext";

export const cameraContext = createContext({
  canvas: { ref: createRefDescription(), height: 0, width: 0 },
  peopleTracked: [],
  toggleVideoActive: noOp,
  videoActive: noOp
});

const HiddenVideo = styled.video`
  display: none;
`;

const { Provider } = cameraContext;

export function CameraProvider({ children }) {
  const { model, modelOpacity, trackingActive } = useContext(modelContext);

  const [peopleTracked, setPeopleTracked] = useState([]);
  const [videoActive, toggleVideoActive] = useToggle();

  const auxiliaryCanvasRef = useRef(document.createElement("canvas"));
  const canvasRef = useRef();
  const auxiliaryImageRef = useRef(document.createElement("img"));
  const hiddenVideoRef = useRef();

  const drawTrackedId = useCallback(({ id }) => id + 1, []);

  useStream(hiddenVideoRef);

  const [width, height] = useVideoDimensions(hiddenVideoRef, videoActive);

  useEffect(() => {
    auxiliaryImageRef.current.src = "";
  }, []);

  useEffect(() => {
    if (width && height) {
      auxiliaryCanvasRef.current.width = width;
      auxiliaryCanvasRef.current.height = height;
      auxiliaryImageRef.current.width = width;
      auxiliaryImageRef.current.height = height;
    }
  }, [height, width]);

  // Cleanup
  useEffect(() => {
    if (!videoActive && peopleTracked.length > 0) setPeopleTracked([]);
  }, [peopleTracked.length, videoActive]);

  useCanvasDraw(
    auxiliaryCanvasRef.current,
    auxiliaryImageRef.current,
    hiddenVideoRef.current,
    videoActive,
    {}
  );
  useCanvasDraw(
    canvasRef.current,
    false,
    hiddenVideoRef.current,
    !trackingActive && videoActive,
    {}
  );
  useModelDraw(
    canvasRef.current,
    auxiliaryImageRef.current,
    model.current,
    videoActive && trackingActive,
    setPeopleTracked,
    { opacity: modelOpacity, peopleTracked, text: drawTrackedId }
  );

  return (
    <>
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
