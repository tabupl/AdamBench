import { Link } from 'react-router-dom';
import { useAuth } from './auth';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <Link to="/profile" className="profile-link">
            <div className="user-avatar">{user?.name?.[0] || 'U'}</div>
            <span>{user?.name}</span>
          </Link>
          <button onClick={logout} className="logout-button">Sign Out</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.name}!</h2>
          <p>Logged in as {user?.email}</p>
        </div>

        <div className="stats-grid">
          {[
            { label: 'Projects', value: 12 },
            { label: 'Tasks', value: 48 },
            { label: 'Team Members', value: 8 },
            { label: 'Completed', value: 156 },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <h3>{s.label}</h3>
              <span className="stat-number">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            {[
              { text: 'Project "Alpha" was created', time: '2 hours ago' },
              { text: 'Task #42 was completed', time: '4 hours ago' },
              { text: 'New team member joined', time: '1 day ago' },
              { text: 'Project "Beta" milestone reached', time: '2 days ago' },
            ].map((a, i) => (
              <li key={i}>
                <span className="activity-dot" />
                {a.text}
                <span className="activity-time">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
