import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState({ name: '', email: '' })

  React.useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = () => {
    if (user) {
      updateUser({ ...user, ...formData })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({ name: user.name, email: user.email })
      setIsEditing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">No user logged in</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10 text-center">
            <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-blue-100">{user.email}</p>
          </div>

          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{user.email}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
