// client/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
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
import { apiRequest } from '../utils/apiClient';
import { getAuthErrorMessage } from '../utils/authErrors';
import { requestPasswordReset } from '../utils/passwordReset';

export const LoginPage = () => {
  const { dbUser, needsOnboarding } = useAuth();
  const from = useLocation().state?.from || '/';
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { identifier, password } = formData;

  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  // Email or username -> email (the server looks up usernames)
  const resolveEmail = async () => {
    const { email } = await apiRequest('/api/auth/resolve-identifier', {
      method: 'POST',
      body: { identifier },
      retry: true,
    });
    return email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const email = await resolveEmail();
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back! You are signed in.');
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!identifier.trim()) return toast.error('Enter your email or username first.');
    try {
      await requestPasswordReset(identifier.trim());
      toast.success('If an account exists, a password reset email is on its way. Check your inbox and spam folder.');
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  };

  if (needsOnboarding) return <Navigate to="/complete-profile" replace />;
  if (dbUser) return <Navigate to={from} replace />;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to download resources, share your own and chat with your department."
      footer={
        <>
          New to Campus Hub?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create a free account
          </Link>
        </>
      }
    >
      <SocialButtons rememberMe={rememberMe} label="Continue with" />

      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">or use your email or username</span>
        <span className="flex-1 h-px bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="identifier" className="text-sm font-medium text-slate-700">
            Email or username
          </label>
          <input
            id="identifier"
            type="text"
            name="identifier"
            autoComplete="username"
            placeholder="e.g. angkonkar"
            value={identifier}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="Your password"
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

        <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 accent-indigo-600"
          />
          Remember me on this device
        </label>

        <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
};