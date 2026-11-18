import admin from '../config/firebaseAdmin.js';

// Requirement: Arrow Function + Destructuring
export const verifyFirebaseToken = async (req, res, next) => {
  const { authorization = '' } = req.headers;

  // Requirement: Array Destructuring
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided!' });
  }

  try {
    req.firebaseUser = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    // 401 (not 403) so the client knows it should refresh the token / log in again
    return res.status(401).json({ success: false, message: 'Invalid or expired session token!' });
  }
};

// For public routes that behave a little better for signed-in users (e.g. the feed's "loved" hearts).
// A missing or bad token never blocks the request: the user is simply treated as a guest.
export const optionalFirebaseToken = async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme === 'Bearer' && token) {
    try {
      req.firebaseUser = await admin.auth().verifyIdToken(token);
    } catch {
      // guest
    }
  }
  next();
};

// Email/password accounts must verify their email before posting.
// Google/GitHub accounts come with a provider-verified email, so they pass.
export const requireVerifiedEmail = async (req, res, next) => {
  const { uid, email_verified: emailVerified, firebase } = req.firebaseUser || {};
  if (firebase?.sign_in_provider === 'password' && emailVerified !== true) {
    // The ID token can be up to an hour old. If the person verified after it was issued, Firebase already knows.
    try {
      const record = await admin.auth().getUser(uid);
      if (record.emailVerified) return next();
    } catch {
      // fall through to the 403 below
    }
    return res.status(403).json({
      success: false,
      requiresEmailVerification: true,
      message: 'Please verify your email address before posting. Check your inbox for the verification link.',
    });
  }
  next();
};