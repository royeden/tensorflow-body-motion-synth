import React, { useContext, useState } from "react";

import { audioContext } from "../context/audioContext";
import { useToggle } from "../hooks/useToggle";
import { MODEL_PARTS } from "../constants/model";
import { SYNTH_WAVE_TYPES } from "../constants/music";

// TODO move select to a component
// TODO add custom inputs

function Synth({ id, initialFrequency, person, personId }) {
  const { audioContextObject } = useContext(audioContext);
  const [synthWaveType, setSynthWaveType] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [persist, togglePersist] = useToggle(true);

  const keypoints = person ? person.pose.keypoints : false;
  const trackedBodyPart =
    keypoints && bodyPart && keypoints.find(({ part }) => part === bodyPart);

  return (
    <div>
      <h1>
        Synth {id} for Person {personId + 1}
      </h1>
      <select
        onChange={event => setBodyPart(event.target.value)}
        value={bodyPart}
      >
        <option value="" disabled>
          Choose an option
        </option>
        {MODEL_PARTS.map(part => (
          <option key={`Synth_${personId}_${id}_${part}`} value={part}>
            {part}
          </option>
        ))}
      </select>
      <select
        onChange={event => setSynthWaveType(event.target.value)}
        value={bodyPart}
      >
        <option value="" disabled>
          Choose an option
        </option>
        {SYNTH_WAVE_TYPES.map(type => (
          <option disabled={type === "custom"} key={`Synth_${personId}_${id}_${type}`} value={type}>
            {type}
          </option>
        ))}
      </select>
      <p>
        Synth Type:{" "}
        {synthWaveType || "no type selected"}
      </p>
      <p>
        Position:{" "}
        {keypoints
          ? bodyPart
            ? `[ x: ${trackedBodyPart.position.x}, y: ${trackedBodyPart.position.y} ]`
            : "No body part selected"
          : "No person tracked"}
      </p>
      <p>
        Score:{" "}
        {keypoints
          ? bodyPart
            ? trackedBodyPart.score
            : "No body part selected"
          : "No person tracked"}
      </p>
    </div>
  );
}

export default Synth;
