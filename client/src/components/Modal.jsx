// client/src/components/Modal.jsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WIDTHS = { sm: 'sm:max-w-md', md: 'sm:max-w-xl', lg: 'sm:max-w-3xl' };
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Used for small dialogs (report, review, delete, share). Posting has its own page.
export const Modal = ({ isOpen, onClose, title, size = 'md', children }) => {
  const dialogRef = useRef(null);

  const getFocusable = () =>
    dialogRef.current
      ? Array.from(dialogRef.current.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null)
      : [];

  // Move focus into the dialog when it opens, and give it back to the button that opened it when it closes
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;

    const timer = setTimeout(() => {
      const target = getFocusable().find((el) => el.getAttribute('aria-label') !== 'Close') || dialogRef.current;
      target?.focus();
    }, 60);

    return () => {
      clearTimeout(timer);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  // Escape closes the dialog, Tab stays inside it (focus trap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event) => {
      if (event.key === 'Escape') return onClose();
      if (event.key !== 'Tab') return;

      const items = getFocusable();
      if (items.length === 0) return event.preventDefault();

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Stop the page behind the dialog from scrolling
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-y-auto bg-slate-900/40 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`w-full ${WIDTHS[size] || WIDTHS.md} sm:my-8 max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200 focus:outline-none`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-6 py-4 bg-white/95 backdrop-blur border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};