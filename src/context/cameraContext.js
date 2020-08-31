import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import useCanvasDraw from "../hooks/useCanvasDraw";
import useModelDraw from "../hooks/useModelDraw";
import useStream from "../hooks/useStream";
import useToggle from "../hooks/useToggle";
import useVideoDimensions from "../hooks/useVideoDimensions";
import { createRefDescription } from "../constants/objects";
import { noOp } from "../constants/functions";

import { modelContext } from "./modelContext";

export const cameraContext = createContext({
  canvas: { ref: createRefDescription(), height: 0, width: 0 },
  canvasOpacity: 0.7,
  peopleTracked: [],
  setCanvasOpacity: noOp,
  setVideoActive: noOp,
  toggleVideoActive: noOp,
  video: createRefDescription(),
  videoActive: noOp
});

const { Provider } = cameraContext;

export function CameraProvider({ children }) {
  const { model, modelColorsOpacity, trackingActive } = useContext(
    modelContext
  );
  const [canvasOpacity, setCanvasOpacity] = useState(0.7);
  const [peopleTracked, setPeopleTracked] = useState([]);
  const [videoActive, toggleVideoActive, setVideoActive] = useToggle();

  const auxiliaryCanvasRef = useRef(document.createElement("canvas"));
  const auxiliaryImageRef = useRef(document.createElement("img"));
  const canvasRef = useRef();
  const videoRef = useRef();

  const drawTrackedId = useCallback(({ id }) => id + 1, []);

  useStream(videoRef, videoActive);

  const [width, height] = useVideoDimensions(videoRef, videoActive);

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
    if (!(trackingActive && videoActive) && peopleTracked.length > 0)
      setPeopleTracked([]);
  }, [peopleTracked.length, trackingActive, videoActive]);

  useCanvasDraw(
    auxiliaryCanvasRef.current,
    auxiliaryImageRef.current,
    videoRef.current,
    videoActive,
    {}
  );
  useCanvasDraw(
    canvasRef.current,
    false,
    videoRef.current,
    !trackingActive && videoActive,
    {}
  );
  useModelDraw(
    canvasRef.current,
    auxiliaryImageRef.current,
    model.current,
    videoActive && trackingActive,
    setPeopleTracked,
    { opacity: modelColorsOpacity, peopleTracked, text: drawTrackedId }
  );

  return (
    <Provider
      value={{
        canvas: { ref: canvasRef, height, width },
        canvasOpacity,
        peopleTracked,
        setCanvasOpacity,
        setVideoActive,
        toggleVideoActive,
        video: videoRef,
        videoActive
      }}
    >
      {children}
    </Provider>
  );
}

export default CameraProvider;
