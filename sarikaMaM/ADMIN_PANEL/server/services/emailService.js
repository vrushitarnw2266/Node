const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Standard transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_EMAIL || '',
        pass: process.env.SMTP_PASSWORD || ''
      }
    });

    const message = {
      from: `${process.env.FROM_NAME || 'EduSphere Campus'} <${process.env.FROM_EMAIL || 'noreply@edusphere.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message
    };

    if (process.env.SMTP_EMAIL) {
      const info = await transporter.sendMail(message);
      console.log('Email sent successfully: %s', info.messageId);
      return info;
    } else {
      console.log('--- MOCK EMAIL SENT (SMTP credentials not provided in .env) ---');
      console.log(`To: ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Message: ${options.message}`);
      console.log('--------------------------------------------------------------');
      return { success: true, mocked: true };
    }
  } catch (error) {
    console.error('Email dispatch failed, fallback mock execution:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
