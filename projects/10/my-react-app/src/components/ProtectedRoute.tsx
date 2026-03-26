import { Navigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import type { JSX } from 'react';

interface Props {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: Props) => {
  const isAuthenticated = authService.getState().isAuthenticated;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};