import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <div style={styles.headerActions}>
          <Link to="/profile" style={styles.navLink}>Profile</Link>
          <button onClick={logout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Welcome, {user?.name}!</h2>
          <p style={styles.cardText}>
            You have successfully logged in. This is a protected route that only
            authenticated users can access.
          </p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>User Information</h2>
          <div style={styles.userInfo}>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>ID:</strong> {user?.id}</p>
          </div>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Quick Actions</h2>
          <div style={styles.actions}>
            <Link to="/profile" style={styles.actionLink}>Edit Profile</Link>
            <button style={styles.actionButton}>Settings</button>
            <button style={styles.actionButton}>Help</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  header: {
    backgroundColor: 'white',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  navLink: {
    color: '#1976d2',
    textDecoration: 'none',
    fontSize: '14px',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
  },
  cardText: {
    color: '#666',
    lineHeight: '1.6',
  },
  userInfo: {
    color: '#444',
    lineHeight: '2',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  actionLink: {
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    display: 'inline-block',
    fontSize: '14px',
  },
  actionButton: {
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
}
