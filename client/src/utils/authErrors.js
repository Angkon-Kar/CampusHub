// client/src/utils/authErrors.js
const AUTH_ERROR_MESSAGES = {
  'auth/invalid-credential': 'Incorrect email/username or password.',
  'auth/wrong-password': 'Incorrect email/username or password.',
  'auth/user-not-found': 'No account found with these details.',
  'auth/email-already-in-use': 'This email already has an account. Try signing in instead.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'The sign-in window was closed before finishing.',
  'auth/cancelled-popup-request': 'The sign-in window was closed before finishing.',
  'auth/popup-blocked': 'Your browser blocked the sign-in popup. Allow popups and try again.',
  'auth/account-exists-with-different-credential':
    'An account with this email already exists using another sign-in method. Sign in with that method, then link this one from your Security tab.',
  'auth/provider-already-linked': 'This sign-in method is already linked to your account.',
  'auth/credential-already-in-use': 'That account is already linked to a different profile.',
  'auth/requires-recent-login': 'For security, please log out and log in again, then retry.',
};

export const getAuthErrorMessage = (error) => {
  const { code, message } = error || {};
  return AUTH_ERROR_MESSAGES[code] || message || 'Something went wrong. Please try again.';
};
