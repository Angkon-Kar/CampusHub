// client/src/pages/PrivacyPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CONTACT_EMAIL } from '../constants/campus';

const SECTIONS = [
  {
    id: 'collect',
    title: 'What we collect',
    points: [
      'Account details: your name, username, email address, college, department, session and the login methods you use (email/password, Google or GitHub).',
      'Optional profile details: a short bio and an avatar colour. If you sign in with Google or GitHub, your profile photo from that account is shown on your profile, posts and reviews. You can turn it off in Edit profile.',
      'Reviews: your star rating and text, shown with your name and profile link after a moderator approves them.',
      'What you share: posts, tags, links, love reacts, reports and the review status of your posts.',
      'View counts: opening a post counts as one view per person every 30 minutes. For signed-in people we use the account. For visitors we use a one-way anonymous code made from the network address and browser type, which is deleted automatically after 30 minutes. We do not run advertising or tracking scripts.',
    ],
  },
  {
    id: 'device',
    title: 'Data that stays on your device',
    points: [
      'The CGPA calculator and the Syllabus Tracker save their data only in your browser (localStorage). It is never sent to our server or database.',
      'Clearing your browser data, or using "Start over" / "Reset", removes it. Installing the app does not change this.',
    ],
  },
  {
    id: 'public',
    title: 'What is public',
    points: [
      'Your public profile (/username) shows your name, username, college, department, session, bio, badges and your approved posts.',
      'Your email address is never shown on your profile or in the feed.',
      'Posts that are pending or declined are visible only to you and the moderators.',
    ],
  },
  {
    id: 'services',
    title: 'Services that help us run the site',
    points: [
      'Firebase Authentication handles sign-in. Your browser stores a sign-in session so you stay logged in ("Remember me").',
      'MongoDB stores accounts and posts. The website and the server are hosted on Vercel and Render.',
      'When you add a link, its address (and the post title) may be checked by Google Safe Browsing and an AI safety check before a moderator sees it.',
      'You receive an email from Firebase when you verify your email address or reset your password.',
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    points: [
      'We show in-app notifications when a moderator approves, declines or comments on your post, or when readers report its link. Old notifications are deleted automatically after 60 days.',
    ],
  },
  {
    id: 'rights',
    title: 'Your choices',
    points: [
      'You can edit or delete your own posts at any time, and change your name, bio and avatar colour on your profile.',
      `To delete your account or ask what we store about you, email ${CONTACT_EMAIL}.`,
      'Moderators may remove posts that break the terms and conditions.',
    ],
  },
];

export const PrivacyPage = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Privacy policy</h1>
      <p className="mt-3 text-slate-500 leading-relaxed">
        Campus Hub is a student academic project. This page explains in plain words what information the site uses and why.
      </p>

      <div className="mt-10 space-y-6">
        {SECTIONS.map(({ id, title, points }) => (
          <section key={id} id={id} className="card p-5 sm:p-6 scroll-mt-24">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <ul className="mt-3 space-y-2.5 list-disc pl-5 text-sm leading-relaxed text-slate-600 marker:text-indigo-400">
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Questions about this page? Write to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-indigo-600 underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/terms" className="btn-secondary">
          Terms and conditions
        </Link>
        <Link to="/" className="btn-primary">
          Back to the hub
        </Link>
      </div>
    </motion.div>
  </div>
);