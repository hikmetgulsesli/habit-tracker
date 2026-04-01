import React from 'react';
import TimeSlot from './TimeSlot';
import './WeekView.css';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function WeekView({ year, month, day, events, onSlotClick }) {
  // Get the start of the week (Sunday)
  const currentDate = new Date(year, month, day);
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDays.push({
      date: date.toISOString().split('T')[0],
      dayName: WEEKDAYS[i],
      dayNumber: date.getDate(),
    });
  }

  const getEventsForDate = (date) => {
    return events.filter(event => event.date === date);
  };

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="time-column-header" />
        {weekDays.map(({ date, dayName, dayNumber }) => (
          <div key={date} className="weekday-column-header">
            <span className="day-name">{dayName}</span>
            <span className="day-number">{dayNumber}</span>
          </div>
        ))}
      </div>
      <div className="week-grid">
        {HOURS.map(hour => (
          <div key={hour} className="week-row">
            <div className="time-label-cell">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {weekDays.map(({ date }) => (
              <TimeSlot
                key={`${date}-${hour}`}
                date={date}
                hour={hour}
                events={getEventsForDate(date)}
                onClick={onSlotClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekView;
