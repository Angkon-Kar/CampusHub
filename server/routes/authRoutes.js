import express from 'express';
import { sendServerError } from '../utils/httpError.js';
import { User, COLLEGES, DEPARTMENTS, SESSIONS, AVATAR_COLORS, RESERVED_USERNAMES } from '../models/User.js';
import { verifyFirebaseToken } from '../middlewares/authMiddleware.js';
import { normalizePhotoUrl, resolveProviderPhoto } from '../utils/avatar.js';

const router = express.Router();

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;
const ALLOWED_PROVIDERS = ['password', 'google.com', 'github.com'];

const normalizeUsername = (value) => String(value ?? '').toLowerCase().trim();

const getUsernameError = (username) => {
  if (!USERNAME_REGEX.test(username)) {
    return 'Username must be 3-20 characters (lowercase letters, numbers, or _ only).';
  }
  if (RESERVED_USERNAMES.includes(username)) {
    return 'This username is reserved. Please choose another one.';
  }
  return null;
};

// Only accept known provider ids (the client sends them, so never store them blindly)
const cleanProviders = (list) =>
  Array.isArray(list) ? list.filter((provider) => ALLOWED_PROVIDERS.includes(provider)) : [];

// Providers that the verified Firebase token itself proves ("email" is Firebase's name for password login)
const providersFromToken = ({ firebase: { identities = {} } = {} }) =>
  Object.keys(identities).map((key) => (key === 'email' ? 'password' : key));

const toSafeUser = (userDoc) => {
  const { firebaseUid, __v, ...safeUser } = userDoc.toObject();
  return safeUser;
};

// 1. Real-time unique username check (GET /api/auth/check-username?username=angkonkar)
router.get('/check-username', async (req, res) => {
  const cleanUsername = normalizeUsername(req.query.username);

  const formatError = getUsernameError(cleanUsername);
  if (formatError) {
    return res.status(200).json({ available: false, message: formatError });
  }

  const existingUser = await User.findOne({ username: cleanUsername }).select('_id');
  return res.status(200).json({
    available: !existingUser,
    message: existingUser ? '❌ Username is already taken!' : '✅ Username is available!',
  });
});

// 2. Resolve username -> email so users can log in with either (rate-limited strictly in server.js)
router.post('/resolve-identifier', async (req, res) => {
  const cleanInput = normalizeUsername(req.body?.identifier);

  if (cleanInput.includes('@')) {
    return res.status(200).json({ email: cleanInput });
  }

  const user = await User.findOne({ username: cleanInput }).select('email');
  if (!user) {
    return res.status(404).json({ message: 'No account found with this username!' });
  }

  const { email } = user;
  return res.status(200).json({ email });
});

// 3. Sync Firebase user with MongoDB (POST /api/auth/sync)
router.post('/sync', verifyFirebaseToken, async (req, res) => {
  const { uid, email, email_verified: emailVerified, picture } = req.firebaseUser;
  const {
    username,
    fullName,
    college,
    department = 'CSE',
    session = '2022-23',
    acceptedTerms = false,
    providers = [],
  } = req.body;

  const incomingProviders = Array.from(
    new Set([...providersFromToken(req.firebaseUser), ...cleanProviders(providers)])
  );

  // First Super Admin: verified emails listed in ADMIN_EMAILS become 'admin'
  // (on first registration, or later once an email/password account has verified its email)
  const { ADMIN_EMAILS = '' } = process.env;
  const adminEmails = ADMIN_EMAILS.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  const isSeedAdmin = emailVerified === true && Boolean(email) && adminEmails.includes(email.toLowerCase());

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // New user: must finish onboarding (username + terms)
      if (acceptedTerms !== true) {
        return res.status(400).json({
          requiresOnboarding: true,
          message: 'Please complete profile details and accept Terms & Conditions.',
        });
      }
      if (!email) {
        return res.status(400).json({
          message: 'Your login account has no email address. Make your GitHub email public or use another login method.',
        });
      }

      const cleanUsername = normalizeUsername(username);
      const usernameError = getUsernameError(cleanUsername);
      if (usernameError) return res.status(400).json({ message: usernameError });

      if (!COLLEGES.includes(college)) {
        return res.status(400).json({ message: 'Please select a valid college.' });
      }
      if (!DEPARTMENTS.includes(department)) {
        return res.status(400).json({ message: 'Please select a valid department.' });
      }
      if (!SESSIONS.includes(session)) {
        return res.status(400).json({ message: 'Please select a valid session.' });
      }

      const cleanName = String(fullName ?? '').trim().slice(0, 80);
      if (!cleanName) return res.status(400).json({ message: 'Full name is required.' });

      const taken = await User.exists({ username: cleanUsername });
      if (taken) return res.status(409).json({ message: 'Username already taken! Choose another.' });

      const hasSocialLogin = incomingProviders.some((provider) => provider !== 'password');
      const avatarUrl = hasSocialLogin ? await resolveProviderPhoto(uid, picture) : '';

      user = await User.create({
        firebaseUid: uid,
        avatarUrl,
        email,
        username: cleanUsername,
        fullName: cleanName,
        college,
        department: String(department).trim(),
        session: String(session).trim(),
        role: isSeedAdmin ? 'admin' : 'student',
        acceptedTerms: true,
        acceptedTermsAt: new Date(),
        authProviders: incomingProviders,
      });
    } else {
      // Existing user: only add newly linked providers (e.g. Google, then password)
      const mergedProviders = Array.from(new Set([...user.authProviders, ...incomingProviders]));
      const providersChanged = mergedProviders.length !== user.authProviders.length;
      const shouldPromote = isSeedAdmin && user.role !== 'admin';

      if (providersChanged) user.authProviders = mergedProviders;
      if (shouldPromote) user.role = 'admin';

      // Keep the Google/GitHub photo up to date (unless the person turned it off)
      let photoChanged = false;
      if (user.showAvatarPhoto !== false) {
        let photo = normalizePhotoUrl(picture);
        const hasSocialLogin = mergedProviders.some((provider) => provider !== 'password');
        if (!photo && !user.avatarUrl && hasSocialLogin) photo = await resolveProviderPhoto(uid, picture);
        if (photo && photo !== user.avatarUrl) {
          user.avatarUrl = photo;
          photoChanged = true;
        }
      }

      if (providersChanged || shouldPromote || photoChanged) await user.save();
    }

    return res.status(200).json({ success: true, user: toSafeUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username or email is already registered!' });
    }
    return sendServerError(res, error);
  }
});

// 4. Update profile details & linked providers (PUT /api/auth/profile-security)
router.put('/profile-security', verifyFirebaseToken, async (req, res) => {
  const { uid } = req.firebaseUser;
  const { fullName, college, department, session, bio, avatarColor, showAvatarPhoto, providers = [] } = req.body;

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (college && !COLLEGES.includes(college)) {
      return res.status(400).json({ message: 'Please select a valid college.' });
    }
    if (department && !DEPARTMENTS.includes(department)) {
      return res.status(400).json({ message: 'Please select a valid department.' });
    }
    if (session && !SESSIONS.includes(session)) {
      return res.status(400).json({ message: 'Please select a valid session.' });
    }

    if (avatarColor !== undefined && !AVATAR_COLORS.includes(avatarColor)) {
      return res.status(400).json({ message: 'Please choose one of the available colours.' });
    }

    if (fullName) user.fullName = String(fullName).trim().slice(0, 80);
    if (bio !== undefined) user.bio = String(bio).trim().slice(0, 160);
    if (avatarColor) user.avatarColor = avatarColor;

    // Show or hide the Google/GitHub photo. Turning it on again fetches the photo from the linked accounts.
    if (typeof showAvatarPhoto === 'boolean') {
      user.showAvatarPhoto = showAvatarPhoto;
      if (showAvatarPhoto) {
        const photo = await resolveProviderPhoto(uid, req.firebaseUser.picture);
        user.avatarUrl = photo || user.avatarUrl;
      } else {
        user.avatarUrl = '';
      }
    }
    if (college) user.college = college;
    if (department) user.department = String(department).trim();
    if (session) user.session = String(session).trim();

    const newProviders = cleanProviders(providers);
    if (newProviders.length > 0) {
      user.authProviders = Array.from(new Set([...user.authProviders, ...newProviders]));
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Profile & Security updated!', user: toSafeUser(user) });
  } catch (error) {
    return sendServerError(res, error);
  }
});

export default router;