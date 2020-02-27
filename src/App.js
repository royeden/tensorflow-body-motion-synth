import React, { useEffect, useRef, useState } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';

import { AudioContext } from './audio/audioContext';
import { useInterval } from './hooks/useInterval';
import { useToggle } from './hooks/useToggle';
import { drawVideo } from './utils/canvas';

const messages = {
  noVideo: 'No stream is being captured',
  video: 'Viewing camera feed!'
};

function App() {
  const audioContext = useRef();
  const net = useRef();
  const video = useRef();
  const canvas = useRef();

  const [trackingLoading, toggleTrackingLoading] = useToggle();
  const [trackingActive, toggleTrackingActive] = useToggle();
  const [videoActive, toggleVideoActive] = useToggle();
  const [canvasDimensions, setCanvasDimensions] = useState({
    height: 0,
    width: 0
  });
  const [canvasIntervalDelay, setCanvasIntervalDelay] = useState(null);

  useInterval(async () => {
    const canvasNode = canvas.current;
    const videoNode = video.current;
    const model = net.current;
    if (canvasNode && videoNode && model) {
      const context = drawVideo(canvasNode, videoNode);
      const image = context.getImageData(
        0,
        0,
        canvasDimensions.width,
        canvasDimensions.height
      );
      const segmentation = await model.segmentPerson(image);
      const coloredPartImage = bodyPix.toMask(segmentation);
      const opacity = 0.7;
      const flipHorizontal = false;
      const maskBlurAmount = 0;
      console.log(coloredPartImage, image)
      context.putImageData(coloredPartImage, 0, 0);
      // drawVideo(canvasNode, coloredPartImage);
      // bodyPix.drawMask(
      //   canvasNode,
      //   image,
      //   coloredPartImage,
      //   opacity,
      //   maskBlurAmount,
      //   flipHorizontal
      // );
    }
  }, canvasIntervalDelay);

  useEffect(() => {
    if (!trackingActive && !trackingLoading) {
      toggleTrackingLoading();
      async function getModel() {
        net.current = await bodyPix.load();

        console.log('loaded model!');
        console.log(net.current);
        toggleTrackingActive();
      }
      getModel();
    }
  }, [
    toggleTrackingActive,
    toggleTrackingLoading,
    trackingActive,
    trackingLoading
  ]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function(stream) {
        const videoNode = video.current;
        videoNode.srcObject = stream;
        audioContext.current = new AudioContext();
      })
      .catch(function(err) {
        console.log('An error occurred: ' + err);
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
        onClick={() =>
          setCanvasIntervalDelay(prev => (prev ? null : 1000 / 60))
        }
      >
        Stop Tracking
      </button>
      <canvas
        className="main__canvas"
        ref={canvas}
        height={canvasDimensions.height}
        width={canvasDimensions.width}
      ></canvas>
    </main>
  );
}

export default App;
