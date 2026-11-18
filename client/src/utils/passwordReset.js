// client/src/utils/passwordReset.js
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { apiRequest } from './apiClient';

// Takes an email or a username. First tries the server (our own styled email).
// If the server has no email service set up (HTTP 501), it uses Firebase's built-in email instead.
export const requestPasswordReset = async (identifier) => {
  try {
    await apiRequest('/api/email/password-reset', { method: 'POST', body: { identifier }, retry: true });
    return;
  } catch (error) {
    if (error.status !== 501) throw error;
  }

  const { email } = await apiRequest('/api/auth/resolve-identifier', {
    method: 'POST',
    body: { identifier },
    retry: true,
  });
  await sendPasswordResetEmail(auth, email);
};