import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { User, LoginCredentials, AuthError, ProfileUpdate } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<AuthError | null>;
  logout: () => void;
  updateUser: (updates: ProfileUpdate) => Promise<AuthError | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fake user database
const FAKE_USERS: Record<string, { password: string; user: User }> = {
  'user@example.com': {
    password: 'password123',
    user: { id: '1', email: 'user@example.com', name: 'John Doe' },
  },
  'admin@example.com': {
    password: 'admin123',
    user: { id: '2', email: 'admin@example.com', name: 'Admin User' },
  },
};

const AUTH_STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthError | null> => {
    setError(null);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate input
    if (!credentials.email.includes('@')) {
      const err = { code: 'INVALID_EMAIL', message: 'Please enter a valid email' };
      setError(err);
      return err;
    }
    if (credentials.password.length < 6) {
      const err = { code: 'INVALID_PASSWORD', message: 'Password must be at least 6 characters' };
      setError(err);
      return err;
    }

    const fakeUser = FAKE_USERS[credentials.email];
    if (!fakeUser) {
      const err = { code: 'USER_NOT_FOUND', message: 'No account found with this email' };
      setError(err);
      return err;
    }
    if (fakeUser.password !== credentials.password) {
      const err = { code: 'INVALID_PASSWORD', message: 'Incorrect password' };
      setError(err);
      return err;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fakeUser.user));
    setUser(fakeUser.user);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback(async (updates: ProfileUpdate): Promise<AuthError | null> => {
    setError(null);
    if (!user) {
      const err = { code: 'NOT_LOGGED_IN', message: 'No user logged in' };
      setError(err);
      return err;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!updates.email.includes('@')) {
      const err = { code: 'INVALID_EMAIL', message: 'Please enter a valid email' };
      setError(err);
      return err;
    }
    if (updates.name.trim().length < 2) {
      const err = { code: 'INVALID_NAME', message: 'Name must be at least 2 characters' };
      setError(err);
      return err;
    }
    if (updates.email !== user.email && FAKE_USERS[updates.email]) {
      const err = { code: 'EMAIL_EXISTS', message: 'This email is already registered' };
      setError(err);
      return err;
    }

    const updatedUser: User = { ...user, name: updates.name.trim(), email: updates.email.trim() };
    
    // Update fake user database
    delete FAKE_USERS[user.email];
    FAKE_USERS[updatedUser.email] = { password: FAKE_USERS[user.email]?.password || '', user: updatedUser };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    return null;
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      updateUser,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
