import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Sends a verification email.
 * For production, update `transporter` settings to match your provider (e.g., SendGrid, Amazon SES).
 */
export async function sendVerificationEmail(to, token) {
  const mailOptions = {
    from: '"YouToBus" <no-reply@yourapp.com>',
    to,
    subject: 'Verify Your Email Address',
    text: `Hello! Please verify your email by clicking the link below:\n\n${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`,
    html: `<p>Hello!</p><p>Please verify your email by clicking the link below:</p><a href="${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}">Verify Email</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}
