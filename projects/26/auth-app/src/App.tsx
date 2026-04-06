import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Layout } from './components/Layout';
import { useProtectedRoute } from './hooks/useProtectedRoute';

// Public route component wrapper
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isPublic } = useProtectedRoute({ requireAuth: false });

  // DEBUG: Log auth state
  if (isAuthenticated !== undefined) {
    console.log('PublicRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show children only if not authenticated
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Protected route component wrapper
const ProtectedRouteComponent = ({ 
  children, 
  requireAuth = true 
}: { 
  children: React.ReactNode; 
  requireAuth?: boolean; 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // DEBUG: Log auth state
  console.log('ProtectedRouteComponent - requireAuth:', requireAuth, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated and auth is required, redirect to login
  if (!requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If public route but user is authenticated, redirect to dashboard
  if (requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show children if not authenticated (for public routes)
  // or authenticated (for private routes)
  return <>{children}</>;
};

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route - login page */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected route - dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRouteComponent requireAuth={true}>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRouteComponent>
            }
          />

          {/* Redirect home to login */}
          <Route
            path="/"
            element={
              <Navigate to="/login" replace />
            }
          />

          {/* Catch-all redirect to login */}
          <Route
            path="*"
            element={
              <Navigate to="/login" replace />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;