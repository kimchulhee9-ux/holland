import React from 'react';
import './StartScreen.css';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen fade-in">
      <div className="title-container">
        <h1>나의 직업 적성은?</h1>
        <p className="subtitle">간편 홀랜드(Holland) 직업적성 검사</p>
        <p className="creator-text">- chulhee -</p>
      </div>
      
      <div className="illustration">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="info">
        <p>⏱ 소요 시간: 약 3분</p>
        <p>📝 총 60문항 (좋다/관심없다 선택)</p>
      </div>

      <button className="start-button" onClick={onStart}>
        검사 시작하기
      </button>
    </div>
  );
}

export default StartScreen;
