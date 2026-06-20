export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Applied Sciences & Humanities',
];

export const COURSES_LIST = [
  'B.Tech',
  'M.Tech',
  'BCA',
  'MCA',
  'B.Sc',
  'M.Sc',
  'MBA',
];

export const NOTICE_CATEGORIES = [
  'Academic',
  'Examination',
  'Admission',
  'Placement',
  'Sports & Culture',
  'General',
];

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};
