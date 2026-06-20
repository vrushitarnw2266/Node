import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('admin');
  const [name, setName] = useState('Vrushita');
  const [email, setEmail] = useState('vrushi23@campus.com');
  const [password, setPassword] = useState('vrushi23');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password, role, name);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setName('Vrushita');
      setEmail('vrushi23@campus.com');
      setPassword('vrushi23');
    } else if (selectedRole === 'faculty') {
      setName('');
      setEmail('faculty@campus.com');
      setPassword('faculty123');
    } else if (selectedRole === 'student') {
      setName('');
      setEmail('student@campus.com');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-slate-900 overflow-hidden relative select-none">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      {/* Brand Column */}
      <div className="md:w-1/2 flex flex-col justify-center items-center md:items-start p-10 md:p-20 text-white relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3 mb-6"
        >
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/30">
            <GraduationCap size={36} />
          </div>
          <span className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent font-sans">
            EduSphere
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-sans text-center md:text-left leading-tight tracking-tight mb-4"
        >
          Smart Campus <br />
          <span className="text-indigo-400">Management Panel</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-slate-400 text-sm md:text-base text-center md:text-left max-w-md mb-8 leading-relaxed"
        >
          Empowering administrators, faculties, and students with clean visualizations and integrated workflows.
        </motion.p>
      </div>

      {/* Login Card Column */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col space-y-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white tracking-tight">Portal Authentication</h3>
            <p className="text-xs text-slate-400 mt-1">Select your access role to sign in</p>
          </div>

          {/* Role selector tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 relative">
            {['admin', 'faculty', 'student'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleQuickFill(r)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all relative ${role === r ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                {role === r && (
                  <motion.div
                    layoutId="activeRoleTab"
                    className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-lg shadow-indigo-500/20"
                    transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                  />
                )}
                {r}
              </button>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your Name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={16} />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                required
              />
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick logs assistance for user */}
          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span>Demo Quick-Fill Controls</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['admin', 'faculty', 'student'].map((r) => (
                <button
                  key={r}
                  onClick={() => handleQuickFill(r)}
                  className="py-1 px-2 text-[10px] font-bold rounded-lg border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors capitalize text-center"
                >
                  Fill {r}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
