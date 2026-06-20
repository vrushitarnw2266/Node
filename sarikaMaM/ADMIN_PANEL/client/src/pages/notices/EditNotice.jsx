import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import noticeService from '../../services/noticeService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const EditNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const bulletin = await noticeService.getNoticeById(id);
        if (bulletin) {
          setFormData(bulletin);
        } else {
          setErrors({ api: 'Bulletin notice not found.' });
        }
      } catch (err) {
        setErrors({ api: 'Failed to load announcement details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required.';
    if (!formData.content?.trim()) newErrors.content = 'Content is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await noticeService.updateNotice(id, formData);
      navigate('/notices');
    } catch (err) {
      setErrors({ api: err.message || 'Failed to update notice.' });
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
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Modify Bulletin Announcement</h2>
      </div>

      {errors.api && (
        <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          {errors.api}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <Button type="submit" disabled={saving} icon={<Save size={16} />}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditNotice;
