import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';


const DEMO_STATS = {
  totalUsers: 1234,
  activeSessions: 56,
  revenue: 45230,
  growth: 12.5,
};

const DEMO_ACTIVITIES = [
  { type: 'dashboard_view', icon: '📊', text: 'New dashboard view', time: '2 minutes ago' },
  { type: 'email_received', icon: '📧', text: 'New email received', time: '1 hour ago' },
  { type: 'settings_changed', icon: '⚙️', text: 'Settings updated', time: '3 hours ago' },
];

interface StatCardProps {
  label: string;
  value: string;
}

interface ActivityItemProps {
  type: string;
  icon: string;
  text: string;
  time: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className="stat-card">
    <h3>{label}</h3>
    <p className="stat-value">{value}</p>
  </div>
);

const ActivityItem: React.FC<ActivityItemProps> = ({ type, icon, text, time }) => {
  void type; // Mark as intentionally unused
  return (
    <div className="activity-item">
      <span className="activity-icon">{icon}</span>
      <span className="activity-text">{text}</span>
      <span className="activity-time">{time}</span>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth(null, 0);

  const handleLogout = () => {
    logout();
  };

  // Format stats
  const formattedStats = Object.entries(DEMO_STATS).map(([key, value]) => {
    const formattedValue = key === 'growth'
      ? `+${value}%`
      : key === 'revenue'
      ? `$${value.toLocaleString()}`
      : value.toLocaleString();
    return { key, value: formattedValue };
  });

  // Format activities
  const formattedActivities = DEMO_ACTIVITIES.map((activity) => ({
    ...activity,
    time: `${activity.time}`,
  }));

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </header>

        <main className="dashboard-main">
          <section className="welcome-section">
            <h2>Welcome, {user?.name}!</h2>
            <p>Email: {user?.email}</p>
          </section>

          <section className="stats-section">
            <StatCard label="Total Users" value={formattedStats[0].value} />
            <StatCard label="Active Sessions" value={formattedStats[1].value} />
            <StatCard label="Revenue" value={formattedStats[2].value} />
            <StatCard label="Growth" value={formattedStats[3].value} />
          </section>

          <section className="recent-activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {formattedActivities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </section>

          <section className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <Link to="/profile" className="action-btn">
                Profile Settings
              </Link>
              <Link to="/settings" className="action-btn">
                Account Settings
              </Link>
              <Link to="/reports" className="action-btn">
                View Reports
              </Link>
              <Link to="/analytics" className="action-btn">
                Analytics
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
