// server/middlewares/optionalAuth.js
import admin from '../config/firebaseAdmin.js';
import { User } from '../models/User.js';

// For public routes that show a little more to signed-in users (for example the feed preview).
// A missing, invalid or expired token is NOT an error here: the visitor is simply treated as a guest.
export const optionalAuth = async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');

  if (scheme === 'Bearer' && token) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.firebaseUser = decoded;
      req.viewer = await User.findOne({ firebaseUid: decoded.uid }).select('_id role').lean();
    } catch {
      req.viewer = null;
    }
  }
  next();
};
