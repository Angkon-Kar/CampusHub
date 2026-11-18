// client/src/hooks/useLocalStorage.js
// Like useState, but the value is saved in this browser only (localStorage). Nothing is sent to the server.
import { useState, useEffect } from 'react';

// `getInitial` is a function that returns the starting value (used when nothing is saved yet)
export const useLocalStorage = (key, getInitial) => {
  const [value, setValue] = useState(() => {
    const initial = getInitial();
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch {
      return initial; // private mode, blocked storage or broken data
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked: the page still works, the data just is not saved
    }
  }, [key, value]);

  return [value, setValue];
};

export const makeId = () => Math.random().toString(36).slice(2, 9);