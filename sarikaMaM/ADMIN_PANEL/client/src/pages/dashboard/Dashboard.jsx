import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, Calendar, Bell, ArrowUpRight,
  TrendingUp, Award, CalendarDays, CheckCircle,
  BookOpen, FileText, Star, Activity, Clock, Zap,
  BarChart2, MessageSquare, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import StudentChart from '../../components/charts/StudentChart';
import AttendanceChart from '../../components/charts/AttendanceChart';
import EventChart from '../../components/charts/EventChart';
import studentService from '../../services/studentService';
import facultyService from '../../services/facultyService';
import noticeService from '../../services/noticeService';
import eventService from '../../services/eventService';
import leaveService from '../../services/leaveService';
import courseService from '../../services/courseService';
import feedbackService from '../../services/feedbackService';
import { formatDate, calculatePercentage } from '../../utils/helpers';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    attendance: '91.2%',
    events: 0,
    courses: 0,
    pendingLeaves: 0,
    avgRating: '0.0',
  });
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stdList, facList, ntcList, evtList, lvList, crsList, fdbList] = await Promise.all([
          studentService.getAllStudents(),
          facultyService.getAllFaculty(),
          noticeService.getAllNotices(),
          eventService.getAllEvents(),
          leaveService.getAllLeaves(),
          courseService.getAllCourses(),
          feedbackService.getAllFeedback(),
        ]);

        const pendingLeaves = lvList.filter(l => l.status === 'pending').length;
        const avgRating = fdbList.length
          ? (fdbList.reduce((sum, f) => sum + (f.rating || 0), 0) / fdbList.length).toFixed(1)
          : '0.0';

        setStats({
          students: stdList.length * 125 || 1250,
          faculty: facList.length * 15 || 64,
          attendance: '91.4%',
          events: evtList.length,
          courses: crsList.length * 12 || 48,
          pendingLeaves,
          avgRating,
        });

        setNotices(ntcList.slice(0, 3));
        setEvents(evtList.slice(0, 4));
        setFeedback(fdbList.slice(0, 3));

        // Build top students from mock data sorted by attendance
        const sorted = [...stdList]
          .map(s => ({ ...s, pct: calculatePercentage(s.presentDays, s.totalDays) }))
          .sort((a, b) => b.pct - a.pct)
          .slice(0, 4);
        setTopStudents(sorted);

        // Compose recent activity from notices + leaves
        const activities = [
          ...ntcList.slice(0, 2).map(n => ({
            id: n.id, icon: 'bell', color: 'indigo',
            text: `Notice posted: "${n.title}"`, time: formatDate(n.date), by: n.author,
          })),
          ...lvList.slice(0, 3).map(l => ({
            id: l.id, icon: 'file',
            color: l.status === 'approved' ? 'emerald' : l.status === 'rejected' ? 'rose' : 'amber',
            text: `Leave ${l.status}: ${l.applicantName} (${l.type})`,
            time: formatDate(l.startDate), by: l.role,
          })),
        ].slice(0, 5);
        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching dashboard summary info', error);
      }
    };

    fetchDashboardData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (idx) => ({
      opacity: 1, y: 0,
      transition: { delay: idx * 0.08, duration: 0.4, ease: 'easeOut' },
    }),
  };

  const statCards = [
    { title: 'Total Students', value: stats.students, change: '+12% this year', icon: <Users size={20} />, color: 'from-blue-600 to-indigo-600', link: '/students' },
    { title: 'Active Faculty', value: stats.faculty, change: '+4% this semester', icon: <UserCheck size={20} />, color: 'from-purple-600 to-indigo-600', link: '/faculty' },
    { title: 'Avg. Attendance', value: stats.attendance, change: 'Target: 95.0%', icon: <TrendingUp size={20} />, color: 'from-emerald-600 to-teal-600', link: '/attendance' },
    { title: 'Upcoming Events', value: stats.events, change: 'Next: Tech Symposium', icon: <CalendarDays size={20} />, color: 'from-pink-600 to-rose-600', link: '/events' },
    { title: 'Active Courses', value: stats.courses, change: 'Across 4 departments', icon: <BookOpen size={20} />, color: 'from-amber-500 to-orange-500', link: '/courses' },
    { title: 'Pending Leaves', value: stats.pendingLeaves, change: 'Awaiting approval', icon: <FileText size={20} />, color: 'from-cyan-500 to-sky-600', link: '/leaves' },
  ];

  const departments = [
    { name: 'Computer Science & Engg.', short: 'CSE', students: 310, capacity: 400, color: 'bg-indigo-500' },
    { name: 'Information Technology', short: 'IT', students: 145, capacity: 200, color: 'bg-sky-500' },
    { name: 'Electronics & Comm.', short: 'ECE', students: 110, capacity: 180, color: 'bg-purple-500' },
    { name: 'Mechanical Engineering', short: 'ME', students: 80, capacity: 150, color: 'bg-amber-500' },
  ];

  const activityIconMap = {
    bell: <Bell size={14} />,
    file: <FileText size={14} />,
    star: <Star size={14} />,
  };
  const activityColorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  return (
    <div className="space-y-8 select-none">

      {/* ── Header Greeting ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Welcome Back,{' '}
            <span className="text-indigo-600 dark:text-indigo-400">{user?.name || 'Administrator'}</span>
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">
            Here's a live summary of EduSphere campus — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
          <Activity size={14} />
          <span>System Operational</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* ── 6 Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx} custom={idx} initial="hidden" animate="visible" variants={cardVariants}
            className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl shadow-slate-100/10 dark:shadow-none relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${card.color} opacity-[0.04] group-hover:opacity-[0.12] transition-opacity duration-300 blur-xl`} />
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg w-fit mb-3`}>
              {card.icon}
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight">{card.title}</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1">{card.value}</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 truncate">{card.change}</p>
            <Link to={card.link} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={13} className="text-slate-400" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── 3 Analytics Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StudentChart />
        <AttendanceChart />
        <EventChart />
      </div>

      {/* ── Department Performance + Top Students ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Department Strength */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
          className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-col space-y-5"
        >
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BarChart2 size={16} className="text-indigo-500" /> Department Strength
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Enrolled students vs. seat capacity</p>
            </div>
            <Link to="/students" className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-0.5">
              View All <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-4">
            {departments.map((dept, i) => {
              const pct = Math.round((dept.students / dept.capacity) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dept.color}`} />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{dept.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {dept.students} / {dept.capacity} <span className="text-[10px] font-normal">seats</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full ${dept.color}`}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 text-right">{pct}% capacity</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Students by Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}
          className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-col space-y-5"
        >
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Award size={16} className="text-amber-500" /> Top Performing Students
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by attendance percentage</p>
            </div>
            <Link to="/students" className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-0.5">
              All Students <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {topStudents.length === 0 ? (
              <p className="text-xs text-slate-400">Loading student data...</p>
            ) : (
              topStudents.map((s, idx) => {
                const medal = ['🥇', '🥈', '🥉', '🎖️'][idx] || '🎖️';
                const pctColor = s.pct >= 90 ? 'text-emerald-500' : s.pct >= 75 ? 'text-amber-500' : 'text-rose-500';
                const barColor = s.pct >= 90 ? 'bg-emerald-500' : s.pct >= 75 ? 'bg-amber-500' : 'bg-rose-500';
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                    <span className="text-xl shrink-0">{medal}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{s.department?.split(' ')[0]} · {s.rollNo}</p>
                      <div className="mt-1 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                    <span className={`text-sm font-black shrink-0 ${pctColor}`}>{s.pct}%</span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Notices + Events + Activity Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Notices */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Bell size={14} className="text-indigo-500" /> Active Notices
              </h3>
              <p className="text-xs text-slate-400">Latest from dean & dept heads</p>
            </div>
            <Link to="/notices" className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-0.5">
              View All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40 space-y-3">
            {notices.length === 0 ? (
              <span className="text-xs text-slate-400 pt-2 block">No active notices posted.</span>
            ) : (
              notices.map((notice, idx) => (
                <div key={notice.id || idx} className="pt-3 first:pt-0 flex flex-col space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{notice.title}</span>
                    <span className="text-[10px] font-bold py-0.5 px-2 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 rounded-md shrink-0">
                      {notice.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2">{notice.content}</p>
                  <div className="flex items-center space-x-2 pt-0.5 text-[10px] font-bold text-slate-400">
                    <span>By: {notice.author}</span>
                    <span>&middot;</span>
                    <span>{formatDate(notice.date)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <CalendarDays size={14} className="text-pink-500" /> Upcoming Events
              </h3>
              <p className="text-xs text-slate-400">Scheduled campus activities</p>
            </div>
            <Link to="/events" className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-0.5">
              Calendar <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {events.length === 0 ? (
              <span className="text-xs text-slate-400 pt-2 block">No upcoming events scheduled.</span>
            ) : (
              events.map((event, idx) => (
                <div key={event.id || idx} className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 rounded-xl flex items-center space-x-3 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-indigo-600 text-white w-11 shrink-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider leading-none">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-base font-black leading-tight mt-0.5">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{event.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{event.time} &middot; {event.venue}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" /> Recent Activity
              </h3>
              <p className="text-xs text-slate-400">Latest campus actions & updates</p>
            </div>
          </div>
          <div className="relative space-y-4">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800" />
            {recentActivity.length === 0 ? (
              <p className="text-xs text-slate-400 pl-8">No recent activity.</p>
            ) : (
              recentActivity.map((act, idx) => (
                <div key={act.id || idx} className="flex items-start gap-3 pl-1">
                  <span className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center ${activityColorMap[act.color] || activityColorMap.indigo}`}>
                    {activityIconMap[act.icon] || <Bell size={13} />}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{act.text}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400">
                      <Clock size={10} />
                      <span>{act.time}</span>
                      <span>&middot;</span>
                      <span className="capitalize">{act.by}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Latest Student Feedback ── */}
      <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <MessageSquare size={15} className="text-violet-500" /> Latest Student Feedback
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Average faculty rating: <span className="text-amber-500 font-black">{stats.avgRating} ★</span>
            </p>
          </div>
          <Link to="/feedback" className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-0.5">
            See All <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feedback.map((fb, idx) => (
            <motion.div
              key={fb.id || idx}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 flex flex-col space-y-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{fb.studentName}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{fb.courseName}</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className={i < fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">"{fb.comment}"</p>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>{fb.facultyName}</span>
                <span>{formatDate(fb.date)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;