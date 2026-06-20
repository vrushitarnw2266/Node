import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Shield, User, Award, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 select-none max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Account Profile
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspect your verified personal account files and platform security credentials.
        </p>
      </div>

      {/* Profile summary card */}
      <div className="p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt="Avatar"
          className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover ring-4 ring-indigo-500/20 shrink-0"
        />

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
              {user?.name || 'Administrator'}
            </h3>
            <span className="inline-flex px-2 py-0.5 text-[9px] font-black uppercase rounded-md border bg-indigo-500/10 border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
              Verified {user?.role || 'Guest'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs max-w-lg">
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <Mail size={16} className="text-slate-400" />
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase">Email</span>
                <span className="font-semibold">{user?.email || 'admin@campus.com'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <Shield size={16} className="text-slate-400" />
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase">Access Role</span>
                <span className="font-semibold capitalize">{user?.role || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
