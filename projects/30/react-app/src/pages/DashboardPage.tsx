import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span className="user-greeting">
              Hello, <strong>{user.name || user.username}</strong>
            </span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="profile-button"
            onClick={() => navigate('/profile')}
            disabled={isLoading}
          >
            Profile
          </button>
          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <h2>Welcome to your dashboard</h2>
          <p>This is a protected page. Only authenticated users can access it.</p>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <h3>Profile</h3>
            <p className="stat-value">{user.id.slice(0, 8)}...</p>
            <span className="stat-label">User ID</span>
          </div>

          <div className="stat-card">
            <h3>Username</h3>
            <p className="stat-value">{user.username}</p>
            <span className="stat-label">Account</span>
          </div>

          <div className="stat-card">
            <h3>Email</h3>
            <p className="stat-value">{user.email}</p>
            <span className="stat-label">Contact</span>
          </div>

          <div className="stat-card">
            <h3>Name</h3>
            <p className="stat-value">{user.name || 'Not set'}</p>
            <span className="stat-label">Display Name</span>
          </div>
        </section>

        <section className="features-section">
          <h2>Features</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <h4>Secure Authentication</h4>
              <p>Protected routes with fake authentication</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <h4>User Dashboard</h4>
              <p>View your account information</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👤</span>
              <h4>User Profile</h4>
              <p>Edit your name and email</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <h4>React + TypeScript</h4>
              <p>Modern frontend stack</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
