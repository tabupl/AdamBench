import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useAuth from '../useAuth';

interface User {
  id: string;
  username: string;
  email: string;
}

describe('useAuth', () => {
  const mockStorage: Record<string, string> = { user: JSON.stringify({ id: '1', username: 'testuser', email: 'test@example.com' }) };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => { mockStorage[k] = v; },
        removeItem: (k: string) => { delete mockStorage[k]; },
        clear: () => { Object.keys(mockStorage).forEach((kk) => delete mockStorage[kk]); },
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: window.localStorage,
      writable: true,
    });
  });

  it('returns user from storage on mount', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual({ id: '1', username: 'testuser', email: 'test@example.com' } as User);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('has correct state structure', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('updateProfile');
  });
});