/**
 * User Profile Page
 * Allows users to view and edit their profile information
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/auth';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load user data when mounted
    const currentUser = useAuth().getCurrentUser();
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
    setIsLoaded(true);
  }, []);

  if (!user || !isLoaded) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Note: In a real app, you would call an API here
      // For now, we'll just update the local state
      console.log('Profile updated:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsEditing(false);
      // In a real app, you would update the auth state here
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.cardTitle}>
            {isEditing ? 'Edit Profile' : 'Profile Information'}
          </h2>
          {isEditing && (
            <div style={styles.buttonGroup}>
              <button 
                style={styles.saveButton} 
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                style={styles.cancelButton} 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}
          {!isEditing && (
            <button 
              style={styles.editButton} 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{
                ...styles.input,
                ...(isEditing ? { backgroundColor: 'white' } : { backgroundColor: '#f5f5f5' }),
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{
                ...styles.input,
                ...(isEditing ? { backgroundColor: 'white' } : { backgroundColor: '#f5f5f5' }),
              }}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={!isEditing || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              style={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </form>
      </div>

      <div style={styles.info}>
        <h3>Account Information</h3>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  saveButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  submitButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
  },
  info: {
    marginTop: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '1.5rem',
  },
};

export default ProfilePage;
