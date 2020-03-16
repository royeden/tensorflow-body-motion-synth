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

const HiddenImage = styled.img`
  display: none;
`;

const { Provider } = cameraContext;

export function CameraProvider({ children }) {
  const { model, modelOpacity, trackingActive } = useContext(modelContext);

  const [imageSrc, setImageSrc] = useState("");
  const [peopleTracked, setPeopleTracked] = useState([]);
  const [videoActive, toggleVideoActive] = useToggle();

  const auxiliaryCanvasRef = useRef(document.createElement("canvas"));
  const canvasRef = useRef();
  const hiddenImageRef = useRef();
  const hiddenVideoRef = useRef();

  const drawTrackedId = useCallback(({ id }) => id + 1, []);

  useStream(hiddenVideoRef);

  const [width, height] = useVideoDimensions(hiddenVideoRef, videoActive);

  useEffect(() => {
    if (width && height) {
      auxiliaryCanvasRef.current.width = width;
      auxiliaryCanvasRef.current.height = height;
    }
  }, [height, width]);

  // Cleanup
  useEffect(() => {
    if (!videoActive && peopleTracked.length > 0) setPeopleTracked([]);
  }, [peopleTracked.length, videoActive]);

  useCanvasDraw(
    auxiliaryCanvasRef.current,
    hiddenVideoRef.current,
    videoActive,
    setImageSrc,
    {}
  );
  useCanvasDraw(
    canvasRef.current,
    hiddenVideoRef.current,
    !trackingActive && videoActive,
    false,
    {}
  );
  useModelDraw(
    canvasRef.current,
    hiddenImageRef.current,
    model.current,
    videoActive && imageSrc && trackingActive,
    setPeopleTracked,
    { opacity: modelOpacity, peopleTracked, text: drawTrackedId }
  );

  return (
    <>
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
