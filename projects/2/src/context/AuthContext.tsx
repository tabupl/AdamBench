import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  { email: 'user@example.com', password: 'password123', name: 'Test User' },
  { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
];

const AUTH_TOKEN_KEY = 'auth_token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      try {
        setUser(JSON.parse(token));
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const mockUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!mockUser) {
      throw new Error('Invalid email or password');
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: mockUser.email,
      name: mockUser.name,
    };

    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(user));
    setUser(user);
  };

  const logout = (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
