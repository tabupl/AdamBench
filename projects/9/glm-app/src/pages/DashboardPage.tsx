import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface DashboardStats {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative'
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const [stats] = useState<DashboardStats[]>([
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+8.2%',
      changeType: 'positive',
    },
    {
      title: 'Active Sessions',
      value: '1,432',
      change: '-3.1%',
      changeType: 'negative',
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+0.8%',
      changeType: 'positive',
    },
  ])

  const [recentActivity] = useState([
    { id: 1, action: 'New user registration', user: 'Alice Johnson', time: '2 minutes ago' },
    { id: 2, action: 'Order completed', user: 'Bob Smith', time: '15 minutes ago' },
    { id: 3, action: 'Password reset requested', user: 'Carol White', time: '1 hour ago' },
    { id: 4, action: 'New subscription', user: 'David Brown', time: '2 hours ago' },
  ])

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here's what's happening with your account.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{formatTime(currentTime)}</p>
              <p className="text-xs text-gray-500">{formatDate(currentTime)}</p>
            </div>
            <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {currentTime.getHours()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                {stat.title}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stat.value}
              </dd>
              {stat.change && (
                <dd
                  className={`mt-1 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.changeType === 'positive' ? '↑' : '↓'} {stat.change}
                </dd>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-4 sm:p-6">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Go to Profile Settings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium text-sm">
                          {activity.user.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        by {activity.user}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage