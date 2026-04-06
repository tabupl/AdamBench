import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/auth.types';
import { FAKE_USERS } from '../data/users';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  initializeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'authToken';

function generateToken(userId: string): string {
  return `token-${userId}`;
}

function extractUserId(token: string): string | null {
  if (!token.startsWith('token-')) return null;
  return token.slice(6);
}

function findUserById(id: string): User | null {
  const user = FAKE_USERS.find(u => u.id === id);
  return user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null;
}

function findUserByEmail(email: string): typeof FAKE_USERS[number] | undefined {
  return FAKE_USERS.find(u => u.email === email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const userId = extractUserId(token);
      if (userId) {
        const foundUser = findUserById(userId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = findUserByEmail(email);

    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser;
      const token = generateToken(userWithoutPassword.id);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(userWithoutPassword);
    } else {
      throw new Error('Invalid email or password');
    }

    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        initializeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
