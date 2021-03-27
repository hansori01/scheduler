import { useState } from 'react';

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {

    //if user hits cancel or receives error, go back to initial state
    setMode(newMode);
    if (replace) {
      setHistory(prev => [...prev.slice(0, prev.length - 1), newMode])
    } else {
      setHistory(prev => [...prev, newMode])
    };
  };

  // removes the latest element from history then sets Mode to last element in history
  const back = () => {
    if (history.length < 2) {
      return;
    };
    setMode(history[history.length - 2])
    setHistory(prev => [...prev.slice(0, prev.length - 1)]);
  };
  return { mode, transition, back };
};