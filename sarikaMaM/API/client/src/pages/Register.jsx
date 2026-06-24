import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Try a different email.');
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

      <div className="glass-card auth-card" style={{ maxWidth: '460px' }}>
        <div className="auth-header">
          <h1 className="auth-logo">TaskSphere</h1>
          <p className="auth-subtitle">Create a university final project account</p>
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
            <label className="glass-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User 
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
                id="name"
                type="text"
                className="glass-input"
                style={{ paddingLeft: '44px' }}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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

          <div className="form-group">
            <label className="glass-label" htmlFor="role">Role (Academic Testing)</label>
            <select
              id="role"
              className="glass-input"
              style={{ cursor: 'pointer', background: 'rgba(11, 15, 25, 0.6)' }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User (Team Member)</option>
              <option value="admin">Admin (Team Leader)</option>
            </select>
          </div>

          <div className="form-group">
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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label className="glass-label" htmlFor="confirmPassword">Confirm Password</label>
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
                id="confirmPassword"
                type="password"
                className="glass-input"
                style={{ paddingLeft: '44px' }}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              'Creating Account...'
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
