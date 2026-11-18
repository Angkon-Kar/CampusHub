// client/src/components/ProfileSecurityTab.jsx
import { useState } from 'react';
import { EmailAuthProvider, linkWithCredential, linkWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { CheckCircle2, KeyRound, Mail, MailCheck, MailWarning, LockKeyhole, Send } from 'lucide-react';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { useEmailActions } from '../hooks/useEmailActions';
import { apiRequest } from '../utils/apiClient';
import { getAuthErrorMessage } from '../utils/authErrors';

const ALL_PROVIDERS = [
  { id: 'password', label: 'Email and password' },
  { id: 'google.com', label: 'Google', providerObj: googleProvider },
  { id: 'github.com', label: 'GitHub', providerObj: githubProvider },
];

// Small card shell used for each section of this tab
const Section = ({ Icon, title, description, children }) => (
  <section className="card p-5 sm:p-6 space-y-4">
    <div className="flex items-start gap-3.5">
      <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={19} />
      </span>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
    {children}
  </section>
);

export const ProfileSecurityTab = () => {
  const { firebaseUser, dbUser, dispatch, extractProviders } = useAuth();
  const {
    sendVerification,
    checkVerified,
    sendPasswordReset,
    sendingVerification,
    sendingReset,
    checking,
    verifyCooldown,
    resetCooldown,
  } = useEmailActions();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Which login methods are currently linked
  const activeProviders = extractProviders(firebaseUser);
  const hasPasswordSet = activeProviders.includes('password');
  const isVerified = Boolean(firebaseUser?.emailVerified);

  const saveProvidersToServer = async () => {
    const token = await auth.currentUser.getIdToken();
    const { user } = await apiRequest('/api/auth/profile-security', {
      method: 'PUT',
      token,
      body: { providers: extractProviders(auth.currentUser) },
    });
    dispatch({ type: 'SET_DB_USER', payload: user });
  };

  // Social-login users can add a password for direct email/username login
  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters.');
    if (!firebaseUser?.email) {
      return toast.error('Your account has no email address, so a password cannot be added.');
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, newPassword);
      await linkWithCredential(auth.currentUser, credential);
      await saveProvidersToServer();
      setNewPassword('');
      toast.success('Password added. You can now sign in with your username or email.');
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLinkOAuth = async (providerObj, label) => {
    try {
      await linkWithPopup(auth.currentUser, providerObj);
      await saveProvidersToServer();
      toast.success(`${label} linked to your profile.`);
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <p className="text-sm text-slate-500">
        Your public profile: <span className="text-indigo-600 font-mono">/{dbUser?.username}</span>
      </p>

      {/* Email address + verification */}
      <Section
        Icon={Mail}
        title="Email address"
        description="Verified emails keep accounts safe, and are needed before you can share a post."
      >
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="min-w-0">
            <p className="font-medium text-sm text-slate-900 break-all">{firebaseUser?.email || 'No email on this account'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{isVerified ? 'This address is confirmed.' : 'Not confirmed yet.'}</p>
          </div>
          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              <MailCheck size={14} /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
              <MailWarning size={14} /> Not verified
            </span>
          )}
        </div>

        {!isVerified && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Press the button, open the email we send you, and click the link inside. Then come back and press
              &quot;I have verified&quot;. Check your spam folder if it does not arrive.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={sendVerification}
                disabled={sendingVerification || verifyCooldown > 0 || !firebaseUser?.email}
                className="btn-primary"
              >
                <Send size={15} />
                {verifyCooldown > 0 ? `Resend in ${verifyCooldown}s` : sendingVerification ? 'Sending...' : 'Send verification email'}
              </button>
              <button type="button" onClick={() => checkVerified()} disabled={checking} className="btn-secondary">
                <CheckCircle2 size={15} /> {checking ? 'Checking...' : 'I have verified'}
              </button>
            </div>
          </div>
        )}
      </Section>

      {/* Password */}
      {hasPasswordSet ? (
        <Section
          Icon={LockKeyhole}
          title="Password"
          description="Forgot it, or want a new one? We will email a reset link to your address."
        >
          <button
            type="button"
            onClick={sendPasswordReset}
            disabled={sendingReset || resetCooldown > 0 || !firebaseUser?.email}
            className="btn-secondary"
          >
            <KeyRound size={15} />
            {resetCooldown > 0 ? `Resend in ${resetCooldown}s` : sendingReset ? 'Sending...' : 'Send password reset email'}
          </button>
        </Section>
      ) : (
        <Section
          Icon={KeyRound}
          title="Add a password"
          description="You signed up with a social account. A password lets you also sign in with your username or email."
        >
          <form onSubmit={handleSetPassword} className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              aria-label="New password"
              className="input"
            />
            <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
              {loading ? 'Saving...' : 'Save password'}
            </button>
          </form>
        </Section>
      )}

      {/* Login methods */}
      <Section Icon={CheckCircle2} title="Login methods" description="The ways you can sign in to this account.">
        <div className="space-y-3">
          {ALL_PROVIDERS.map(({ id, label, providerObj }) => {
            const isConnected = activeProviders.includes(id);
            return (
              <div key={id} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="font-medium text-sm text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{isConnected ? 'Connected and active' : 'Not linked yet'}</p>
                </div>

                {isConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    <CheckCircle2 size={14} /> Linked
                  </span>
                ) : (
                  providerObj && (
                    <button type="button" onClick={() => handleLinkOAuth(providerObj, label)} className="btn-secondary !py-1.5 !text-xs">
                      Connect {label}
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
};