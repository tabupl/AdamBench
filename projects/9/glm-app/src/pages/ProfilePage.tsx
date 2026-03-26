import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProfilePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required')
      setIsSaving(false)
      return
    }

    try {
      // Update user in localStorage directly
      localStorage.setItem('authUser', JSON.stringify({
        ...user,
        name: formData.name,
        email: formData.email
      }))

      setIsEditing(false)
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    })
    setError('')
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Please login to view your profile
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-6 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your personal information
            </p>
          </div>

          <div className="px-4 py-6 sm:px-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="space-y-6">
                {/* User Info Card */}
                {!isEditing ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="mt-1 text-sm text-blue-600">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  /* Edit Form */
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}