/**
 * Admin Dashboard Page Component
 * Admin-only dashboard with restricted features
 */

import { useAuth } from '../context/AuthContext';

interface AdminCard {
  title: string;
  description: string;
}

const adminCards: AdminCard[] = [
  { title: 'User Management', description: 'Manage all users in the system' },
  { title: 'System Settings', description: 'Configure system-wide settings' },
  { title: 'Activity Logs', description: 'View all user activity' },
  { title: 'Security', description: 'Manage security settings' },
];

export const AdminDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-badge">Admin Access</div>
        </header>

        <div className="admin-content">
          <div className="admin-cards">
            {adminCards.map((card) => (
              <div key={card.title} className="admin-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>

          <div className="admin-section">
            <h3>Admin Features</h3>
            <ul>
              <li>✅ Create and manage users</li>
              <li>✅ Assign roles and permissions</li>
              <li>✅ View system-wide analytics</li>
              <li>✅ Manage security settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
