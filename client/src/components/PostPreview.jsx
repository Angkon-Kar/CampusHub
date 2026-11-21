// client/src/components/PostPreview.jsx
// Live file preview for signed-in users, a blurred placeholder for guests.
import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';

// Decorative "document" for guests. Guests never receive the real file or its link, only this fake page.
const FAKE_LINES = ['w-3/4', 'w-full', 'w-5/6', 'w-full', 'w-2/3', 'w-full', 'w-4/5', 'w-1/2'];

// Mount the heavy iframe only when the card is near the screen: 9 cards must not load 9 files at once
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

export const PostPreview = ({ title, previewUrl, isSignedIn, onSignIn }) => {
  const [ref, inView] = useInView();
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      {isSignedIn && previewUrl ? (
        <>
          {!loaded && <div className="skeleton absolute inset-0" />}
          {inView && (
            <iframe
              src={previewUrl}
              title={`Preview of ${title}`}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
              referrerPolicy="no-referrer"
              onLoad={() => setLoaded(true)}
              className="absolute inset-0 h-full w-full border-0"
            />
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={onSignIn}
          aria-label="Sign in to preview this file"
          className="group absolute inset-0 w-full cursor-pointer text-left"
        >
          <div aria-hidden="true" className="absolute inset-0 space-y-3 p-5 blur-[5px] select-none">
            <div className="h-4 w-1/2 rounded bg-slate-300" />
            {FAKE_LINES.map((width, index) => (
              <div key={index} className={`h-2.5 rounded bg-slate-300/80 ${width}`} />
            ))}
          </div>
          <div className="absolute inset-0 grid place-items-center bg-white/40 transition group-hover:bg-white/55">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm shadow-slate-900/10 ring-1 ring-slate-200">
              <Lock size={13} /> Sign in to preview
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
