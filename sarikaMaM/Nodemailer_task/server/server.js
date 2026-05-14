const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const { sendEmail } = require('./utils/emailService');
const {
    contactTemplate,
    otpTemplate,
    resetTemplate,
    orderTemplate,
    notifyTemplate
} = require('./templates/emailTemplates');

// Models
const Contact = require('./models/Contact');
const OTP = require('./models/OTP');
const Order = require('./models/Order');
const Notification = require('./models/Notification');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes

// 1. Contact Form
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        const html = contactTemplate(name, email, message);
        await sendEmail(process.env.ADMIN_EMAIL, `New Contact from ${name}`, html);
        res.status(200).json({ success: true, message: 'Message sent and saved!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process contact form.' });
    }
});

// 2. OTP Verification
app.post('/api/otp/send', async (req, res) => {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        await OTP.findOneAndUpdate(
            { email }, 
            { otp: otpCode, createdAt: new Date() }, 
            { upsert: true }
        );
        const html = otpTemplate(otpCode);
        await sendEmail(email, 'Your Verification Code', html);
        res.status(200).json({ success: true, message: 'OTP sent!', otp: otpCode });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
});

// 3. Password Reset
app.post('/api/password/reset', async (req, res) => {
    const { email } = req.body;
    const resetLink = `http://localhost:5173/reset-password?token=${Math.random().toString(36).substring(7)}`;
    try {
        const html = resetTemplate(resetLink);
        await sendEmail(email, 'Password Reset Request', html);
        res.status(200).json({ success: true, message: 'Reset link sent!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send reset link.' });
    }
});

// 4. Order Confirmation
app.post('/api/order/confirm', async (req, res) => {
    const { email, orderId, items, total } = req.body;
    try {
        const newOrder = new Order({ email, orderId, items, total });
        await newOrder.save();
        const html = orderTemplate(orderId, items, total);
        await sendEmail(email, `Order Confirmation #${orderId}`, html);
        res.status(200).json({ success: true, message: 'Order confirmed and saved!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process order.' });
    }
});

// 5. Notifications
app.post('/api/notify', async (req, res) => {
    const { email, title, message } = req.body;
    try {
        const newNotification = new Notification({ email, title, message });
        await newNotification.save();
        const html = notifyTemplate(title, message);
        await sendEmail(email, title, html);
        res.status(200).json({ success: true, message: 'Notification sent and logged!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send notification.' });
    }
});

app.get('/', (req, res) => {
    res.send('Nodemailer + MongoDB API (Server Folder) is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
