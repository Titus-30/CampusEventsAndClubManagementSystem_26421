import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './auth/Login';
import Signup from './auth/Signup';
import ForgotPassword from './auth/ForgotPassword';
import LandingPage from './pages/LandingPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Clubs from './pages/Clubs';
import Announcements from './pages/Announcements';
import Users from './pages/Users';
import Locations from './pages/Locations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Loading Screen
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4 mx-auto"></div>
      <p className="text-white text-xl font-semibold">Loading Campus Events...</p>
    </div>
  </div>
);

// Landing Page Wrapper
const LandingPageWrapper = () => {
  const navigate = useNavigate();
  return <LandingPage onNavigate={(screen) => navigate(`/${screen}`)} />;
};

// Auth Wrapper Components
const LoginWrapper = () => {
  const navigate = useNavigate();
  return <Login onNavigate={(screen) => {
    if (screen === 'forgot') {
      navigate('/forgot-password');
    } else {
      navigate(`/${screen}`);
    }
  }} />;
};

const SignupWrapper = () => {
  const navigate = useNavigate();
  return <Signup onNavigate={(screen) => navigate(`/${screen}`)} />;
};

const ForgotPasswordWrapper = () => {
  const navigate = useNavigate();
  return <ForgotPassword onNavigate={(screen) => navigate(`/${screen}`)} />;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main Application Layout
const MainApp = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract highlightedId from URL params
  const getHighlightedId = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('highlight') || null;
  };

  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Navigate from search results
  const handleGlobalSearchResultClick = (type, id) => {
    let path = '/';
    switch (type) {
      case 'Event':
        path = '/events';
        break;
      case 'Club':
        path = '/clubs';
        break;
      case 'User':
        path = '/users';
        break;
      default:
        path = '/dashboard';
    }

    // Navigate with highlighted ID in URL
    if (id) {
      navigate(`${path}?highlight=${id}`);
    } else {
      navigate(path);
    }
  };

  // Get current page from pathname for sidebar highlighting
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('/events')) return 'events';
    if (path.includes('/clubs')) return 'clubs';
    if (path.includes('/announcements')) return 'announcements';
    if (path.includes('/users')) return 'users';
    if (path.includes('/locations')) return 'locations';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={getCurrentPage()}
        onNavigate={(page) => navigate(`/${page === 'dashboard' ? '' : page}`)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <TopBar
          onToggleSidebar={handleToggleSidebar}
          onResultClick={handleGlobalSearchResultClick}
        />

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events highlightedId={getHighlightedId()} />} />
            <Route path="/clubs" element={<Clubs highlightedId={getHighlightedId()} />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/users" element={<Users highlightedId={getHighlightedId()} />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
};

// App Content - FINAL FIX: Redirect / to /LandingPage
const AppContent = () => {
  const { user, loading } = useAuth();

  // Initialize dark mode on app load
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      {/* Redirect root to /LandingPage */}
      <Route path="/" element={<Navigate to="/LandingPage" replace />} />

      {/* Landing Page at /LandingPage */}
      <Route path="/LandingPage" element={
        user ? <Navigate to="/dashboard" replace /> : <LandingPageWrapper />
      } />

      {/* Public Auth Routes */}
      <Route path="/login" element={
        user ? <Navigate to="/dashboard" replace /> : <LoginWrapper />
      } />
      <Route path="/signup" element={
        user ? <Navigate to="/dashboard" replace /> : <SignupWrapper />
      } />
      <Route path="/forgot-password" element={
        user ? <Navigate to="/dashboard" replace /> : <ForgotPasswordWrapper />
      } />

      {/* Protected Routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <MainApp />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

// Root App
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;