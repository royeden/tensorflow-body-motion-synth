export function drawVideo(canvas, video) {
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0);
  return context;
}

export function getCanvasPixels() {

}