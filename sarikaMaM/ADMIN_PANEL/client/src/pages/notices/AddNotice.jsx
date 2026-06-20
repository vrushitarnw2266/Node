import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import noticeService from '../../services/noticeService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const AddNotice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    content: '',
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
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.content.trim()) newErrors.content = 'Content is required.';
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
        author: user.name || 'Campus Admin',
        date: new Date().toISOString(),
      };
      await noticeService.createNotice(payload);
      navigate('/notices');
    } catch (err) {
      setErrors({ api: err.message || 'Failed to post notice. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/notices')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Post Announcement Bulletin</h2>
      </div>

      {errors.api && (
        <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          {errors.api}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          <div className="md:col-span-2">
            <Input
              label="Bulletin Title"
              name="title"
              placeholder="e.g. Schedule for Mid-Term Exams"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />
          </div>

          <Input
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={handleChange}
            options={['General', 'Academic', 'Exam', 'Event']}
            required
          />
        </div>

        <Input
          label="Announcements Content"
          name="content"
          type="textarea"
          rows={6}
          placeholder="Explain details here..."
          value={formData.content}
          onChange={handleChange}
          error={errors.content}
          required
        />

        <div className="flex space-x-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={() => navigate('/notices')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} icon={<Send size={15} />}>
            {loading ? 'Posting...' : 'Post Notice'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNotice;
