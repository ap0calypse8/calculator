import React, { useState, useCallback, useMemo } from 'react';
import './App.css'; // Custom CSS for themes and responsiveness

interface HistoryItem {
  input: string;
  result: string | number;
}

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const safeEval = (expression: string): string | number => {
    try {
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${expression})`)();
    } catch {
      return 'Error';
    }
  };

  const handleButtonClick = useCallback((value: string) => {
    if (value === 'C') {
      setInput('');
    } else if (value === '=') {
      const result = safeEval(input);
      setHistory((prevHistory) => [...prevHistory, { input, result }]);
      setInput(result.toString());
    } else {
      setInput((prevInput) => prevInput + value);
    }
  }, [input]);

  const handleCustomFunction = useCallback((func: (x: string) => string) => {
    const result = safeEval(func(input));
    setHistory((prevHistory) => [...prevHistory, { input, result }]);
    setInput(result.toString());
  }, [input]);

  const buttons = useMemo(() => [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C'
  ], []);

  const advancedButtons = useMemo(() => [
    { label: 'sin', func: (x: string) => `Math.sin(${x})` },
    { label: 'cos', func: (x: string) => `Math.cos(${x})` },
    { label: 'tan', func: (x: string) => `Math.tan(${x})` },
    { label: 'log', func: (x: string) => `Math.log(${x})` },
    { label: 'sqrt', func: (x: string) => `Math.sqrt(${x})` }
  ], []);

  return (
    <div className="calculator">
      <h1>Calculator</h1>
      <div className="display">
        <input type="text" value={input} readOnly />
      </div>
      <div className="button-container">
        {buttons.map((btn) => (
          <button key={btn} onClick={() => handleButtonClick(btn)}>
            {btn}
          </button>
        ))}
      </div>
      <div className="advanced-container">
        {advancedButtons.map(({ label, func }) => (
          <button key={label} onClick={() => handleCustomFunction(func)}>
            {label}
          </button>
        ))}
      </div>
      <div className="history">
        <h3>History</h3>
        <ul>
          {history.map(({ input, result }, idx) => (
            <li key={idx}>{input} = {result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;