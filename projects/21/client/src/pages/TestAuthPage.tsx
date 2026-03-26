/**
 * Test Page to verify auth state
 */

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../utils/authService';
import { clearAuth } from '../utils/authStorage';

export const TestAuthPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    console.log('TestAuthPage - Mounted');
    console.log('TestAuthPage - isAuthenticated:', isAuthenticated);
    console.log('TestAuthPage - user:', user);
    console.log('TestAuthPage - authService.getCurrentUser():', authService.getCurrentUser());
    console.log('TestAuthPage - localStorage auth_user:', localStorage.getItem('auth_user'));
    console.log('TestAuthPage - localStorage mock_users:', localStorage.getItem('mock_users'));
    
    // Clear auth and reload
    clearAuth();
    console.log('TestAuthPage - Auth cleared, reloading...');
    window.location.reload();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Auth Test Page</h1>
      <p>isAuthenticated: {isAuthenticated}</p>
      <p>user: {user?.email || 'null'}</p>
      <p>isLoading: {isLoading}</p>
    </div>
  );
};

export default TestAuthPage;
