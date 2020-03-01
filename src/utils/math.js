export function map(
  value,
  lowerBound,
  upperBound,
  lowerMapBound,
  upperMapBound
) {
  return (
    ((value - lowerBound) / (upperBound - lowerBound)) *
      (upperMapBound - lowerMapBound) +
    lowerMapBound
  );
}

export function mapWithinBoundary(
  value,
  lowerBound,
  upperBound,
  lowerMapBound = lowerBound,
  upperMapBound = upperBound
) {
  return value < lowerBound
    ? lowerMapBound
    : value > upperBound
    ? upperMapBound
    : value;
}
