export function drawText(canvas, text, coordinates = { x: 0, y: 0 }) {
  const context = canvas.getContext("2d");
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillStyle = "#00000099";
  context.fillRect(coordinates.x - 30, coordinates.y - 45, 60, 60);
  context.fillStyle = "#fff";
  context.fillText(text, coordinates.x, coordinates.y);
}

export function drawImage(canvas, image) {
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
}
