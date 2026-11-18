// client/src/pages/CompleteProfilePage.jsx
// New Google/GitHub users finish their profile here (username, college, terms).
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { PageSkeleton } from '../components/Skeletons';
import { AuthLayout } from '../components/AuthLayout';
import { useUsernameCheck } from '../hooks/useUsernameCheck';
import { apiRequest } from '../utils/apiClient';
import { COLLEGES, DEPARTMENTS, SESSIONS } from '../constants/campus';

const CompleteProfileForm = () => {
  const { firebaseUser, dispatch, extractProviders, logoutUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: firebaseUser.displayName || '',
    username: '',
    college: COLLEGES[0],
    department: DEPARTMENTS[0],
    session: SESSIONS[2],
    acceptedTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const { fullName, username, college, department, session, acceptedTerms } = formData;
  const usernameStatus = useUsernameCheck(username);

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) return toast.error('Please accept the Terms and Conditions to continue.');
    if (!usernameStatus.available) return toast.error('Please choose an available username.');

    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const { user } = await apiRequest('/api/auth/sync', {
        method: 'POST',
        token,
        body: {
          username,
          fullName: fullName || 'Student',
          college,
          department,
          session,
          acceptedTerms,
          providers: extractProviders(firebaseUser),
        },
      });

      dispatch({ type: 'SET_DB_USER', payload: user });
      toast.success(`Profile ready! Your page: /${user.username}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const usernameColor =
    usernameStatus.available === true
      ? 'text-emerald-600'
      : usernameStatus.checking
      ? 'text-slate-400'
      : 'text-rose-600';

  return (
    <AuthLayout
      title="Complete your campus profile"
      subtitle="One last step. Choose your public username and tell us where you study."
      footer={
        <>
          Not you?{' '}
          <button type="button" onClick={logoutUser} className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
            Sign out
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-700">Full name</label>
          <input id="fullName" type="text" name="fullName" value={fullName} onChange={handleChange} required className="input" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">Username</label>
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

        <button type="submit" disabled={submitting || !acceptedTerms} className="btn-primary w-full !py-3">
          {submitting ? 'Saving...' : 'Finish setup'}
        </button>
      </form>
    </AuthLayout>
  );
};

export const CompleteProfilePage = () => {
  const { firebaseUser, dbUser, loading } = useAuth();

  if (loading) {
    return <PageSkeleton />;
  }
  if (!firebaseUser) return <Navigate to="/login" replace />;
  if (dbUser) return <Navigate to="/" replace />;

  return <CompleteProfileForm />;
};