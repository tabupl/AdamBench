import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute component that protects routes.
 * If the user is authenticated, it renders the child routes (Outlet).
 * Otherwise, it redirects to the login page.
 */
const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, render the nested routes (Outlet)
  // If not authenticated, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;