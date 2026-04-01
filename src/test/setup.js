import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Notification API properly as a constructor
const MockNotification = vi.fn().mockImplementation(function(title, options) {
  this.title = title;
  this.options = options;
});
MockNotification.permission = 'default';
MockNotification.requestPermission = vi.fn();

Object.defineProperty(window, 'Notification', {
  writable: true,
  configurable: true,
  value: MockNotification,
});
