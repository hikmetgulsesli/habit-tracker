import React, { useState } from 'react';
import './AddHabit.css';

function AddHabit({ onAdd }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name);
      setName('');
    }
  };

  return (
    <form className="add-habit" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a new habit..."
        className="add-habit-input"
      />
      <button type="submit" className="add-habit-button">
        Add Habit
      </button>
    </form>
  );
}

export default AddHabit;
