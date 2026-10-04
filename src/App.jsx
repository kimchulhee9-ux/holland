import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash' | 'start' | 'question' | 'result'
  const [userName, setUserName] = useState('');
  const [scores, setScores] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [primaryType, setPrimaryType] = useState('');
  const [secondaryType, setSecondaryType] = useState('');

  // 비밀번호(참여코드 5555) 인증 완료 시
  const handleUnlock = () => {
    setCurrentScreen('start');
  };

  // 이름 입력 후 검사 시작 시
  const handleStartTest = (name) => {
    setUserName(name);
    setScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    setCurrentScreen('question');
  };

  // 60문항 완료 시 결과 계산
  const handleTestComplete = (finalScores) => {
    const sortedTypes = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);

    setPrimaryType(sortedTypes[0][0]); // 1순위
    setSecondaryType(sortedTypes[1][0]); // 2순위

    setCurrentScreen('result');
  };

  // 다시 검사하기
  const restartTest = () => {
    setCurrentScreen('start');
  };

  return (
    <div className="app-container">
      {currentScreen === 'splash' && <SplashScreen onUnlock={handleUnlock} />}
      {currentScreen === 'start' && <StartScreen onStart={handleStartTest} />}
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
          scores={scores}
          userName={userName}
          onRestart={restartTest}
        />
      )}
    </div>
  );
}

export default App;
