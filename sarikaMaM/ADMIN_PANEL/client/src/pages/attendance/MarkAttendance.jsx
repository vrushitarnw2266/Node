import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Check, X } from 'lucide-react';
import studentService from '../../services/studentService';
import courseService from '../../services/courseService';
import attendanceService from '../../services/attendanceService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const MarkAttendance = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [courseCode, setCourseCode] = useState('CS-301');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({}); // { studentId: 'present' | 'absent' }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const crsList = await courseService.getAllCourses();
        setCourses(crsList);
        
        const stdList = await studentService.getAllStudents();
        const activeStudents = stdList.filter(s => s.status === 'active');
        setStudents(activeStudents);

        // Pre-populate attendance state with 'present' as default
        const defaultState = {};
        activeStudents.forEach(s => {
          defaultState[s.id] = 'present';
        });
        setAttendanceState(defaultState);
      } catch (err) {
        console.error('Error fetching mark details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = (studentId, status) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceState(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const records = students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      date,
      courseCode,
      status: attendanceState[s.id]
    }));

    try {
      await attendanceService.markAttendance(records);
      navigate('/attendance');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/attendance')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to Logs</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Mark Session Attendance</h2>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-wrap gap-6 items-end">
          <div className="w-48">
            <Input
              label="Select Session Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="w-64">
            <Input
              label="Select Course"
              type="select"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              options={courses.map(c => ({ label: `${c.code} - ${c.name}`, value: c.code }))}
              required
            />
          </div>

          <div className="flex space-x-2 ml-auto">
            <Button
              variant="secondary"
              onClick={() => handleMarkAll('present')}
              className="!py-2 !px-3 hover:bg-emerald-500/10 hover:text-emerald-500"
            >
              All Present
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleMarkAll('absent')}
              className="!py-2 !px-3 hover:bg-rose-500/10 hover:text-rose-500"
            >
              All Absent
            </Button>
          </div>
        </div>

        {/* Student list card */}
        <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {students.length === 0 ? (
              <span className="text-xs text-slate-400 p-6 block text-center">No active student records available.</span>
            ) : (
              students.map((student) => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{student.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono font-semibold">Roll No: {student.rollNo}</p>
                    </div>
                  </div>

                  {/* Attendance Controls */}
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all text-xs font-bold ${
                        attendanceState[student.id] === 'present'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      <Check size={14} />
                      <span>Present</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all text-xs font-bold ${
                        attendanceState[student.id] === 'absent'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      <X size={14} />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-200/50 dark:border-slate-800/40 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => navigate('/attendance')}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} icon={<Save size={16} />}>
              {saving ? 'Submitting...' : 'Save Attendance Sheet'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MarkAttendance;
