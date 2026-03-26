import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state with null user', async () => {
    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {}),
      removeItem: vi.fn(() => {}),
    };

    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    // Import after setting up mocks
    const authService = require('../services/auth.service');
    const storageService = require('../services/storage.service');

    vi.spyOn(authService.getCurrentUser, 'call').mockReturnValue(null);
    vi.spyOn(authService.isUserAuthenticated, 'call').mockReturnValue(false);
    vi.spyOn(storageService.checkAuth, 'call').mockResolvedValue(false);

    const { result } = renderHook(() => useAuth(null));

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('should set user in state after successful login', async () => {
    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {}),
      removeItem: vi.fn(() => {}),
    };

    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    const authService = require('../services/auth.service');
    const storageService = require('../services/storage.service');

    const mockUser = { id: '1', email: 'admin@example.com', name: 'Admin User', password: 'password' } as any;

    vi.spyOn(authService.authenticateUser, 'call').mockResolvedValue(mockUser);
    vi.spyOn(authService.getCurrentUser, 'call').mockReturnValue(null);
    vi.spyOn(authService.isUserAuthenticated, 'call').mockReturnValue(false);
    vi.spyOn(storageService.checkAuth, 'call').mockResolvedValue(false);

    const { result } = renderHook(() => useAuth(null));

    const loginFn = result.current.login;
    expect(loginFn).toBeDefined();

    await loginFn({ email: 'admin@example.com', password: 'password' });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should throw error with message when login fails', async () => {
    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {}),
      removeItem: vi.fn(() => {}),
    };

    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    const authService = require('../services/auth.service');
    const storageService = require('../services/storage.service');

    vi.spyOn(authService.authenticateUser, 'call').mockRejectedValue(new Error('Invalid email or password'));
    vi.spyOn(authService.getCurrentUser, 'call').mockReturnValue(null);
    vi.spyOn(authService.isUserAuthenticated, 'call').mockReturnValue(false);
    vi.spyOn(storageService.checkAuth, 'call').mockResolvedValue(false);

    const { result } = renderHook(() => useAuth(null));

    const loginFn = result.current.login;
    await expect(loginFn({ email: 'invalid@example.com', password: 'password' })).rejects.toThrow('Invalid email or password');
  });

  it('should validate email format before authentication', async () => {
    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {}),
      removeItem: vi.fn(() => {}),
    };

    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    const authService = require('../services/auth.service');
    const storageService = require('../services/storage.service');

    vi.spyOn(authService.authenticateUser, 'call').mockRejectedValue(new Error('Invalid email or password'));
    vi.spyOn(authService.getCurrentUser, 'call').mockReturnValue(null);
    vi.spyOn(authService.isUserAuthenticated, 'call').mockReturnValue(false);
    vi.spyOn(storageService.checkAuth, 'call').mockResolvedValue(false);

    const { result } = renderHook(() => useAuth(null));

    const loginFn = result.current.login;
    await expect(loginFn({ email: 'invalid-email', password: 'password' })).rejects.toThrow('Invalid email address');
  });

  it('should validate password length before authentication', async () => {
    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {}),
      removeItem: vi.fn(() => {}),
    };

    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    const authService = require('../services/auth.service');
    const storageService = require('../services/storage.service');

    vi.spyOn(authService.authenticateUser, 'call').mockRejectedValue(new Error('Invalid email or password'));
    vi.spyOn(authService.getCurrentUser, 'call').mockReturnValue(null);
    vi.spyOn(authService.isUserAuthenticated, 'call').mockReturnValue(false);
    vi.spyOn(storageService.checkAuth, 'call').mockResolvedValue(false);

    const { result } = renderHook(() => useAuth(null));

    const loginFn = result.current.login;
    await expect(loginFn({ email: 'admin@example.com', password: 'short' })).rejects.toThrow('Password must be at least 6 characters');
  });

  it('should simulate network delay', async () => {
    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {}),
      removeItem: vi.fn(() => {}),
    };

    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    const authService = require('../services/auth.service');
    const storageService = require('../services/storage.service');

    const mockUser = { id: '1', email: 'admin@example.com', name: 'Admin User', password: 'password' } as any;

    vi.spyOn(authService.authenticateUser, 'call').mockResolvedValue(mockUser);
    vi.spyOn(authService.getCurrentUser, 'call').mockReturnValue(null);
    vi.spyOn(authService.isUserAuthenticated, 'call').mockReturnValue(false);
    vi.spyOn(storageService.checkAuth, 'call').mockResolvedValue(false);

    const { result } = renderHook(() => useAuth(null));

    const loginFn = result.current.login;
    const start = Date.now();
    await loginFn({ email: 'admin@example.com', password: 'password' });
    const end = Date.now();

    expect(end - start).toBeGreaterThanOrEqual(500);
  });

  it('should invalidate session on logout', async () => {
    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {}),
      removeItem: vi.fn(() => {}),
    };

    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    const authService = require('../services/auth.service');
    const storageService = require('../services/storage.service');

    vi.spyOn(authService.getCurrentUser, 'call').mockReturnValue({ id: '1', email: 'test@example.com', name: 'Test User', password: 'password' } as any);
    vi.spyOn(storageService.checkAuth, 'call').mockResolvedValue(false);

    const { result } = renderHook(() => useAuth(null));

    result.current.logout();

    expect(authService.removeUser).toHaveBeenCalled();
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
