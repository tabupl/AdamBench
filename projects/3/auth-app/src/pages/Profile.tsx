import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, isLoading, error } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({ name, email });
    } catch {
      // Error handled by context
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p className="subtitle">Manage your account information</p>
      </div>

      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error.message}</div>}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="profile-info">
          <h3>Account Information</h3>
          <div className="info-row">
            <span className="info-label">User ID:</span>
            <span className="info-value">{user.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Current Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
