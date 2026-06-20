import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import leaveService from '../../services/leaveService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const ApplyLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'Sick Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.reason.trim()) newErrors.reason = 'Please explain the reason for your leave request.';
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date cannot be earlier than start date.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        userId: user.id || 'std-1',
        userName: user.name || 'Marcus Sterling',
        userRole: user.role || 'student',
      };
      await leaveService.applyLeave(payload);
      navigate('/leave');
    } catch (err) {
      setErrors({ api: err.message || 'Failed to submit leave application.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/leave')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Apply for Leave</h2>
      </div>

      {errors.api && (
        <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          {errors.api}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Leave Type"
            name="type"
            type="select"
            value={formData.type}
            onChange={handleChange}
            options={['Sick Leave', 'Casual Leave', 'Duty Leave', 'Maternity/Paternity Leave']}
            required
          />

          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />

          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            required
          />
        </div>

        <Input
          label="Reason for Application"
          name="reason"
          type="textarea"
          placeholder="Briefly state why you require this leave period..."
          value={formData.reason}
          onChange={handleChange}
          error={errors.reason}
          required
        />

        <div className="flex space-x-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={() => navigate('/leave')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} icon={<Send size={15} />}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </div>
    </>
  );

};

export default ApplyLeave;
