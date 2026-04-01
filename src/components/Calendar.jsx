import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import CalendarEvent from './CalendarEvent';
import { useCalendar } from '../context/CalendarContext';
import './Calendar.css';

const VIEW_MODES = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
};

function Calendar() {
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeDragEvent, setActiveDragEvent] = useState(null);
  const { events, rescheduleEvent, addEvent } = useCalendar();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event) => {
        const { active } = event;
        return active?.rect?.current?.translated;
      },
    })
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === VIEW_MODES.MONTH) {
      newDate.setMonth(month - 1);
    } else if (viewMode === VIEW_MODES.WEEK) {
      newDate.setDate(day - 7);
    } else {
      newDate.setDate(day - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === VIEW_MODES.MONTH) {
      newDate.setMonth(month + 1);
    } else if (viewMode === VIEW_MODES.WEEK) {
      newDate.setDate(day + 7);
    } else {
      newDate.setDate(day + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const formatTitle = () => {
    if (viewMode === VIEW_MODES.MONTH) {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === VIEW_MODES.WEEK) {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(day - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const draggedEvent = events.find(e => e.id === active.id);
    if (draggedEvent) {
      setActiveDragEvent(draggedEvent);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragEvent(null);

    if (!over) return;

    const draggedEvent = events.find(e => e.id === active.id);
    if (!draggedEvent) return;

    const overData = over.data.current;
    if (!overData) return;

    if (overData.type === 'cell') {
      // Dropped on a day cell (month view)
      const newDate = overData.date;
      rescheduleEvent(active.id, newDate, draggedEvent.time);
    } else if (overData.type === 'timeslot') {
      // Dropped on a time slot (week/day view)
      const newDate = overData.date;
      const newHour = overData.hour.toString().padStart(2, '0');
      const newTime = `${newHour}:00`;
      rescheduleEvent(active.id, newDate, newTime);
    }
  };

  const handleCellClick = (date) => {
    // Could open an "add event" modal here
    console.log('Clicked date:', date);
  };

  const handleSlotClick = (date, hour) => {
    // Could open an "add event" modal here with pre-filled time
    console.log('Clicked slot:', date, hour);
  };

  return (
    <div className="calendar">
      <div className="calendar-toolbar">
        <div className="calendar-nav">
          <button className="nav-button" onClick={navigatePrev}>←</button>
          <button className="nav-button today" onClick={navigateToday}>Today</button>
          <button className="nav-button" onClick={navigateNext}>→</button>
        </div>
        <h2 className="calendar-title">{formatTitle()}</h2>
        <div className="view-switcher">
          {Object.values(VIEW_MODES).map((mode) => (
            <button
              key={mode}
              className={`view-button ${viewMode === mode ? 'active' : ''}`}
              onClick={() => setViewMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="calendar-content">
          {viewMode === VIEW_MODES.MONTH && (
            <MonthView
              year={year}
              month={month}
              events={events}
              onCellClick={handleCellClick}
            />
          )}
          {viewMode === VIEW_MODES.WEEK && (
            <WeekView
              year={year}
              month={month}
              day={day}
              events={events}
              onSlotClick={handleSlotClick}
            />
          )}
          {viewMode === VIEW_MODES.DAY && (
            <DayView
              year={year}
              month={month}
              day={day}
              events={events}
              onSlotClick={handleSlotClick}
            />
          )}
        </div>

        <DragOverlay>
          {activeDragEvent ? (
            <div className="drag-overlay">
              <CalendarEvent event={activeDragEvent} view="week" />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default Calendar;
