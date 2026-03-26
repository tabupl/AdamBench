import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullwidth?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  className = '',
  fullwidth = false
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
      case 'secondary':
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      default:
        return 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
    }
  };

  const getSizeClasses = () => {
    let sizeClasses = '';
    switch (size) {
      case 'sm':
        sizeClasses = 'px-3 py-1 text-sm';
        break;
      case 'md':
        sizeClasses = 'px-4 py-2 text-sm';
        break;
      case 'lg':
        sizeClasses = 'px-6 py-3 text-base';
        break;
      default:
        sizeClasses = 'px-4 py-2 text-sm';
    }
    
    if (fullwidth) {
      sizeClasses += ' w-full';
    }
    
    return sizeClasses;
  };

  const baseClasses = `inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getVariantClasses()} ${getSizeClasses()} ${className}`;

  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className={baseClasses}
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">
        Welcome, {user.name}
      </span>
      <button
        onClick={handleLogout}
        className={baseClasses}
      >
        Sign Out
      </button>
    </div>
  );
};