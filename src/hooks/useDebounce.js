import { useState, useCallback } from 'react';

export function useDebounce(callback, delay) {
  const [timeoutId, setTimeoutId] = useState(null);

  const debouncedFunction = useCallback((...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      callback(...args);
    }, delay);
    setTimeoutId(id);
  }, [callback, delay, timeoutId]);

  return debouncedFunction;
}