import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User } from '../types/auth';

interface Props {
  children: ReactNode;
}

export const ProtectedContext = ({ children }: Props) => {
  const { isAuthenticated, user, loading, error } = AuthContext;
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Authentication in progress...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="error-page">
        <h1>Authentication Required</h1>
        {error && <p className="error-message">{error}</p>}
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Login
        </button>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (user) {
    return (
      <div className="dashboard-page">
        <h1>Welcome, {user.username}</h1>
        {user.role === 'admin' && (
          <div className="admin-badge">Admin Access</div>
        )}
        <button onClick={() => navigate('/logout')} className="btn btn-danger">
          Logout
        </button>
      </div>
    );
  }

  return children;
};
