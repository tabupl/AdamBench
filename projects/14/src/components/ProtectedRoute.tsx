import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  requiresAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiresAuth = true }) => {
  const { isAuthenticated, isLoading } = useAuth(null, 0);

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requiresAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
