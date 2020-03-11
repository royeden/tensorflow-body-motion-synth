import React, { useState, useRef } from "react";

function Input({
  defaultValue,
  errorMessage = "Error",
  label,
  labelIdPrefix,
  onChange,
  onError,
  onBlur,
  onFocus,
  validation,
  labelProps = {},
  ...props
}) {
  const id = useRef(`${labelIdPrefix || label}_${Date.now()}`);
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const additionalPropsWithLabel = label ? { id: id.current } : {};
  return (
    <>
      {label && <label {...labelProps} htmlFor={id.current}>{label}</label>}
      <input
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
      <p style={{ color: "red" }}>{error && errorMessage}</p>
    </>
  );
}

export default Input;
