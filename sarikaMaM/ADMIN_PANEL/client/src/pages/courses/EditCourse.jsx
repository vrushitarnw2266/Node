import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import courseService from '../../services/courseService';
import { DEPARTMENTS } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    credits: '',
    duration: '',
    syllabus: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await courseService.getCourseById(id);
        if (course) {
          setFormData(course);
        } else {
          setErrors({ api: 'Course not found.' });
        }
      } catch (err) {
        setErrors({ api: 'Failed to load course details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
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
    if (!formData.code?.trim()) newErrors.code = 'Course code is required.';
    if (!formData.name?.trim()) newErrors.name = 'Course name is required.';
    if (!formData.credits || formData.credits <= 0) newErrors.credits = 'Credits must be a positive number.';
    if (!formData.syllabus?.trim()) newErrors.syllabus = 'Syllabus content is required.';
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
      await courseService.updateCourse(id, formData);
      navigate('/courses');
    } catch (error) {
      setErrors({ api: error.message || 'Failed to update course details.' });
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
          onClick={() => navigate('/courses')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Edit Course Details</h2>
      </div>

      {errors.api && (
        <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          {errors.api}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Course Code"
            name="code"
            placeholder="CS-301"
            value={formData.code}
            onChange={handleChange}
            error={errors.code}
            required
          />

          <Input
            label="Course Title"
            name="name"
            placeholder="Database Systems"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Department"
            name="department"
            type="select"
            value={formData.department}
            onChange={handleChange}
            options={DEPARTMENTS}
            required
          />

          <Input
            label="Course Credits"
            name="credits"
            type="number"
            placeholder="e.g. 4"
            value={formData.credits}
            onChange={handleChange}
            error={errors.credits}
            required
          />

          <Input
            label="Program Duration"
            name="duration"
            type="select"
            value={formData.duration}
            onChange={handleChange}
            options={['3 Months', '6 Months', '1 Year']}
            required
          />
        </div>

        <Input
          label="Syllabus Outline"
          name="syllabus"
          type="textarea"
          placeholder="Enter description of units covered..."
          value={formData.syllabus}
          onChange={handleChange}
          error={errors.syllabus}
          required
        />

        <div className="flex space-x-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={() => navigate('/courses')}>
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

export default EditCourse;
