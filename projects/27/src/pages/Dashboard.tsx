/**
 * Dashboard Page
 */

import { useAuthContext } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Logout?')) logout();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Dashboard</h1>
            <button onClick={() => navigate('/profile')} className="btn btn-primary btn-sm">
              Profile
            </button>
          </div>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>

        <div className="dashboard-user">
          <div className="user-avatar">{user?.username?.charAt(0).toUpperCase() || '?'}</div>
          <div className="user-info">
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <h3>Total Users</h3>
            <p>1,234</p>
          </div>
          <div className="stat-card stat-green">
            <h3>Revenue</h3>
            <p>¥45,678</p>
          </div>
          <div className="stat-card stat-orange">
            <h3>Pending Orders</h3>
            <p>23</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Recent Activity</h2>
        <ul className="activity-list">
          <li className="activity-completed">Order #1234</li>
          <li className="activity-pending">Order #1233</li>
          <li className="activity-completed">Order #1232</li>
          <li className="activity-cancelled">Order #1231</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;