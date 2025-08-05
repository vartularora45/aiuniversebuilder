import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft,
  Brain,
  Chrome,
  X
} from 'lucide-react';

const SignIn = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    resetEmail: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!showForgotPassword) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (showForgotPassword) {
        alert('Password reset link sent to your email!');
        setShowForgotPassword(false);
      } else {
        alert('Signed in successfully!');
        onClose();
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google User Info:', decoded);
      
      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        email_verified: decoded.email_verified
      };
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In Failed');
    alert('Google Sign-In failed. Please try again.');
  };

  const handleMicrosoftLogin = () => {
    alert('Microsoft Sign-In coming soon! Use Google for now.');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      resetEmail: ''
    });
    setErrors({});
    setShowPassword(false);
  };

  const switchToForgotPassword = () => {
    resetForm();
    setShowForgotPassword(true);
  };

  const switchToSignIn = () => {
    resetForm();
    setShowForgotPassword(false);
  };

  const handleSignUpRedirect = () => {
    // Navigate to signup page
    window.location.href = '/signup';
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center z-50 p-4 overflow-hidden">
      {/* Background blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Cosmic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        
        {/* Animated Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Main Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl w-full max-w-md max-h-[90vh] shadow-2xl z-10 flex flex-col"
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-8 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 hover:bg-gray-800/50 rounded-full p-2 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              <Brain className="w-8 h-8 text-purple-400" />
              AI Universe
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.h2
                key={showForgotPassword ? 'forgot' : 'signin'}
                {...fadeInUp}
                className="text-2xl font-bold text-white mb-2"
              >
                {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
              </motion.h2>
            </AnimatePresence>
            
            <motion.p
              {...fadeInUp}
              className="text-gray-300"
            >
              {showForgotPassword 
                ? 'Enter your email to receive reset instructions'
                : 'Sign in to continue building your AI universe'
              }
            </motion.p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <style jsx>{`
            .scrollable-content::-webkit-scrollbar {
              width: 6px;
            }
            .scrollable-content::-webkit-scrollbar-track {
              background: rgba(75, 85, 99, 0.3);
              border-radius: 10px;
            }
            .scrollable-content::-webkit-scrollbar-thumb {
              background: rgba(168, 85, 247, 0.6);
              border-radius: 10px;
            }
            .scrollable-content::-webkit-scrollbar-thumb:hover {
              background: rgba(168, 85, 247, 0.8);
            }
          `}</style>
          
          <div className="scrollable-content">
            <AnimatePresence mode="wait">
              {!showForgotPassword && (
                <motion.div
                  key="social-login"
                  {...fadeInUp}
                  className="space-y-3 mb-6"
                >
                  {/* Google Login Component */}
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      theme="filled_blue"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      logo_alignment="left"
                      width="100%"
                    />
                  </div>

                  {/* Microsoft Login (placeholder) */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMicrosoftLogin}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                    </svg>
                    Continue with Microsoft
                  </motion.button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-800/50 text-gray-400">or</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showForgotPassword ? 'forgot-form' : 'signin-form'}
                  {...fadeInUp}
                  className="space-y-4"
                >
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name={showForgotPassword ? "resetEmail" : "email"}
                        value={showForgotPassword ? formData.resetEmail : formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-white placeholder-gray-400 ${
                          errors.email ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Password - Not for Forgot Password */}
                  {!showForgotPassword && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-white placeholder-gray-400 ${
                            errors.password ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Forgot Password Link - Only for Sign In */}
              {!showForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={switchToForgotPassword}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    {showForgotPassword ? 'Send Reset Link' : 'Sign In'}
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              {showForgotPassword ? (
                <button
                  onClick={switchToSignIn}
                  className="flex items-center justify-center gap-2 w-full text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              ) : (
                <>
                  <p className="text-gray-400">
                    Don't have an account?
                  </p>
                  <button
                    onClick={handleSignUpRedirect}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
