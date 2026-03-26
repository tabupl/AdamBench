import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Welcome() {
  const { isAuthenticated } = useAuth()

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to React Auth App</h1>
        <p style={styles.subtitle}>
          A simple authentication demo with a fun Snake game
        </p>

        <div style={styles.features}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔐</div>
            <h2 style={styles.featureTitle}>Authentication</h2>
            <p style={styles.featureText}>
              Secure login and registration system with protected routes
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🐍</div>
            <h2 style={styles.featureTitle}>Snake Game</h2>
            <p style={styles.featureText}>
              Play the classic Snake game - no login required!
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚙️</div>
            <h2 style={styles.featureTitle}>Profile</h2>
            <p style={styles.featureText}>
              Edit your profile information after logging in
            </p>
          </div>
        </div>

        <div style={styles.actions}>
          <Link to="/login" style={styles.primaryButton}>
            Login / Sign Up
          </Link>
          <Link to="/snake" style={styles.secondaryButton}>
            Play Snake Game
          </Link>
        </div>

        {isAuthenticated && (
          <div style={styles.dashboardLink}>
            <Link to="/dashboard" style={styles.dashboardLinkText}>
              Go to Dashboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Welcome

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    padding: '48px',
    width: '100%',
    maxWidth: '800px',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '40px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  featureCard: {
    padding: '24px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  featureText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
  actions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '14px 32px',
    backgroundColor: '#1976d2',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    padding: '14px 32px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  dashboardLink: {
    marginTop: '24px',
  },
  dashboardLinkText: {
    color: '#1976d2',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
}
