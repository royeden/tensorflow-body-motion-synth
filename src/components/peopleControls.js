import React, { useState } from "react";

import SynthControls from "./synthControls";

function PeopleControls(props) {
  const [peopleAmount, setPeopleAmount] = useState(1);
  return (
    <>
      <select
        onChange={event => setPeopleAmount(parseInt(event.target.value, 10))}
        value={peopleAmount}
      >
        {[...Array(3)].map((_, index) => (
          <option key={`select_option_${index}`} value={index + 1}>
            {index + 1} Person{index > 0 && "s"}
          </option>
        ))}
      </select>
      {[...Array(peopleAmount)].map((_, index) => (
        <SynthControls key={`synth_controls_for_person_${index}`} personId={index} />
      ))}
    </>
  );
}

export default PeopleControls;
