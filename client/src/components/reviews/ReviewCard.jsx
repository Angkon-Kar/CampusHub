// client/src/components/reviews/ReviewCard.jsx
// Frosted-glass review card. It floats gently (unless the visitor prefers reduced motion).
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, Award } from 'lucide-react';
import { Avatar } from '../Avatar';
import { StarDisplay } from './StarRating';

export const ReviewCard = ({ review, index = 0 }) => {
  const reduceMotion = useReducedMotion();
  const { user, rating, text, verified, contributor, createdAt } = review;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index % 12, 8) * 0.06 }}
      className="mb-5 break-inside-avoid"
    >
      <motion.article
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        transition={reduceMotion ? undefined : { duration: 5 + (index % 4) * 0.8, repeat: Infinity, ease: 'easeInOut', delay: (index % 5) * 0.35 }}
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.015 }}
        className="rounded-3xl border border-white/70 bg-white/90 supports-[backdrop-filter]:bg-white/55 backdrop-blur-xl shadow-[0_8px_32px_rgba(79,70,229,0.12)] hover:shadow-[0_16px_44px_rgba(79,70,229,0.2)] p-5 sm:p-6 transition-shadow"
      >
        <header className="flex items-start gap-3">
          <Link to={`/${user.username}`} aria-label={`Open ${user.fullName}'s profile`}>
            <Avatar user={user} className="w-11 h-11" textClass="text-base" alt="" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link to={`/${user.username}`} className="block font-bold text-slate-900 hover:text-indigo-700 transition truncate">
              {user.fullName}
            </Link>
            <Link to={`/${user.username}`} className="block text-xs text-slate-500 hover:text-indigo-600 transition truncate">
              @{user.username}
            </Link>
          </div>
        </header>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {verified && (
            <span
              title="This person signed in with a verified email address"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <BadgeCheck size={12} /> Verified user
            </span>
          )}
          {contributor && (
            <span
              title="Has at least one approved post on Campus Hub"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"
            >
              <Award size={12} /> Contributor
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <StarDisplay value={rating} size={16} />
          <time dateTime={createdAt} className="text-xs text-slate-400">
            {new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </time>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-line break-words">{text}</p>

        <footer className="mt-4 pt-3 border-t border-slate-200/70 text-xs text-slate-500">
          {user.college} &middot; {user.department}
        </footer>
      </motion.article>
    </motion.div>
  );
};