import { useState } from 'react';

export function useToggle(initialState = false) {
  const [state, setState] = useState(Boolean(initialState));
  const toggleState = () => setState(prevState => !prevState);
  const override = value => value !== undefined && setState(Boolean(value));
  return [state, toggleState, override];
}