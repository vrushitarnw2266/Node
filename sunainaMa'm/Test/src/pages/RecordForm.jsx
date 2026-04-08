import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createRecord, getRecordById, updateRecord } from '../api';

const RecordForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        image: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit) {
            loadRecord();
        }
    }, [id]);

    const loadRecord = async () => {
        try {
            const data = await getRecordById(id);
            setFormData(data);
        } catch (error) {
            console.error('Failed to load record:', error);
            navigate('/');
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters long.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        const phoneRegex = /^\d+$/;
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone must contain only numbers.';
        }

        if (!formData.image || !formData.image.startsWith('http')) {
            newErrors.image = 'Image must be a valid online URL (starting with http).';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // clear error for this field dynamically
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                if (isEdit) {
                    await updateRecord(id, formData);
                } else {
                    await createRecord(formData);
                }
                navigate('/');
            } catch (error) {
                console.error('Submission failed:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="page-container glass-panel form-card fade-in">
            <div className="form-header">
                <h2 className="gradient-text">{isEdit ? 'Edit Record' : 'Create New Record'}</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {isEdit ? 'Update the details below.' : 'Fill in the information to add a new entry.'}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="1234567890"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="image">Profile Image URL</label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/avatar.jpg"
                    />
                    {errors.image && <span className="error-text">{errors.image}</span>}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Record')}
                    </button>
                    <Link to="/" className="btn btn-secondary" style={{ flex: 1 }}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default RecordForm;
