import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export function Profile() {
  const { user, updateProfile, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    name: user?.name ?? '',
    email: user?.email ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    clearError();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Only send changed fields
      const updates: Partial<FormData> = {};
      if (formData.name !== user?.name) updates.name = formData.name.trim();
      if (formData.email !== user?.email) updates.email = formData.email.trim();

      if (Object.keys(updates).length === 0) {
        setSuccessMessage('No changes to save');
        setIsSubmitting(false);
        return;
      }

      await updateProfile(updates);
      setSuccessMessage('Profile updated successfully!');
    } catch {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      
      // Clear field error on change
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      
      // Clear messages on change
      if (successMessage) setSuccessMessage(null);
      if (error) clearError();
    };

  const hasChanges = 
    formData.name !== user?.name || 
    formData.email !== user?.email;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Profile Settings</h2>
        <p className="subtitle">Manage your account information</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="avatar-info">
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form" noValidate>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message" role="status">
              {successMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Enter your name"
              disabled={isSubmitting}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && (
              <span className="field-error">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="Enter your email"
              disabled={isSubmitting}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting || !hasChanges}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {hasChanges && !isSubmitting && (
            <p className="unsaved-changes">You have unsaved changes</p>
          )}
        </form>
      </div>
    </div>
  );
}
