import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Quick Links</h2>
        <Link to="/snake" style={{ display: 'block', padding: '1rem', background: '#6366f1', color: '#fff', borderRadius: '8px', textDecoration: 'none', marginBottom: '0.5rem' }}>
          🐍 Play Snake Game
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
