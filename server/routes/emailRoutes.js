// server/routes/emailRoutes.js
// Branded verification and password-reset emails (needs the SMTP_* variables in .env).
// Without SMTP the endpoints answer 501 and the website uses Firebase's own emails instead.
import express from 'express';
import admin from '../config/firebaseAdmin.js';
import { User } from '../models/User.js';
import { verifyFirebaseToken } from '../middlewares/authMiddleware.js';
import { isMailConfigured, sendMail } from '../utils/mailer.js';
import { verificationEmail, passwordResetEmail } from '../utils/emailTemplates.js';
import { sendServerError } from '../utils/httpError.js';

const router = express.Router();

const notConfigured = (res) =>
  res.status(501).json({ success: false, fallback: true, message: 'Custom email is not set up on the server.' });

// Where Firebase sends people after they press the link in the email
const clientUrl = () => (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

// 1. Send my verification email (POST /api/email/verification)
router.post('/verification', verifyFirebaseToken, async (req, res) => {
  if (!isMailConfigured()) return notConfigured(res);

  const { uid, email, email_verified: emailVerified } = req.firebaseUser;
  if (!email) return res.status(400).json({ message: 'Your account has no email address.' });
  if (emailVerified === true) return res.status(200).json({ success: true, alreadyVerified: true });

  try {
    const profile = await User.findOne({ firebaseUid: uid }).select('fullName').lean();
    const link = await admin.auth().generateEmailVerificationLink(email, { url: `${clientUrl()}/` });
    await sendMail({ to: email, ...verificationEmail({ name: profile?.fullName, link }) });
    res.status(200).json({ success: true, message: 'Verification email sent.' });
  } catch (error) {
    sendServerError(res, error, 'Could not send the email right now. Please try again in a few minutes.');
  }
});

// 2. Password reset by email or username (POST /api/email/password-reset)
// The answer is always the same, so nobody can use this to find out which accounts exist.
router.post('/password-reset', async (req, res) => {
  if (!isMailConfigured()) return notConfigured(res);

  const identifier = String(req.body?.identifier ?? '').trim().toLowerCase().slice(0, 120);
  if (!identifier) return res.status(400).json({ message: 'Enter your email or username.' });

  try {
    const profile = identifier.includes('@')
      ? await User.findOne({ email: identifier }).select('email fullName').lean()
      : await User.findOne({ username: identifier }).select('email fullName').lean();
    const email = profile?.email || (identifier.includes('@') ? identifier : null);

    if (email) {
      try {
        const link = await admin.auth().generatePasswordResetLink(email, { url: `${clientUrl()}/login` });
        await sendMail({ to: email, ...passwordResetEmail({ name: profile?.fullName, link }) });
      } catch (error) {
        console.error('Password reset email failed:', error.message); // e.g. no such Firebase user
      }
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists, a password reset email is on its way.',
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

export default router;