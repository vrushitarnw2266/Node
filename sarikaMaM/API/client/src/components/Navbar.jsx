import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ title }) => {
  const { user } = useAuth();

  if (!user) return null;

  // Get initials for profile placeholder
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="navbar">
      <div style={{ marginRight: 'auto', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{title || 'Dashboard'}</h2>
      </div>

      <div className="navbar-user">
        <div className="navbar-info" style={{ textAlign: 'right' }}>
          <span className="navbar-name">{user.name}</span>
          <span className="navbar-role">{user.role}</span>
        </div>
        <div className="navbar-avatar">
          {getInitials(user.name)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
