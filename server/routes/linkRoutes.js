import express from 'express';
import { verifyFirebaseToken } from '../middlewares/authMiddleware.js';
import { validateAndUnmaskLink } from '../middlewares/linkValidator.js';

const router = express.Router();

// POST /api/links/verify -> live link check BEFORE the Upload button unlocks.
// Login is required: otherwise anybody could use our server as a free URL-scanning proxy.
router.post('/verify', verifyFirebaseToken, validateAndUnmaskLink, (req, res) => {
  // Requirement: Object Destructuring
  const { originalLink, unmaskedLink, isMasked, hostname, aiSafetyNote } = req.linkMeta;

  res.status(200).json({
    success: true,
    message: isMasked
      ? `Masked link resolved to ${hostname} and verified safe!`
      : 'Link verified successfully!',
    data: { originalLink, unmaskedLink, isMasked, hostname, aiSafetyNote },
  });
});

export default router;
