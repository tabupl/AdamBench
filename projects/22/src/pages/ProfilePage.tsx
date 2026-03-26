import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProfilePage() {
  const { user, updateUser, logout, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Clear messages when form changes
  useEffect(() => {
    if (error || successMessage) {
      clearError();
      setSuccessMessage('');
    }
  }, [name, email, error, successMessage, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    const updateError = await updateUser({ name, email });

    if (!updateError) {
      setSuccessMessage('Profile updated successfully!');
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    clearError();
    setSuccessMessage('');
  };

  if (!user) {
    return null;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <div style={styles.headerRight}>
          <span style={styles.userName}>{user.name}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>Profile Settings</h1>
          <p style={styles.subtitle}>Update your personal information</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                placeholder="Your name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div style={styles.errorContainer}>
                <p style={styles.error}>{error.message}</p>
              </div>
            )}

            {successMessage && (
              <div style={styles.successContainer}>
                <p style={styles.success}>{successMessage}</p>
              </div>
            )}

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.infoCard}>
          <h2 style={styles.infoTitle}>Account Information</h2>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>User ID:</span>
            <span style={styles.infoValue}>{user.id}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Member Since:</span>
            <span style={styles.infoValue}>January 2024</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Account Status:</span>
            <span style={styles.statusBadge}>Active</span>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#3498db',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userName: {
    color: '#333',
    fontSize: '14px',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  main: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    color: '#333',
  },
  subtitle: {
    margin: '0 0 32px 0',
    color: '#666',
    fontSize: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  errorContainer: {
    padding: '12px',
    backgroundColor: '#fdf2f2',
    borderRadius: '4px',
    border: '1px solid #fecaca',
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    margin: '0',
  },
  successContainer: {
    padding: '12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '4px',
    border: '1px solid #bbf7d0',
  },
  success: {
    color: '#16a34a',
    fontSize: '14px',
    margin: '0',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  infoTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    color: '#333',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  infoLabel: {
    color: '#666',
    fontSize: '14px',
  },
  infoValue: {
    color: '#333',
    fontSize: '14px',
    fontWeight: 500,
  },
  statusBadge: {
    padding: '4px 12px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  },
};
