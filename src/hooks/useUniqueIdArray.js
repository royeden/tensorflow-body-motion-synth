import { useState } from "react";

export function useUniqueIdArray() {
  const [state, setState] = useState([]);
  const add = () =>
    setState(prevState => [...prevState, Date.now().toString()]);
  const remove = removeId =>
    setState(prevState => [...prevState].filter(id => id !== removeId));
  return [state, add, remove];
}
