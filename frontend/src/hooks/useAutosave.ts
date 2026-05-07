import { useEffect, useRef } from "react";

export function useAutosave(value: string, onSave: (value: string) => void, delay = 900) {
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const handle = setTimeout(() => onSave(value), delay);
    return () => clearTimeout(handle);
  }, [delay, onSave, value]);
}
