import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid rgba(99, 102, 241, 0.1)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save location they tried to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Redirect non-admins to the dashboard page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
