import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import SnakeGame from './pages/SnakeGame';

function App() {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/snakegame" element={<SnakeGame />} />
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
