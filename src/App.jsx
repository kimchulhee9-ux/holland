import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [scores, setScores] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [primaryType, setPrimaryType] = useState('');
  const [secondaryType, setSecondaryType] = useState('');

  const startTest = () => {
    setScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    setCurrentScreen('question');
  };

  const handleTestComplete = (finalScores) => {
    // Sort scores to find the top types
    const sortedTypes = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
    
    setPrimaryType(sortedTypes[0][0]); // Highest score
    setSecondaryType(sortedTypes[1][0]); // Second highest score
    
    setCurrentScreen('result');
  };

  const restartTest = () => {
    setCurrentScreen('start');
  };

  return (
    <div className="app-container">
      {currentScreen === 'start' && <StartScreen onStart={startTest} />}
      {currentScreen === 'question' && (
        <QuestionScreen 
          onComplete={handleTestComplete} 
          scores={scores} 
          setScores={setScores} 
        />
      )}
      {currentScreen === 'result' && (
        <ResultScreen 
          primary={primaryType} 
          secondary={secondaryType} 
          onRestart={restartTest} 
        />
      )}
    </div>
  );
}

export default App;
