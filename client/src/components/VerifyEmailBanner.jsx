// client/src/components/VerifyEmailBanner.jsx
import { MailWarning } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEmailActions } from '../hooks/useEmailActions';
import { needsEmailVerification } from '../utils/emailVerification';

// Shown to email/password users until their email is verified
export const VerifyEmailBanner = () => {
  const { firebaseUser, dbUser } = useAuth();
  const { sendVerification, checkVerified, sendingVerification, checking, verifyCooldown } = useEmailActions();

  if (!firebaseUser || !dbUser || !needsEmailVerification(firebaseUser)) return null;

  return (
    <div role="status" className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-amber-900">
        <p className="flex items-start gap-2 flex-1">
          <MailWarning size={17} className="mt-0.5 shrink-0" />
          <span>
            Please verify <span className="font-semibold">{firebaseUser.email}</span> to share resources.
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={sendVerification}
            disabled={sendingVerification || verifyCooldown > 0}
            className="btn-secondary !py-1.5 !text-xs"
          >
            {verifyCooldown > 0 ? `Resend in ${verifyCooldown}s` : sendingVerification ? 'Sending...' : 'Send verification email'}
          </button>
          <button type="button" onClick={() => checkVerified()} disabled={checking} className="btn-secondary !py-1.5 !text-xs">
            {checking ? 'Checking...' : 'I have verified'}
          </button>
        </div>
      </div>
    </div>
  );
};