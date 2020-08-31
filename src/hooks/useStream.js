import { useEffect, useRef } from "react";

import { IS_MOBILE } from "../utils/mobileDetect";

function useStream(videoRef, active) {
  const isFirstRender = useRef(true);
  const internalStream = useRef(null);
  useEffect(() => {
    const stream = internalStream.current;
    const firstRender = isFirstRender.current;
    if (active || firstRender) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: {
              min: 160,
              ideal: IS_MOBILE ? 300 : 500,
              max: 500,
            },
            height: {
              min: 120,
              ideal: IS_MOBILE ? 300 : 500,
              max: 500,
            },
            facingMode: "environment",
          },
          audio: false,
        })
        .then((captureStream) => {
          internalStream.current = captureStream;
          videoRef.current.srcObject = captureStream;
          isFirstRender.current = false;
        })
        .catch((error) => console.error(error));
    } else if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      internalStream.current = null;
    }
  }, [active, videoRef]);
}

export default useStream;
