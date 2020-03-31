import React, { useCallback, useState } from "react";

import { BaseSynthProvider } from "../context/baseSynthContext";

import Select from "./select";
import SynthControls from "./synthControls";

function PeopleControls() {
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
      />

      <BaseSynthProvider>
        {[...Array(peopleAmount)].map((_, index) => (
          <SynthControls
            key={`Synth_controls_for_person_${index}`}
            personId={index}
          />
        ))}
      </BaseSynthProvider>
    </>
  );
}

export default PeopleControls;
