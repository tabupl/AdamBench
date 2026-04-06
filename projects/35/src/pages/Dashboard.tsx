import { Link } from 'react-router-dom';
import { useAuth } from '../auth';

export function Dashboard() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>{user.name}</strong>!</p>
        </div>
        <div className="header-actions">
          <Link to="/profile" className="btn btn-outline">Profile</Link>
          <button onClick={logout} className="btn btn-outline">Sign Out</button>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Profile</h3>
          <div className="card-body">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{user.role}</span></p>
          </div>
        </div>

        <div className="card">
          <h3>Statistics</h3>
          <div className="card-body stats">
            <div className="stat"><span className="stat-value">1,284</span><span className="stat-label">Total Users</span></div>
            <div className="stat"><span className="stat-value">86%</span><span className="stat-label">Engagement</span></div>
            <div className="stat"><span className="stat-value">$12.4k</span><span className="stat-label">Revenue</span></div>
          </div>
        </div>

        <div className="card">
          <h3>Recent Activity</h3>
          <div className="card-body">
            <ul className="activity-list">
              <li>Login successful — 2 minutes ago</li>
              <li>Profile updated — 1 hour ago</li>
              <li>New feature enabled — 3 hours ago</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
