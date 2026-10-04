import React, { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../config';
import splashHero from '../assets/holland_splash_hero.png';
import './SplashScreen.css';

function SplashScreen({ onUnlock }) {
  const [passcode, setPasscode] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'

  const handleNumberPress = useCallback((digit) => {
    if (status !== 'idle' || passcode.length >= 4) return;

    const nextPasscode = passcode + digit;
    setPasscode(nextPasscode);

    if (nextPasscode.length === 4) {
      if (nextPasscode === CONFIG.PASSCODE) {
        setStatus('success');
        setTimeout(() => {
          onUnlock();
        }, 1000);
      } else {
        setStatus('error');
        setTimeout(() => {
          setPasscode('');
          setStatus('idle');
        }, 1000);
      }
    }
  }, [passcode, status, onUnlock]);

  const handleDelete = useCallback(() => {
    if (status !== 'idle' || passcode.length === 0) return;
    setPasscode((prev) => prev.slice(0, -1));
  }, [status, passcode]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== 'idle') return;
      if (e.key >= '0' && e.key <= '9') {
        handleNumberPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberPress, handleDelete, status]);

  return (
    <div className="splash-screen fade-in">
      <div className="splash-header">
        <h1 className="splash-title">간편 Holland</h1>
        <p className="splash-subtitle">- Chulhee -</p>
      </div>

      <div className="splash-illustration-container">
        <img
          src={splashHero}
          className="splash-illustration"
          alt="Holland Career Aptitude Illustration"
        />
      </div>

      <div className="passcode-container">
        <p className={`passcode-prompt ${status}`}>
          {status === 'success'
            ? '참여코드 확인 완료! 잠시만 기다려주세요.'
            : status === 'error'
            ? '올바르지 않은 참여코드입니다.'
            : '참여코드 4자리를 입력하세요'}
        </p>

        <div className={`passcode-dots ${status === 'error' ? 'shake' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            let dotClass = 'dot';
            if (status === 'success') {
              dotClass += ' success';
            } else if (status === 'error') {
              dotClass += ' error';
            } else if (index < passcode.length) {
              dotClass += ' filled';
            }
            return <div key={index} className={dotClass} />;
          })}
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              className="keypad-btn"
              onClick={() => handleNumberPress(num.toString())}
            >
              {num}
            </button>
          ))}
          <div className="keypad-btn empty" />
          <button
            type="button"
            className="keypad-btn"
            onClick={() => handleNumberPress('0')}
          >
            0
          </button>
          <button
            type="button"
            className="keypad-btn delete"
            onClick={handleDelete}
          >
            지우기
          </button>
        </div>
      </div>

      <div className="splash-footer">
        <p>© 2026 Chulhee. All rights reserved.</p>
      </div>
    </div>
  );
}

export default SplashScreen;
