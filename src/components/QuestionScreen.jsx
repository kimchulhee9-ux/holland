import React, { useState, useEffect } from 'react';
import { questions, shuffleQuestions } from '../data/questions';
import './QuestionScreen.css';

function QuestionScreen({ onComplete, scores, setScores }) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('slide-in-right');

  useEffect(() => {
    // Shuffle questions on mount
    setShuffledQuestions(shuffleQuestions(questions));
  }, []);

  if (shuffledQuestions.length === 0) return null;

  const currentQuestion = shuffledQuestions[currentIndex];
  const progress = (currentIndex / shuffledQuestions.length) * 100;

  const handleOptionClick = (isLike) => {
    // Update score if user likes the activity
    const newScores = { ...scores };
    if (isLike) {
      newScores[currentQuestion.type] += 1;
      setScores(newScores);
    }

    // Next question or complete
    if (currentIndex < shuffledQuestions.length - 1) {
      setAnimationClass('slide-out-left');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setAnimationClass('slide-in-right');
      }, 300);
    } else {
      onComplete(newScores);
    }
  };

  return (
    <div className="question-screen">
      <div className="progress-container">
        <div className="progress-text">{currentIndex + 1} / {shuffledQuestions.length}</div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className={`question-container ${animationClass}`}>
        <p className="question-instruction">이 활동이 좋거나 관심이 간다면 'O', 아니라면 'X'를 선택하세요.</p>
        <h2 className="question-text">"{currentQuestion.text}"</h2>
        
        <div className="options-container">
          <button 
            className="option-button btn-like"
            onClick={() => handleOptionClick(true)}
          >
            <span className="icon">⭕</span> 좋다
          </button>
          <button 
            className="option-button btn-dislike"
            onClick={() => handleOptionClick(false)}
          >
            <span className="icon">❌</span> 관심없다
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
