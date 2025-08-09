import React, { useState } from 'react';
import axios from 'axios';
// import { motion } from 'framer-motion'; // Comment out if not using
import { Mail, Lock, Eye, EyeOff, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '../context/userContext';
const SignUp = ({ onClose }) => {
  // Form state
  const { login } = useUser();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    else if (formData.email.length > 50) newErrors.email = 'Max 50 chars';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'At least 8 characters';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Toggle password fields
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading('Creating account...');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/user/register`,
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: 'user',
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      // Handle response structure
      const userData = res.data?.user || res.data?.data?.user || res.data;
      const tokenData = res.data?.accessToken || res.data?.token || res.data?.data?.accessToken;
      
      
      if (!userData) {
        throw new Error('Invalid response format from server');
      }

      // Update context and localStorage via login()
      login(userData, tokenData);
      if (!userData) throw new Error('Invalid response format from server');

      // Store user data if you want
      localStorage.setItem('user', JSON.stringify(userData));
      if (tokenData) localStorage.setItem('token', tokenData);
      localStorage.setItem('isAuthenticated', 'true');


      toast.success('Account created successfully! 🎉', {
        id: toastId,
        duration: 2000,
      });

      onClose();

      // Short delay before redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);

    } catch (error) {
      console.error('Signup error:', error);

      let message = 'Failed to create account. Please try again.';
      if (error.response?.data?.code === 11000) {
        message = error.response.data.message || 'Email already registered';
        setErrors({ email: message });
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

  // Escape key to close
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !loading) onClose();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="signup-title"
      aria-modal="true"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm text-white flex items-center justify-center z-50 p-4"
    >
      <div className="absolute inset-0" onClick={!loading ? onClose : undefined}></div>
      <div className={`relative bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl w-full max-w-md p-8 shadow-2xl z-10 transition-all duration-300 ${loading ? 'opacity-90' : ''}`}>
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-[1px] rounded-2xl z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-300 font-medium">Creating account...</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:bg-gray-800/50 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close sign up modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2
            id="signup-title"
            className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Create Account
          </h2>
          <p className="text-gray-300">Join the AI Universe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                }`}
                placeholder="First name"
                required
              />
            </div>
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                }`}
                placeholder="Last name"
                required
              />
            </div>
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="signup-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your email"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                }`}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="signup-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                }`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPassword}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
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
                Creating Account...
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Already have account link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onClose} // Replace with your sign-in modal toggle
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
