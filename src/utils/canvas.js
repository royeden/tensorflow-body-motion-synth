export function flipCanvas(canvas) {
  const context = canvas.getContext("2d");
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
}

export function drawText(canvas, text, { x = 0, y = 0 }) {
  const context = canvas.getContext("2d");
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillStyle = "#00000099";
  context.fillRect(x - 30, y - 45, 60, 60);
  context.fillStyle = "#fff";
  context.fillText(text, x, y);
}

export function drawImage(canvas, image, flip) {
  const context = canvas.getContext("2d");
  context.save();
  if (flip) flipCanvas(canvas);
  context.drawImage(image, 0, 0);
  context.restore();
}
