import React, { useState } from 'react';
import './StartScreen.css';

function StartScreen({ onStart }) {
  const [userName, setUserName] = useState('');
  const [hasWarning, setHasWarning] = useState(false);

  const handleStart = () => {
    const trimmed = userName.trim();
    if (!trimmed) {
      setHasWarning(true);
      return;
    }
    onStart(trimmed);
  };

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

      <div className="name-input-container">
        <label htmlFor="name-input" className="name-label">
          이름을 입력해주세요
        </label>
        <input
          id="name-input"
          type="text"
          className={`name-input ${hasWarning && !userName.trim() ? 'warning' : ''}`}
          placeholder="예: 홍길동"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            if (e.target.value.trim()) setHasWarning(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleStart();
          }}
          maxLength={10}
          autoComplete="off"
        />
        {hasWarning && !userName.trim() && (
          <p className="warning-text">이름을 입력해야 테스트를 시작할 수 있습니다.</p>
        )}
      </div>

      <div className="info">
        <p>⏱ 소요 시간: 약 3분</p>
        <p>📝 총 60문항 (좋다/관심없다 선택)</p>
      </div>

      <button className="start-button" onClick={handleStart}>
        검사 시작하기
      </button>
    </div>
  );
}

export default StartScreen;
