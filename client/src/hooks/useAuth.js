// client/src/hooks/useAuth.js
import { useSyncExternalStore } from 'react';
import {
  getAuthState,
  subscribeAuth,
  dispatchAuth,
  extractProviders,
  logoutUser,
  setRegistering,
} from '../store/authStore';

export const useAuth = () => {
  const state = useSyncExternalStore(subscribeAuth, getAuthState);
  return { ...state, dispatch: dispatchAuth, extractProviders, logoutUser, setRegistering };
};
