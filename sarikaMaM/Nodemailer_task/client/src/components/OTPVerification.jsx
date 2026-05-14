import { useState } from 'react'
import axios from 'axios'

const OTPVerification = () => {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [serverOtp, setServerOtp] = useState(null)
    const [status, setStatus] = useState({ loading: false, success: '', error: '', verified: false })

    const handleSendOTP = async (e) => {
        e.preventDefault()
        setStatus({ ...status, loading: true, success: '', error: '' })
        try {
            const res = await axios.post('/api/otp/send', { email })
            setServerOtp(res.data.otp)
            setStatus({ ...status, loading: false, success: 'OTP sent to your email!', error: '' })
        } catch (err) {
            setStatus({ ...status, loading: false, success: '', error: 'Failed to send OTP.' })
        }
    }

    const handleVerify = () => {
        if (otp === serverOtp) {
            setStatus({ ...status, success: 'Email verified successfully!', error: '', verified: true })
        } else {
            setStatus({ ...status, success: '', error: 'Invalid OTP. Please try again.' })
        }
    }

    return (
        <div className="card">
            <h2>OTP Verification</h2>
            {status.success && <div className="success-message">{status.success}</div>}
            {status.error && <div className="error-message">{status.error}</div>}
            
            {!serverOtp ? (
                <form onSubmit={handleSendOTP}>
                    <div className="form-group">
                        <label>Enter your email to receive OTP</label>
                        <input 
                            type="email" 
                            placeholder="user@example.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={status.loading}>
                        {status.loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            ) : !status.verified ? (
                <div>
                    <div className="form-group">
                        <label>Enter 6-digit OTP</label>
                        <input 
                            type="text" 
                            placeholder="123456" 
                            maxLength="6"
                            required 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    <button onClick={handleVerify} className="w-full">
                        Verify OTP
                    </button>
                    <p className="mt-4 text-sm text-slate-400">
                        Didn't receive it? <button onClick={handleSendOTP} className="bg-transparent p-0 text-blue-400 border-none shadow-none hover:scale-100">Resend</button>
                    </p>
                </div>
            ) : (
                <div className="text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <p>Your email <strong>{email}</strong> is verified.</p>
                </div>
            )}
        </div>
    )
}

export default OTPVerification
