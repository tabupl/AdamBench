import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>MyApp</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>Hello, {user?.name}</span>
          <button onClick={() => navigate('/profile')} style={styles.profileButton}>
            Profile
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Dashboard Overview</h2>
          <p style={styles.cardText}>
            Welcome to your dashboard, {user?.name}! You are successfully logged in.
          </p>
          
          <div style={styles.stats}>
            <div style={styles.statCard}>
              <span style={styles.statValue}>24</span>
              <span style={styles.statLabel}>Projects</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>156</span>
              <span style={styles.statLabel}>Tasks</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>12</span>
              <span style={styles.statLabel}>Team Members</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>98%</span>
              <span style={styles.statLabel}>Completion</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Recent Activity</h2>
          <ul style={styles.activityList}>
            <li style={styles.activityItem}>
              <span style={styles.activityDot}></span>
              <div>
                <strong>Project Alpha</strong> updated
                <span style={styles.activityTime}>2 hours ago</span>
              </div>
            </li>
            <li style={styles.activityItem}>
              <span style={styles.activityDot}></span>
              <div>
                <strong>New task</strong> assigned to you
                <span style={styles.activityTime}>5 hours ago</span>
              </div>
            </li>
            <li style={styles.activityItem}>
              <span style={styles.activityDot}></span>
              <div>
                <strong>Meeting</strong> scheduled for tomorrow
                <span style={styles.activityTime}>1 day ago</span>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    margin: 0,
    fontSize: '24px',
    color: '#3498db',
    fontWeight: 700,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userName: {
    color: '#333',
    fontSize: '14px',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  profileButton: {
    padding: '8px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  main: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    margin: '0 0 16px 0',
    fontSize: '20px',
    color: '#333',
  },
  cardText: {
    color: '#666',
    marginBottom: '24px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statCard: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statValue: {
    display: 'block',
    fontSize: '32px',
    fontWeight: 700,
    color: '#3498db',
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#666',
    marginTop: '4px',
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  activityDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#3498db',
    borderRadius: '50%',
    marginTop: '6px',
    flexShrink: 0,
  },
  activityTime: {
    display: 'block',
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
  },
};
