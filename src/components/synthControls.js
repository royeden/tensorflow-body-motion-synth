import React, { useContext } from "react";

import { cameraContext } from "../context/cameraContext";
import { useUniqueIdArray } from "../hooks/useUniqueIdArray";

import Synth from "./synth";

function SynthControls({ personId }) {
  const { peopleTracked } = useContext(cameraContext);
  const [synths, addSynth, removeSynth, clear] = useUniqueIdArray();
  const person = peopleTracked.length > 0 && peopleTracked[personId];
  return (
    <div>
      <h1>Synth Controls for Person {personId + 1}:</h1>
      {synths.map(id => (
        <Synth key={`Synth_${id}`} id={id} person={person} personId={personId} removeSynth={removeSynth} />
      ))}
      <button onClick={addSynth}>Add Synth</button>
      <button onClick={clear}>Clear all synths</button>
    </div>
  );
}

export default SynthControls;
