import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { protectedRouteService } from '../services/protectedRouteService';
import { User } from '../types/auth';

const ProtectedRoutePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await protectedRouteService.checkAuth();
    await logout();
    navigate('/login', { replace: true });
  };

  const handleUpdateRole = async (newRole: 'user' | 'admin') => {
    await updateUser({
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: newRole,
    });
    navigate('/dashboard', { replace: true });
  };

  if (user) {
    return (
      <div className="dashboard-page">
        <h1>User Dashboard</h1>
        <p>Logged in as: {user.username}</p>
        <button onClick={() => handleUpdateRole('user')} className="btn btn-secondary">
          Change to User Role
        </button>
        <button onClick={() => handleUpdateRole('admin')} className="btn btn-primary">
          Change to Admin Role
        </button>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Authentication Required</h1>
        <p>Please authenticate to access this page</p>

        <div className="auth-form">
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="btn btn-primary"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register', { replace: true })}
            className="btn btn-secondary"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoutePage;
