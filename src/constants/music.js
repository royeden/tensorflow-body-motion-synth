// https://pages.mtu.edu/~suits/notefreqs.html
export const A4_440 = { position: 49, frequency: 440 };
export const BASE_TET = 12;
export const SYNTH_WAVE_TYPES = [
  "square",
  "sine",
  "sawtooth",
  "triangle",
  "custom"
];
export const FREQUENCY_LIMITS = { min: 20, max: 20000 };
export const TET_LIMITS = { min: 2, max: 24 };

const transformHorizontal = ({ x }, { width }, inverted = false) => ({
  x: inverted ? width - x : x
});

const transformVertical = ({ y }, { height }, inverted = false) => ({
  y: inverted ? height - y : y
});

const transformLinear = (
  coordinates,
  canvas,
  config = { invertedHorizontal: false, invertedVertical: false }
) => ({
  ...transformHorizontal(coordinates, canvas, config.invertedHorizontal),
  ...transformVertical(coordinates, canvas, config.invertedVertical)
});

export const FREQUENCY_DIRECTIONS = [
  {
    label: "X-axis (horizontal: left-right)",
    value: "horizontal",
    transformer: (coordinates, canvas) =>
      transformHorizontal(coordinates, canvas)
  },
  {
    label: "X-axis-inverted (horizontal: right-left)",
    value: "horizontal_inverted",
    transformer: (coordinates, canvas) =>
      transformHorizontal(coordinates, canvas, true)
  },
  {
    label: "Y-axis (vertical: top-bottom)",
    value: "vertical",
    transformer: (coordinates, canvas) => transformVertical(coordinates, canvas)
  },
  {
    label: "Y-axis-inverted (vertical: bottom-top)",
    value: "vertical_inverted",
    transformer: (coordinates, canvas) =>
      transformVertical(coordinates, canvas, true)
  },
  {
    label: "X-axis, Y-axis (linear: left-right, top-bottom)",
    value: "linear",
    transformer: (coordinates, canvas) => transformLinear(coordinates, canvas)
  },
  {
    label: "X-axis-inverted, Y-axis-inverted (linear: right-right, bottom-top)",
    value: "linear_inverted",
    transformer: (coordinates, canvas) =>
      transformLinear(coordinates, canvas, {
        invertedHorizontal: true,
        invertedVertical: true
      })
  },
  {
    label: "X-axis-inverted, Y-axis (linear: right-left, top-bottom)",
    value: "linear_horizontal_inverted",
    transformer: (coordinates, canvas) =>
      transformLinear(coordinates, canvas, { invertedHorizontal: true })
  },
  {
    label: "X-axis, Y-axis-inverted (linear: left-right, bottom-top)",
    value: "linear_vertical_inverted",
    transformer: (coordinates, canvas) =>
      transformLinear(coordinates, canvas, { invertedVertical: true })
  }
];
