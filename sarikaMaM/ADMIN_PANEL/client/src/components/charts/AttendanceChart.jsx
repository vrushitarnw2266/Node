import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

export const AttendanceChart = () => {
  const { theme } = useTheme();

  // Mock attendance report data
  const data = [
    { month: 'Jan', CSE: 88, IT: 92, ECE: 85 },
    { month: 'Feb', CSE: 90, IT: 94, ECE: 87 },
    { month: 'Mar', CSE: 91, IT: 90, ECE: 84 },
    { month: 'Apr', CSE: 85, IT: 88, ECE: 80 },
    { month: 'May', CSE: 94, IT: 95, ECE: 91 },
    { month: 'Jun', CSE: 92, IT: 93, ECE: 89 },
  ];

  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const labelColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <div className="w-full h-80 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Average Attendance %</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">Monthly classroom attendance comparison</p>
      </div>

      <div className="w-full h-[calc(100%-40px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" stroke={labelColor} fontSize={11} tickLine={false} />
            <YAxis stroke={labelColor} fontSize={11} tickLine={false} domain={[60, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                borderRadius: '12px',
                color: theme === 'dark' ? '#ffffff' : '#000000',
              }}
            />
            <Bar dataKey="CSE" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={25} />
            <Bar dataKey="IT" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
