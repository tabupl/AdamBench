/**
 * Application Routes
 * Defines all routes and their protected route requirements
 */

import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { PublicRoute, ProtectedRoute } from './routeComponents';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { TestAuthPage } from '../pages/TestAuthPage';

export const AppRoutes: React.FC = () => {
  return (
    <RouterRoutes>
      {/* Public Routes - Only accessible when NOT logged in */}
      <Route
        path="/test-auth"
        element={
          <PublicRoute>
            <TestAuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Only accessible when logged in */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<div style={{ padding: '2rem' }}>404 - Page Not Found</div>} />
    </RouterRoutes>
  );
};

export default AppRoutes;
