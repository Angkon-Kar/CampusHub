// client/src/components/guide/LockedContent.jsx
// Freemium helper (CV guide + resume checker). When `locked` is true the content stays in place, but a colored glass layer
// (CSS backdrop-filter: blur) covers it, with a Lock icon, "Members only" and a login button in the middle.
// The login button sends the visitor to /login and brings them back to the same page after login.
// Note: this is a visual lock. Real secrets should be loaded from the server after login.
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';

export const LOGIN_LABEL = 'Login to Unlock Full Guide';

export const LoginButton = ({ className = 'btn-primary', label = LOGIN_LABEL }) => {
  const { pathname } = useLocation();
  return (
    <Link to="/login" state={{ from: pathname }} className={className}>
      <Lock size={15} /> {label}
    </Link>
  );
};

export const LockedContent = ({ locked, checking = false, showAction = true, label = LOGIN_LABEL, className = '', children }) => {
  // While Firebase is still checking the session we also cover the content, so guests never see it flash
  const isCovered = locked || checking;

  return (
    <div className={`relative rounded-2xl ${isCovered ? 'overflow-hidden' : ''} ${className}`}>
      <div
        inert={isCovered}
        aria-hidden={isCovered || undefined}
        // The content gets its own blur too. Chrome ignores backdrop-filter inside a parent that also has backdrop-filter,
        // so this keeps the text unreadable everywhere (and it fades away smoothly after login).
        className={`transition-[filter] duration-500 ${isCovered ? `blur-[6px] select-none pointer-events-none ${showAction ? 'min-h-[16.5rem]' : ''}` : 'blur-0'}`}
      >
        {children}
      </div>

      <AnimatePresence>
        {isCovered && (
          <motion.div
            key="glass-lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 grid place-items-center p-3 bg-gradient-to-br from-indigo-200/45 via-white/30 to-violet-200/45 backdrop-blur-lg"
          >
            {checking ? (
              <Loader2 size={22} className="animate-spin text-indigo-500" aria-label="Checking your login" />
            ) : showAction ? (
              <div className="w-full max-w-xs text-center rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-2xl shadow-indigo-900/15 px-6 py-6 space-y-3">
                <span className="mx-auto grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
                  <Lock size={20} />
                </span>
                <p className="text-base font-extrabold text-slate-900">Members only</p>
                <p className="text-sm text-slate-500">Free for every student. Just log in.</p>
                <LoginButton className="btn-primary !py-2.5 w-full" label={label} />
              </div>
            ) : (
              <span className="grid place-items-center w-9 h-9 rounded-full bg-white/85 border border-white text-indigo-600 shadow-lg">
                <Lock size={16} />
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};