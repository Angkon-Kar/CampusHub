// client/src/components/NotificationSettings.jsx
// Shown inside the Security tab of the owner's profile.
import toast from 'react-hot-toast';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications';

export const NotificationSettings = () => {
  const { supported, permission, subscribed, busy, subscribe, unsubscribe, sendTest } = usePushNotifications();

  const run = async (action, successMessage) => {
    try {
      await action();
      if (successMessage) toast.success(successMessage);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
        <Bell size={16} className="text-indigo-600" /> Phone notifications
      </h4>

      {!supported ? (
        <p className="text-sm text-slate-500">
          This browser cannot show push notifications. On iPhone, open Campus Hub in Safari, tap Share, choose
          &quot;Add to Home Screen&quot;, then open it from the Home Screen (iOS 16.4 or newer).
        </p>
      ) : permission === 'denied' ? (
        <p className="text-sm text-rose-600">
          Notifications are blocked for this site. Allow them in your browser or phone settings, then reload the page.
        </p>
      ) : (
        <>
          <p className="text-sm text-slate-500">
            Get a message on this device when a moderator approves or declines your post.
          </p>
          <div className="flex flex-wrap gap-2">
            {subscribed ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(unsubscribe, 'Notifications turned off on this device.')}
                  className="btn-secondary !py-2"
                >
                  {busy ? <Loader2 size={15} className="animate-spin" /> : <BellOff size={15} />} Turn off
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(sendTest, 'Test notification sent.')}
                  className="btn-secondary !py-2"
                >
                  Send a test
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => run(subscribe, 'Notifications enabled on this device.')}
                className="btn-primary !py-2"
              >
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Bell size={15} />} Turn on notifications
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
