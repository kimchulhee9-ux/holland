import React, { useState, useEffect, useCallback, useRef } from 'react';
import { results } from '../data/results';
import { CONFIG } from '../config';
import { groupContent } from '../data/groupContent';

// 유형 이름에서 짧은 우리말 이름만 꺼냅니다. 예: '현실형 (Realistic)' → '현실'
const shortName = (data, code) => (data?.title ? data.title.split('형')[0] : code);
import './ResultScreen.css';

function ResultScreen({ primary, secondary, scores, userName, group = 'student', onRestart }) {
  const resultData = results[primary];
  const secondaryData = results[secondary];
  const extra = groupContent[primary] || {};

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

  // 결과는 한 번만 자동 전송합니다. (개발 모드에서 화면이 두 번 그려져도 중복 저장되지 않도록)
  const hasSubmittedRef = useRef(false);
  useEffect(() => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    submitToGoogleSheets();
  }, [submitToGoogleSheets]);

  if (!resultData) {
    return <div className="result-screen">결과를 계산하는 중 문제가 발생했습니다.</div>;
  }

  const scoreList = scores
    ? [
        { label: '현실', key: 'R', val: scores.R ?? 0 },
        { label: '탐구', key: 'I', val: scores.I ?? 0 },
        { label: '예술', key: 'A', val: scores.A ?? 0 },
        { label: '사회', key: 'S', val: scores.S ?? 0 },
        { label: '진취', key: 'E', val: scores.E ?? 0 },
        { label: '관습', key: 'C', val: scores.C ?? 0 }
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
          {userName ? `${userName}님의 적성은` : '당신의 적성은'}
        </p>
        <h1 className="result-type result-type-name">
          {shortName(resultData, primary)}·{shortName(secondaryData, secondary)}형
        </h1>
        <p className="result-code">{primary}{secondary}</p>

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
                {item.label}({item.key}) <strong>{item.val}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="result-card">
        <p className="result-description">{resultData.description}</p>

        <div className="features-list">
          <h3>✨ {resultData.title}의 주요 특징</h3>
          <ul>
            {resultData.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      {group === 'student' && (
        <div className="jobs-container">
          <h3>💼 추천 직업 분야</h3>
          <p className="jobs-list">{resultData.jobs}</p>
        </div>
      )}

      {group === 'parent' && extra.parentStrengths && (
        <div className="group-section">
          <h3>👨‍👩‍👧 부모로서 나의 강점</h3>
          <ul>
            {extra.parentStrengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h3>💬 자녀 진로 대화 팁</h3>
          <ul>
            {extra.parentTips.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {group === 'senior' && extra.seniorActivities && (
        <>
          <div className="group-section">
            <h3>🌿 인생 2막 추천 활동</h3>
            <div className="activity-grid">
              {extra.seniorActivities.map((act, index) => (
                <div key={index} className="activity-card">
                  <span className="activity-icon">{act.icon}</span>
                  <span className="activity-name">{act.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="jobs-container">
            <h3>🤝 재능 나눔·일자리 분야</h3>
            <p className="jobs-list">{extra.seniorTalent}</p>
          </div>
        </>
      )}

      <div className="secondary-container">
        <p className="secondary-label">두 번째로 높은 성향</p>
        <p className="secondary-type">
          {secondaryData?.title || ''} ({secondary})
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
