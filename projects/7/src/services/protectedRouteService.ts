import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/auth';

export const protectedRouteService = {
  checkAuth: async (): Promise<{ isAuthenticated: boolean; user: User | null; role: 'user' | 'admin' }> => {
    const { authState } = useAuth();

    if (authState.isAuthenticated && authState.user) {
      return { isAuthenticated: true, user: authState.user, role: authState.user.role };
    } else {
      const navigate = useNavigate();
      const location = useLocation();

      if (authState.isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }

      return {
        isAuthenticated: false,
        user: null,
        role: 'user',
      };
    }
  },

  validateAuth: async (): Promise<boolean> => {
    const { authState } = useAuth();
    return authState.isAuthenticated && authState.user;
  },
};
