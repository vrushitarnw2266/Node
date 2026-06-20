import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Sun, Moon, Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Generate breadcrumb titles
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const mockNotifications = [
    { id: 1, title: 'Notice Posted', desc: 'Summer Schedule is online.', time: '10m ago' },
    { id: 2, title: 'New Leave Request', desc: 'Marcus Sterling applied for Sick Leave.', time: '1h ago' },
    { id: 3, title: 'Event Reminder', desc: 'Tech Symposium starts tomorrow.', time: '5h ago' }
  ];

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40 h-20 px-6 md:px-8 flex items-center justify-between sticky top-0 z-20 w-full select-none">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-tight font-sans tracking-tight">
          {getPageTitle()}
        </h1>
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span>EduSphere</span>
          <span>/</span>
          <span className="text-slate-500 dark:text-slate-400">{getPageTitle().toLowerCase()}</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden lg:flex items-center relative w-60">
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500/20 focus:outline-none text-slate-700 dark:text-slate-200"
          />
          <Search size={15} className="absolute left-3 text-slate-400" />
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-white transition-all duration-200"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-white transition-all duration-200 relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-2xl p-4 z-20 space-y-3"
                >
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Notifications
                  </h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/40 space-y-3">
                    {mockNotifications.map((notif) => (
                      <div key={notif.id} className="pt-2 text-xs flex flex-col space-y-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {notif.title}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">{notif.desc}</span>
                        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium">
                          {notif.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center space-x-2.5 p-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all duration-200"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="Avatar"
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium capitalize">
                {user?.role || 'Guest'}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-2xl p-2 z-20 space-y-1"
                >
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center space-x-2.5 px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <User size={15} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center space-x-2.5 px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <Settings size={15} />
                    <span>Settings</span>
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
