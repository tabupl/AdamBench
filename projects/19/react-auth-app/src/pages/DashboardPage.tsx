import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthActions, useAuthState } from '../services/authService';
import '../styles/DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      
      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome, {user?.name || 'User'}!</h2>
          <p>You are successfully logged in.</p>
        </div>
        
        <div className="dashboard-content">
          <div className="card">
            <h3>Profile Information</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Name:</strong> {user?.name}</p>
            <Link to="/profile" className="profile-link">View Profile</Link>
          </div>
          
          <div className="card">
            <h3>Dashboard Features</h3>
            <ul>
              <li>View your profile information</li>
              <li>Manage your account settings</li>
              <li>Access protected content</li>
              <li>View your recent activity</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;