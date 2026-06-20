import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Core Pages
import Dashboard from '../pages/dashboard/Dashboard';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';

// Students
import Students from '../pages/students/Students';
import AddStudent from '../pages/students/AddStudent';
import EditStudent from '../pages/students/EditStudent';
import StudentProfile from '../pages/students/StudentProfile';

// Faculty
import Faculties from '../pages/faculty/Faculties';
import AddFaculty from '../pages/faculty/AddFaculty';
import EditFaculty from '../pages/faculty/EditFaculty';

// Courses
import Courses from '../pages/courses/Courses';
import AddCourse from '../pages/courses/AddCourse';
import EditCourse from '../pages/courses/EditCourse';

// Attendance
import Attendance from '../pages/attendance/Attendance';
import MarkAttendance from '../pages/attendance/MarkAttendance';

// Leave
import LeaveRequests from '../pages/leave/LeaveRequests';
import ApplyLeave from '../pages/leave/ApplyLeave';

// Notices
import Notices from '../pages/notices/Notices';
import AddNotice from '../pages/notices/AddNotice';
import EditNotice from '../pages/notices/EditNotice';

// Events
import Events from '../pages/events/Events';
import AddEvent from '../pages/events/AddEvent';
import EditEvent from '../pages/events/EditEvent';

// Feedbacks
import Feedbacks from '../pages/feedback/Feedbacks';
import AddFeedback from '../pages/feedback/AddFeedback';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Private Pages (Requires authentication token) */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Default dashboard redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Shared pages across all logged roles */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Notices Page */}
          <Route path="/notices" element={<Notices />} />
          <Route element={<RoleRoute allowedRoles={['admin', 'faculty']} />}>
            <Route path="/notices/add" element={<AddNotice />} />
            <Route path="/notices/edit/:id" element={<EditNotice />} />
          </Route>

          {/* Events Page */}
          <Route path="/events" element={<Events />} />
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/events/add" element={<AddEvent />} />
            <Route path="/events/edit/:id" element={<EditEvent />} />
          </Route>

          {/* Attendance Page */}
          <Route path="/attendance" element={<Attendance />} />
          <Route element={<RoleRoute allowedRoles={['admin', 'faculty']} />}>
            <Route path="/attendance/mark" element={<MarkAttendance />} />
          </Route>

          {/* Leaves Page */}
          <Route path="/leave" element={<LeaveRequests />} />
          <Route element={<RoleRoute allowedRoles={['faculty', 'student']} />}>
            <Route path="/leave/apply" element={<ApplyLeave />} />
          </Route>

          {/* Feedback Page */}
          <Route path="/feedback" element={<Feedbacks />} />
          <Route element={<RoleRoute allowedRoles={['student']} />}>
            <Route path="/feedback/add" element={<AddFeedback />} />
          </Route>

          {/* Student Directories (Requires Admin/Faculty permissions) */}
          <Route element={<RoleRoute allowedRoles={['admin', 'faculty']} />}>
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentProfile />} />
          </Route>

          {/* Student Modification (Requires Admin permissions) */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/students/add" element={<AddStudent />} />
            <Route path="/students/edit/:id" element={<EditStudent />} />
          </Route>

          {/* Faculty Management (Requires Admin permissions) */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/faculty" element={<Faculties />} />
            <Route path="/faculty/add" element={<AddFaculty />} />
            <Route path="/faculty/edit/:id" element={<EditFaculty />} />
          </Route>

          {/* Courses Management (Requires Admin permissions) */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/add" element={<AddCourse />} />
            <Route path="/courses/edit/:id" element={<EditCourse />} />
          </Route>

        </Route>
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
