import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import CalendarEvent from './CalendarEvent';
import './TimeSlot.css';

function TimeSlot({ date, hour, events, onClick }) {
  const timeString = `${hour.toString().padStart(2, '0')}:00`;
  const slotId = `slot-${date}-${hour}`;
  
  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
    data: { date, hour, time: timeString, type: 'timeslot' },
  });

  const slotEvents = events.filter(event => {
    if (!event.time) return false;
    const eventHour = parseInt(event.time.split(':')[0], 10);
    return eventHour === hour;
  });

  return (
    <div
      ref={setNodeRef}
      className={`time-slot ${isOver ? 'drag-over' : ''}`}
      onClick={() => onClick?.(date, hour)}
    >
      <div className="time-label">{timeString}</div>
      <div className="time-content">
        {slotEvents.map(event => (
          <CalendarEvent key={event.id} event={event} view="week" />
        ))}
      </div>
    </div>
  );
}

export default TimeSlot;
