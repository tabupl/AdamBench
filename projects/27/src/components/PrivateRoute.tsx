/**
 * Private Route
 * Protects routes requiring authentication
 */

import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import type { ReactNode } from 'react';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};