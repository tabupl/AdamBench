/**
 * Protected Route Component
 * Wraps routes that require authentication
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RouteOptions {
  requireAuth?: boolean;
  requireRole?: 'admin' | 'user';
}

export const ProtectedRoute = ({ requireAuth = true }: RouteOptions) => {
  const { isAuthenticated } = useAuth();

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isAuthenticated && requireAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const RequireAdmin = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const RequireNonAdmin = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role === 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
