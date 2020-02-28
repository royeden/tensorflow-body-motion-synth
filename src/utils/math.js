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
