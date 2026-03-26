import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {user?.name && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                )}
              </div>
              <Link
                to="/profile"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/snake"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Play Snake
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">
            You have successfully logged in to your dashboard. This is a protected route
            that requires authentication.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
            <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">$45,678</p>
            <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold text-purple-600">567</p>
            <p className="text-sm text-gray-500 mt-2">● 98% uptime</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">#{item}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      User activity #{item}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
