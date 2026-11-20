// client/src/components/reviews/ReviewSummary.jsx
// The overview at the top: average rating, number of reviews and how many gave each star count.
import { StarDisplay } from './StarRating';

export const ReviewSummary = ({ summary, activeRating, onSelectRating }) => {
  const { average, total, distribution } = summary;

  return (
    <section
      aria-label="Rating overview"
      className="rounded-3xl border border-white/70 bg-white/90 supports-[backdrop-filter]:bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(79,70,229,0.12)] p-5 sm:p-7 grid sm:grid-cols-[auto_minmax(0,1fr)] gap-6 sm:gap-10 items-center"
    >
      <div className="text-center sm:text-left">
        <p className="text-6xl font-extrabold tracking-tight text-slate-900 leading-none">{total ? average.toFixed(1) : '--'}</p>
        <StarDisplay value={average} size={22} className="mt-3 justify-center sm:justify-start" />
        <p className="mt-2 text-sm text-slate-500">
          {total} review{total === 1 ? '' : 's'}
        </p>
      </div>

      <div className="space-y-2" role="group" aria-label="Filter by rating">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = distribution[stars] || 0;
          const percent = total ? Math.round((count / total) * 100) : 0;
          const active = activeRating === stars;
          return (
            <button
              key={stars}
              type="button"
              onClick={() => onSelectRating(active ? 0 : stars)}
              aria-pressed={active}
              aria-label={`${stars} star reviews: ${count}`}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition cursor-pointer ${active ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
            >
              <span className="w-10 text-left font-medium text-slate-600">{stars} ★</span>
              <span className="flex-1 h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                <span className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700" style={{ width: `${percent}%` }} />
              </span>
              <span className="w-8 text-right text-slate-500">{count}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};