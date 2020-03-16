import { useState } from "react";

function useUniqueIdArray() {
  const [state, setState] = useState([]);
  const add = () =>
    setState(prevState => [...prevState, Date.now().toString()]);
  const remove = removeId =>
    setState(prevState => [...prevState].filter(id => id !== removeId));
  const clear = () => setState([])
  return [state, add, remove, clear];
}

export default useUniqueIdArray;
