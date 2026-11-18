// server/middlewares/roleMiddleware.js
import { User } from '../models/User.js';
import { sendServerError } from '../utils/httpError.js';

// Requirement: Arrow Function + Destructuring + Array Method (.includes)
export const requireRole = (allowedRoles = ['admin', 'moderator']) => {
  return async (req, res, next) => {
    const { uid } = req.firebaseUser || {};

    try {
      const currentUser = await User.findOne({ firebaseUid: uid });

      if (!currentUser || !allowedRoles.includes(currentUser.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Admin or Moderator privileges required!',
        });
      }

      req.adminUser = currentUser;
      next();
    } catch (error) {
      return sendServerError(res, error);
    }
  };
};