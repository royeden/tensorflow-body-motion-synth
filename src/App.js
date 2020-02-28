import React, { useEffect, useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";

import { AudioContext } from "./audio/audioContext";
import { drawVideo } from "./utils/canvas";
import { mobileDetect } from "./utils/mobileDetect";
import { useInterval } from "./hooks/useInterval";
import { useToggle } from "./hooks/useToggle";
import { useTemperamentScale } from "./hooks/useTemperamentScale";
import { getFrequencyFromTemperamentScaleNote } from "./utils/music";
import { map } from "./utils/math";

const isMobile = mobileDetect().isMobile();

const messages = {
  noVideo: "No stream is being captured",
  video: "Viewing camera feed!"
};

const THRESHOLD = isMobile ? 0.3 : 0.5;

function App() {
  const [frequency, getNote] = useTemperamentScale();

  const audioContext = useRef();
  const oscillator = useRef();
  const net = useRef();
  const video = useRef();
  const image = useRef();
  const canvas = useRef();

  const [trackingLoaded, toggleTrackingLoaded] = useToggle();
  const [trackingActive, toggleTrackingActive] = useToggle();
  const [audioActive, toggleAudioActive] = useToggle();
  const [videoActive, toggleVideoActive] = useToggle();
  const [imageSrc, setImageSrc] = useState("");
  const [canvasDimensions, setCanvasDimensions] = useState({
    height: 0,
    width: 0
  });
  const [canvasIntervalDelay, setCanvasIntervalDelay] = useState(null);

  useInterval(() => {
    const canvasNode = canvas.current;
    const videoNode = video.current;
    if (canvasNode && videoNode) {
      drawVideo(canvasNode, videoNode);
      setImageSrc(canvasNode.toDataURL("image/png"));
    }
  }, canvasIntervalDelay);

  useInterval(
    async () => {
      const canvasNode = canvas.current;
      const imageNode = image.current;
      const model = net.current;
      if (imageNode && imageNode.height && imageNode.width && model) {
        const segmentations = await model.segmentMultiPersonParts(imageNode, {
          scoreThreshold: isMobile ? 0.2 : 0.4,
          refineSteps: isMobile ? 8 : 10
        });
        const coloredPartImage = bodyPix.toColoredPartMask(segmentations);
        const opacity = 0.7;
        const flipHorizontal = false;
        const maskBlurAmount = 0;
        bodyPix.drawMask(
          canvasNode,
          imageNode,
          coloredPartImage,
          opacity,
          maskBlurAmount,
          flipHorizontal
        );
        if (segmentations && segmentations[0]) {
          const segmentation = segmentations[0];
          const rightWrist = segmentation.pose.keypoints.find(
            ({ part }) => part === "rightWrist"
          );
          if (rightWrist.score >= THRESHOLD) {
            const { position } = rightWrist;
            const note = Math.round(map(position.x > 0 ? position.x : 0, 0, canvasDimensions.width, 0, 88))
            oscillator.current.frequency.setValueAtTime(
              getNote(note),
              audioContext.current.currentTime
            );
            
          } else {
            oscillator.current.frequency.setValueAtTime(
              frequency,
              audioContext.current.currentTime
            );
          }
        }
      }
    },
    trackingActive ? canvasIntervalDelay : null
  );

  useEffect(() => {
    if (!trackingActive && !trackingLoaded) {
      toggleTrackingLoaded();
      async function getModel() {
        net.current = await bodyPix.load();

        console.log("loaded model!");
        console.log(net.current);
        toggleTrackingActive();
      }
      getModel();
    }
  }, [
    toggleTrackingActive,
    toggleTrackingLoaded,
    trackingActive,
    trackingLoaded
  ]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: {
            min: 160,
            ideal: isMobile ? 320 : 640,
            max: 640
          },
          height: {
            min: 120,
            ideal: isMobile ? 240 : 480,
            max: 480
          },
          facingMode: "environment"
        },
        audio: false
      })
      .then(function(stream) {
        const videoNode = video.current;
        videoNode.srcObject = stream;
        const tmpAudioContext = new AudioContext();
        const tmpOscillator = tmpAudioContext.createOscillator();
        tmpOscillator.type = "square";
        tmpOscillator.frequency.setValueAtTime(
          getFrequencyFromTemperamentScaleNote(),
          tmpAudioContext.currentTime
        );
        tmpOscillator.start();
        audioContext.current = tmpAudioContext;
        oscillator.current = tmpOscillator;
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });
  }, []);

  useEffect(() => {
    if (videoActive) {
      const videoNode = video.current;
      if (
        !canvasDimensions ||
        (!canvasDimensions.height && !canvasDimensions.width)
      ) {
        setCanvasDimensions({
          height: videoNode.videoHeight,
          width: videoNode.videoWidth
        });
      }
    }
  }, [canvasDimensions, videoActive]);

  useEffect(() => {
    if (
      canvasDimensions &&
      canvasDimensions.height &&
      canvasDimensions.width &&
      trackingActive
    ) {
      setCanvasIntervalDelay(1000 / 60);
    }
  }, [canvasDimensions, trackingActive]);

  return (
    <main className="main">
      <h1>Here we go</h1>
      <p>Note frequency: {frequency}hz</p>
      <p>{videoActive ? messages.video : messages.noVideo}</p>
      <video
        autoPlay
        onPlayCapture={toggleVideoActive}
        className="main__video"
        ref={video}
      >
        {videoActive ? messages.video : messages.noVideo}
      </video>
      <button
        onClick={() => {
          toggleAudioActive();
          if (!audioActive)
            oscillator.current.connect(audioContext.current.destination);
          else oscillator.current.disconnect(audioContext.current.destination);
        }}
      >
        {audioActive ? "Stop" : "Start"} Synth
      </button>
      <button onClick={toggleTrackingActive}>
        {trackingActive ? "Stop" : "Start"} Tracking
      </button>
      <button
        onClick={() =>
          setCanvasIntervalDelay(prev => (prev ? null : 1000 / 60))
        }
      >
        {canvasIntervalDelay ? "Stop" : "Start"} Camera
      </button>
      <img className="main__image" ref={image} src={imageSrc} alt="" />
      <canvas
        className={`main__canvas${isMobile ? "" : "--flip"}`}
        ref={canvas}
        height={canvasDimensions.height}
        width={canvasDimensions.width}
      ></canvas>
    </main>
  );
}

export default App;
