import React, { useState, useCallback } from "react";

import SynthControls from "./synthControls";
import Select from "./select";

function PeopleControls(props) {
  const [peopleAmount, setPeopleAmount] = useState(1);
  const handleChange = useCallback(
    value => setPeopleAmount(parseInt(value, 10)),
    []
  );
  return (
    <>
      <Select
        label="Amount of people to track"
        labelIdPrefix="amount_of_people"
        options={[...Array(3)].map((_, index) => ({
          key: `select_option_${index}`,
          label: `${index + 1} Person${index > 0 ? "s" : ""}`,
          value: index + 1
        }))}
        onChange={handleChange}
        value={peopleAmount}
      >
        {[...Array(3)].map((_, index) => (
          <option key={`select_option_${index}`} value={index + 1}>
            {index + 1} Person{index > 0 && "s"}
          </option>
        ))}
      </Select>
      {[...Array(peopleAmount)].map((_, index) => (
        <SynthControls
          key={`Synth_controls_for_person_${index}`}
          personId={index}
        />
      ))}
    </>
  );
}

export default PeopleControls;
