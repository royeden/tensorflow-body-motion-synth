import React from "react";

function Select({ onChange, options, placeholder }) {
  return (
    <select onChange={onChange}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(({ key, value, label, ...option }) => (
        <option key={key || value} value={value} {...option}>
          {label}
        </option>
      ))}
    </select>
  );
}

export default Select;
