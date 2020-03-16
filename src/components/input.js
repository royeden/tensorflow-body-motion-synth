import React, { useMemo, useRef, useState } from "react";

function Input({
  defaultValue,
  errorMessage = "Error",
  label,
  labelIdPrefix,
  labelProps = {},
  max,
  min,
  onChange,
  onError,
  onBlur,
  onFocus,
  type,
  validation,
  ...props
}) {
  const id = useRef(`${labelIdPrefix || label}_${Date.now()}`);
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const additionalPropsWithLabel = label ? { id: id.current } : {};
  const isRange = useMemo(() => type === "range", [type]);
  return (
    <>
      {label && (
        <label {...labelProps} htmlFor={id.current}>
          {label}
        </label>
      )}
      {isRange && min !== undefined && <span>{min}</span>}
      <input
        type={type}
        max={max}
        min={min}
        {...props}
        {...additionalPropsWithLabel}
        onChange={({ target: { value } }) => {
          setInputValue(value);
          if (!validation || (validation && validation(value))) {
            if (onChange) onChange(value);
            if (error) setError(false);
          } else {
            if (onError) onError(value);
            setError(true);
          }
        }}
        onBlur={event => {
          if (onBlur) onBlur(event);
          if (error) setInputValue(defaultValue);
        }}
        onFocus={event => {
          if (onFocus) onFocus(event);
          setError(false);
        }}
        value={inputValue}
      />
      {isRange && max !== undefined && <span>{max}</span>}
      <p style={{ color: "red" }}>{error && errorMessage}</p>
    </>
  );
}

export default Input;
