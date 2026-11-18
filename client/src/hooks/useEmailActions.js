// client/src/hooks/useEmailActions.js
// Verification email, "I have verified" check and password reset email, shared by the banner and the Security tab.
import { useState, useEffect } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth } from '../config/firebase';
import { useAuth } from './useAuth';
import { apiRequest } from '../utils/apiClient';
import { getAuthErrorMessage } from '../utils/authErrors';
import { requestPasswordReset } from '../utils/passwordReset';

const COOLDOWN_SECONDS = 60;

// Counts down after an email was sent, so nobody presses "send" ten times in a row
const useCooldown = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return [seconds, () => setSeconds(COOLDOWN_SECONDS)];
};

export const useEmailActions = () => {
  const { firebaseUser, dispatch } = useAuth();
  const [verifyCooldown, startVerifyCooldown] = useCooldown();
  const [resetCooldown, startResetCooldown] = useCooldown();
  const [sendingVerification, setSendingVerification] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [checking, setChecking] = useState(false);

  // Our styled email first; Firebase's own email if the server has no email service (HTTP 501)
  const sendVerification = async () => {
    if (!firebaseUser) return;
    setSendingVerification(true);
    try {
      const token = await firebaseUser.getIdToken();
      try {
        const data = await apiRequest('/api/email/verification', { method: 'POST', token });
        if (data.alreadyVerified) {
          toast('Your email is already verified. Press "I have verified" to refresh.');
          return;
        }
      } catch (error) {
        if (error.status !== 501) throw error;
        await sendEmailVerification(auth.currentUser);
      }
      toast.success('Verification email sent. Check your inbox and spam folder.');
      startVerifyCooldown();
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSendingVerification(false);
    }
  };

  // Reload the Firebase user and force a fresh token, so the app and the server both see the new status
  const checkVerified = async ({ silent = false } = {}) => {
    setChecking(true);
    try {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      dispatch({ type: 'SET_FIREBASE_USER', payload: auth.currentUser });
      const verified = auth.currentUser.emailVerified;
      if (!silent) {
        if (verified) toast.success('Email verified. You can post now!');
        else toast('Not verified yet. Open the link in the email first.');
      }
      return verified;
    } catch (error) {
      if (!silent) toast.error(getAuthErrorMessage(error));
      return false;
    } finally {
      setChecking(false);
    }
  };

  // Password reset email to the signed-in user's own address
  const sendPasswordReset = async () => {
    if (!firebaseUser?.email) return toast.error('Your account has no email address.');
    setSendingReset(true);
    try {
      await requestPasswordReset(firebaseUser.email);
      toast.success('Password reset email sent. Check your inbox and spam folder.');
      startResetCooldown();
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSendingReset(false);
    }
  };

  return {
    sendVerification,
    checkVerified,
    sendPasswordReset,
    sendingVerification,
    sendingReset,
    checking,
    verifyCooldown,
    resetCooldown,
  };
};