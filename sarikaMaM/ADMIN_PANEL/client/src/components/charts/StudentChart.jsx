import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

export const StudentChart = () => {
  const { theme } = useTheme();

  // Mock enrollment trends data
  const data = [
    { year: '2021', CSE: 120, ECE: 80, ME: 60 },
    { year: '2022', CSE: 150, ECE: 95, ME: 55 },
    { year: '2023', CSE: 180, ECE: 110, ME: 65 },
    { year: '2024', CSE: 220, ECE: 100, ME: 70 },
    { year: '2025', CSE: 260, ECE: 130, ME: 75 },
    { year: '2026', CSE: 310, ECE: 145, ME: 80 },
  ];

  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const labelColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <div className="w-full h-80 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Enrollment Trends</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">Student enrollment growth per department</p>
      </div>

      <div className="w-full h-[calc(100%-40px)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEce" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="year" stroke={labelColor} fontSize={11} tickLine={false} />
            <YAxis stroke={labelColor} fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                borderRadius: '12px',
                color: theme === 'dark' ? '#ffffff' : '#000000',
              }}
            />
            <Area type="monotone" dataKey="CSE" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCse)" />
            <Area type="monotone" dataKey="ECE" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEce)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentChart;
