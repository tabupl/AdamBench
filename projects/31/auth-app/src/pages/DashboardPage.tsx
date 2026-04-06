import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%' },
    { label: 'Revenue', value: '$45,678', change: '+8%' },
    { label: 'Active Sessions', value: '567', change: '+23%' },
    { label: 'Conversion Rate', value: '3.2%', change: '-1%' },
  ];

  const recentActivity = [
    { id: 1, action: 'New user registered', time: '2 minutes ago' },
    { id: 2, action: 'Payment received', time: '15 minutes ago' },
    { id: 3, action: 'Report generated', time: '1 hour ago' },
    { id: 4, action: 'Settings updated', time: '3 hours ago' },
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
          <span className={`role-badge ${user?.role}`}>{user?.role}</span>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <span className="nav-icon">📊</span>
            Overview
          </Link>
          <Link to="/profile" className="nav-item">
            <span className="nav-icon">👤</span>
            My Profile
          </Link>
          <a href="#" className="nav-item">
            <span className="nav-icon">👥</span>
            Users
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">💰</span>
            Analytics
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">⚙️</span>
            Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <span className="nav-icon">🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Welcome, {user?.name}!</h1>
            <p className="header-subtitle">Here's what's happening with your account</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat.label}</h3>
                <p className="stat-value">{stat.value}</p>
                <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              </div>
            ))}
          </section>

          <section className="activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn primary">New Report</button>
              <button className="action-btn secondary">Add User</button>
              <button className="action-btn secondary">Export Data</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
