import React from 'react';
import './StreakCounter.css';

function StreakCounter({ current, longest }) {
  return (
    <div className="streak-counter">
      <div className="streak-box">
        <span className="streak-icon">🔥</span>
        <div className="streak-info">
          <span className="streak-number">{current}</span>
          <span className="streak-label">Current Streak</span>
        </div>
      </div>
      
      <div className="streak-box">
        <span className="streak-icon">🏆</span>
        <div className="streak-info">
          <span className="streak-number">{longest}</span>
          <span className="streak-label">Longest Streak</span>
        </div>
      </div>
    </div>
  );
}

export default StreakCounter;
