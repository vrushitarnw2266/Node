import React from 'react';
import { motion } from 'framer-motion';

export const Loader = () => {
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.15,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const dotVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  };

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Dynamic Animated Dots */}
      <motion.div
        className="flex justify-center items-center space-x-2 h-10 w-24"
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        <motion.span
          className="w-3.5 h-3.5 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-md"
          variants={dotVariants}
          transition={dotTransition}
        />
        <motion.span
          className="w-3.5 h-3.5 bg-purple-600 dark:bg-purple-400 rounded-full shadow-md"
          variants={dotVariants}
          transition={dotTransition}
        />
        <motion.span
          className="w-3.5 h-3.5 bg-pink-600 dark:bg-pink-400 rounded-full shadow-md"
          variants={dotVariants}
          transition={dotTransition}
        />
      </motion.div>
      <span className="text-sm font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase animate-pulse">
        Loading EduSphere...
      </span>
    </div>
  );
};

export default Loader;
