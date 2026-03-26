import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { icon: '👤', label: 'Name', value: user.name },
    { icon: '📧', label: 'Email', value: user.email },
    { icon: '🆔', label: 'User ID', value: user.id },
    { icon: '🔐', label: 'Status', value: 'Authenticated' },
  ];

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand"><h1>Dashboard</h1></div>
        <div className="navbar-right">
          <Link to="/profile" className="profile-link">Profile</Link>
          <span className="user-greeting">Hello, {user.name}!</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to Your Dashboard</h2>
          <p>You have successfully logged in to a protected route.</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.label}</h3>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="info-card">
          <h3>Protected Route</h3>
          <p>This page is protected by authentication. Only logged-in users can access this content.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
