import React, { useState, useEffect, useCallback } from 'react';
import { results } from '../data/results';
import { CONFIG } from '../config';
import './ResultScreen.css';

function ResultScreen({ primary, secondary, scores, userName, onRestart }) {
  const resultData = results[primary];
  const secondaryData = results[secondary];

  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const submitToGoogleSheets = useCallback(async () => {
    if (!CONFIG.GOOGLE_SCRIPT_URL) return;

    setSubmissionStatus('submitting');
    try {
      const payload = {
        name: userName || '익명',
        result: `${primary}${secondary}형 (${resultData?.title || primary})`,
        primary: primary,
        secondary: secondary,
        primaryTitle: resultData?.title || primary,
        secondaryTitle: secondaryData?.title || secondary,
        scores: scores,
        score_R: scores?.R ?? 0,
        score_I: scores?.I ?? 0,
        score_A: scores?.A ?? 0,
        score_S: scores?.S ?? 0,
        score_E: scores?.E ?? 0,
        score_C: scores?.C ?? 0,
        date: new Date().toLocaleString('ko-KR')
      };

      await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(payload)
      });

      setSubmissionStatus('success');
    } catch (err) {
      console.error('구글 스프레드시트 전송 오류:', err);
      setSubmissionStatus('error');
    }
  }, [userName, primary, secondary, scores, resultData, secondaryData]);

  useEffect(() => {
    submitToGoogleSheets();
  }, [submitToGoogleSheets]);

  if (!resultData) {
    return <div className="result-screen">결과를 계산하는 중 문제가 발생했습니다.</div>;
  }

  const scoreList = scores
    ? [
        { label: 'R (현실형)', key: 'R', val: scores.R ?? 0 },
        { label: 'I (탐구형)', key: 'I', val: scores.I ?? 0 },
        { label: 'A (예술형)', key: 'A', val: scores.A ?? 0 },
        { label: 'S (사회형)', key: 'S', val: scores.S ?? 0 },
        { label: 'E (진취형)', key: 'E', val: scores.E ?? 0 },
        { label: 'C (관습형)', key: 'C', val: scores.C ?? 0 }
      ]
    : [];

  return (
    <div className="result-screen fade-in" style={{ '--theme-color': resultData.color }}>
      {/* 구글 스프레드시트 전송 상태 바 */}
      {submissionStatus !== 'idle' && (
        <div className={`submission-status-bar ${submissionStatus}`}>
          {submissionStatus === 'submitting' && (
            <div className="status-content">
              <span className="status-spinner" />
              <span>📊 결과를 스프레드시트에 저장 중...</span>
            </div>
          )}
          {submissionStatus === 'success' && (
            <div className="status-content">
              <span>✅ 결과가 스프레드시트에 안전하게 기록되었습니다.</span>
            </div>
          )}
          {submissionStatus === 'error' && (
            <div className="status-content error">
              <span>
                ❌ 전송 실패! [ {userName || '익명'} / {primary}{secondary}형 ]
              </span>
              <button
                type="button"
                className="retry-button-small"
                onClick={submitToGoogleSheets}
              >
                재시도
              </button>
            </div>
          )}
        </div>
      )}

      <div className="result-header">
        <p className="result-subtitle">
          {userName ? `${userName}님의 핵심 직업 적성은` : '당신의 핵심 직업 적성은'}
        </p>
        <h1 className="result-type">{primary}{secondary}형</h1>
        <h2 className="result-title">{resultData.title}</h2>

        {/* 세부 점수 배지 목록 */}
        {scoreList.length > 0 && (
          <div className="score-breakdown">
            {scoreList.map((item) => (
              <span
                key={item.key}
                className={`score-badge ${
                  item.key === primary ? 'primary-badge' : item.key === secondary ? 'secondary-badge' : ''
                }`}
              >
                {item.key} <strong>{item.val}</strong>
              </span>
            ))}
          </div>
        )}
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
        <p className="secondary-type">
          {secondary}형 - {secondaryData?.title || ''}
        </p>
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
