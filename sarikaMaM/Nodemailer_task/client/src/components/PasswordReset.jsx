import { useState } from 'react'
import axios from 'axios'

const PasswordReset = () => {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState({ loading: false, success: '', error: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, success: '', error: '' })
        try {
            await axios.post('/api/password/reset', { email })
            setStatus({ loading: false, success: 'Password reset link sent! Check your inbox.', error: '' })
            setEmail('')
        } catch (err) {
            setStatus({ loading: false, success: '', error: 'Failed to send reset link.' })
        }
    }

    return (
        <div className="card">
            <h2>Reset Password</h2>
            <p className="mb-6 text-slate-400">Enter your email address and we'll send you a link to reset your password.</p>
            
            {status.success && <div className="success-message">{status.success}</div>}
            {status.error && <div className="error-message">{status.error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={status.loading}>
                    {status.loading ? 'Processing...' : 'Send Reset Link'}
                </button>
            </form>
        </div>
    )
}

export default PasswordReset
