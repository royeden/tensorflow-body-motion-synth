import React, { useEffect, useRef } from 'react';
import { AudioContext } from './audio/audioContext';
import { useToggle } from './hooks/useToggle';

const audioContext = new AudioContext();

const messages = {
  noVideo: "No stream is being captured",
  video: "Viewing camera feed!",
}

function App() {
  const [videoActive, toggleVideoActive] = useToggle();

  const video = useRef();
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.current.srcObject = stream;
        video.current.play();
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });
  }, [])

  useEffect(() => {
    const videoNode = video.current;
    if (videoNode) {
      videoNode.addEventListener("play", toggleVideoActive);
    }
    return () => videoNode.removeEventListener("play", toggleVideoActive);
  }, [toggleVideoActive]);

  return (
    <main className="main">
      <h1>Here we go</h1>
      <p>{videoActive ? messages.video : messages.noVideo}</p>
      <video className="main__video" ref={video}>No stream is being captured</video>
    </main>
  );
}

export default App;
