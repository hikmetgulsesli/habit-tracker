import React from 'react';
import HabitItem from './HabitItem';
import './HabitList.css';

function HabitList({ habits, onDelete, onToggle, isCompleted }) {
  if (habits.length === 0) {
    return (
      <div className="habit-list-empty">
        <span className="empty-icon">📝</span>
        <p>No habits yet. Add one above to get started!</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      <h3>Your Habits ({habits.length})</h3>
      <div className="habit-items">
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onDelete={onDelete}
            onToggle={onToggle}
            isCompleted={isCompleted(habit.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default HabitList;
