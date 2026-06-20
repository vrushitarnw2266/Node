// Format Date into human readable format
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format short date-time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate attendance percentage
export const calculatePercentage = (present, total) => {
  if (!total || total === 0) return 0;
  return Math.round((present / total) * 100);
};

// Return Tailwind CSS color classes based on leave/attendance status
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'present':
    case 'active':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    case 'rejected':
    case 'absent':
    case 'inactive':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
  }
};

// Return Tailwind CSS badge color classes for user roles
export const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
    case 'faculty':
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
    case 'student':
      return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20';
    default:
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
  }
};
