import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserUpdate } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: UserUpdate) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USERS = [
  { email: 'user@example.com', password: 'password123', user: { id: '1', email: 'user@example.com', name: 'Demo User' } },
  { email: 'admin@example.com', password: 'admin123', user: { id: '2', email: 'admin@example.com', name: 'Admin User' } },
];

const STORAGE_KEY = 'auth_user';

function simulateDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setUser(stored ? JSON.parse(stored) : null);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await simulateDelay();
      const found = FAKE_USERS.find(u => u.email === email.toLowerCase() && u.password === password);
      if (!found) throw new Error('Invalid email or password');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found.user));
      setUser(found.user);
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback(async (updates: UserUpdate) => {
    if (!user) throw new Error('No user logged in');
    setIsLoading(true);
    try {
      await simulateDelay(300);
      if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
        throw new Error('Invalid email format');
      }
      const updatedUser = { ...user, ...(updates.name && { name: updates.name }), ...(updates.email && { email: updates.email }) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, logout, updateUser, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
