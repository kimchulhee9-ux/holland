import React, { useState } from 'react';
import { questions, seniorQuestions } from '../data/questions';
import './StartScreen.css';

const GROUP_OPTIONS = [
  { key: 'student', label: '학생', icon: '🎒' },
  { key: 'parent', label: '학부모', icon: '👨‍👩‍👧' },
  { key: 'senior', label: '시니어', icon: '🌿' },
];

function StartScreen({ onStart }) {
  const [userName, setUserName] = useState('');
  const [hasWarning, setHasWarning] = useState(false);
  const [group, setGroup] = useState('');
  const [groupWarning, setGroupWarning] = useState(false);

  const questionCount = group === 'senior' ? seniorQuestions.length : questions.length;

  const handleStart = () => {
    const trimmed = userName.trim();
    if (!group) setGroupWarning(true);
    if (!trimmed) setHasWarning(true);
    if (!group || !trimmed) return;
    onStart(trimmed, group);
  };

  return (
    <div className="start-screen fade-in">
      <div className="title-container">
        <h1>나의 적성은?</h1>
        <p className="subtitle">적성알아보기 - 나에게 맞는 일과 활동 찾기</p>
        <p className="creator-text">- chulhee -</p>
      </div>

      <div className="illustration">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="group-select-container">
        <p className="name-label">나는 누구인가요?</p>
        <div className="group-buttons">
          {GROUP_OPTIONS.map((g) => (
            <button
              key={g.key}
              type="button"
              className={`group-button ${group === g.key ? 'selected' : ''}`}
              onClick={() => {
                setGroup(g.key);
                setGroupWarning(false);
              }}
            >
              <span className="group-icon">{g.icon}</span>
              <span>{g.label}</span>
            </button>
          ))}
        </div>
        {groupWarning && !group && (
          <p className="warning-text">학생 / 학부모 / 시니어 중 하나를 골라주세요.</p>
        )}
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
        <p>📝 총 {questionCount}문항 (좋다/관심없다 선택)</p>
      </div>

      <button className="start-button" onClick={handleStart}>
        검사 시작하기
      </button>
    </div>
  );
}

export default StartScreen;
