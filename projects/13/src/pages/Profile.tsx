import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Navigation } from '../components/Navigation';

interface ProfileFormData {
  name: string;
  email: string;
}

/**
 * Profile Page
 * 
 * Allows users to view and edit their profile information.
 * Changes are saved to localStorage and reflected in the auth state.
 */
export function Profile(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [formData, setFormData] = useState<ProfileFormData>({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Validate form data
      if (!formData.name || formData.name.trim().length < 2) {
        setSaveError('Name must be at least 2 characters');
        setIsSaving(false);
        return;
      }

      if (!formData.email || !formData.email.includes('@')) {
        setSaveError('Please enter a valid email address');
        setIsSaving(false);
        return;
      }

      // Save to localStorage
      const updatedUser = {
        ...user!,
        name: formData.name.trim(),
        email: formData.email.trim(),
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update auth state
      // Note: In a real app, you'd need to update the context provider
      // For now, we'll reload the user from localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        localStorage.setItem('user', JSON.stringify({ ...parsedUser, id: user!.id }));
      }

      // Reload user from storage
      const newUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (newUser) {
        // This is a workaround to update the user state
        // In a real app, we'd need to update the context or use a different approach
        setFormData({ name: newUser.name, email: newUser.email });
      }

      setSaveSuccess(true);
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ name: user!.name, email: user!.email });
    setIsEditing(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container">
      <Navigation />
      <div className="card">
        <div className="card-header">
          <h2>
            My Profile
            {saveSuccess && <span className="success-badge">✓ Saved</span>}
          </h2>
        </div>

        <div className="profile-avatar">
          <img
            src={user?.avatar}
            alt={`${user?.name}'s avatar`}
            className="avatar-large"
          />
        </div>

        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your full name"
              className={isEditing ? '' : 'read-only'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your email"
              className={isEditing ? '' : 'read-only'}
            />
          </div>

          {saveError && (
            <div className="error-message">{saveError}</div>
          )}

          <div className="form-actions">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>

        <div className="profile-info">
          <h3>Account Information</h3>
          <div className="info-row">
            <span className="info-label">User ID:</span>
            <span className="info-value">{user?.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Name:</span>
            <span className="info-value">{user?.name}</span>
          </div>
        </div>

        <div className="card-actions">
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
