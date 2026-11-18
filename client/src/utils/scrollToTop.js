// client/src/utils/scrollToTop.js
// Smooth scrolling, unless the visitor asked their system for reduced motion
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

export const scrollBehavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

export const scrollToTop = () => window.scrollTo({ top: 0, behavior: scrollBehavior() });