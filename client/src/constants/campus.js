// client/src/constants/campus.js
// Single source of truth for colleges, departments and sessions.
// College values must match the server's User.js enum.
export const COLLEGES = ['SIMT', 'MEC', 'FEC', 'BEC', 'NITER', 'SHEC'];
export const DEPARTMENTS = ['CSE', 'EEE', 'CE', 'ME'];
export const SESSIONS = ['2020-21', '2021-22', '2022-23', '2023-24', '2024-25'];

// Filter dropdowns get an extra "All" option
export const COLLEGE_FILTER_OPTIONS = ['All', ...COLLEGES];
export const DEPARTMENT_FILTER_OPTIONS = ['All', ...DEPARTMENTS];
export const SESSION_FILTER_OPTIONS = ['All', ...SESSIONS];

export const POST_TYPES = [
  { id: 'resource', label: 'Notes & slides' },
  { id: 'article', label: 'Articles' },
  { id: 'course', label: 'Free courses' },
  { id: 'project', label: 'Projects' },
];

export const EDITOR_FONTS = [
  { name: 'Inter', label: 'Inter (sans)' },
  { name: 'Merriweather', label: 'Merriweather (serif)' },
  { name: 'Fira Code', label: 'Fira Code (mono)' },
];

export const SUGGESTED_TAGS = [
  'midterm',
  'final-suggestion',
  'previous-questions',
  'slides',
  'cpp',
  'dsa',
  'free-course',
  'mern',
];

// These words are real routes, so nobody can take them as a username
export const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'moderator',
  'mod',
  'root',
  'support',
  'help',
  'api',
  'auth',
  'login',
  'logout',
  'register',
  'signup',
  'signin',
  'settings',
  'profile',
  'profiles',
  'me',
  'chat',
  'posts',
  'post',
  'resources',
  'hub',
  'campushub',
  'dutechunit',
  'null',
  'undefined',
  'static',
  'assets',
  'favicon',
  'terms',
  'privacy',
  'about',
  'faq',
  'contact',
  'notifications',
  'create-post',
  'complete-profile',
  'edit-post',
  'reviews',
  'cgpa',
  'syllabus',
  'offline',
  'privacy',
  'settings',
  'me',
  'moderator',
  'support',
  'resume-checker',
  'resume',
  'angkonkar',
  'complete-profile',
  'edit-profile',
  'edit-post',
  'edit-review',
  'edit-comment',
  'delete-post',
  'delete-review',
  'delete-comment',
  'report-post',
  'report-review',
  'report-comment',
  'admin',
  'administrator',
  'moderator',
  'mod',
  'root',
  'support',
  'help',
  'api',
  'auth',
  'login',
  'logout',
  'register',
  'signup',
  'signin',
  'settings',
  'profile',
  'profiles',
  'me',
  'chat',
  'posts',
  'post',
  'resources',
  'hub',
  'campushub',
  'dutechunit',
  'null',
  'undefined',
  'static',
  'assets',
  'favicon',
  'terms',
  'privacy',
  'about',
  'faq',
  'contact',
  'notifications',
  'create-post',
  'complete-profile',
  'edit-post',
  'reviews',
  'cgpa',
  'syllabus',
  'offline',


];

export const HTTPS_LINK_REGEX = /^https:\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/\S*)?$/;

// Contact address shown on the About, Privacy and Terms pages (copyright takedown requests go here).
// Set VITE_CONTACT_EMAIL in client/.env and in Vercel.
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'contact@example.com';

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'loved', label: 'Most loved' },
  { id: 'viewed', label: 'Most viewed' },
];

// Profile avatar colours. The class names are written out in full so Tailwind can see them.
export const AVATAR_COLORS = [
  { id: 'indigo', label: 'Indigo', gradient: 'from-indigo-500 to-indigo-700', swatch: 'bg-indigo-600' },
  { id: 'violet', label: 'Violet', gradient: 'from-violet-500 to-violet-700', swatch: 'bg-violet-600' },
  { id: 'emerald', label: 'Emerald', gradient: 'from-emerald-500 to-emerald-700', swatch: 'bg-emerald-600' },
  { id: 'rose', label: 'Rose', gradient: 'from-rose-500 to-rose-700', swatch: 'bg-rose-600' },
  { id: 'amber', label: 'Amber', gradient: 'from-amber-500 to-amber-700', swatch: 'bg-amber-600' },
  { id: 'sky', label: 'Sky', gradient: 'from-sky-500 to-sky-700', swatch: 'bg-sky-600' },
];

export const getAvatarGradient = (id) => (AVATAR_COLORS.find((color) => color.id === id) || AVATAR_COLORS[0]).gradient;