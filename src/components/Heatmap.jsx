import React from 'react';
import './Heatmap.css';

function Heatmap({ data }) {
  const getIntensity = (count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  };

  const getColor = (intensity) => {
    const colors = [
      'var(--heatmap-0)',
      'var(--heatmap-1)',
      'var(--heatmap-2)',
      'var(--heatmap-3)',
      'var(--heatmap-4)',
    ];
    return colors[intensity];
  };

  const generateCells = () => {
    const cells = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = data[dateStr] || 0;
      const intensity = getIntensity(count);
      
      cells.push({
        date: dateStr,
        count,
        intensity,
      });
    }
    
    return cells;
  };

  const cells = generateCells();
  
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const monthLabels = () => {
    const months = [];
    const seen = new Set();
    
    cells.forEach((cell, index) => {
      const date = new Date(cell.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!seen.has(monthKey) && date.getDate() <= 7) {
        seen.add(monthKey);
        months.push({
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          index: Math.floor(index / 7),
        });
      }
    });
    
    return months;
  };

  return (
    <div className="heatmap-container">
      <h3>Activity Heatmap</h3>
      
      <div className="heatmap-months">
        {monthLabels().map((m, i) => (
          <span key={i} style={{ gridColumnStart: m.index + 1 }} className="month-label">
            {m.label}
          </span>
        ))}
      </div>
      
      <div className="heatmap-grid">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="heatmap-week">
            {week.map((cell, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="heatmap-cell"
                style={{ backgroundColor: getColor(cell.intensity) }}
                title={`${formatDate(cell.date)}: ${cell.count} habits completed`}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="legend-cell"
            style={{ backgroundColor: getColor(level) }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default Heatmap;
