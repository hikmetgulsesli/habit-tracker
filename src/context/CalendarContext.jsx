import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CalendarContext = createContext(null);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};

export function CalendarProvider({ children }) {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendar_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('calendar_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('calendar_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('calendar_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addEvent = useCallback((event) => {
    const newEvent = {
      id: Date.now().toString(),
      ...event,
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates, updatedAt: new Date().toISOString() } : event
    ));
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const invalidateNotifications = useCallback((eventId) => {
    setNotifications(prev => prev.filter(n => n.eventId !== eventId));
  }, []);

  const rescheduleEvent = useCallback((id, newDate, newTime) => {
    setEvents(prev => prev.map(event => {
      if (event.id === id) {
        const oldDateTime = new Date(event.date + 'T' + (event.time || '00:00'));
        const newDateTime = new Date(newDate + 'T' + (newTime || event.time || '00:00'));
        
        // Invalidate notifications if time changed
        if (oldDateTime.getTime() !== newDateTime.getTime()) {
          invalidateNotifications(id);
        }
        
        return { 
          ...event, 
          date: newDate, 
          time: newTime || event.time,
          updatedAt: new Date().toISOString() 
        };
      }
      return event;
    }));
  }, [invalidateNotifications]);

  const getEventsForDate = useCallback((date) => {
    return events.filter(event => event.date === date);
  }, [events]);

  const getEventsForDateRange = useCallback((startDate, endDate) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    });
  }, [events]);

  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    rescheduleEvent,
    getEventsForDate,
    getEventsForDateRange,
    notifications,
    invalidateNotifications,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export default CalendarContext;
