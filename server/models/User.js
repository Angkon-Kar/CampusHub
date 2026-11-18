import mongoose from 'mongoose';

// SINGLE SOURCE OF TRUTH: keep the frontend COLLEGES arrays identical to this list.
export const COLLEGES = ['SIMT', 'MEC', 'FEC', 'BEC', 'NITER', 'SHEC'];
export const AVATAR_COLORS = ['indigo', 'violet', 'emerald', 'rose', 'amber', 'sky'];
export const DEPARTMENTS = ['CSE', 'EEE', 'CE', 'ME'];
export const SESSIONS = ['2020-21', '2021-22', '2022-23', '2023-24', '2024-25'];

// Usernames that would collide with frontend routes (/auth, /admin ...) or look official.
export const RESERVED_USERNAMES = [
  'admin', 'administrator', 'moderator', 'mod', 'root', 'support', 'help', 'api', 'auth', 'login',
  'logout', 'register', 'signup', 'signin', 'settings', 'profile', 'profiles', 'me', 'chat',
  'posts', 'post', 'resources', 'hub', 'campushub', 'dutechunit', 'null', 'undefined', 'static',
  'assets', 'favicon', 'terms', 'privacy', 'about', 'faq', 'contact', 'notifications', 'create-post',
  'complete-profile', 'edit-post', 'reviews', 'cgpa', 'syllabus', 'offline',
];

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9_]{3,20}$/, 'Username must be 3-20 chars: a-z, 0-9, _'],
      validate: {
        validator: (value) => !RESERVED_USERNAMES.includes(value),
        message: 'This username is reserved.',
      },
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    college: { type: String, required: true, enum: COLLEGES },
    department: { type: String, required: true, trim: true },
    session: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'moderator', 'admin'], default: 'student' },
    authProviders: [{ type: String }], // e.g., ['google.com', 'github.com', 'password']
    stats: {
      articlesCount: { type: Number, default: 0 },
      resourcesCount: { type: Number, default: 0 },
      projectsCount: { type: Number, default: 0 },
    },
    badges: [{ type: String }],
    bio: { type: String, default: '', trim: true, maxlength: 160 },
    avatarColor: { type: String, enum: AVATAR_COLORS, default: 'indigo' },
    // Google/GitHub profile photo (only https Google/GitHub addresses are ever stored)
    avatarUrl: { type: String, default: '', maxlength: 500 },
    showAvatarPhoto: { type: Boolean, default: true },
    acceptedTerms: { type: Boolean, required: true, default: false },
    acceptedTermsAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);