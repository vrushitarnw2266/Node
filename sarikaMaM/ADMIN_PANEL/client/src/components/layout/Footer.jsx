import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 px-8 border-t border-slate-200/50 dark:border-slate-800/40 text-center text-xs text-slate-400 dark:text-slate-500 font-medium select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>&copy; {currentYear} EduSphere. All rights reserved.</span>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-indigo-500 transition-colors">Support Desk</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
