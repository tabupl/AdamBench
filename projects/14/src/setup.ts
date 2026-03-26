import '@testing-library/jest-dom';

// Mock localStorage for testing
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: () => null,
    setItem: () => {
      throw new Error('localStorage not allowed');
    },
    removeItem: () => {
      throw new Error('localStorage not allowed');
    },
    clear: () => {
      throw new Error('localStorage not allowed');
    },
    key: () => null,
  },
  writable: true,
});

// Mock fetch for API calls (if needed in future)
Object.defineProperty(window, 'fetch', {
  value: async () => {},
  writable: true,
});
