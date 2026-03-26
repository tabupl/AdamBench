import { useAuthContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Dashboard</div>
        <div className={styles.navLinks}>
          <button onClick={() => navigate('/profile')} className={styles.navLink}>Profile</button>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.welcome}>
          <h1>Welcome back, {user?.name}!</h1>
          <p>You have successfully logged in to your account.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Profile</h3>
            <div className={styles.info}>
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>ID:</strong> {user?.id}</p>
            </div>
            <button onClick={() => navigate('/profile')} className={styles.editBtn}>Edit Profile</button>
          </div>

          <div className={styles.card}>
            <h3>Statistics</h3>
            <div className={styles.stats}>
              <div><span className={styles.statValue}>128</span><span className={styles.statLabel}>Tasks</span></div>
              <div><span className={styles.statValue}>12</span><span className={styles.statLabel}>Projects</span></div>
              <div><span className={styles.statValue}>5</span><span className={styles.statLabel}>Reports</span></div>
            </div>
          </div>

          <div className={styles.card}>
            <h3>Activity</h3>
            <ul className={styles.list}>
              <li>Completed task review</li>
              <li>Submitted quarterly report</li>
              <li>Updated project timeline</li>
              <li>Reviewed team assignments</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Quick Actions</h3>
            <div className={styles.actions}>
              <button className={styles.actionBtn}>New Task</button>
              <button className={styles.actionBtn}>Generate Report</button>
              <button className={styles.actionBtn}>View Projects</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
