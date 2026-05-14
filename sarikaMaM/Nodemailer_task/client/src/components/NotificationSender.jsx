import { useState } from 'react'
import axios from 'axios'

const NotificationSender = () => {
    const [formData, setFormData] = useState({ email: '', title: '', message: '' })
    const [status, setStatus] = useState({ loading: false, success: '', error: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, success: '', error: '' })
        try {
            await axios.post('/api/notify', formData)
            setStatus({ loading: false, success: 'Notification sent!', error: '' })
            setFormData({ ...formData, title: '', message: '' })
        } catch (err) {
            setStatus({ loading: false, success: '', error: 'Failed to send notification.' })
        }
    }

    return (
        <div className="card">
            <h2>System Notification</h2>
            <p className="mb-6 text-slate-400">Send a general notification to any email address.</p>
            
            {status.success && <div className="success-message">{status.success}</div>}
            {status.error && <div className="error-message">{status.error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Recipient Email</label>
                    <input 
                        type="email" 
                        placeholder="recipient@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Subject / Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Account Security Update" 
                        required 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea 
                        rows="3" 
                        placeholder="Write your notification message here..." 
                        required 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                </div>
                <button type="submit" disabled={status.loading}>
                    {status.loading ? 'Sending...' : 'Send Notification'}
                </button>
            </form>
        </div>
    )
}

export default NotificationSender
