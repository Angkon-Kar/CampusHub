// client/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/AuthLayout';
import { SocialButtons } from '../components/SocialButtons';
import { useUsernameCheck } from '../hooks/useUsernameCheck';
import { apiRequest } from '../utils/apiClient';
import { getAuthErrorMessage } from '../utils/authErrors';
import { COLLEGES, DEPARTMENTS, SESSIONS } from '../constants/campus';

export const RegisterPage = () => {
  const { dbUser, needsOnboarding, dispatch, extractProviders, setRegistering } = useAuth();
  const from = useLocation().state?.from || '/';

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    college: COLLEGES[0],
    department: DEPARTMENTS[0],
    session: SESSIONS[2],
    acceptedTerms: false,
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { fullName, username, email, password, college, department, session, acceptedTerms } = formData;
  const usernameStatus = useUsernameCheck(username);

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) return toast.error('Please accept the Terms and Conditions to continue.');
    if (!usernameStatus.available) return toast.error('Please choose an available username.');

    setSubmitting(true);
    // Tell AuthContext not to sync on its own while we create the profile here
    setRegistering(true);

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
      // Email/password accounts must verify their email before they can post
      sendEmailVerification(fbUser).catch(() => {});

      try {
        const token = await fbUser.getIdToken();
        const { user } = await apiRequest('/api/auth/sync', {
          method: 'POST',
          token,
          body: {
            username,
            fullName,
            college,
            department,
            session,
            acceptedTerms,
            providers: extractProviders(fbUser),
          },
        });

        dispatch({ type: 'SET_FIREBASE_USER', payload: fbUser });
        dispatch({ type: 'SET_DB_USER', payload: user });
        toast.success(`Welcome to Campus Hub! Check your inbox to verify your email. Your profile: /${user.username}`);
      } catch (syncError) {
        // The Firebase account exists but the profile failed: let the user finish it
        dispatch({ type: 'REQUIRES_ONBOARDING', payload: fbUser });
        toast.error(`${syncError.message} Please finish your profile.`);
      }
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setRegistering(false);
      setSubmitting(false);
    }
  };

  if (needsOnboarding) return <Navigate to="/complete-profile" replace />;
  if (dbUser) return <Navigate to={from} replace />;

  const usernameColor =
    usernameStatus.available === true
      ? 'text-emerald-600'
      : usernameStatus.checking
      ? 'text-slate-400'
      : 'text-rose-600';

  return (
    <AuthLayout
      title="Create your free account"
      subtitle="Join students from six colleges. It takes about a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </>
      }
    >
      <SocialButtons rememberMe={rememberMe} label="Sign up with" />

      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">or register with your email</span>
        <span className="flex-1 h-px bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input id="fullName" type="text" name="fullName" placeholder="e.g. Angkon Kar" value={fullName} onChange={handleChange} required className="input" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            autoComplete="off"
            placeholder="e.g. angkonkar"
            value={username}
            onChange={handleChange}
            required
            className="input"
          />
          <div className="flex justify-between gap-3 text-xs">
            <span className="text-slate-500 truncate">
              Your profile: <span className="font-mono text-indigo-600">/{username.toLowerCase() || 'username'}</span>
            </span>
            <span className={`text-right ${usernameColor}`}>{usernameStatus.message}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input id="email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={handleChange} required className="input" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              minLength={6}
              value={password}
              onChange={handleChange}
              required
              className="input pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 px-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="college" className="text-sm font-medium text-slate-700">College</label>
            <select id="college" name="college" value={college} onChange={handleChange} className="input">
              {COLLEGES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="department" className="text-sm font-medium text-slate-700">Department</label>
            <select id="department" name="department" value={department} onChange={handleChange} className="input">
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="session" className="text-sm font-medium text-slate-700">Session</label>
            <select id="session" name="session" value={session} onChange={handleChange} className="input">
              {SESSIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            name="acceptedTerms"
            checked={acceptedTerms}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-indigo-600"
          />
          <span>
            I accept the{' '}
            <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-600 underline">
              Terms and Conditions
            </Link>
            , including teacher permission for slides and the link safety policy.
          </span>
        </label>

        <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 accent-indigo-600"
          />
          Remember me on this device
        </label>

        <button type="submit" disabled={submitting || !acceptedTerms} className="btn-primary w-full !py-3">
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
};