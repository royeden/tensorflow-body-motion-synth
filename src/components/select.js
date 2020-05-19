import React, { useCallback, useRef } from "react";

function Select({
  canBeEmpty = true,
  defaultValue,
  label,
  labelIdPrefix,
  labelProps = {},
  onChange,
  options,
  placeholder,
  ...props
}) {
  const id = useRef(`${labelIdPrefix || label}`);
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
      <select {...additionalPropsWithLabel} {...props} defaultValue={defaultValue} onChange={handleChange}>
        {placeholder && (
          <option
            disabled={!canBeEmpty}
            value=""
          >
            {placeholder}
          </option>
        )}
        {options.map(({ key, value, label, ...option }) => (
          <option
            key={key || value}
            value={value}
            {...option}
          >
            {label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Select;
