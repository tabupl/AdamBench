import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p className="subtitle">Welcome to your dashboard, {user?.name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Views</h3>
            <p className="stat-value">12,543</p>
            <span className="stat-change positive">+12.5%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-value">1,234</p>
            <span className="stat-change positive">+8.2%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p className="stat-value">$45,678</p>
            <span className="stat-change negative">-2.4%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Orders</h3>
            <p className="stat-value">456</p>
            <span className="stat-change positive">+18.7%</span>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🛒</div>
            <div className="activity-content">
              <p>New order received</p>
              <span>2 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p>New user registered</p>
              <span>15 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💳</div>
            <div className="activity-content">
              <p>Payment processed</p>
              <span>1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📧</div>
            <div className="activity-content">
              <p>Newsletter sent</p>
              <span>3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
