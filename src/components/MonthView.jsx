import React from 'react';
import CalendarCell from './CalendarCell';
import './MonthView.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MonthView({ year, month, events, onCellClick }) {
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Get days from previous month
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  const prevMonthDays = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day).toISOString().split('T')[0];
    prevMonthDays.push({ date, day, isCurrentMonth: false });
  }

  // Get days in current month
  const currentMonthDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day).toISOString().split('T')[0];
    currentMonthDays.push({ date, day, isCurrentMonth: true });
  }

  // Get days from next month to fill the grid
  const nextMonthDays = [];
  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const remainingCells = 42 - totalCells; // 6 rows * 7 columns
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day).toISOString().split('T')[0];
    nextMonthDays.push({ date, day, isCurrentMonth: false });
  }

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const getEventsForDate = (date) => {
    return events.filter(event => event.date === date);
  };

  return (
    <div className="month-view">
      <div className="month-header">
        {WEEKDAYS.map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}
      </div>
      <div className="month-grid">
        {allDays.map(({ date, day, isCurrentMonth }) => (
          <CalendarCell
            key={date}
            date={date}
            events={getEventsForDate(date)}
            isCurrentMonth={isCurrentMonth}
            view="month"
            onClick={onCellClick}
          />
        ))}
      </div>
    </div>
  );
}

export default MonthView;
