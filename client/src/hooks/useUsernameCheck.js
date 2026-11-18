// client/src/hooks/useUsernameCheck.js
import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/apiClient';
import { RESERVED_USERNAMES } from '../constants/campus';

// Checks the format locally, then asks the server if the username is free.
const getLocalError = (username) => {
  if (!username) return '';
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return 'Use 3-20 characters: lowercase letters, numbers or underscore.';
  }
  if (RESERVED_USERNAMES.includes(username)) return 'This username is reserved.';
  return '';
};

export const useUsernameCheck = (rawUsername) => {
  const username = rawUsername.toLowerCase().trim();
  const localError = getLocalError(username);
  const [remote, setRemote] = useState({ forUsername: '', available: null, message: '' });

  useEffect(() => {
    if (!username || localError) return;

    const timer = setTimeout(async () => {
      try {
        const { available, message } = await apiRequest(
          `/api/auth/check-username?username=${encodeURIComponent(username)}`
        );
        setRemote({ forUsername: username, available, message });
      } catch (error) {
        setRemote({ forUsername: username, available: false, message: error.message });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username, localError]);

  if (!username) return { checking: false, available: null, message: '' };
  if (localError) return { checking: false, available: false, message: localError };
  if (remote.forUsername !== username) {
    return { checking: true, available: null, message: 'Checking availability...' };
  }
  return { checking: false, available: remote.available, message: remote.message };
};
