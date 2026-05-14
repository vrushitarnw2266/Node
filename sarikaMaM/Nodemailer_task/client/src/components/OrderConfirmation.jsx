import { useState } from 'react'
import axios from 'axios'

const OrderConfirmation = () => {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState({ loading: false, success: '', error: '' })

    const sampleOrder = {
        orderId: 'VGT-88291',
        items: [
            { name: 'Gourmet Veggie Burger', quantity: 2, price: 12.99 },
            { name: 'Truffle Fries', quantity: 1, price: 5.50 },
            { name: 'Organic Lemonade', quantity: 2, price: 3.99 }
        ],
        total: 39.46
    }

    const handleSimulateOrder = async () => {
        if (!email) {
            setStatus({ ...status, error: 'Please enter an email address first.' })
            return
        }

        setStatus({ loading: true, success: '', error: '' })
        try {
            await axios.post('/api/order/confirm', { 
                email, 
                ...sampleOrder 
            })
            setStatus({ loading: false, success: 'Order placed! Confirmation email sent.', error: '' })
        } catch (err) {
            setStatus({ loading: false, success: '', error: 'Failed to send confirmation.' })
        }
    }

    return (
        <div className="card">
            <h2>Checkout</h2>
            <p className="mb-4 text-slate-400">Simulate a purchase to receive a rich HTML order confirmation email.</p>
            
            <div className="bg-slate-800/50 p-4 rounded-lg mb-6 text-left border border-white/5">
                <h4 className="mt-0 text-blue-400">Order Preview</h4>
                {sampleOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-white/5">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2 text-lg">
                    <span>Total</span>
                    <span>${sampleOrder.total}</span>
                </div>
            </div>

            {status.success && <div className="success-message">{status.success}</div>}
            {status.error && <div className="error-message">{status.error}</div>}
            
            <div className="form-group">
                <label>Send Receipt To</label>
                <input 
                    type="email" 
                    placeholder="customer@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button onClick={handleSimulateOrder} disabled={status.loading} className="w-full">
                {status.loading ? 'Processing Order...' : 'Complete Purchase'}
            </button>
        </div>
    )
}

export default OrderConfirmation
