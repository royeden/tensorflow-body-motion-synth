import { useEffect } from "react";
import { useState } from "react";

export function useVideoDimensions(videoRef, videoActive) {
  const [{ height, width }, setVideoDimensions] = useState({
    height: 0,
    width: 0
  });
  useEffect(() => {
    if (videoActive) {
      const videoNode = videoRef.current;
      if (!height && !width) {
        setVideoDimensions({
          height: videoNode.videoHeight,
          width: videoNode.videoWidth
        });
      }
    }
  }, [height, videoActive, videoRef, width]);

  return [width, height];
}
