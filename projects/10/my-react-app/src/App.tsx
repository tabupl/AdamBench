import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import ProfilePage from './pages/Profile';
import SnakeGame from './pages/Snake';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
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
          <Route
            path="/snake"
            element={
              <ErrorBoundary>
                <SnakeGame />
              </ErrorBoundary>
            }
          />
          {/* redirect any other path to login */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;