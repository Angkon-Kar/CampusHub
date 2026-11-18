// server/utils/mailer.js
// Optional: sends our own styled emails through SMTP (Gmail, Brevo, Resend SMTP...).
// If the SMTP_* variables are missing, the client falls back to Firebase's built-in emails.
import nodemailer from 'nodemailer';

export const isMailConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

export const sendMail = ({ to, subject, html, text }) =>
  getTransporter().sendMail({
    from: process.env.MAIL_FROM || `Campus Hub <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });