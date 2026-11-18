// client/src/components/guide/TemplateCard.jsx
// One CV template card, built like the resource cards: preview, title, views, love, and a Download or open button.
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, Lock, ExternalLink, Star, FileX2 } from 'lucide-react';
import { PdfThumb } from './PdfThumb';

const pad = (number) => String(number).padStart(2, '0');

export const LayoutBadge = ({ ats }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
      ats ? 'bg-lime-100 text-lime-800 border-lime-300' : 'bg-white/80 text-slate-600 border-slate-300'
    }`}
  >
    {ats ? 'ATS-friendly' : 'Two-column'}
  </span>
);

export const TemplateCard = ({ template, index, url, isSignedIn, checking, views = 0, loves = 0, isLoved, onLove, onOpen }) => {
  const { id, role, degree, ats, featured } = template;
  const { pathname } = useLocation();

  const isCovered = !isSignedIn; // guests (and visitors whose login is still being checked) see a blurred preview
  const urlPending = url === undefined; // still looking for the PDF file
  const missing = url === null;

  const preview = <PdfThumb url={url || ''} missing={missing} blurred={isCovered} label={`CV template ${pad(id)}: ${role}`} />;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      className="group card card-hover relative flex flex-col overflow-hidden !bg-white/75 backdrop-blur-xl"
    >
      {/* Accent line that slides in on hover */}
      <span className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 to-violet-500 transition-transform duration-500 group-hover:scale-x-100" />

      {/* Preview */}
      <div className="relative p-3 pb-0 bg-gradient-to-b from-indigo-50/80 to-violet-50/40">
        {isSignedIn && url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => onOpen(id)} aria-label={`Open template ${pad(id)}: ${role}`} className="block">
            {preview}
          </a>
        ) : (
          <Link to="/login" state={{ from: pathname }} aria-label="Sign in to see this template" className="block relative">
            {preview}
            {!checking && (
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid place-items-center w-11 h-11 rounded-full bg-white/90 text-indigo-600 shadow-xl">
                  <Lock size={19} />
                </span>
              </span>
            )}
          </Link>
        )}
        <span className="absolute top-5 left-5 grid place-items-center min-w-8 h-8 px-2 rounded-lg bg-slate-900/85 text-white text-xs font-extrabold backdrop-blur">{pad(id)}</span>
        {featured && !isCovered && (
          <span className="absolute top-5 right-5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-bold shadow">
            <Star size={11} className="fill-slate-900" /> Good for CSE
          </span>
        )}
        <div className="h-3" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4 flex-1 justify-between">
        <div className="space-y-1.5">
          <LayoutBadge ats={ats} />
          <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors">{role}</h3>
          <p className="text-sm text-slate-500">{degree}</p>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span className="text-xs font-medium text-slate-400">Template {pad(id)}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5" title="Views">
                <Eye size={15} /> {views}
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 1.35 }}
                onClick={() => onLove(id)}
                aria-label={`Love template ${pad(id)}`}
                aria-pressed={Boolean(isLoved)}
                className={`flex items-center gap-1.5 transition cursor-pointer ${isLoved ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
              >
                <Heart size={15} className={isLoved ? 'fill-rose-500' : ''} /> {loves}
              </motion.button>
            </div>
          </div>

          {checking ? (
            <span className="btn-secondary w-full opacity-60 cursor-wait">Checking login...</span>
          ) : !isSignedIn ? (
            <Link to="/login" state={{ from: pathname }} className="btn-secondary w-full !text-amber-700 !border-amber-200 !bg-amber-50 hover:!bg-amber-100">
              <Lock size={15} /> Sign in to download
            </Link>
          ) : url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => onOpen(id)} className="btn-primary w-full">
              <ExternalLink size={15} /> Download or open
            </a>
          ) : (
            <span className="btn-secondary w-full opacity-60 cursor-not-allowed">
              {urlPending ? 'Looking for the file...' : (
                <>
                  <FileX2 size={15} /> PDF not found
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};