import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background glow orbs */}
      <div className="bg-glow-container">
        <div className="bg-glow-orb bg-glow-orb-1" />
        <div className="bg-glow-orb bg-glow-orb-2" />
      </div>

      <div className="glass-card auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">TaskSphere</h1>
          <p className="auth-subtitle">Sign in to manage your team tasks</p>
        </div>

        {errorMsg && (
          <div 
            style={{ 
              background: 'var(--danger-bg)', 
              color: '#f87171', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '20px',
              fontSize: '0.85rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="glass-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                id="email"
                type="email"
                className="glass-input"
                style={{ paddingLeft: '44px' }}
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label className="glass-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                id="password"
                type="password"
                className="glass-input"
                style={{ paddingLeft: '44px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
