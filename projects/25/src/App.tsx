import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { ProtectedRoute } from './components';
import { LoginPage, DashboardPage, ProfilePage, SnakePage } from './pages';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/snake" element={<SnakePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<SnakePage />} />
          <Route path="*" element={<SnakePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
