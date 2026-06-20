import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import facultyService from '../../services/facultyService';
import { DEPARTMENTS } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const EditFaculty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    facultyId: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    status: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const staff = await facultyService.getFacultyById(id);
        if (staff) {
          // Normalize date format for date input
          if (staff.joiningDate) {
            staff.joiningDate = new Date(staff.joiningDate).toISOString().split('T')[0];
          }
          setFormData(staff);
        } else {
          setErrors({ api: 'Faculty member not found.' });
        }
      } catch (err) {
        setErrors({ api: 'Failed to load faculty details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
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
    if (!formData.name?.trim()) newErrors.name = 'Name is required.';
    if (!formData.facultyId?.trim()) newErrors.facultyId = 'Faculty ID is required.';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required.';
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
      await facultyService.updateFaculty(id, formData);
      navigate('/faculty');
    } catch (error) {
      setErrors({ api: error.message || 'Failed to update faculty member.' });
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
          onClick={() => navigate('/faculty')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Edit Faculty Profile</h2>
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
            label="Full Name"
            name="name"
            placeholder="Dr. John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Faculty ID"
            name="facultyId"
            placeholder="FAC-CS-010"
            value={formData.facultyId}
            onChange={handleChange}
            error={errors.facultyId}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="john.doe@campus.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          <Input
            label="Academic Department"
            name="department"
            type="select"
            value={formData.department}
            onChange={handleChange}
            options={DEPARTMENTS}
            required
          />

          <Input
            label="Designation"
            name="designation"
            type="select"
            value={formData.designation}
            onChange={handleChange}
            options={[
              'Professor & Dean',
              'Associate Professor & HOD',
              'Associate Professor',
              'Assistant Professor',
              'Senior Lecturer',
              'Lecturer',
              'Guest Faculty',
            ]}
            required
          />

          <Input
            label="Date of Joining"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
            required
          />

          <Input
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleChange}
            options={['active', 'inactive']}
            required
          />
        </div>

        <div className="flex space-x-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={() => navigate('/faculty')}>
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

export default EditFaculty;
