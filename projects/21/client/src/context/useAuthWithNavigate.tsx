/**
 * Auth Hook with Navigation
 * Provides authentication state and navigation helpers
 * Must be used within a Router context
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { authService } from '../utils/authService';

export const useAuthWithNavigate = () => {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();
  const navigate = useNavigate();

  console.log('useAuthWithNavigate - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  const loginWithRedirect = async (credentials: { email: string; password: string }) => {
    try {
      console.log('useAuthWithNavigate.loginWithRedirect - Attempting login');
      await login(credentials);
      
      // Get the current user to check role for redirection
      const currentUser = authService.getCurrentUser();
      console.log('useAuthWithNavigate.loginWithRedirect - User after login:', currentUser);
      
      // Navigate based on role
      const targetRoute = localStorage.getItem('targetRoute') || '/dashboard';
      console.log('useAuthWithNavigate.loginWithRedirect - Navigating to:', targetRoute);
      navigate(targetRoute);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logoutWithRedirect = () => {
    console.log('useAuthWithNavigate.logoutWithRedirect - Calling logout');
    logout();
    // Redirect to login page
    navigate('/login');
  };

  const targetRoute = () => {
    return localStorage.getItem('targetRoute') || null;
  };

  return {
    ...useAuth(),
    loginWithRedirect,
    logoutWithRedirect,
    targetRoute,
  };
};

export default useAuthWithNavigate;
