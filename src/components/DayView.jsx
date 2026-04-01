import React from 'react';
import TimeSlot from './TimeSlot';
import './DayView.css';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function DayView({ year, month, day, events, onSlotClick }) {
  const date = new Date(year, month, day);
  const dateString = date.toISOString().split('T')[0];
  const dayName = WEEKDAYS[date.getDay()];

  const getEventsForDate = () => {
    return events.filter(event => event.date === dateString);
  };

  const dayEvents = getEventsForDate();

  return (
    <div className="day-view">
      <div className="day-header">
        <div className="day-info">
          <span className="day-name">{dayName}</span>
          <span className="day-date">
            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="day-stats">
          <span className="event-count">{dayEvents.length} events</span>
        </div>
      </div>
      <div className="day-grid">
        {HOURS.map(hour => (
          <TimeSlot
            key={hour}
            date={dateString}
            hour={hour}
            events={dayEvents}
            onClick={onSlotClick}
          />
        ))}
      </div>
    </div>
  );
}

export default DayView;
