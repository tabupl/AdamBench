import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthState } from '../types';
import { getAuthService } from '../services/auth.service';

interface AuthContextType extends Omit<AuthState, 'user'> {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth provider component
 */
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Load saved auth state on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async (): Promise<void> => {
    try {
      const stored = getAuthService().getAuthState();
      if (stored) {
        setAuthState(stored);
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to load auth state', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const user = await getAuthService().login({ email, password });
        setAuthState({ ...user, isLoading: false });
      } catch (error: any) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Login failed',
        }));
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await getAuthService().logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed',
      }));
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<void> => {
    const isAuthenticated = await getAuthService().checkAuth();
    setAuthState((prev) => ({ ...prev, isAuthenticated }));
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Helper to reset authentication (useful for testing)
 */
export function resetAuth(): void {
  getAuthService().reset();
}

export default AuthContext;