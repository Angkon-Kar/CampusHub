// server/routes/profileRoutes.js
import express from 'express';
import { sendServerError } from '../utils/httpError.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { verifyFirebaseToken } from '../middlewares/authMiddleware.js';
import { calculateUserAchievements } from '../utils/achievementEngine.js';

const router = express.Router();

// PUBLIC fields only: never expose email, login providers, firebaseUid
const PUBLIC_USER_FIELDS = 'fullName username college department session badges bio avatarColor avatarUrl role createdAt';

// 1. Public profile by username (GET /api/profile/:username)
router.get('/:username', async (req, res) => {
  const username = String(req.params.username).toLowerCase().trim();

  try {
    const user = await User.findOne({ username }).select(PUBLIC_USER_FIELDS).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found!' });
    }

    // Public profile shows only 'approved' posts
    const approvedPosts = await Post.find({ author: user._id, status: 'approved' })
      .sort({ createdAt: -1 })
      .lean();

    const achievementData = calculateUserAchievements(approvedPosts);
    const { stats, unlockedBadges } = achievementData;

    // Write to DB only when something actually changed (a GET should not write on every visit)
    const newBadgeTitles = unlockedBadges.map(({ title }) => title);
    const newStats = {
      articlesCount: stats.articlesCount,
      resourcesCount: stats.resourcesCount + stats.coursesCount,
      projectsCount: stats.projectsCount,
    };
    const badgesChanged =
      newBadgeTitles.length !== (user.badges || []).length ||
      newBadgeTitles.some((title, index) => title !== user.badges[index]);
    const statsChanged = Object.entries(newStats).some(([key, value]) => user.stats?.[key] !== value);

    if (badgesChanged || statsChanged) {
      await User.findByIdAndUpdate(user._id, { stats: newStats, badges: newBadgeTitles });
    }

    // Requirement: Array Method (.map) + rest destructuring: strip links, reports, admin notes, voter ids
    const sanitizedPosts = approvedPosts.map(
      ({ externalLink, unmaskedLink, reports, adminComment, aiSafetyNote, viewedBy, lovedBy = [], ...rest }) => ({
        ...rest,
        likesCount: lovedBy.length,
      })
    );

    res.status(200).json({
      success: true,
      profile: user,
      achievements: achievementData,
      posts: sanitizedPosts,
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

// 2. Owner's private submissions + review status (GET /api/profile/me/submissions)
router.get('/me/submissions', verifyFirebaseToken, async (req, res) => {
  const { uid } = req.firebaseUser;

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id');
    if (!user) return res.status(404).json({ message: 'User not found!' });

    const myPosts = await Post.find({ author: user._id }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      submissions: myPosts.map(({ reports, viewedBy, lovedBy = [], ...rest }) => ({
        ...rest,
        likesCount: lovedBy.length,
      })),
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

export default router;