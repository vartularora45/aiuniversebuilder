import React, { useState } from 'react';
import axios from 'axios';
// import { motion } from 'framer-motion'; // Comment out if not installed
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useUser } from '../context/userContext';
import toast from 'react-hot-toast';

const SignIn = ({ onClose }) => {
  const { login } = useUser();

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Field validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle password visibility
  const togglePassword = () => setShowPassword(!showPassword);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading('Signing in...');

    try {
      
      
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/user/login`,
        {
          email: formData.email.trim(),
          password: formData.password
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 second timeout
        }
      );

      // Handle different response structures
      const userData = res.data?.user || res.data?.data?.user || res.data;
      const tokenData = res.data?.accessToken || res.data?.token || res.data?.data?.accessToken;
      
      if (!userData) {
        throw new Error('Invalid response format from server');
      }

      // Update context and localStorage via login()
      login(userData, tokenData);

      toast.success('Signed in successfully!', {
        id: toastId,
        duration: 2000,
      });

      // Close modal first
      onClose();
      
      // Navigate after a brief delay
      setTimeout(() => {
        // Use your router's navigate function here instead
        window.location.href = '/dashboard';
      }, 500);

    } catch (error) {
      console.error('Sign in error:', error);
      
      let message = 'Failed to sign in. Please try again.';
      
      if (error.response?.status === 401) {
        message = 'Invalid email or password';
      } else if (error.response?.status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.code === 'ECONNABORTED') {
        message = 'Request timeout. Please check your connection.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Handle escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !loading) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm text-white flex items-center justify-center z-50 p-4"
    >
      <div
        className="absolute inset-0"
        onClick={!loading ? onClose : undefined}
      ></div>
      
      <div
        // Remove framer-motion if not installed
        // initial={{ opacity: 0, scale: 0.9, y: 20 }}
        // animate={{ opacity: 1, scale: 1, y: 0 }}
        // exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl w-full max-w-md p-8 shadow-2xl z-10 transition-all duration-300 ${
          loading ? 'opacity-90' : ''
        }`}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-[1px] rounded-2xl z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-300 font-medium">Signing in...</p>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:bg-gray-800/50 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close sign in modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2
            id="modal-title"
            className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Sign In
          </h2>
          <p className="text-gray-300">Welcome back to the AI Universe</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Signup link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={onClose} // Replace with your signup modal toggle
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;