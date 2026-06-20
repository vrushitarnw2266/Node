import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-600/30';
      case 'secondary':
        return 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 border border-red-600/30';
      case 'glass':
        return 'bg-white/10 dark:bg-slate-900/40 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-900/60 text-slate-800 dark:text-white border border-slate-200/20 dark:border-slate-800/40';
      default:
        return 'bg-indigo-600 text-white';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none ${getVariantStyles()} ${className}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
