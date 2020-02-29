import React, { useContext, useMemo, useState } from "react";

import { audioContext } from "../context/audioContext";
import { cameraContext } from "../context/cameraContext";
import { useToggle } from "../hooks/useToggle";
import { MODEL_PARTS } from "../constants/model";
import { SYNTH_WAVE_TYPES } from "../constants/music";
import Select from "./select";

// TODO move select to a component
// TODO add custom inputs

function Synth({ id, initialFrequency, person, personId }) {
  const { audioContextObject } = useContext(audioContext);
  const { isMobile } = useContext(cameraContext);
  const [synthWaveType, setSynthWaveType] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [persist, togglePersist] = useToggle(true);

  const keypoints = person ? person.pose.keypoints : false;
  const trackedBodyPart =
    keypoints && bodyPart && keypoints.find(({ part }) => part === bodyPart);

  const modelOptions = useMemo(
    () =>
      MODEL_PARTS.map(({ label, value }) => ({
        key: `Synth_${personId}_${id}_model_${label}`,
        label,
        value: value(!isMobile)
      })),
    [id, isMobile, personId]
  );

  const synthOptions = useMemo(
    () =>
      SYNTH_WAVE_TYPES.map(type => ({
        key: `Synth_${personId}_${id}_synth_wave_${type}`,
        disabled: type === "custom",
        label: type,
        value: type
      })),
    [id, personId]
  );

  return (
    <div>
      <h1>
        Synth {id} for Person {personId + 1}
      </h1>
      <Select
        onChange={event => setBodyPart(event.target.value)}
        options={modelOptions}
        placeholder="Choose an option"
      />
      <Select
        onChange={event => setBodyPart(event.target.value)}
        options={synthOptions}
        placeholder="Choose an option"
      />
      {/* <Select
        onChange={event => setBodyPart(event.target.value)}
        options={SYNTH_WAVE_TYPES.map(type => ({
          key: `Synth_${personId}_${id}_${type}`,
          disabled: type === "custom",
          label: type,
          value: type
        }))}
        placeholder="Choose an option"
      /> */}
      <p>Synth Type: {synthWaveType || "no type selected"}</p>
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
