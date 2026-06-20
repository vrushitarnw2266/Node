import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, Bell, Lock, ShieldAlert, Check } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  // Settings form states
  const [notifSound, setNotifSound] = useState(true);
  const [notifEmails, setNotifEmails] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security password fields
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    // Success simulation
    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  return (
    <div className="space-y-8 select-none max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          System Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust theme customization choices and manage login security files.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar inside Settings */}
        <div className="md:col-span-1 space-y-2">
          <div className="p-4 rounded-xl border border-indigo-500/15 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center space-x-2">
            <Sun size={15} />
            <span>Preferences & theme</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center space-x-2">
            <Lock size={15} />
            <span>Security settings</span>
          </div>
        </div>

        {/* Content panel */}
        <div className="md:col-span-2 space-y-8">
          {/* Theme card */}
          <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Personalization
            </h3>
            
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
              <div>
                <span className="block font-bold">Theme Appearance</span>
                <span className="text-[10px] text-slate-400 font-medium">Select your default screen coloring mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                <span className="capitalize">{theme} Mode</span>
              </button>
            </div>
          </div>

          {/* Email notice preference */}
          <form onSubmit={handleSavePreferences} className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Notification Rules
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-750 dark:text-slate-300">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="block">Receive noticeboard alerts</span>
                  <span className="text-[10px] text-slate-400 font-medium">Get notify tags when bulletins are posted</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmails}
                  onChange={(e) => setNotifEmails(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="block">Sound indicators</span>
                  <span className="text-[10px] text-slate-400 font-medium">Play sounds on desktop bulletins alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifSound}
                  onChange={(e) => setNotifSound(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5"
                />
              </label>
            </div>

            {saveSuccess && (
              <div className="flex items-center space-x-2 text-emerald-500 text-xs font-semibold">
                <Check size={16} />
                <span>Preferences saved successfully.</span>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="submit">Save Rules</Button>
            </div>
          </form>

          {/* Security details reset */}
          <form onSubmit={handlePasswordSubmit} className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Change Account Password
            </h3>

            {passwordError && (
              <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                Your password has been changed successfully.
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />

              <Input
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm new password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="submit">Update Password</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
