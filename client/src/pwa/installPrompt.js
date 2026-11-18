// client/src/pwa/installPrompt.js
// Chrome/Edge/Android fire "beforeinstallprompt" once, early. This file is imported in main.jsx so the event is never missed.
import { useSyncExternalStore } from 'react';

let deferredPrompt = null;
const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); // we show our own "Install app" button instead of the automatic bar
    deferredPrompt = event;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });
}

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

// 'installed' | 'available' (one tap) | 'ios' (needs "Add to Home Screen") | 'unavailable'
const getState = () => {
  if (isStandalone()) return 'installed';
  if (deferredPrompt) return 'available';
  if (isIos()) return 'ios';
  return 'unavailable';
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useInstallState = () => useSyncExternalStore(subscribe, getState, () => 'unavailable');

export const promptInstall = async () => {
  if (!deferredPrompt) return 'dismissed';
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  notify();
  return outcome;
};