// TODO remove unused functions
export function flipCanvas(canvas) {
  const context = canvas.getContext("2d");
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
}

export function drawImage(canvas, image, flip, callback) {
  const context = canvas.getContext("2d");
  context.save();
  if (flip) flipCanvas(canvas);
  context.drawImage(image, 0, 0);
  context.restore();
  if (callback) callback();
}

export function drawImageAsync(canvas, image, flip) {
  return new Promise(resolve => drawImage(canvas, image, flip, resolve));
}

export function createAuxiliarCanvas({ width = 1, height = 1 }) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function drawText(canvas, text, { x = 0, y = 0 }, callback) {
  const context = canvas.getContext("2d");
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillStyle = "#00000099";
  context.fillRect(x - 30, y - 45, 60, 60);
  context.fillStyle = "#fff";
  context.fillText(text, x, y);
  if (callback) callback();
}

export function drawTextAsync(canvas, text, { x = 0, y = 0 }) {
  return new Promise(resolve => drawText(canvas, text, { x, y }, resolve));
}

export function convertCanvasToImage(canvas, { width = 1, height = 1 }) {
  return new Promise(resolve => {
    const image = new Image(width, height);
    image.onload = () => {
      resolve(image);
    };
    image.src = canvas.toDataURL("image/png");
  });
}

export function setCanvasToImage(canvas, image) {
  return new Promise(resolve => {
    image.onload = () => {
      resolve(image);
    };
    image.src = canvas.toDataURL("image/png");
  });
}
