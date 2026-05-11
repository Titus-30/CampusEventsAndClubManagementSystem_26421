import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Button from '../components/Button';

const Login = ({ onNavigate, onLoginSuccess }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First verify credentials
      const loginResponse = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse.data.success) {
        // Send OTP
        const otpResponse = await authAPI.sendOtp(formData.email);

        if (otpResponse.data.success) {
          setSuccess('OTP sent to your email!');
          setOtpSent(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      setError('Please enter the OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyOtp(formData.email, formData.otp);

      if (response.data.success) {
        login(response.data.user);

        // Use the onLoginSuccess callback if provided, otherwise navigate directly
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSignup = () => {
    if (onNavigate) {
      onNavigate('signup');
    } else {
      navigate('/signup'); // Fallback to router navigation
    }
  };

  const handleNavigateToForgotPassword = () => {
    if (onNavigate) {
      onNavigate('forgot');
    } else {
      navigate('/forgot-password'); // Fallback to router navigation
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-full p-4 shadow-xl mb-4">
            <Calendar className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Campus Events</h1>
          <p className="text-blue-100">Manage your campus activities</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>

          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4" autoComplete="off">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={otpSent}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="your.email@example.com"
                  required
                  autoComplete="new-email" // Hack to prevent autofill
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={otpSent}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password" // Prevent autofill
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={otpSent}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* OTP Input (shown after OTP is sent) */}
            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Check your email for the verification code
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {otpSent ? 'Verify & Login' : 'Send OTP'}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleNavigateToForgotPassword}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleNavigateToSignup}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;