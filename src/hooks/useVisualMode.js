import { useState } from 'react';

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {

    //if user hits cancel or receives error, go back to initial state
    if (replace) {
      setHistory(prev => prev.pop())
      setMode(initial);
    }
    setMode(newMode);
    let updatedHistory = [...history, newMode];
    setHistory(updatedHistory);
  };

  // removes the latest element from history then sets Mode to last element in history
  const back = () => {
    if (history.length < 2) {
      return;
    };
    setHistory(prev => {
      const newHistory = [...prev];
      newHistory.pop();
      setMode(newHistory.slice(-1)[0]);
      return newHistory;
    });
  };

  return { mode, transition, back };
};