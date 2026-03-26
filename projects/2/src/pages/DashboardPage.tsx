import { useAuth } from '../context/AuthContext';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

   return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.headerActions}>
          <span className={styles.welcome}>
            Welcome, <strong>{user?.name}</strong>
          </span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <h2 className={styles.welcomeHeading}>Welcome to your Dashboard!</h2>
          <p className={styles.welcomeText}>
            This is a protected page. Only authenticated users can access this content.
          </p>
        </section>

        <section className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📧</div>
            <h3 className={styles.cardTitle}>Email</h3>
            <p className={styles.cardValue}>{user?.email}</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>👤</div>
            <h3 className={styles.cardTitle}>Name</h3>
            <p className={styles.cardValue}>{user?.name}</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🔒</div>
            <h3 className={styles.cardTitle}>Status</h3>
            <p className={styles.cardValue}>Authenticated</p>
          </div>
        </section>

        <section className={styles.info}>
          <h3 className={styles.infoTitle}>About this demo</h3>
          <p className={styles.infoText}>
            This is a React + TypeScript application with fake authentication.
            It demonstrates protected routes, React Context for state management,
            and React Router for navigation.
          </p>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
