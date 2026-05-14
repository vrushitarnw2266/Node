import { useState } from 'react'
import axios from 'axios'

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState({ loading: false, success: '', error: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, success: '', error: '' })
        try {
            await axios.post('/api/contact', formData)
            setStatus({ loading: false, success: 'Message sent successfully!', error: '' })
            setFormData({ name: '', email: '', message: '' })
        } catch (err) {
            setStatus({ loading: false, success: '', error: 'Failed to send message. Please try again.' })
        }
    }

    return (
        <div className="card">
            <h2>Contact Us</h2>
            {status.success && <div className="success-message">{status.success}</div>}
            {status.error && <div className="error-message">{status.error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input 
                        type="text" 
                        placeholder="John Doe" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Message</label>
                    <textarea 
                        rows="4" 
                        placeholder="How can we help you?" 
                        required 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                </div>
                <button type="submit" disabled={status.loading}>
                    {status.loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    )
}

export default ContactForm
