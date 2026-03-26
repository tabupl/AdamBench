import { useState, useEffect, useCallback, ReactNode } from 'react';
import { User, LoginForm } from '../types';
import {
  authenticateUser,
  storeUser,
  removeUser,
  getCurrentUser,
  isUserAuthenticated,
} from '../services/auth.service';
import { StorageService } from '../services/storage.service';

/**
 * Custom hook for authentication management
 * Provides a clean API for authentication state and actions
 */
export const useAuth = (
  children: ReactNode,
  isLoadingDelay: number = 100
): {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => void;
} => {
  const [state, setState] = useState({
    user: getCurrentUser() ?? null,
    isAuthenticated: isUserAuthenticated(),
    isLoading: true,
  });

  // Check for existing session on mount and after storage changes
  useEffect(() => {
    const checkAuth = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      const isAuthenticated = await StorageService.checkAuth();
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated,
        user: isAuthenticated ? getCurrentUser() : null,
      }));
    };

    checkAuth();
  }, [children, isLoadingDelay]);

  // Invalidate session when storage service changes
  const invalidateSession = useCallback(() => {
    removeUser();
    setState((prev) => ({
      ...prev,
      user: null,
      isAuthenticated: false,
    }));
  }, []);

  const login = useCallback(
    async (credentials: LoginForm) => {
      try {
        const user = await authenticateUser(credentials);
        if (user) {
          storeUser(user);
          setState((prev) => ({ ...prev, user, isAuthenticated: true }));
        }
      } catch (error: any) {
        throw { message: error.message, loginFailed: true };
      }
    },
    []
  );

  const logout = useCallback(() => {
    invalidateSession();
  }, [invalidateSession]);

  return {
    ...state,
    login,
    logout,
  };
};

/**
 * Simple wrapper for login with better error handling
 */
export const useLogin = (): {
  login: (credentials: LoginForm) => Promise<void>;
  loginFailed: boolean;
} => {
  const { login } = useAuth(null, 0);

  return {
    login: async (credentials: LoginForm) => {
      try {
        await login(credentials);
      } catch (error: any) {
        throw { message: error.message, loginFailed: true };
      }
    },
    loginFailed: false,
  };
};
