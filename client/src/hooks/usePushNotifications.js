// client/src/hooks/usePushNotifications.js
import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/apiClient';
import { useAuth } from './useAuth';

const isPushSupported = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

// The server's VAPID public key arrives as base64url text; the browser wants bytes
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
};

export const usePushNotifications = () => {
  const { firebaseUser } = useAuth();
  const supported = isPushSupported();

  const [permission, setPermission] = useState(() => (isPushSupported() ? Notification.permission : 'unsupported'));
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  // Is this browser already subscribed?
  useEffect(() => {
    if (!supported) return;
    let cancelled = false;

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        if (!cancelled) setSubscribed(Boolean(subscription));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [supported]);

  // Each action throws a readable Error, so the caller can show it in a toast
  const subscribe = async () => {
    setBusy(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        throw new Error('Notifications are blocked. Allow them in your browser or phone settings, then try again.');
      }

      const { publicKey } = await apiRequest('/api/push/public-key');
      if (!publicKey) throw new Error('Push notifications are not set up on the server yet.');

      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      const token = await firebaseUser.getIdToken();
      await apiRequest('/api/push/subscribe', {
        method: 'POST',
        token,
        body: { subscription: subscription.toJSON() },
      });
      setSubscribed(true);
    } finally {
      setBusy(false);
    }
  };

  const unsubscribe = async () => {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const token = await firebaseUser.getIdToken();
        await apiRequest('/api/push/unsubscribe', { method: 'POST', token, body: { endpoint: subscription.endpoint } });
        await subscription.unsubscribe();
      }
      setSubscribed(false);
    } finally {
      setBusy(false);
    }
  };

  const sendTest = async () => {
    const token = await firebaseUser.getIdToken();
    await apiRequest('/api/push/test', { method: 'POST', token });
  };

  return { supported, permission, subscribed, busy, subscribe, unsubscribe, sendTest };
};
