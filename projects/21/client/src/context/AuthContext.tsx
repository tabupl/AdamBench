/**
 * Authentication Context
 * Provides authentication state and methods to the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextValue, AuthState } from '../types/auth';
import { authService } from '../utils/authService';
import { initMockUsersIfNeeded } from '../utils/authStorage';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('[AuthProvider.useEffect] Starting');
    console.log('[AuthProvider.useEffect] Initial state:', state);
    
    // Initialize mock users on first load
    initMockUsersIfNeeded();
    
    // Load user on mount - check localStorage
    const currentUser = authService.getCurrentUser();
    
    console.log('[AuthProvider.useEffect] currentUser:', currentUser);
    
    if (currentUser) {
      console.log('[AuthProvider.useEffect] User found, setting isAuthenticated to true');
      setState({
        user: currentUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      console.log('[AuthProvider.useEffect] No user found, setting isAuthenticated to false');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<void> => {
    try {
      console.log('[AuthProvider.login] Attempting login with:', credentials.email);
      await authService.login(credentials);
      
      // Get the current user to check role for redirection
      const user = authService.getCurrentUser();
      console.log('[AuthProvider.login] Login successful, user:', user);
      
      // Store navigation preference for child components to use
      if (user?.role === 'admin') {
        localStorage.setItem('targetRoute', '/admin');
      } else {
        localStorage.setItem('targetRoute', '/dashboard');
      }
    } catch (error) {
      console.error('[AuthProvider.login] Login failed:', error);
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    localStorage.removeItem('targetRoute');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
