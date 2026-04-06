import React from 'react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  const { user, logout } = useAuth();

  // DEBUG
  console.log('Layout - Rendering with children:', children ? 'yes' : 'no');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">CoPaw Flash</span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">
                  {user.name.charAt(0) || 'U'}
                </div>
              </>
            )}
            <button
              onClick={handleLogout}
              className="ml-4 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;