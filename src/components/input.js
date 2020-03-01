import React, { useState } from "react";

function Input({
  defaultValue,
  errorMessage = "Error",
  onChange,
  onError,
  onBlur,
  onFocus,
  validation,
  ...props
}) {
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  return (
    <>
      <input
        {...props}
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