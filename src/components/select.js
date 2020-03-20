import React, { useCallback, useRef } from "react";

function Select({
  canBeEmpty = true,
  label,
  labelIdPrefix,
  labelProps = {},
  onChange,
  options,
  placeholder
}) {
  const id = useRef(`${labelIdPrefix || label}_${Date.now()}`);
  const additionalPropsWithLabel = label ? { id: id.current } : {};
  const handleChange = useCallback(event => onChange(event.target.value), [onChange]);
  return (
    <>
      {label && (
        <label {...labelProps} htmlFor={id.current}>
          {label}
        </label>
      )}
      <select {...additionalPropsWithLabel} onChange={handleChange}>
        {placeholder && (
          <option disabled={!canBeEmpty} value="">
            {placeholder}
          </option>
        )}
        {options.map(({ key, value, label, ...option }) => (
          <option key={key || value} value={value} {...option}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Select;
