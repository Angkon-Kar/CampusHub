// client/src/components/reviews/StarRating.jsx
import { useState } from 'react';
import { Star } from 'lucide-react';

const LABELS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

// Read-only stars
export const StarDisplay = ({ value, size = 16, className = '' }) => (
  <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={size} className={n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
    ))}
  </span>
);

// Clickable stars (real radio buttons, so the keyboard and screen readers work)
export const StarInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700 mb-2">Your rating</legend>
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
            <input type="radio" name="review-rating" value={n} checked={value === n} onChange={() => onChange(n)} className="peer sr-only" />
            <span className="block p-1 rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 transition-transform hover:scale-110">
              <Star size={30} className={n <= shown ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
              <span className="sr-only">{n} star{n > 1 ? 's' : ''}</span>
            </span>
          </label>
        ))}
        <span className="ml-2 text-sm font-medium text-slate-500 min-w-20">{shown ? LABELS[shown - 1] : 'Choose stars'}</span>
      </div>
    </fieldset>
  );
};