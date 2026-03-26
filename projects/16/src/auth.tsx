import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const AUTH_KEY = 'auth_user';

export interface User {
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredUser = (): User | null => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

const saveUser = (user: User) => localStorage.setItem(AUTH_KEY, JSON.stringify(user));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = async ({ email, password }: LoginCredentials) => {
    await delay(400);

    if (!email || !password) throw new Error('Email and password are required');
    if (password.length < 4) throw new Error('Invalid credentials');

    const loggedInUser: User = { name: email.split('@')[0] || 'User', email };
    saveUser(loggedInUser);
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const updateProfile = ({ name, email }: UpdateProfileData) => {
    if (!name.trim() || !email.trim()) throw new Error('Name and email are required');
    if (!user) throw new Error('Not authenticated');

    const updatedUser = { ...user, name: name.trim(), email: email.trim() };
    saveUser(updatedUser);
    setUser(updatedUser);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout, updateProfile }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
