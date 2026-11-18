// client/src/store/authStore.js
// Global auth state: a small reducer-based store (no React Context needed).
// Components read it through the useAuth() hook in src/hooks/useAuth.js.
import { onAuthStateChanged, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth } from '../config/firebase';
import { apiRequest } from '../utils/apiClient';

const initialState = {
  firebaseUser: null,
  dbUser: null, // user document from MongoDB
  needsOnboarding: false, // new social-login user who still needs username + terms
  loading: true,
};

// Which login methods are linked (Array .map + destructuring)
export const extractProviders = (fbUser) =>
  fbUser?.providerData?.map(({ providerId }) => providerId) || [];

const authReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_FIREBASE_USER':
      return { ...state, firebaseUser: payload, loading: false };
    case 'SET_DB_USER':
      return { ...state, dbUser: payload, needsOnboarding: false, loading: false };
    case 'REQUIRES_ONBOARDING':
      // Ignore a late "needs onboarding" if the profile already exists
      if (state.dbUser) return state;
      return { ...state, firebaseUser: payload, needsOnboarding: true, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    default:
      return state;
  }
};

let state = initialState;
let isRegistering = false;
const listeners = new Set();

export const getAuthState = () => state;

export const subscribeAuth = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const dispatchAuth = (action) => {
  state = authReducer(state, action);
  listeners.forEach((listener) => listener());
};

// The register page turns this on while it creates the account and the
// MongoDB profile itself, so the listener below does not sync too early.
export const setRegistering = (value) => {
  isRegistering = value;
};

export const logoutUser = async () => {
  await signOut(auth);
  dispatchAuth({ type: 'LOGOUT' });
  toast.success('Logged out successfully.');
};

const unsubscribeFirebase = onAuthStateChanged(auth, async (fbUser) => {
  if (!fbUser) {
    dispatchAuth({ type: 'LOGOUT' });
    return;
  }

  if (isRegistering) return;

  try {
    const token = await fbUser.getIdToken();
    const { user } = await apiRequest('/api/auth/sync', {
      method: 'POST',
      token,
      body: { providers: extractProviders(fbUser) },
      retry: true, // safe to repeat, and the first call often hits a sleeping server
    });

    dispatchAuth({ type: 'SET_FIREBASE_USER', payload: fbUser });
    dispatchAuth({ type: 'SET_DB_USER', payload: user });
  } catch (error) {
    const { status, data, message } = error;

    // Only a real "new user" response starts onboarding
    if (status === 400 && data?.requiresOnboarding) {
      dispatchAuth({ type: 'REQUIRES_ONBOARDING', payload: fbUser });
    } else {
      dispatchAuth({ type: 'SET_FIREBASE_USER', payload: fbUser });
      toast.error(`Could not reach the server: ${message}`);
    }
  }
});

if (import.meta.hot) import.meta.hot.dispose(unsubscribeFirebase);