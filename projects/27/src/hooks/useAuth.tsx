/**
 * Authentication Hook
 * Manages authentication state
 */

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { storageService, type User } from '../services/storageService';

interface LoginParams {
  username: string;
}

export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (params: LoginParams) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const login = useCallback(async (params: LoginParams) => {
    setIsLoading(true);
    try {
      const user = await authService.login(params.username);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = { ...user, ...updates } as User;
      storageService.set(updated);
      setUser(updated);
    } catch (error) {
      throw new Error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return { user, isLoading, isAuthenticated: !!user, login, logout, updateProfile };
};

export default useAuth;