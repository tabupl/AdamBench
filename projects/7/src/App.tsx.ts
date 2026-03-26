import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedContext from './context/ProtectedContext';
import { protectedRouteService } from './services/protectedRouteService';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoutePage from './pages/ProtectedRoutePage';
import DashboardPage from './pages/DashboardPage';
import './styles/main.css';

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  const handleLogin = async (credentials: { username: string; password: string }) => {
    async mockAuth.login(credentials);
  };

  return (
    <Router>
      <AuthProvider>
        <ProtectedContext>
          <Routes>
            <Route
              path="/login"
              element={
                <LoginPage
                  handleLogin={handleLogin}
                  onSubmit={async () => {
                    await handleLogin({ username: '', password: '' });
                  }}
                />
              }
            />
            <Route
              path="/register"
              element={
                <RegisterPage
                  handleLogin={handleLogin}
                  onSubmit={async () => {
                    await handleLogin({ username: '', password: '' });
                  }}
                />
              }
            />
            <Route
              element={
                <ProtectedRoutePage
                  handleLogin={handleLogin}
                  handleLogout={async () => {
                    await protectedRouteService.checkAuth();
                    await () => {
                      // Call logout from AuthContext
                    };
                    // Reset protected route page
                    window.location.href = '/login';
                  }}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  handleLogout={async () => {
                    await protectedRouteService.checkAuth();
                    await () => {
                      // Call logout from AuthContext
                    };
                    window.location.href = '/login';
                  }}
                />
              }
            />
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </ProtectedContext>
      </AuthProvider>
    </Router>
  );
}

export default App;
