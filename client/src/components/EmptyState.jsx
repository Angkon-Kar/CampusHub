// client/src/components/EmptyState.jsx
// Friendly "nothing here yet" panels with small inline illustrations (no image files needed).

const stroke = 'stroke-indigo-300';
const soft = 'fill-indigo-50';
const strong = 'fill-indigo-200';

const ILLUSTRATIONS = {
  search: (
    <svg viewBox="0 0 120 90" fill="none" aria-hidden="true">
      <rect x="18" y="14" width="64" height="62" rx="8" className={`${soft} ${stroke}`} strokeWidth="2" />
      <rect x="28" y="28" width="30" height="5" rx="2.5" className={strong} />
      <rect x="28" y="40" width="44" height="5" rx="2.5" className={strong} />
      <rect x="28" y="52" width="24" height="5" rx="2.5" className={strong} />
      <circle cx="82" cy="58" r="16" className="fill-white stroke-indigo-400" strokeWidth="3" />
      <path d="M94 70l12 12" className="stroke-indigo-400" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  posts: (
    <svg viewBox="0 0 120 90" fill="none" aria-hidden="true">
      <rect x="30" y="10" width="62" height="48" rx="8" className={`${soft} ${stroke}`} strokeWidth="2" transform="rotate(-6 61 34)" />
      <rect x="26" y="22" width="62" height="48" rx="8" className={`fill-white ${stroke}`} strokeWidth="2" />
      <rect x="36" y="34" width="32" height="5" rx="2.5" className={strong} />
      <rect x="36" y="45" width="42" height="5" rx="2.5" className={strong} />
      <circle cx="92" cy="66" r="14" className="fill-indigo-500" />
      <path d="M92 59v14M85 66h14" className="stroke-white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 120 90" fill="none" aria-hidden="true">
      <path d="M22 50l12-26h52l12 26v22a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V50z" className={`${soft} ${stroke}`} strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 50h26a12 12 0 0 0 24 0h26" className={stroke} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="88" cy="22" r="11" className="fill-white stroke-indigo-400" strokeWidth="2.5" />
      <path d="M88 16v7M88 27h.01" className="stroke-indigo-400" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  queue: (
    <svg viewBox="0 0 120 90" fill="none" aria-hidden="true">
      <rect x="30" y="12" width="60" height="68" rx="8" className={`${soft} ${stroke}`} strokeWidth="2" />
      <rect x="46" y="6" width="28" height="12" rx="4" className="fill-white stroke-indigo-400" strokeWidth="2" />
      <path d="M44 42l8 8 16-18" className="stroke-emerald-500" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="42" y="60" width="36" height="5" rx="2.5" className={strong} />
    </svg>
  ),
};

export const EmptyState = ({ variant = 'posts', title, text, compact = false, bare = false, children }) => (
  <div
    className={`text-center px-6 ${bare ? '' : 'card'} ${compact ? 'py-8' : 'py-14 sm:py-16'}`}
    role="status"
  >
    <div className={`mx-auto ${compact ? 'w-24' : 'w-32'}`}>{ILLUSTRATIONS[variant] || ILLUSTRATIONS.posts}</div>
    <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
    {text && <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{text}</p>}
    {children && <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">{children}</div>}
  </div>
);