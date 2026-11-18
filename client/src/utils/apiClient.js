// client/src/utils/apiClient.js
// Native fetch wrapper (Rules.md: no Axios) with a timeout, retries and a "server is waking up" message,
// because the free Render plan sleeps and the first request can take up to a minute.
import toast from 'react-hot-toast';

const { VITE_API_BASE_URL = 'http://localhost:5000' } = import.meta.env;

const REQUEST_TIMEOUT_MS = 40 * 1000; // one attempt
const MAX_ATTEMPTS = 3; // for safe (retryable) requests
const RETRY_DELAY_MS = 2500;
const SLOW_NOTICE_MS = 4000; // show the "waking up" message after this long
const WAKE_TOAST_ID = 'server-waking-up';

let slowRequests = 0; // how many requests currently show the notice

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, options) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

// GET requests retry on their own. Other requests only retry when the caller says it is safe (retry: true).
export const apiRequest = async (path, { method = 'GET', token, body, retry = method === 'GET' } = {}) => {
  const options = {
    method,
    headers: {
      ...(body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  let showedNotice = false;
  const noticeTimer = setTimeout(() => {
    showedNotice = true;
    slowRequests += 1;
    toast.loading('Waking up the server. This can take up to a minute after a quiet period...', {
      id: WAKE_TOAST_ID,
    });
  }, SLOW_NOTICE_MS);

  try {
    let response;

    for (let attempt = 1; ; attempt += 1) {
      const canRetry = retry && attempt < MAX_ATTEMPTS;
      try {
        response = await fetchWithTimeout(`${VITE_API_BASE_URL}${path}`, options);
        // 502/503/504 while the host is starting up
        if (canRetry && [502, 503, 504].includes(response.status)) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        break;
      } catch (networkError) {
        if (canRetry) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        throw new Error(
          networkError.name === 'AbortError'
            ? 'The server took too long to respond. Please try again.'
            : 'Could not reach the server. Check your connection and try again.',
          { cause: networkError }
        );
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const { message = `Request failed (${response.status})` } = data;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } finally {
    clearTimeout(noticeTimer);
    if (showedNotice) {
      slowRequests -= 1;
      if (slowRequests === 0) toast.dismiss(WAKE_TOAST_ID);
    }
  }
};