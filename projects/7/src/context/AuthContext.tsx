import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, AuthState, LoginFormData } from '../types/auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (data: LoginFormData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await mockAuth.login(data);
      const { token, user } = response;
      
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Login failed',
      }));
    }
  }, [mockAuth]);

  const logout = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
    }));
  }, []);

  const updateUser = useCallback((user: User) => {
    setAuthState(prev => ({
      ...prev,
      user,
      token: user?.id,
      isAuthenticated: true,
    }));
  }, []);

  const value = {
    login,
    logout,
    updateUser,
    authState,
    login: () => login(authState.authState),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
