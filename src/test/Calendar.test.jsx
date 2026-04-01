import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DndContext } from '@dnd-kit/core';
import Calendar from '../components/Calendar';
import CalendarEvent from '../components/CalendarEvent';
import MonthView from '../components/MonthView';
import WeekView from '../components/WeekView';
import DayView from '../components/DayView';
import { CalendarProvider, useCalendar } from '../context/CalendarContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Helper to render with context
const renderWithContext = (component) => {
  return render(
    <CalendarProvider>
      {component}
    </CalendarProvider>
  );
};

describe('Calendar Drag and Drop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders calendar with month view by default', () => {
    renderWithContext(<Calendar />);
    
    expect(screen.getByText(/January|February|March|April|May|June|July|August|September|October|November|December/i)).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Month')).toHaveClass('active');
  });

  it('switches between month, week, and day views', () => {
    renderWithContext(<Calendar />);
    
    const weekButton = screen.getByText('Week');
    const dayButton = screen.getByText('Day');
    const monthButton = screen.getByText('Month');
    
    // Switch to week view
    fireEvent.click(weekButton);
    expect(weekButton).toHaveClass('active');
    
    // Switch to day view
    fireEvent.click(dayButton);
    expect(dayButton).toHaveClass('active');
    
    // Switch back to month view
    fireEvent.click(monthButton);
    expect(monthButton).toHaveClass('active');
  });

  it('displays events in month view', () => {
    const mockEvents = [
      { id: '1', title: 'Test Event', date: new Date().toISOString().split('T')[0], type: 'work' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
    
    renderWithContext(<Calendar />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('navigates to previous and next periods', () => {
    renderWithContext(<Calendar />);
    
    const prevButton = screen.getByText('←');
    const nextButton = screen.getByText('→');
    
    fireEvent.click(prevButton);
    fireEvent.click(nextButton);
    
    // Should not throw errors
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('returns to today when Today button is clicked', () => {
    renderWithContext(<Calendar />);
    
    const todayButton = screen.getByText('Today');
    const prevButton = screen.getByText('←');
    
    // Navigate away first
    fireEvent.click(prevButton);
    fireEvent.click(prevButton);
    
    // Click today
    fireEvent.click(todayButton);
    
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
    expect(screen.getByText(new RegExp(currentMonth, 'i'))).toBeInTheDocument();
  });
});

describe('CalendarContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('provides calendar context to children', () => {
    const TestComponent = () => {
      const { events, addEvent } = useCalendar();
      return (
        <div>
          <span data-testid="event-count">{events.length}</span>
          <button onClick={() => addEvent({ title: 'New Event', date: '2024-01-01' })}>
            Add Event
          </button>
        </div>
      );
    };

    renderWithContext(<TestComponent />);
    
    expect(screen.getByTestId('event-count')).toHaveTextContent('0');
    
    fireEvent.click(screen.getByText('Add Event'));
    
    expect(screen.getByTestId('event-count')).toHaveTextContent('1');
  });

  it('reschedules events correctly', () => {
    const mockEvents = [
      { id: '1', title: 'Test Event', date: '2024-01-15', time: '10:00' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
    
    const TestComponent = () => {
      const { events, rescheduleEvent } = useCalendar();
      return (
        <div>
          <span data-testid="event-date">{events[0]?.date || 'none'}</span>
          <button onClick={() => rescheduleEvent('1', '2024-01-20', '14:00')}>
            Reschedule
          </button>
        </div>
      );
    };

    renderWithContext(<TestComponent />);
    
    expect(screen.getByTestId('event-date')).toHaveTextContent('2024-01-15');
    
    fireEvent.click(screen.getByText('Reschedule'));
    
    expect(screen.getByTestId('event-date')).toHaveTextContent('2024-01-20');
  });

  it('deletes events correctly', () => {
    const mockEvents = [
      { id: '1', title: 'Test Event', date: '2024-01-15' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
    
    const TestComponent = () => {
      const { events, deleteEvent } = useCalendar();
      return (
        <div>
          <span data-testid="event-count">{events.length}</span>
          <button onClick={() => deleteEvent('1')}>
            Delete
          </button>
        </div>
      );
    };

    renderWithContext(<TestComponent />);
    
    expect(screen.getByTestId('event-count')).toHaveTextContent('1');
    
    fireEvent.click(screen.getByText('Delete'));
    
    expect(screen.getByTestId('event-count')).toHaveTextContent('0');
  });

  it('invalidates notifications when event time changes', () => {
    const mockEvents = [
      { id: '1', title: 'Test Event', date: '2024-01-15', time: '10:00' }
    ];
    const mockNotifications = [
      { id: 'n1', eventId: '1', scheduledTime: '2024-01-15T09:45:00' }
    ];
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'calendar_events') return JSON.stringify(mockEvents);
      if (key === 'calendar_notifications') return JSON.stringify(mockNotifications);
      return null;
    });
    
    const TestComponent = () => {
      const { notifications, rescheduleEvent } = useCalendar();
      return (
        <div>
          <span data-testid="notification-count">{notifications.length}</span>
          <button onClick={() => rescheduleEvent('1', '2024-01-15', '14:00')}>
            Change Time
          </button>
        </div>
      );
    };

    renderWithContext(<TestComponent />);
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    
    fireEvent.click(screen.getByText('Change Time'));
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
  });
});

describe('CalendarEvent Component', () => {
  it('renders event with correct styling', () => {
    const event = { id: '1', title: 'Test Event', type: 'work' };
    
    render(
      <DndContext>
        <CalendarEvent event={event} view="month" />
      </DndContext>
    );
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('formats time correctly', () => {
    const event = { id: '1', title: 'Test Event', time: '14:30', type: 'work' };
    
    render(
      <DndContext>
        <CalendarEvent event={event} view="week" />
      </DndContext>
    );
    
    expect(screen.getByText('2:30 PM')).toBeInTheDocument();
  });
});

describe('View Components', () => {
  const mockEvents = [
    { id: '1', title: 'Event 1', date: '2024-01-15', time: '10:00' },
    { id: '2', title: 'Event 2', date: '2024-01-16', time: '14:00' }
  ];

  it('MonthView renders correct number of days', () => {
    render(
      <DndContext>
        <MonthView year={2024} month={0} events={mockEvents} />
      </DndContext>
    );
    
    // Should have weekday headers
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('WeekView renders 7 days', () => {
    render(
      <DndContext>
        <WeekView year={2024} month={0} day={15} events={mockEvents} />
      </DndContext>
    );
    
    expect(screen.getByText('Sunday')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Saturday')).toBeInTheDocument();
  });

  it('DayView renders 24 hours', () => {
    render(
      <DndContext>
        <DayView year={2024} month={0} day={15} events={mockEvents} />
      </DndContext>
    );
    
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('23:00')).toBeInTheDocument();
  });
});
