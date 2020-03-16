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

const DIRECTION_TRANSFORMER = {
  horizontal: {
    value: "horizontal",
    transformer: isInverted => (coordinates, canvas) =>
      transformHorizontal(coordinates, canvas, isInverted)
  },
  horizontal_inverted: {
    value: "horizontal_inverted",
    transformer: isInverted => (coordinates, canvas) =>
      transformHorizontal(coordinates, canvas, !isInverted)
  },
  vertical: {
    value: "vertical",
    transformer: () => (coordinates, canvas) =>
      transformVertical(coordinates, canvas)
  },
  vertical_inverted: {
    value: "vertical_inverted",
    transformer: () => (coordinates, canvas) =>
      transformVertical(coordinates, canvas, true)
  },
  linear: {
    value: "linear",
    transformer: isInverted => (coordinates, canvas) =>
      transformLinear(coordinates, canvas, { invertedHorizontal: isInverted })
  },
  linear_inverted: {
    value: "linear_inverted",
    transformer: isInverted => (coordinates, canvas) =>
      transformLinear(coordinates, canvas, {
        invertedHorizontal: !isInverted,
        invertedVertical: true
      })
  },
  linear_horizontal_inverted: {
    value: "linear_horizontal_inverted",
    transformer: isInverted => (coordinates, canvas) =>
      transformLinear(coordinates, canvas, { invertedHorizontal: !isInverted })
  },
  linear_vertical_inverted: {
    value: "linear_vertical_inverted",
    transformer: () => (coordinates, canvas) =>
      transformLinear(coordinates, canvas, { invertedVertical: true })
  }
};

export const TRACKING_DIRECTIONS = [
  {
    label: "X-axis (horizontal: left-right)",
    ...DIRECTION_TRANSFORMER.horizontal
  },
  {
    label: "X-axis-inverted (horizontal: right-left)",
    ...DIRECTION_TRANSFORMER.horizontal_inverted
  },
  {
    label: "Y-axis (vertical: top-bottom)",
    ...DIRECTION_TRANSFORMER.vertical
  },
  {
    label: "Y-axis-inverted (vertical: bottom-top)",
    ...DIRECTION_TRANSFORMER.vertical_inverted
  },
  {
    label: "X-axis, Y-axis (linear: left-right, top-bottom)",
    ...DIRECTION_TRANSFORMER.linear
  },
  {
    label: "X-axis-inverted, Y-axis-inverted (linear: right-right, bottom-top)",
    ...DIRECTION_TRANSFORMER.linear_inverted
  },
  {
    label: "X-axis-inverted, Y-axis (linear: right-left, top-bottom)",
    ...DIRECTION_TRANSFORMER.linear_horizontal_inverted
  },
  {
    label: "X-axis, Y-axis-inverted (linear: left-right, bottom-top)",
    ...DIRECTION_TRANSFORMER.linear_vertical_inverted
  }
];
