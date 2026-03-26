import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, {user?.username}!</h2>
        <p>Here's what's happening with your projects today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-content">
            <span className="stat-value">24</span>
            <span className="stat-label">Projects</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div className="stat-content">
            <span className="stat-value">1,234</span>
            <span className="stat-label">Stars</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💬</span>
          <div className="stat-content">
            <span className="stat-value">56</span>
            <span className="stat-label">Issues</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔗</span>
          <div className="stat-content">
            <span className="stat-value">892</span>
            <span className="stat-label">Commits</span>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">2h ago</span>
            <span>Pushed to main branch</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">5h ago</span>
            <span>Opened issue #42</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">1d ago</span>
            <span>Created new project</span>
          </div>
        </div>
      </div>
    </div>
  );
}
