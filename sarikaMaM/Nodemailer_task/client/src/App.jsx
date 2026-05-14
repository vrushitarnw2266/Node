import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ShieldCheck, Key, ShoppingCart, Bell } from 'lucide-react'
import ContactForm from './components/ContactForm'
import OTPVerification from './components/OTPVerification'
import PasswordReset from './components/PasswordReset'
import OrderConfirmation from './components/OrderConfirmation'
import NotificationSender from './components/NotificationSender'

function App() {
  const [activeTab, setActiveTab] = useState('contact')

  const tabs = [
    { id: 'contact', name: 'Contact Form', icon: <Mail size={18} />, component: <ContactForm /> },
    { id: 'otp', name: 'OTP Verification', icon: <ShieldCheck size={18} />, component: <OTPVerification /> },
    { id: 'reset', name: 'Password Reset', icon: <Key size={18} />, component: <PasswordReset /> },
    { id: 'order', name: 'Order Confirmation', icon: <ShoppingCart size={18} />, component: <OrderConfirmation /> },
    { id: 'notify', name: 'Notification', icon: <Bell size={18} />, component: <NotificationSender /> },
  ]

  return (
    <div className="min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Nodemailer Tasks
      </motion.h1>

      <div className="nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''} flex items-center gap-2`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <main className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tabs.find(t => t.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
