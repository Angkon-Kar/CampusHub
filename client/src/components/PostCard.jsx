// client/src/components/PostCard.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, MoreVertical, Flag, Lock, ExternalLink, Clock, FileText, BookOpen, PlaySquare, Code } from 'lucide-react';
import { sanitizeHtml, stripHtml } from '../utils/sanitize';
import { Avatar } from './Avatar';

// Added specific icons to make the badges look less empty
const TYPE_STYLES = {
  resource: { label: 'Notes & slides', icon: FileText, style: 'bg-indigo-50 text-indigo-700 border-indigo-200/60' },
  article: { label: 'Article', icon: BookOpen, style: 'bg-violet-50 text-violet-700 border-violet-200/60' },
  course: { label: 'Free course', icon: PlaySquare, style: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
  project: { label: 'Project', icon: Code, style: 'bg-amber-50 text-amber-700 border-amber-200/60' },
};

const LONG_POST_CHARS = 280;

export const PostCard = ({ post, index = 0, isSignedIn, isLoved, onOpen, onLove, onReport, onTagClick }) => {
  const { _id, title, content, fontFamily, type, college, department, session, tags, views, likesCount, author } = post;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

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
    setTimeout(() => {
      menuRef.current?.querySelector('[role="menuitem"]')?.focus();
    }, 50);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const fallbackType = { label: type, icon: FileText, style: 'bg-slate-100 text-slate-700 border-slate-200/60' };
  const { label, icon: TypeIcon, style } = TYPE_STYLES[type] || fallbackType;

  const plainText = stripHtml(content);
  const isLong = plainText.length > LONG_POST_CHARS;
  const readMinutes = Math.max(1, Math.round(plainText.split(/\s+/).filter(Boolean).length / 200));

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index % 12, 8) * 0.04 }}
      className="group relative flex flex-col h-full rounded-2xl bg-white border border-slate-200/70 shadow-sm hover:shadow-[0_8px_30px_-4px_rgba(79,70,229,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-transform duration-500 ease-out group-hover:scale-x-100 z-10" />

      {/* Main Content Area */}
      <div className="p-5 pb-4 flex-1 flex flex-col">
        
        {/* Header Badges & Menu */}
        <div className="flex justify-between items-start gap-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${style}`}>
              <TypeIcon size={12} strokeWidth={2.5} /> {label}
            </span>
            <span className="px-2 py-1 rounded-md bg-slate-50 text-slate-600 text-[11px] font-semibold border border-slate-200/60">
              {college} &middot; {session}
            </span>
            {isLong && (
              <span className="px-2 py-1 rounded-md bg-amber-50/50 text-amber-700 text-[11px] font-semibold border border-amber-200/60 flex items-center gap-1">
                <Clock size={11} /> {readMinutes} min
              </span>
            )}
          </div>

          <div ref={menuRef} className="relative shrink-0">
            <button
              ref={menuButtonRef}
              type="button"
              aria-label="More options"
              onClick={() => setMenuOpen((open) => !open)}
              className="p-1 -mr-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
            >
              <MoreVertical size={18} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                  className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onReport({ _id, title });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Flag size={14} /> Report
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-[18px] text-slate-900 leading-snug line-clamp-2 mb-2 transition-colors group-hover:text-indigo-600">
          <Link to={`/post/${_id}`} className="focus:outline-none">
            {title}
          </Link>
        </h3>

        {/* Content */}
        <div
          style={{ fontFamily: `'${fontFamily}', sans-serif` }}
          className="rich-content text-[15px] text-slate-600 line-clamp-3 leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />

        {isLong && (
          <Link to={`/post/${_id}`} className="inline-flex items-center gap-1 text-[13px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-3">
            Read full post &rarr;
          </Link>
        )}

        {/* Tags - Removed mt-auto so they hug the content */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                className="text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-1 rounded-md hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Area (Pushed to bottom using mt-auto) */}
      <div className="mt-auto px-5 pb-5">
        <div className="h-px w-full bg-slate-100 mb-4"></div>
        
        <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
          <Link 
            to={`/${author?.username}`} 
            className="inline-flex items-center gap-2 font-medium text-slate-700 hover:text-indigo-600 transition min-w-0"
          >
            <Avatar user={author} className="w-6 h-6 border border-slate-200" textClass="text-[10px]" />
            <span className="truncate text-xs tracking-wide">@{author?.username}</span>
          </Link>
          
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500" title="Views">
              <Eye size={14} className="text-slate-400" /> {views}
            </span>
            <motion.button
              type="button"
              whileTap={{ scale: 1.2 }}
              onClick={() => onLove(_id)}
              aria-label={isLoved ? 'Remove your love react' : 'Love this post'}
              aria-pressed={isLoved}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer ${
                isLoved 
                  ? 'bg-rose-50 text-rose-600' 
                  : 'text-slate-500 hover:text-rose-500 hover:bg-rose-50/50'
              }`}
            >
              <Heart size={14} className={isLoved ? 'fill-rose-500' : ''} /> {likesCount}
            </motion.button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen(_id)}
          className={`group/btn w-full py-2.5 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 transition-all duration-300 ${
            isSignedIn
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-600/20'
              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          {isSignedIn ? (
            <>
              <ExternalLink size={16} className="transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
              Download or Open
            </>
          ) : (
            <>
              <Lock size={16} /> Sign in to download
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
};