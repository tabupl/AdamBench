import { useAuth } from '../hooks/useAuth';
import { AuthButton } from '../components/AuthButton';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return null; // This should never happen due to ProtectedRoute, but just in case
  }

  const dashboardCards = [
    {
      title: 'Analytics',
      description: 'View your data insights',
      icon: '📊',
      color: 'bg-blue-500'
    },
    {
      title: 'Users', 
      description: 'Manage user accounts',
      icon: '👥',
      color: 'bg-green-500'
    },
    {
      title: 'Security',
      description: 'Monitor security settings',
      icon: '🔒',
      color: 'bg-yellow-500'
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: '⚙️',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <div className="hidden md:flex ml-6 space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 p-2"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
              <div className="hidden md:block ml-4">
                <AuthButton variant="secondary" size="sm" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/dashboard" 
                className="text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <AuthButton variant="secondary" size="sm" fullwidth={true} />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to Your Dashboard</h2>
              
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-sm text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">User ID:</span>
                    <p className="text-sm text-gray-900">{user.id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <p className="text-sm text-green-600">Authenticated</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {dashboardCards.map((card, index) => (
                  <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                          <span className="text-white text-xl">{card.icon}</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                          <p className="text-sm text-gray-500">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Getting Started</h3>
                <p className="text-blue-700">
                  This is a demo dashboard built with React + TypeScript. You can customize this page 
                  with your actual application features and components.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};