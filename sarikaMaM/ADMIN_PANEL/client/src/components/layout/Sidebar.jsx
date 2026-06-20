import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, UserCheck, BookOpen, CalendarCheck, 
  FileSpreadsheet, BellRing, CalendarDays, MessageSquare, 
  User, Settings, LogOut, GraduationCap, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'faculty', 'student'] },
    { name: 'Students', path: '/students', icon: <Users size={20} />, roles: ['admin', 'faculty'] },
    { name: 'Faculty', path: '/faculty', icon: <UserCheck size={20} />, roles: ['admin'] },
    { name: 'Courses', path: '/courses', icon: <BookOpen size={20} />, roles: ['admin'] },
    { name: 'Attendance', path: '/attendance', icon: <CalendarCheck size={20} />, roles: ['admin', 'faculty', 'student'] },
    { name: 'Leave Requests', path: '/leave', icon: <FileSpreadsheet size={20} />, roles: ['admin', 'faculty', 'student'] },
    { name: 'Notices', path: '/notices', icon: <BellRing size={20} />, roles: ['admin', 'faculty', 'student'] },
    { name: 'Events', path: '/events', icon: <CalendarDays size={20} />, roles: ['admin', 'faculty', 'student'] },
    { name: 'Feedback', path: '/feedback', icon: <MessageSquare size={20} />, roles: ['admin', 'faculty', 'student'] },
    { name: 'Profile', path: '/profile', icon: <User size={20} />, roles: ['admin', 'faculty', 'student'] },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['admin', 'faculty', 'student'] },
  ];

  // Filter navigation items by active user role
  const filteredItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/40 h-screen fixed top-0 left-0 flex flex-col z-30 overflow-hidden"
    >
      {/* Brand Logo Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/40 shrink-0">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30 shrink-0">
            <GraduationCap size={24} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-sans tracking-wide whitespace-nowrap"
            >
              EduSphere
            </motion.span>
          )}
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 select-none">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <div className="shrink-0 transition-transform group-hover:scale-110 duration-200">{item.icon}</div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-nowrap"
              >
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer Section */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/40 shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <div className="shrink-0"><LogOut size={20} /></div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="whitespace-nowrap font-semibold"
            >
              Sign Out
            </motion.span>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
