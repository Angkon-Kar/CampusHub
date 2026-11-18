// client/src/lib/ats/storage.js
// Keeps the last few reports in this browser only (localStorage). Nothing is sent to the server.
const KEY = 'campushub_ats_history';
const MAX_REPORTS = 8;

export const loadHistory = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage can be full or blocked (private mode). The report still shows on screen.
  }
  return list;
};

export const saveReport = (report) =>
  write([report, ...loadHistory().filter(({ id }) => id !== report.id)].slice(0, MAX_REPORTS));

export const deleteReport = (id) => write(loadHistory().filter((report) => report.id !== id));

export const clearHistory = () => write([]);
