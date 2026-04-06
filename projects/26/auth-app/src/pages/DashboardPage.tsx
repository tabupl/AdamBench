import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`rounded-full p-3 ${color} bg-opacity-10`}>
        <div className={`${color.replace('text-', 'text-')} opacity-75`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

export function DashboardPage(): JSX.Element {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // DEBUG
  if (user) {
    console.log('DashboardPage - User found:', user.email, 'User name:', user.name);
  } else {
    console.log('DashboardPage - No user found');
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Not Authenticated</h2>
          <p className="text-gray-600">Please log in to view the dashboard</p>
          <button onClick={() => navigate('/login')} className="mt-4 px-4 py-2 bg-primary text-white rounded">
            Login
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Projects',
      value: 12,
      icon: '📁',
      color: 'text-blue-600',
    },
    {
      title: 'Active Tasks',
      value: 8,
      icon: '📋',
      color: 'text-green-600',
    },
    {
      title: 'Team Members',
      value: 5,
      icon: '👥',
      color: 'text-purple-600',
    },
    {
      title: 'Hours This Week',
      value: 32.5,
      icon: '⏱️',
      color: 'text-orange-600',
    },
  ];

  const recentActivity = [
    { id: 1, user: 'Sarah M.', action: 'completed task', project: 'Website Redesign', time: '2 minutes ago' },
    { id: 2, user: 'Mike T.', action: 'created project', project: 'Mobile App', time: '1 hour ago' },
    { id: 3, user: 'Lisa K.', action: 'commented on', project: 'API Integration', time: '3 hours ago' },
    { id: 4, user: 'David R.', action: 'uploaded file', project: 'Marketing Campaign', time: '5 hours ago' },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">
              {user.name.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action} {activity.project}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage;