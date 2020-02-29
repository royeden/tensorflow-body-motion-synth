import { useEffect } from "react";
import { mobileDetect } from "../utils/mobileDetect";

const isMobile = mobileDetect().isMobile();

export function useStream(videoRef) {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: {
            min: 160,
            ideal: isMobile ? 250 : 640,
            max: 640
          },
          height: {
            min: 120,
            ideal: isMobile ? 250 : 480,
            max: 480
          },
          facingMode: "environment"
        },
        audio: false
      })
      .then(stream => (videoRef.current.srcObject = stream))
      .catch(error => console.error(error));
  }, [videoRef]);
  return isMobile;
}
