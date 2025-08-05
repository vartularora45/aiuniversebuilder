import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import LandingPage from './pages/LandingPage.jsx'
import SignIn from './pages/SignIn.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import BuilderPage from './pages/BuilderPage.jsx'
const App = () => {
  // ✅ Temporary hardcoded client ID for testing
  const googleClientId = "306683940368-4o1pnogkqenptdpd8h24fjl580f0q345.apps.googleusercontent.com";
  
  // ✅ Fallback to environment variable if needed
  // const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "306683940368-4o1pnogkqenptdpd8h24fjl580f0q345.apps.googleusercontent.com";
  
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
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/builder"
            element={
              <ProtectedRoute>
          
          {/* Catch-all route for 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p>Page not found</p>
                  <a href="/" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
                    Go Home
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
