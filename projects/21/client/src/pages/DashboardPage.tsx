/**
 * Dashboard Page Component
 * Main user dashboard
 */

import { useAuth } from '../context/AuthContext';

interface UserStats {
  label: string;
  value: string;
  icon: string;
  color?: string;
}

export const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();

  const stats: UserStats[] = [
    { label: 'User ID', value: user?.id || 'N/A', icon: '👤' },
    { label: 'Email', value: user?.email || 'N/A', icon: '📧' },
    { label: 'Authentication Status', value: isAuthenticated ? 'Authenticated' : 'Not Authenticated', icon: '🔒', color: isAuthenticated ? 'success' : 'warning' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-card">
            <h2>Welcome, {user?.name || 'User'}!</h2>
            <p>Welcome to your dashboard. This is where you can see your account information and manage your settings.</p>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className={`stat-icon ${stat.color ? `stat-icon-${stat.color}` : ''}`}>{stat.icon}</div>
                <div className="stat-info">
                  <span className="stat-label">{stat.label}</span>
                  <span className={`stat-value ${stat.color ? `stat-value-${stat.color}` : ''}`}>{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="role-section">
            <h3>Your Role</h3>
            <p className="role-badge">{user?.role || 'Unknown'}</p>
            <p>
              {user?.role === 'admin' 
                ? 'You have full administrative access to the system.' 
                : 'You have standard user access to the system.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
