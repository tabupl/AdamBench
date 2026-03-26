import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          React + TypeScript Auth Demo
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          A demo application showcasing fake authentication, protected routes, a modern dashboard, and a public snake game.
        </p>
        <div className="mt-10 flex justify-center space-x-4 flex-wrap gap-4">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Login
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Dashboard (protected)
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            My Profile (protected)
          </Link>
          <Link
            to="/snake-game"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            🐍 Play Snake Game (public)
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 tracking-tight">Fake Authentication</h3>
                <p className="mt-2 text-base text-gray-500">
                  Simulated login with localStorage. No backend required.
                </p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 tracking-tight">Protected Routes</h3>
                <p className="mt-2 text-base text-gray-500">
                  Automatic redirect to login for unauthenticated users.
                </p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 tracking-tight">TypeScript & React</h3>
                <p className="mt-2 text-base text-gray-500">
                  Fully typed components and hooks for better developer experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;