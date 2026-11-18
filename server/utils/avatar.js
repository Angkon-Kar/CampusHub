// server/utils/avatar.js
// Profile photos come from Google or GitHub only (never from a link the user types).
import admin from '../config/firebaseAdmin.js';

const GOOGLE_HOST = /(^|\.)googleusercontent\.com$/;
const GITHUB_HOST = /(^|\.)githubusercontent\.com$/;

// Returns a safe https photo URL, or '' if the address is not a Google/GitHub picture
export const normalizePhotoUrl = (raw) => {
  if (!raw || typeof raw !== 'string') return '';

  let url;
  try {
    url = new URL(raw);
  } catch {
    return '';
  }
  if (url.protocol !== 'https:') return '';

  if (GOOGLE_HOST.test(url.hostname)) {
    // Ask Google for a sharper picture (=s96-c becomes =s256-c)
    return url.href.replace(/=s\d+(-c)?$/, '=s256-c');
  }
  if (GITHUB_HOST.test(url.hostname)) {
    url.searchParams.set('s', '256');
    return url.href;
  }
  return '';
};

// `tokenPicture` is the "picture" claim of the verified ID token.
// If it is missing (for example Google was linked later), ask Firebase which photos the linked providers have.
export const resolveProviderPhoto = async (uid, tokenPicture) => {
  const fromToken = normalizePhotoUrl(tokenPicture);
  if (fromToken) return fromToken;

  try {
    const record = await admin.auth().getUser(uid);
    const candidates = [record.photoURL, ...record.providerData.map(({ photoURL }) => photoURL)];
    for (const candidate of candidates) {
      const safe = normalizePhotoUrl(candidate);
      if (safe) return safe;
    }
  } catch {
    // no photo available
  }
  return '';
};