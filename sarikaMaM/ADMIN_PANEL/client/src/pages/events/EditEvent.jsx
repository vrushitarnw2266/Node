import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import eventService from '../../services/eventService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    coordinator: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const evt = await eventService.getEventById(id);
        if (evt) {
          // Normalize date format for date input
          if (evt.date) {
            evt.date = new Date(evt.date).toISOString().split('T')[0];
          }
          setFormData(evt);
        } else {
          setErrors({ api: 'Event details not found.' });
        }
      } catch (err) {
        setErrors({ api: 'Failed to load event data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
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
    if (!formData.title?.trim()) newErrors.title = 'Event title is required.';
    if (!formData.venue?.trim()) newErrors.venue = 'Venue location is required.';
    if (!formData.coordinator?.trim()) newErrors.coordinator = 'Coordinator name is required.';
    if (!formData.description?.trim()) newErrors.description = 'Description is required.';
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
      await eventService.updateEvent(id, formData);
      navigate('/events');
    } catch (err) {
      setErrors({ api: err.message || 'Failed to update event details.' });
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
          onClick={() => navigate('/events')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to Planner</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Edit Event Details</h2>
      </div>

      {errors.api && (
        <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          {errors.api}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Event Title"
              name="title"
              placeholder="e.g. Annual Sports Tournament"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />
          </div>

          <Input
            label="Schedule Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <Input
            label="Schedule Time"
            name="time"
            placeholder="e.g. 10:00 AM - 4:00 PM"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <Input
            label="Venue Location"
            name="venue"
            placeholder="e.g. Seminar Hall A"
            value={formData.venue}
            onChange={handleChange}
            error={errors.venue}
            required
          />

          <Input
            label="Event Coordinator / Sponsor"
            name="coordinator"
            placeholder="e.g. Prof. Alan Turing"
            value={formData.coordinator}
            onChange={handleChange}
            error={errors.coordinator}
            required
          />
        </div>

        <Input
          label="Event Description"
          name="description"
          type="textarea"
          rows={5}
          placeholder="Detail event activities, prerequisites, speaker info..."
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
        />

        <div className="flex space-x-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={() => navigate('/events')}>
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

export default EditEvent;
