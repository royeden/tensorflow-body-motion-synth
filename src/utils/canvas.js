export function drawText(canvas, text, coordinates = { x: 0, y: 0 }, invert) {
  const context = canvas.getContext("2d");
  function draw({ x, y }) {
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillStyle = "#00000099";
    context.fillRect(x - 30, y - 45, 60, 60);
    context.fillStyle = "#fff";
    context.fillText(text, x, y);
  }
  if (invert) {
    context.save();
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    draw({ x: canvas.width - coordinates.x, y: coordinates.y });
    context.restore();
  } else draw(coordinates);
}

export function drawImage(canvas, image) {
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
}
