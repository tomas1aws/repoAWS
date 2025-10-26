import { useEffect, useState } from 'react';

export function useLocalState(key, initialValue) {
  const [state, setState] = useState(() => initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to read localStorage', error);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to write localStorage', error);
    }
  }, [key, state, isHydrated]);

  return [state, setState, isHydrated];
}
