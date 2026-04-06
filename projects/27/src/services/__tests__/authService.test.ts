import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { authService } from '../authService';

const originalStorage = window.localStorage;

beforeAll(() => {
  const mockStorage: Record<string, string> = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((k: string) => mockStorage[k] || null),
      setItem: vi.fn((k: string, v: string) => { mockStorage[k] = v; }),
      removeItem: vi.fn((k: string) => { delete mockStorage[k]; }),
      clear: vi.fn(() => { Object.keys(mockStorage).forEach((k: string) => delete mockStorage[k]); }),
    },
    writable: true,
  });
});

afterAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: originalStorage,
    writable: true,
  });
});

interface User {
  id: string;
  username: string;
  email: string;
}

describe('authService', () => {
  describe('login', () => {
    it('should throw error for empty username', async () => {
      await expect(authService.login('')).rejects.toThrow();
    });

    it('should throw error for invalid username format', async () => {
      await expect(authService.login('123invalid')).rejects.toThrow();
    });

    it('should return user for valid username', async () => {
      const user = await authService.login('validuser');
      expect(user).toEqual({
        id: '1',
        username: 'validuser',
        email: 'validuser@example.com',
      } as User);
    });
  });

  describe('logout', () => {
    it('should clear storage', () => {
      const mockStorage: Record<string, string> = { user: JSON.stringify({ id: '1', username: 'test', email: 'test@example.com' }) };
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn((k: string) => mockStorage[k] || null),
          setItem: vi.fn((k: string, v: string) => { mockStorage[k] = v; }),
          removeItem: vi.fn((k: string) => { delete mockStorage[k]; }),
          clear: vi.fn(() => { Object.keys(mockStorage).forEach((kk: string) => delete mockStorage[kk]); }),
        },
        writable: true,
      });
      
      expect(authService.getUser() as User).not.toBeNull();
      authService.logout();
      expect(authService.getUser()).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return null when no user stored', () => {
      const mockStorage: Record<string, string> = {};
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn((k: string) => mockStorage[k] || null),
          setItem: vi.fn((k: string, v: string) => { mockStorage[k] = v; }),
          removeItem: vi.fn((k: string) => { delete mockStorage[k]; }),
          clear: vi.fn(() => { Object.keys(mockStorage).forEach((kk: string) => delete mockStorage[kk]); }),
        },
        writable: true,
      });
      expect(authService.getUser()).toBeNull();
    });

    it('should return stored user', () => {
      const mockStorage: Record<string, string> = { user: JSON.stringify({ id: '1', username: 'testuser', email: 'test@example.com' }) };
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn((k: string) => mockStorage[k] || null),
          setItem: vi.fn((k: string, v: string) => { mockStorage[k] = v; }),
          removeItem: vi.fn((k: string) => { delete mockStorage[k]; }),
          clear: vi.fn(() => { Object.keys(mockStorage).forEach((kk: string) => delete mockStorage[kk]); }),
        },
        writable: true,
      });
      expect(authService.getUser()).toEqual({ id: '1', username: 'testuser', email: 'test@example.com' } as User);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user', () => {
      const mockStorage: Record<string, string> = {};
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn((k: string) => mockStorage[k] || null),
          setItem: vi.fn((k: string, v: string) => { mockStorage[k] = v; }),
          removeItem: vi.fn((k: string) => { delete mockStorage[k]; }),
          clear: vi.fn(() => { Object.keys(mockStorage).forEach((kk: string) => delete mockStorage[kk]); }),
        },
        writable: true,
      });
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true when user exists', () => {
      const mockStorage: Record<string, string> = { user: JSON.stringify({ id: '1', username: 'testuser', email: 'test@example.com' }) };
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn((k: string) => mockStorage[k] || null),
          setItem: vi.fn((k: string, v: string) => { mockStorage[k] = v; }),
          removeItem: vi.fn((k: string) => { delete mockStorage[k]; }),
          clear: vi.fn(() => { Object.keys(mockStorage).forEach((kk: string) => delete mockStorage[kk]); }),
        },
        writable: true,
      });
      expect(authService.isAuthenticated()).toBe(true);
    });
  });
});