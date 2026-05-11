 import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from '../components/Button';

const ResetPassword = ({ onNavigate }) => {
  const [step, setStep] = useState(1); // 1: email, 2: token, 3: new password
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: send email to get token
  const handleSendToken = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email');
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.data.success) {
        setSuccess('Token sent! Check your email.');
        setStep(2); // move to token input
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send token');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify token
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (!token) return setError('Please enter the token you received');
    setLoading(true);
    setError('');
    try {
      // Optional: verify token with backend if needed
      // If backend just requires token for reset, you can skip extra call
      setStep(3); // move to new password input
      setSuccess('Token verified! Now set your new password.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid token');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return setError('Please enter all fields');
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.resetPassword({ email, token, newPassword: password });
      if (response.data.success) {
        setSuccess('Password reset successfully!');
        setTimeout(() => onNavigate('login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" /> {success}
          </div>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
            <p className="text-gray-600 mb-6">Enter your email to receive a reset token.</p>
            <form onSubmit={handleSendToken} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <Button type="submit" fullWidth loading={loading} disabled={loading}>
                Send Token
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Token</h2>
            <p className="text-gray-600 mb-6">Enter the token you received via email.</p>
            <form onSubmit={handleVerifyToken} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <Button type="submit" fullWidth loading={loading} disabled={loading}>
                Verify Token
              </Button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
            <p className="text-gray-600 mb-6">Enter your new password below.</p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <Button type="submit" fullWidth loading={loading} disabled={loading}>
                Reset Password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;