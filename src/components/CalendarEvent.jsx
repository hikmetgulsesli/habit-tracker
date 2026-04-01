import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import './CalendarEvent.css';

function CalendarEvent({ event, view = 'month' }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    data: { event, type: 'event' },
  });

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEventColor = () => {
    const colors = {
      work: 'var(--event-work, #58a6ff)',
      personal: 'var(--event-personal, #238636)',
      meeting: 'var(--event-meeting, #f0883e)',
      reminder: 'var(--event-reminder, #8957e5)',
      default: 'var(--accent-primary, #58a6ff)',
    };
    return colors[event.type] || colors.default;
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`calendar-event ${isDragging ? 'dragging' : ''} ${view}-view`}
      style={{
        backgroundColor: getEventColor(),
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
        transform: isDragging ? 'scale(1.02) rotate(2deg)' : 'none',
      }}
      title={`${event.title}${event.time ? ` at ${formatTime(event.time)}` : ''}`}
    >
      {view === 'month' ? (
        <>
          <span className="event-dot" />
          <span className="event-title">{event.title}</span>
        </>
      ) : (
        <>
          <span className="event-time">{formatTime(event.time)}</span>
          <span className="event-title">{event.title}</span>
        </>
      )}
    </div>
  );
}

export default CalendarEvent;
