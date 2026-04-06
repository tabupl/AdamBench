import { useState, useCallback, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

interface UserProfileFormData {
  name: string;
  email: string;
}

export function UserProfilePage() {
  const navigate = useNavigate();
  const { user, updateUserProfile, isLoading } = useAuth();

  const [formData, setFormData] = useState<UserProfileFormData>({
    name: '',
    email: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateUserProfile({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      });
      setSaveSuccess(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setIsSaving(false);
    }
  }, [formData, updateUserProfile]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>User Profile</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="logout-button"
            style={{ backgroundColor: '#e0e0e0', color: '#333' }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Edit Your Profile</h2>
          <p>Update your personal information below</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              disabled={isSaving || isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={isSaving || isLoading}
              required
            />
          </div>

          {saveSuccess && (
            <div className="success-message">Profile updated successfully!</div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isSaving || isLoading}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="profile-info-section">
          <h3>Current Profile</h3>
          <div className="profile-info-card">
            <div className="info-row">
              <span className="info-label">Username</span>
              <span className="info-value">{user.username}</span>
            </div>
            <div className="info-row">
              <span className="info-label">User ID</span>
              <span className="info-value" style={{ fontFamily: 'monospace' }}>
                {user.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
