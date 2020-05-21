import { A4_440 } from "../constants/music";

function getFactorizedValueFrom(number, prime) {
  // short circuit
  if (number % prime) {
    return 0;
  }

  let iterations = 0;
  let value = number;

  while (value % prime === 0) {
    iterations++;
    value /= prime;
  }

  return iterations;
}

// TODO rename, this is the inverse of the getFrequencyFromTemperamentScaleNote function
export function getFrequencyFromAnyPosition(
  position,
  config = {
    baseNoteFrequency: A4_440.frequency,
    tet: 12,
  }
) {
  const { baseNoteFrequency, tet } = config;
  const relationInFrequency = getFactorizedValueFrom(baseNoteFrequency, 2);
  return (
    (tet *
      Math.log(position / (baseNoteFrequency / Math.pow(2, relationInFrequency)))) /
      Math.LN2 -
    tet * relationInFrequency
  );
}

export function getFrequencyFromTemperamentScaleNote(
  desiredNotePosition = A4_440.position,
  config = {
    baseNoteFrequency: A4_440.frequency,
    baseNotePosition: A4_440.position,
    tet: 12,
  }
) {
  const { baseNoteFrequency, baseNotePosition, tet } = config;
  if (isNaN(Number(desiredNotePosition)))
    throw new Error("This function expects numbers as arguments, nothing else");
  if (baseNoteFrequency < 20)
    throw new Error("Don't use a base frequency below human hearing");
  if (baseNotePosition < 0)
    throw new Error("Don't use a base note position below 0");
  if (tet < 1) throw new Error("Don't use an invalid scale");

  return (
    baseNoteFrequency *
    Math.pow(Math.pow(2, 1 / tet), desiredNotePosition - baseNotePosition)
  );
}
