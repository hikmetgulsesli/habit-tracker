import React from 'react';
import './HabitItem.css';

function HabitItem({ habit, onDelete, onToggle, isCompleted }) {
  return (
    <div className={`habit-item ${isCompleted ? 'completed' : ''}`}>
      <button
        className={`habit-checkbox ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(habit.id)}
        aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {isCompleted && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 13l4 4L19 7" />
        </svg>}
      </button>
      
      <span className="habit-name">{habit.name}</span>
      
      <button
        className="habit-delete"
        onClick={() => onDelete(habit.id)}
        aria-label="Delete habit"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default HabitItem;
