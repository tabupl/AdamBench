import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/authService';
import '../styles/ProfilePage.css';

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const { state, actions } = useAuth();
  const { updateUser } = actions;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (state.user) {
      setProfile({
        id: state.user.id,
        name: state.user.name,
        email: state.user.email
      });
      setEditedProfile({
        id: state.user.id,
        name: state.user.name,
        email: state.user.email
      });
    }
  }, [state.user]);

  const handleEdit = () => {
    if (profile) {
      setEditedProfile({ ...profile });
      setIsEditing(true);
      setError(null);
      setSuccess(null);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile({ ...profile });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!editedProfile || !profile) return;

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedProfile.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Update the user profile
      await updateUser(editedProfile);
      
      // Update local state
      setProfile({ ...editedProfile });
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [name]: value
      });
    }
  };

  if (!state.user) {
    return (
      <div className="profile-page">
        <div className="profile-content">
          <p>You must be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <h2>User Profile</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {isEditing && editedProfile ? (
          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedProfile.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedProfile.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="form-actions">
              <button onClick={handleSave} className="save-button">
                Save Changes
              </button>
              <button onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <div className="profile-field">
              <label>ID:</label>
              <span>{profile?.id}</span>
            </div>
            
            <div className="profile-field">
              <label>Name:</label>
              <span>{profile?.name}</span>
            </div>
            
            <div className="profile-field">
              <label>Email:</label>
              <span>{profile?.email}</span>
            </div>
            
            <button onClick={handleEdit} className="edit-button">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;