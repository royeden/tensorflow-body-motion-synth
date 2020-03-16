import React, { useRef } from "react";

function Select({
  label,
  labelIdPrefix,
  labelProps = {},
  onChange,
  options,
  placeholder
}) {
  const id = useRef(`${labelIdPrefix || label}_${Date.now()}`);
  const additionalPropsWithLabel = label ? { id: id.current } : {};
  return (
    <>
      {label && (
        <label {...labelProps} htmlFor={id.current}>
          {label}
        </label>
      )}
      <select {...additionalPropsWithLabel} onChange={onChange}>
        {placeholder && <option value="">{placeholder}</option>}
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
