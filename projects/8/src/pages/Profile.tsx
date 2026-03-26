import { useAuth } from '../context/AuthContext';
import './Profile.css';

export function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">{user.username[0].toUpperCase()}</div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <span className="role-badge">{user.role}</span>
        </div>
      </div>

      <div className="profile-details">
        <h3>Account Details</h3>
        <div className="detail-row">
          <span className="detail-label">User ID</span>
          <span className="detail-value">{user.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email</span>
          <span className="detail-value">{user.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Role</span>
          <span className="detail-value">{user.role}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Member Since</span>
          <span className="detail-value">Jan 2024</span>
        </div>
      </div>
    </div>
  );
}
