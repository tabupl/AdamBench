import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UseProtectedRouteOptions {
  requireAuth: boolean;
}

interface UseProtectedRouteReturn {
  isAuthorized: boolean;
  error: string | null;
  isPublic: boolean;
}

export function useProtectedRoute({
  requireAuth,
}: UseProtectedRouteOptions): UseProtectedRouteReturn {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const path = location.pathname;
  const isPublic = path === '/' || path === '/login' || path.startsWith('/login');

  // For public routes (login page), always authorize
  if (isPublic) {
    return { isAuthorized: true, error: null, isPublic: true };
  }

  // For all other routes, check authentication
  if (!isPublic) {
    if (isAuthenticated) {
      return { isAuthorized: true, error: null, isPublic: false };
    } else {
      return { isAuthorized: false, error: 'Authentication required', isPublic: false };
    }
  }

  return { isAuthorized: true, error: null, isPublic: isPublic };
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps): React.ReactElement {
  const { isAuthorized, error } = useProtectedRoute({ requireAuth });

  if (error) {
    return React.createElement(
      'div',
      { className: 'flex min-h-screen items-center justify-center' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('h2', { className: 'text-2xl font-bold mb-2' }, 'Access Denied'),
        React.createElement('p', { className: 'text-gray-600' }, error),
        React.createElement('button', { onClick: () => window.location.reload(), className: 'mt-4 px-4 py-2 bg-primary text-white rounded' }, 'Reload Page')
      )
    );
  }

  // For protected routes, only show children if authenticated
  if (!isAuthorized && requireAuth) {
    // Redirect to login for protected routes
    return React.createElement('Navigate', { to: '/login', replace: true });
  }

  return React.createElement('div', null, children);
}