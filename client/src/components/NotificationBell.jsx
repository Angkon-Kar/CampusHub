// client/src/components/NotificationBell.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, XCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../utils/apiClient';
import { timeAgo } from '../utils/timeAgo';
import { Bone } from './Skeletons';
import { EmptyState } from './EmptyState';

const POLL_MS = 60 * 1000;

const TYPE_ICONS = {
  approved: { Icon: CheckCircle2, style: 'text-emerald-600 bg-emerald-50' },
  declined: { Icon: XCircle, style: 'text-rose-600 bg-rose-50' },
  feedback: { Icon: MessageSquare, style: 'text-amber-600 bg-amber-50' },
  reported: { Icon: AlertTriangle, style: 'text-orange-600 bg-orange-50' },
  review_approved: { Icon: CheckCircle2, style: 'text-emerald-600 bg-emerald-50' },
  review_declined: { Icon: XCircle, style: 'text-rose-600 bg-rose-50' },
};

export const NotificationBell = () => {
  const { firebaseUser, dbUser } = useAuth();
  const [items, setItems] = useState(null); // null = first load
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  // Load now, then every minute while the tab is visible (and again when the visitor comes back)
  useEffect(() => {
    if (!firebaseUser) return;
    let cancelled = false;

    const load = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const { notifications, unreadCount } = await apiRequest('/api/notifications', { token });
        if (cancelled) return;
        setItems(notifications);
        setUnread(unreadCount);
      } catch {
        if (!cancelled) setItems((previous) => previous ?? []);
      }
    };

    load();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, POLL_MS);
    const handleVisible = () => document.visibilityState === 'visible' && load();
    document.addEventListener('visibilitychange', handleVisible);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisible);
    };
  }, [firebaseUser]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const handlePointer = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const toggle = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (!willOpen || unread === 0) return;

    // The badge clears right away; the dots inside the list stay until the next refresh
    setUnread(0);
    try {
      const token = await firebaseUser.getIdToken();
      await apiRequest('/api/notifications/read', { method: 'POST', token, body: {} });
    } catch {
      // not critical
    }
  };

  const targetFor = ({ type, post }) =>
    type.startsWith('review')
      ? { to: '/reviews' }
      : type === 'approved' && post
      ? { to: `/post/${post}` }
      : { to: `/${dbUser.username}`, state: { tab: 'status' } };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
      >
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-4.5 h-4.5 px-1 grid place-items-center rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-[4.25rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 z-50 card shadow-xl shadow-slate-900/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 text-sm font-semibold text-slate-900">Notifications</div>

          <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto">
            {items === null && (
              <div className="p-4 space-y-3" role="status" aria-busy="true">
                <span className="sr-only">Loading notifications</span>
                {Array.from({ length: 3 }, (_, i) => (
                  <Bone key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            )}

            {items?.length === 0 && (
              <EmptyState variant="inbox" bare compact title="You are all caught up" text="Updates about your posts will show up here." />
            )}

            {items?.map((item) => {
              const { Icon, style } = TYPE_ICONS[item.type] || TYPE_ICONS.feedback;
              const { to, state } = targetFor(item);
              return (
                <Link
                  key={item._id}
                  to={to}
                  state={state}
                  onClick={() => setOpen(false)}
                  className={`flex gap-3 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition ${
                    item.read ? '' : 'bg-indigo-50/40'
                  }`}
                >
                  <span className={`grid place-items-center w-8 h-8 shrink-0 rounded-full ${style}`}>
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-slate-900 truncate">{item.title || 'Your post'}</span>
                    <span className="block text-sm text-slate-600 line-clamp-2">{item.message}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">{timeAgo(item.createdAt)}</span>
                  </span>
                  {!item.read && <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-indigo-500" aria-label="Unread" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};