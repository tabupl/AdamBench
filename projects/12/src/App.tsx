import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SnakeGame from './pages/SnakeGame';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/snake" element={<SnakeGame />} />
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
    </Routes>
  );
};

export default App;
