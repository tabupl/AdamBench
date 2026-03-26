import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="auth-loading"><div className="spinner"></div><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Welcome, {user?.name || user?.email.split('@')[0] || 'User'}! 👋</h2>
          <p className="description">
            This is your personalized dashboard. You can navigate to your
            profile to edit your information.
          </p>

          <div className="dashboard-actions">
            <Link to="/profile" className="btn btn-primary">
              View Profile
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="action-grid">
            <div className="action-item">
              <span className="action-icon">📊</span>
              <span>View Statistics</span>
            </div>
            <div className="action-item">
              <span className="action-icon">⚙️</span>
              <span>Settings</span>
            </div>
            <div className="action-item">
              <span className="action-icon">📧</span>
              <span>Notifications</span>
            </div>
            <div className="action-item">
              <span className="action-icon">💳</span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Account Summary</h3>
          <dl className="account-summary">
            <div className="summary-row">
              <dt>User ID</dt>
              <dd>12345</dd>
            </div>
            <div className="summary-row">
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div className="summary-row">
              <dt>Role</dt>
              <dd>User</dd>
            </div>
            <div className="summary-row">
              <dt>Member Since</dt>
              <dd>{new Date().toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <div className="dashboard-card">
          <h3>Need Help?</h3>
          <p className="help-text">
            If you have any questions or need assistance, please don't
            hesitate to reach out to our support team.
          </p>
          <button className="btn btn-secondary" onClick={() => window.alert('Contact support!')}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
