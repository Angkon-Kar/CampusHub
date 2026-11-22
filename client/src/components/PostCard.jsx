// client/src/components/PostCard.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, MoreVertical, Flag, Lock, ExternalLink, Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { sanitizeHtml, stripHtml } from '../utils/sanitize';
import { Avatar } from './Avatar';

const TYPE_STYLES = {
  resource: { label: 'Notes & slides', style: 'bg-indigo-50 text-indigo-700' },
  article: { label: 'Article', style: 'bg-violet-50 text-violet-700' },
  course: { label: 'Free course', style: 'bg-emerald-50 text-emerald-700' },
  project: { label: 'Project', style: 'bg-amber-50 text-amber-700' },
};

const LONG_POST_CHARS = 280;

export const PostCard = ({
  post,
  index = 0,
  isSignedIn,
  isLoved,
  onOpen,
  onLove,
  onReport,
  onTagClick,
  activeTags = [],
}) => {
  const {
    _id,
    title,
    content,
    fontFamily,
    type,
    college,
    department,
    session,
    semester,
    subjectCode,
    subjectName,
    tags,
    views,
    likesCount,
    author,
  } = post;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Close the 3-dot menu on outside click (this also closes it when another card's menu opens) or Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handlePointer = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    // Keyboard users land on the first menu item
    menuRef.current?.querySelector('[role="menuitem"]')?.focus();

    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const handleShare = async () => {
    setMenuOpen(false);
    const shareUrl = `${window.location.origin}/post/${_id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Post link copied!');
    } catch {
      toast.error('Could not copy the link.');
    }
  };

  const { label, style } = TYPE_STYLES[type] || { label: type, style: 'bg-slate-100 text-slate-700' };

  // Long posts get a "Long read" label and a link to the full page
  const plainText = stripHtml(content);
  const isLong = plainText.length > LONG_POST_CHARS;
  const readMinutes = Math.max(1, Math.round(plainText.split(/\s+/).filter(Boolean).length / 200));

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index % 12, 8) * 0.04 }}
      className="group card card-hover relative p-5 flex flex-col justify-between gap-4"
    >
      {/* Accent line that slides in on hover */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-2xl origin-left scale-x-0 bg-gradient-to-r from-indigo-500 to-violet-500 transition-transform duration-500 group-hover:scale-x-100" />

      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>{label}</span>
            <span className="chip">
              {college} &middot; {department}
              {semester ? <> &middot; Sem {semester}</> : session && session !== 'General' ? <> &middot; {session}</> : null}
            </span>
            {isLong && (
              <span className="chip bg-amber-50 text-amber-700">
                <Clock size={11} /> Long read &middot; {readMinutes} min
              </span>
            )}
          </div>

          {/* 3-dot menu */}
          <div ref={menuRef} className="relative shrink-0">
            <button
              ref={menuButtonRef}
              type="button"
              aria-label="More options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="p-2.5 -mr-2.5 -mt-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div
                role="menu"
                aria-label="Post options"
                className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-900/5 p-1.5 z-20"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleShare}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none rounded-lg cursor-pointer"
                >
                  <Share2 size={14} /> Share post
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onReport({ _id, title });
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 focus:bg-rose-50 focus:outline-none rounded-lg cursor-pointer"
                >
                  <Flag size={14} /> Report this link
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2 transition-colors group-hover:text-indigo-700">
          <Link to={`/post/${_id}`} className="focus-visible:outline-none focus-visible:underline">
            {title}
          </Link>
        </h3>

        {subjectCode && (
          <p className="-mt-1 text-xs font-medium text-slate-500 line-clamp-1">
            {subjectCode} &middot; {subjectName}
          </p>
        )}

        <div
          style={{ fontFamily: `'${fontFamily}', sans-serif` }}
          className="rich-content text-sm text-slate-600 line-clamp-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />

        {isLong && (
          <Link to={`/post/${_id}`} className="inline-block py-2 -my-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Read the full post &rarr;
          </Link>
        )}

        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                className={`text-xs px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                  activeTags.includes(tag)
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center text-sm text-slate-500">
          <Link to={`/${author?.username}`} className="inline-flex items-center gap-2 py-2 -my-2 font-medium hover:text-indigo-600 transition min-w-0">
            <Avatar user={author} className="w-6 h-6" textClass="text-[11px]" />
            <span className="truncate">@{author?.username}</span>
          </Link>
          <div className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5" title="Views">
              <Eye size={15} /> {views}
            </span>
            <motion.button
              type="button"
              whileTap={{ scale: 1.35 }}
              onClick={() => onLove(_id)}
              aria-label={isLoved ? 'Remove your love react' : 'Love this post'}
              aria-pressed={isLoved}
              className={`flex items-center gap-1.5 p-2 -m-2 transition cursor-pointer ${
                isLoved ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart size={15} className={isLoved ? 'fill-rose-500' : ''} /> {likesCount}
            </motion.button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen(_id)}
          className={`group/btn w-full ${
            isSignedIn
              ? 'btn-primary'
              : 'btn-secondary !text-amber-700 !border-amber-200 !bg-amber-50 hover:!bg-amber-100'
          }`}
        >
          {isSignedIn ? (
            <>
              <ExternalLink
                size={15}
                className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
              Download or open
            </>
          ) : (
            <>
              <Lock size={15} /> Sign in to download
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
};
