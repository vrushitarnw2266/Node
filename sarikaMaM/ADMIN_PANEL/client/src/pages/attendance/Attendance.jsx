import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Check, Plus, AlertCircle, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import attendanceService from '../../services/attendanceService';
import studentService from '../../services/studentService';
import courseService from '../../services/courseService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import { getStatusColor, formatDate } from '../../utils/helpers';

export const Attendance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search/Filters state for Admin/Faculty
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [courseCode, setCourseCode] = useState('CS-301');
  const [courses, setCourses] = useState([]);
  const [sheet, setSheet] = useState([]);
  const [loadingSheet, setLoadingSheet] = useState(false);

  // Student specific state
  const [studentSummary, setStudentSummary] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      try {
        if (user.role === 'student') {
          // Fetch student attendance summary
          setLoadingStudent(true);
          const data = await attendanceService.getStudentAttendanceSummary('std-1');
          setStudentSummary(data);
          setLoadingStudent(false);
        } else {
          // Fetch courses list for selector
          const crsList = await courseService.getAllCourses();
          setCourses(crsList);
          fetchAttendanceSheet();
        }
      } catch (err) {
        console.error('Error initializing attendance', err);
      }
    };
    initPage();
  }, [user]);

  const fetchAttendanceSheet = async () => {
    setLoadingSheet(true);
    try {
      const records = await attendanceService.getAttendanceByDateAndCourse(date, courseCode);
      setSheet(records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSheet(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAttendanceSheet();
  };

  // Renders view for Student Role
  if (user.role === 'student') {
    if (loadingStudent) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            My Attendance Report
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Check your current classroom registration details and attendance percentages.
          </p>
        </div>

        {studentSummary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-4 flex flex-col justify-center items-center text-center">
              <Award size={32} className="text-amber-500" />
              <h3 className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                {studentSummary.percentage}%
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Overall Score
              </span>
              <p className="text-xs text-slate-500 max-w-[180px]">
                {studentSummary.percentage >= 75
                  ? 'Great job! You satisfy the minimum 75% attendance criteria.'
                  : 'Warning: Your attendance is below 75%. Please contact class coordinator.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Classes Checklist
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-slate-400 text-[10px] uppercase">Classes Attended</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-white mt-1 block">
                    {studentSummary.present} Classes
                  </span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-slate-400 text-[10px] uppercase">Total Term Classes</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-white mt-1 block">
                    {studentSummary.total} Classes
                  </span>
                </div>
              </div>

              {/* Attendance warning indicator */}
              {studentSummary.percentage < 75 && (
                <div className="flex items-center space-x-2.5 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  <AlertCircle size={16} />
                  <span>Your current score does not meet the 75% final examination guidelines.</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <span className="text-xs text-slate-400">No attendance reports recorded yet.</span>
        )}
      </div>
    );
  }

  // Renders view for Admin/Faculty Role
  const columns = [
    { header: 'Student Name', accessor: 'studentName', cell: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.studentName}</span> },
    { header: 'Class Code', accessor: 'courseCode', cell: (row) => <span className="font-mono text-xs font-semibold">{row.courseCode}</span> },
    { header: 'Logged Date', accessor: 'date', cell: (row) => <span>{formatDate(row.date)}</span> },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Attendance Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track daily classroom session logs and inspect student attendance percentages.
          </p>
        </div>

        <Button onClick={() => navigate('/attendance/mark')} icon={<Plus size={16} />}>
          Mark Attendance
        </Button>
      </div>

      {/* Filter Toolbar */}
      <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-end gap-4 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <div className="w-48">
          <Input
            label="Log Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="w-56">
          <Input
            label="Select Course"
            type="select"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            options={courses.map(c => ({ label: `${c.code} - ${c.name}`, value: c.code }))}
          />
        </div>
        <Button type="submit">Filter Sheet</Button>
      </form>

      {/* Table */}
      <Table
        columns={columns}
        data={sheet}
        searchField="studentName"
        searchPlaceholder="Search student name..."
        loading={loadingSheet}
      />
    </div>
  );
};

export default Attendance;
