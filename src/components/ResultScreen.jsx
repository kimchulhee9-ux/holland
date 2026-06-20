import React from 'react';
import { results } from '../data/results';
import './ResultScreen.css';

function ResultScreen({ primary, secondary, onRestart }) {
  const resultData = results[primary];
  const secondaryData = results[secondary];

  if (!resultData) {
    return <div className="result-screen">결과를 계산하는 중 문제가 발생했습니다.</div>;
  }

  return (
    <div className="result-screen fade-in" style={{ '--theme-color': resultData.color }}>
      <div className="result-header">
        <p className="result-subtitle">당신의 핵심 직업 적성은</p>
        <h1 className="result-type">{primary}{secondary}형</h1>
        <h2 className="result-title">{resultData.title}</h2>
      </div>

      <div className="result-card">
        <p className="result-description">{resultData.description}</p>
        
        <div className="features-list">
          <h3>✨ 주요 특징</h3>
          <ul>
            {resultData.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="jobs-container">
        <h3>💼 추천 직업 분야</h3>
        <p className="jobs-list">{resultData.jobs}</p>
      </div>

      <div className="secondary-container">
        <p className="secondary-label">두 번째로 높은 성향</p>
        <p className="secondary-type">{secondaryData?.title || ''}</p>
      </div>

      <div className="action-buttons">
        <button className="restart-button" onClick={onRestart}>
          테스트 다시하기
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
