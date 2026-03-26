import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ name: '', email: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState({ name: '', email: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email })
      setOriginalData({ name: user.name, email: user.email })
    }
  }, [user])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleEdit = () => setIsEditing(true)

  const handleCancel = () => {
    setFormData({ name: originalData.name, email: originalData.email })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      await updateProfile(formData.name, formData.email)
      setOriginalData({ name: formData.name, email: formData.email })
      setIsEditing(false)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Profile Settings</h1>
          <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
        <button onClick={logout} style={styles.logoutButton}>Logout</button>
      </header>
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Personal Information</h2>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={isEditing ? styles.input : styles.readonlyInput}
                disabled={!isEditing}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={isEditing ? styles.input : styles.readonlyInput}
                disabled={!isEditing}
                required
              />
            </div>
            <div style={styles.buttonGroup}>
              {!isEditing ? (
                <button type="button" onClick={handleEdit} style={styles.editButton}>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button type="submit" style={styles.saveButton} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Account Details</h2>
          <div style={styles.infoGroup}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>User ID:</span>
              <span style={styles.infoValue}>{user.id}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email:</span>
              <span style={styles.infoValue}>{user.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Name:</span>
              <span style={styles.infoValue}>{user.name}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  readonlyInput: {
    padding: '12px',
    border: '1px solid #eee',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#f8f9fa',
    color: '#666',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  editButton: {
    padding: '12px 24px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  saveButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  infoLabel: {
    fontWeight: '500',
    color: '#666',
  },
  infoValue: {
    color: '#333',
  },
}
