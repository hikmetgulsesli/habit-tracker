import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationPermissionDialog, { 
  getNotificationState, 
  saveNotificationState, 
  requestNotificationPermission,
  scheduleNotification,
  scheduleEventReminder 
} from '../components/NotificationPermissionDialog.jsx';

describe('NotificationPermissionDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Notification.permission = 'default';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Dialog Rendering', () => {
    it('renders when isOpen is true', () => {
      render(
        <NotificationPermissionDialog 
          isOpen={true} 
          onClose={() => {}} 
          onAllow={() => {}} 
          onDeny={() => {}} 
        />
      );
      
      expect(screen.getByTestId('notification-dialog-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(
        <NotificationPermissionDialog 
          isOpen={false} 
          onClose={() => {}} 
          onAllow={() => {}} 
          onDeny={() => {}} 
        />
      );
      
      expect(screen.queryByTestId('notification-dialog-overlay')).not.toBeInTheDocument();
    });

    it('displays correct dialog text', () => {
      render(
        <NotificationPermissionDialog 
          isOpen={true} 
          onClose={() => {}} 
          onAllow={() => {}} 
          onDeny={() => {}} 
        />
      );
      
      const dialogText = screen.getByTestId('notification-dialog-text');
      expect(dialogText).toHaveTextContent('Bildirimlere izin vermek istiyor musunuz?');
      expect(dialogText).toHaveTextContent('Etkinlikleriniz başlamadan 15 dakika önce hatırlatılacaktır');
    });

    it('has correct button labels', () => {
      render(
        <NotificationPermissionDialog 
          isOpen={true} 
          onClose={() => {}} 
          onAllow={() => {}} 
          onDeny={() => {}} 
        />
      );
      
      expect(screen.getByTestId('notification-allow-button')).toHaveTextContent('Evet, izin ver');
      expect(screen.getByTestId('notification-deny-button')).toHaveTextContent('Hayır, teşekkürler');
    });
  });

  describe('Button Interactions', () => {
    it('calls onAllow when Evet, izin ver button is clicked', () => {
      const onAllow = vi.fn();
      render(
        <NotificationPermissionDialog 
          isOpen={true} 
          onClose={() => {}} 
          onAllow={onAllow} 
          onDeny={() => {}} 
        />
      );
      
      fireEvent.click(screen.getByTestId('notification-allow-button'));
      expect(onAllow).toHaveBeenCalledTimes(1);
    });

    it('calls onDeny when Hayır, teşekkürler button is clicked', () => {
      const onDeny = vi.fn();
      render(
        <NotificationPermissionDialog 
          isOpen={true} 
          onClose={() => {}} 
          onAllow={() => {}} 
          onDeny={onDeny} 
        />
      );
      
      fireEvent.click(screen.getByTestId('notification-deny-button'));
      expect(onDeny).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Notification State Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Notification.permission = 'default';
  });

  describe('getNotificationState', () => {
    it('returns default state when nothing is saved', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const state = getNotificationState();
      
      expect(state).toEqual({ hasAsked: false, permission: 'default' });
    });

    it('returns saved state from localStorage', () => {
      const savedState = { hasAsked: true, permission: 'granted' };
      localStorage.getItem.mockReturnValue(JSON.stringify(savedState));
      
      const state = getNotificationState();
      
      expect(state).toEqual(savedState);
    });

    it('uses current Notification.permission when no saved state', () => {
      localStorage.getItem.mockReturnValue(null);
      Notification.permission = 'denied';
      
      const state = getNotificationState();
      
      expect(state.permission).toBe('denied');
    });
  });

  describe('saveNotificationState', () => {
    it('saves state to localStorage', () => {
      const state = { hasAsked: true, permission: 'granted' };
      
      saveNotificationState(state);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'notification-permission-state',
        JSON.stringify(state)
      );
    });
  });
});

describe('Notification Permission Request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests notification permission from browser', async () => {
    Notification.requestPermission.mockResolvedValue('granted');
    
    const result = await requestNotificationPermission();
    
    expect(Notification.requestPermission).toHaveBeenCalled();
    expect(result).toBe('granted');
  });

  it('handles denied permission', async () => {
    Notification.requestPermission.mockResolvedValue('denied');
    
    const result = await requestNotificationPermission();
    
    expect(result).toBe('denied');
  });
});

describe('Scheduled Notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    Notification.permission = 'granted';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('schedules notification for future time', () => {
    const futureTime = Date.now() + 60000; // 1 minute from now
    
    scheduleNotification('Test Title', 'Test Body', futureTime);
    
    expect(Notification).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(60000);
    
    expect(Notification).toHaveBeenCalledWith('Test Title', { body: 'Test Body' });
  });

  it('shows notification immediately if time has passed', () => {
    const pastTime = Date.now() - 1000;
    Notification.permission = 'granted';
    
    scheduleNotification('Past Title', 'Past Body', pastTime);
    
    expect(Notification).toHaveBeenCalledWith('Past Title', { body: 'Past Body' });
  });

  it('does not show notification if permission is not granted', () => {
    Notification.permission = 'denied';
    const futureTime = Date.now() + 1000;
    
    scheduleNotification('Test Title', 'Test Body', futureTime);
    vi.advanceTimersByTime(2000);
    
    expect(Notification).not.toHaveBeenCalled();
  });
});

describe('Event Reminders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    Notification.permission = 'granted';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('schedules reminder 15 minutes before event', () => {
    const eventTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    const expectedReminderTime = eventTime.getTime() - 15 * 60 * 1000;
    const delay = expectedReminderTime - Date.now();
    
    scheduleEventReminder('My Event', eventTime.toISOString());
    
    expect(Notification).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(delay);
    
    expect(Notification).toHaveBeenCalledWith(
      'Etkinlik Hatırlatması',
      expect.objectContaining({
        body: expect.stringContaining('My Event')
      })
    );
  });

  it('includes event time in notification body', () => {
    const eventTime = new Date(Date.now() + 30 * 60 * 1000);
    const delay = eventTime.getTime() - 15 * 60 * 1000 - Date.now();
    
    scheduleEventReminder('Meeting', eventTime.toISOString());
    vi.advanceTimersByTime(delay);
    
    const callArgs = Notification.mock.calls[0];
    expect(callArgs[1].body).toContain('Meeting');
  });
});
