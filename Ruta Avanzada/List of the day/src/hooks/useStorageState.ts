import { useState, useEffect } from "react";
/**
Un gancho de React personalizado que devuelve un valor con estado y una función para actualizarlo, y conserva el valor en localStorage.
@param {any} defaultValue - El valor predeterminado para el estado.
@param {string} key - La clave bajo la cual se almacenará el valor en localStorage.
@returns {[any, Function]} Una tupla que contiene el valor del estado actual y una función para actualizarlo.
@example const [count, setCount] = useStorageState(1, "count")
*/
export function useStorageState<T>(
  defaultValue: T,
  key: string
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
