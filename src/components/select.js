import React, { useCallback, useRef } from "react";

function Select({
  canBeEmpty = true,
  label,
  labelIdPrefix,
  labelProps = {},
  onChange,
  options,
  placeholder,
  value = ""
}) {
  const id = useRef(`${labelIdPrefix || label}_${Date.now()}`);
  const additionalPropsWithLabel = label ? { id: id.current } : {};
  const handleChange = useCallback(event => onChange(event.target.value), [
    onChange
  ]);
  return (
    <>
      {label && (
        <label {...labelProps} htmlFor={id.current}>
          {label}
        </label>
      )}
      <select {...additionalPropsWithLabel} onChange={handleChange}>
        {placeholder && (
          <option
            disabled={!canBeEmpty}
            selected={value === ""}
            value=""
          >
            {placeholder}
          </option>
        )}
        {options.map(({ key, value: optionValue, label, ...option }) => (
          <option
            key={key || optionValue}
            value={optionValue}
            {...option}
            selected={value === optionValue}
          >
            {label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Select;
