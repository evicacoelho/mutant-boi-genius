const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send contact form email
const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Blog Contact" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 3px;">
              ${message}
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This message was sent from the contact form on your blog.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};

// Send auto-reply to sender
const sendAutoReply = async ({ name, email, subject }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Mutant Boi Genius" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Your Message</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Mutant Boi Genius</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Auto-reply sent:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('Error sending auto-reply:', error);
    throw error;
  }
};

module.exports = { sendContactEmail, sendAutoReply };