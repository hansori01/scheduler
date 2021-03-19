import React, { useState } from 'react';

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

//takes a new mode and sets mode, and updates history
  const transition = function (newMode) {
    setMode(newMode)
    let updatedHistory = [...history, newMode];
    setHistory(updatedHistory)
  }

  // removes the latest element from history then sets Mode to last element in history
  const back = () => {
    history.pop();
    setMode(history[history.length - 1]);
    };

  return { mode, transition, back };
};