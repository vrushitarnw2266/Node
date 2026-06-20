import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import studentService from '../../services/studentService';
import { DEPARTMENTS, COURSES_LIST } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const AddStudent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    phone: '',
    course: 'B.Tech',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    semester: '1st',
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
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.rollNo.trim()) newErrors.rollNo = 'Roll number is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
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
      await studentService.createStudent(formData);
      navigate('/students');
    } catch (error) {
      setErrors({ api: error.message || 'Failed to register student. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Register New Student</h2>
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
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Roll Number"
            name="rollNo"
            placeholder="CS-2026-001"
            value={formData.rollNo}
            onChange={handleChange}
            error={errors.rollNo}
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
            label="Academic Program"
            name="course"
            type="select"
            value={formData.course}
            onChange={handleChange}
            options={COURSES_LIST}
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
            label="Year of study"
            name="year"
            type="select"
            value={formData.year}
            onChange={handleChange}
            options={['1st Year', '2nd Year', '3rd Year', '4th Year']}
            required
          />

          <Input
            label="Semester"
            name="semester"
            type="select"
            value={formData.semester}
            onChange={handleChange}
            options={['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']}
            required
          />
        </div>

        <div className="flex space-x-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={() => navigate('/students')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} icon={<UserPlus size={16} />}>
            {loading ? 'Registering...' : 'Register Student'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
