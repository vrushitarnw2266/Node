import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

export const EventChart = () => {
  const { theme } = useTheme();

  // Mock events RSVPs
  const data = [
    { name: 'Tech Symposium', RSVPs: 350 },
    { name: 'AI Seminar', RSVPs: 180 },
    { name: 'Sports Week', RSVPs: 290 },
    { name: 'Convocation', RSVPs: 420 },
  ];

  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const labelColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <div className="w-full h-80 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Event RSVP Status</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">Registered participants for scheduled events</p>
      </div>

      <div className="w-full h-[calc(100%-40px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" stroke={labelColor} fontSize={11} tickLine={false} />
            <YAxis dataKey="name" type="category" stroke={labelColor} fontSize={11} tickLine={false} width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                borderRadius: '12px',
                color: theme === 'dark' ? '#ffffff' : '#000000',
              }}
            />
            <Bar dataKey="RSVPs" fill="#a855f7" radius={[0, 4, 4, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventChart;
