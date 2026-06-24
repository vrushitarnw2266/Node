import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ListTodo, 
  ShieldCheck, 
  User, 
  LogOut, 
  CheckSquare 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <CheckSquare size={26} color="var(--primary)" />
        <span>TaskSphere</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/tasks" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <ListTodo size={20} />
          <span>Task Board</span>
        </NavLink>

        {user && user.role === 'admin' && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <ShieldCheck size={20} />
            <span>Admin Panel</span>
          </NavLink>
        )}

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <User size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button 
          onClick={logout} 
          className="sidebar-link" 
          style={{ 
            width: '100%', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <LogOut size={20} color="var(--danger)" />
          <span style={{ color: 'var(--danger)' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
