import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Award, BookOpen, Clock } from 'lucide-react';
import studentService from '../../services/studentService';
import attendanceService from '../../services/attendanceService';
import Button from '../../components/common/Button';
import { getStatusColor, formatDate } from '../../utils/helpers';

export const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const stdData = await studentService.getStudentById(id);
        if (stdData) {
          setStudent(stdData);
          const attData = await attendanceService.getStudentAttendanceSummary(id);
          setAttendance(attData);
        } else {
          setError('Student record not found.');
        }
      } catch (err) {
        setError('Failed to fetch student details.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold">{error || 'Something went wrong'}</p>
        <Button onClick={() => navigate('/students')} className="mt-4">
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-extrabold text-3xl md:text-4xl shrink-0">
          {student.name.charAt(0)}
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                {student.name}
              </h2>
              <span className={`inline-flex px-2 py-0.5 text-[9px] font-black uppercase rounded-md border self-center ${getStatusColor(student.status)}`}>
                {student.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono font-semibold">Roll No: {student.rollNo}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            <div>
              <span className="block text-[10px]">Program</span>
              <span className="text-slate-700 dark:text-slate-200 block mt-0.5">{student.course}</span>
            </div>
            <div>
              <span className="block text-[10px]">Department</span>
              <span className="text-slate-700 dark:text-slate-200 block mt-0.5 truncate max-w-[120px]">{student.department}</span>
            </div>
            <div>
              <span className="block text-[10px]">Year</span>
              <span className="text-slate-700 dark:text-slate-200 block mt-0.5">{student.year}</span>
            </div>
            <div>
              <span className="block text-[10px]">Semester</span>
              <span className="text-slate-700 dark:text-slate-200 block mt-0.5">{student.semester} Sem</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info card */}
        <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Contact Information
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-350">
              <Mail size={16} className="text-slate-400" />
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase">Email</span>
                <span className="font-semibold">{student.email}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-350">
              <Phone size={16} className="text-slate-400" />
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase">Phone</span>
                <span className="font-semibold">{student.phone || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance card */}
        <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Attendance Summary
          </h3>

          {attendance ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col justify-center items-center text-center space-y-1">
                <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{attendance.percentage}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Score</span>
              </div>

              <div className="sm:col-span-2 space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] uppercase text-slate-400">
                    <span>Attendance Rate</span>
                    <span>{attendance.present} / {attendance.total} Classes</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        attendance.percentage >= 75 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${attendance.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[10px] uppercase text-slate-400">
                  <Clock size={14} className="text-indigo-500" />
                  <span>
                    Status: {attendance.percentage >= 75 ? 'Eligible for finals' : 'Shortage (Requires Review)'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-400 block pt-2">No attendance records found.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
