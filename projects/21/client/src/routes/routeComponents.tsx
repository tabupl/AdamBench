/**
 * Route Components
 * Provides protected route wrappers for authentication
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute - Redirects to login if already authenticated
 */
export const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  console.log('PublicRoute - Component mounted');
  console.log('PublicRoute - isAuthenticated:', isAuthenticated);
  console.log('PublicRoute - children:', children?.type?.name);
  
  if (isAuthenticated) {
    console.log('PublicRoute - Redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('PublicRoute - Rendering children');
  return <>{children}</>;
};

/**
 * ProtectedRoute - Redirects to login if not authenticated
 */
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  console.log('ProtectedRoute - Component mounted');
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - children:', children?.type?.name);
  
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute - Rendering children');
  return <>{children}</>;
};
