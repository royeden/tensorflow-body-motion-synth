import { useEffect } from "react";

import { IS_MOBILE } from "../utils/mobileDetect";

function useStream(videoRef) {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: {
            min: 160,
            ideal: IS_MOBILE ? 300 : 500,
            max: 500
          },
          height: {
            min: 120,
            ideal: IS_MOBILE ? 300 : 500,
            max: 500
          },
          facingMode: "environment"
        },
        audio: false
      })
      .then(stream => (videoRef.current.srcObject = stream))
      .catch(error => console.error(error));
  }, [videoRef]);
}

export default useStream;
