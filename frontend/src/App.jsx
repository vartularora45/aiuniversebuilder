import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage.jsx';
import SignIn from './pages/SignIn.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BuilderPage from './pages/BuilderPage.jsx';
import { UserProvider } from './context/userContext.jsx';
import { Toaster } from 'react-hot-toast';

const App = () => {
  // ✅ Google OAuth Client ID
  const googleClientId = "306683940368-4o1pnogkqenptdpd8h24fjl580f0q345.apps.googleusercontent.com";

  // ✅ Debug logging
  console.log('Google Client ID loaded:', googleClientId);

  // ✅ Error handling for missing client ID
  if (!googleClientId) {
    console.error('Google Client ID is missing!');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p>Google Client ID is not configured properly.</p>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <Toaster position="bottom-center" toastOptions={{ className: '!bg-gray-900 !text-white' }} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />

            {/* Here we pass onClose only if the component actually uses it */}
            <Route path="/login" element={<WithCloseWrapper Component={SignIn} />} />
            <Route path="/signup" element={<WithCloseWrapper Component={SignupPage} />} />
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen min-w-screen bg-gray-900 text-white flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p>Page not found</p>
                    <a
                      href="/"
                      className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </UserProvider>
  );
};

// ✅ Small wrapper to inject a safe onClose into any page
const WithCloseWrapper = ({ Component }) => {
  const navigate = useNavigate();
  return <Component onClose={() => navigate('/')} />;
};

export default App;
