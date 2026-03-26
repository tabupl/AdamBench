import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

interface User {
  email: string;
  name: string;
}

const STORAGE_KEY = 'auth_user';

// Fake users database
const USERS = [
  { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
  { email: 'user@example.com', password: 'user123', name: 'Test User' },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await delay(800);
    const found = USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const u = { email: found.email, name: found.name };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(async (name: string, email: string) => {
    await delay(500);
    if (!user) return false;
    const updated = { ...user, name, email };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
