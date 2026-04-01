import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import CalendarEvent from './CalendarEvent';
import './CalendarCell.css';

function CalendarCell({ date, events, isCurrentMonth, view = 'month', onClick }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${date}`,
    data: { date, type: 'cell' },
  });

  const dayNumber = new Date(date).getDate();
  const isToday = date === new Date().toISOString().split('T')[0];

  return (
    <div
      ref={setNodeRef}
      className={`calendar-cell ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${isOver ? 'drag-over' : ''} ${view}-view`}
      onClick={() => onClick?.(date)}
    >
      <div className="cell-header">
        <span className="day-number">{dayNumber}</span>
      </div>
      <div className="cell-events">
        {events.map(event => (
          <CalendarEvent key={event.id} event={event} view={view} />
        ))}
      </div>
    </div>
  );
}

export default CalendarCell;
