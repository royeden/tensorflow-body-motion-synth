import { A4_440 } from "../constants/music";

export function getFrequencyFromTemperamentScaleNote(
  desiredNotePosition = A4_440.position,
  config = {
    baseNoteFrequency: A4_440.frequency,
    baseNotePosition: A4_440.position,
    tet: 12
  }
) {
  const { baseNoteFrequency, baseNotePosition, tet } = config;
  if (isNaN(Number(desiredNotePosition)))
    throw new Error("This function expects numbers as arguments, nothing else");
  if (baseNoteFrequency < 20)
    throw new Error("Don't use a base frequency below human hearing");
  if (baseNotePosition <= 0)
    throw new Error("Don't use a base note position below 0");
  if (tet < 1) throw new Error("Don't use an invalid scale");

  return (
    baseNoteFrequency *
    Math.pow(Math.pow(2, 1 / tet), baseNotePosition - desiredNotePosition)
  );
}
