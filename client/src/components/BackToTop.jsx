// client/src/components/BackToTop.jsx
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';

// Floating button that appears after the visitor has scrolled down a bit
export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-5 right-4 sm:right-6 z-30 grid place-items-center w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-600 shadow-lg shadow-slate-900/10 hover:text-indigo-600 hover:border-indigo-200 transition cursor-pointer"
    >
      <ArrowUp size={18} />
    </button>
  );
};