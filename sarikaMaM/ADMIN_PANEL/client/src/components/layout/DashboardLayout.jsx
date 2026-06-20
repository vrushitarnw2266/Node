import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });

  const handleCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
    localStorage.setItem('sidebar_collapsed', collapsed);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-250 flex">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={handleCollapse} />

      {/* Main Container */}
      <motion.div
        animate={{ 
          paddingLeft: isCollapsed ? '80px' : '260px' 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-w-0"
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer */}
        <Footer />
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
