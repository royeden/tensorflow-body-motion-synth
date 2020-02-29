export const A4_440 = { position: 49, frequency: 440 };
export const SYNTH_WAVE_TYPES = [
  "sine",
  "square",
  "sawtooth",
  "triangle",
  "custom"
];
const transformHorizontal = ({ x }, { width }, inverted = false) => ({
  x: inverted ? width - x : x
});

const transformVertical = ({ y }, { height }, inverted = false) => ({
  y: inverted ? height - y : y
});

export const FREQUENCY_MAPPING_DIRECTION = [
  {
    label: "X-axis (horizontal) left-right",
    value: "horizontal",
    transformer: (coordinates, canvas) =>
      transformHorizontal(coordinates, canvas)
  },
  {
    label: "X-axis (horizontal) right-left",
    value: "horizontal_inverted",
    transformer: (coordinates, canvas) =>
      transformHorizontal(coordinates, canvas, true)
  },
  {
    label: "Y-axis (vertical) top-bottom",
    value: "vertical",
    transformer: (coordinates, canvas) => transformVertical(coordinates, canvas)
  },
  {
    label: "Y-axis (vertical) bottom-top",
    value: "vertical_inverted",
    transformer: (coordinates, canvas) =>
      transformVertical(coordinates, canvas, true)
  },
  {
    label: "X-Y (linear) left-right & top-bottom",
    value: "horizontal",
    transformer: ({ x }) => ({ x })
  },
  {
    label: "X-axis (horizontal) right-left",
    value: "horizontal_inverted",
    transformer: ({ x }, { width }) => ({ x: width - x })
  },
  {
    label: "Y-axis (vertical) top-bottom",
    value: "horizontal",
    transformer: ({ y }) => ({ y })
  },
  {
    label: "Y-axis (vertical) bottom-top",
    value: "horizontal_inverted",
    transformer: ({ y }, { height }) => ({ y: height - y })
  }
];
