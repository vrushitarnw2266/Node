/**
 * Email Templates for various tasks
 */

const contactTemplate = (name, email, message) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
</div>
`;

const otpTemplate = (otp) => `
<div style="font-family: Arial, sans-serif; text-align: center; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
    <h2 style="color: #2196F3;">Verification Code</h2>
    <p>Your One-Time Password (OTP) for account verification is:</p>
    <h1 style="font-size: 36px; letter-spacing: 5px; color: #333;">${otp}</h1>
    <p>This code is valid for 10 minutes.</p>
</div>
`;

const resetTemplate = (resetLink) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Password Reset Request</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${resetLink}" style="display: inline-block; background: #FF5722; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
</div>
`;

const orderTemplate = (orderId, items, total) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Order Confirmation</h2>
    <p>Order ID: <strong>#${orderId}</strong></p>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background: #f4f4f4;">
                <th style="padding: 10px; border: 1px solid #ddd;">Item</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
            </tr>
        </thead>
        <tbody>
            ${items.map(item => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>Total</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>$${total.toFixed(2)}</strong></td>
            </tr>
        </tfoot>
    </table>
</div>
`;

const notifyTemplate = (title, body) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="background: #2196F3; color: #fff; padding: 10px 20px;">
        <h2 style="margin: 0;">${title}</h2>
    </div>
    <div style="padding: 20px; border: 1px solid #2196F3; border-top: none;">
        <p>${body}</p>
    </div>
</div>
`;

module.exports = {
    contactTemplate,
    otpTemplate,
    resetTemplate,
    orderTemplate,
    notifyTemplate
};
