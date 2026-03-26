import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, LoginForm } from '../types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  loginFailed: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  } = useAuth(children, 100);

  const loginFailed = false; // Will be passed from LoginPage

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: async (credentials) => {
      try {
        await login(credentials);
      } catch (error: any) {
        if (error.loginFailed) {
          throw error;
        }
      }
    },
    loginFailed,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
