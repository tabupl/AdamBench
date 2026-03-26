import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProfileFormData {
  name: string;
  email: string;
}

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSave = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setIsSaving(true);

    try {
      // Update user in storage
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
      });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1>Profile Settings</h1>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
                disabled={isSaving}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              {isEditing ? (
                <>
                  <button type="submit" className="submit-btn" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ name: user?.name || '', email: user?.email || '' });
                      setError(null);
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>

          <div className="profile-info">
            <h3>Account Information</h3>
            <dl>
              <div className="info-row">
                <dt>ID</dt>
                <dd>12345</dd>
              </div>
              <div className="info-row">
                <dt>Role</dt>
                <dd>User</dd>
              </div>
              <div className="info-row">
                <dt>Member Since</dt>
                <dd>{new Date().toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
