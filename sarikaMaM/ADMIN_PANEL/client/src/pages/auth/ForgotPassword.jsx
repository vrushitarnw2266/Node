import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, ArrowLeft, Send } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import authService from '../../services/authService';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message || 'Password reset instructions sent to your email.');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-900 overflow-hidden relative p-4 select-none">
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col space-y-6"
      >
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
            <GraduationCap size={28} />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Forgot Password?</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Enter your email and we'll dispatch instructions to reset your account credentials.
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        {message ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-4 py-4"
          >
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 text-center text-xs font-semibold">
              {message}
            </div>
            <Link
              to="/login"
              className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
            />

            <Button type="submit" className="w-full" icon={<Send size={15} />} disabled={loading}>
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
              >
                <ArrowLeft size={13} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
