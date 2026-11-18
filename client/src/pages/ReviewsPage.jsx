// client/src/pages/ReviewsPage.jsx
// Reviews from real, signed-in students. A moderator approves each review before it appears here.
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquareHeart } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/apiClient';
import { useAuth } from '../hooks/useAuth';
import { ReviewSummary } from '../components/reviews/ReviewSummary';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { EmptyState } from '../components/EmptyState';
import { Bone } from '../components/Skeletons';

const SORTS = [
  { id: 'newest', label: 'Newest' },
  { id: 'highest', label: 'Highest rated' },
  { id: 'lowest', label: 'Lowest rated' },
];

const EMPTY = { key: '', reviews: [], summary: { average: 0, total: 0, distribution: {} }, total: 0, page: 1, hasMore: false, myReview: null };

// Soft colour blobs behind the glass cards, so the frosted effect is visible
const Blobs = () => {
  const reduceMotion = useReducedMotion();
  const drift = (x, y, seconds) => (reduceMotion ? undefined : { animate: { x: [0, x, 0], y: [0, y, 0] }, transition: { duration: seconds, repeat: Infinity, ease: 'easeInOut' } });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div {...drift(60, 40, 18)} className="absolute -top-24 -left-20 w-[26rem] h-[26rem] rounded-full bg-indigo-300/40 blur-3xl" />
      <motion.div {...drift(-50, 60, 22)} className="absolute top-40 -right-24 w-[24rem] h-[24rem] rounded-full bg-violet-300/40 blur-3xl" />
      <motion.div {...drift(40, -50, 20)} className="absolute top-[38rem] left-1/4 w-[22rem] h-[22rem] rounded-full bg-sky-300/40 blur-3xl" />
      <motion.div {...drift(-40, -40, 24)} className="absolute bottom-0 right-1/4 w-[22rem] h-[22rem] rounded-full bg-rose-200/40 blur-3xl" />
    </div>
  );
};

const CardSkeleton = () => (
  <div className="mb-5 break-inside-avoid rounded-3xl border border-white/70 bg-white/70 p-6 space-y-3" aria-hidden="true">
    <div className="flex items-center gap-3">
      <Bone className="w-11 h-11 rounded-full" />
      <div className="space-y-2 flex-1">
        <Bone className="h-3.5 w-32 rounded" />
        <Bone className="h-3 w-20 rounded" />
      </div>
    </div>
    <Bone className="h-4 w-24 rounded" />
    <Bone className="h-3 rounded" />
    <Bone className="h-3 w-5/6 rounded" />
    <Bone className="h-3 w-2/3 rounded" />
  </div>
);

export const ReviewsPage = () => {
  const { firebaseUser, loading: authLoading } = useAuth();
  const [rating, setRating] = useState(0); // 0 = all
  const [sort, setSort] = useState('newest');
  const [state, setState] = useState(EMPTY);
  const [loadingMore, setLoadingMore] = useState(false);

  const query = `rating=${rating}&sort=${sort}`;
  const key = `${firebaseUser?.uid || 'guest'}|${query}`;
  const loading = authLoading || state.key !== key;

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    const load = async () => {
      try {
        const token = await firebaseUser?.getIdToken().catch(() => undefined);
        const data = await apiRequest(`/api/reviews?${query}`, { token });
        if (!cancelled) setState({ key, ...data });
      } catch (error) {
        if (cancelled) return;
        setState({ ...EMPTY, key });
        toast.error(error.message);
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [key, query, authLoading, firebaseUser]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const token = await firebaseUser?.getIdToken().catch(() => undefined);
      const nextPage = state.page + 1;
      const data = await apiRequest(`/api/reviews?${query}&page=${nextPage}`, { token });
      setState((previous) => {
        if (previous.key !== key) return previous;
        const known = new Set(previous.reviews.map(({ _id }) => _id));
        return { ...previous, reviews: [...previous.reviews, ...data.reviews.filter(({ _id }) => !known.has(_id))], page: nextPage, hasMore: data.hasMore, total: data.total };
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const setMyReview = (myReview) => setState((previous) => ({ ...previous, myReview }));

  return (
    <div className="relative">
      <Blobs />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-white/70 backdrop-blur border border-indigo-100 rounded-full px-3 py-1.5">
            <MessageSquareHeart size={14} /> Real students, real words
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">What students say</h1>
          <p className="mt-3 text-slate-500 leading-relaxed">
            Every review here is written by a signed-in student and approved by a moderator. Click a name to see their profile.
          </p>
        </motion.header>

        {/* Overview first, so the average is the first thing people see */}
        {loading ? <Bone className="h-52 rounded-3xl" /> : <ReviewSummary summary={state.summary} activeRating={rating} onSelectRating={setRating} />}

        <div className="max-w-2xl mx-auto w-full">
          {!authLoading && <ReviewForm key={`${firebaseUser?.uid || 'guest'}-${state.myReview?.updatedAt || 'none'}`} myReview={state.myReview} onChange={setMyReview} />}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500" aria-live="polite">
            {loading ? 'Loading reviews...' : rating ? `${state.total} review${state.total === 1 ? '' : 's'} with ${rating} star${rating === 1 ? '' : 's'}` : `${state.total} review${state.total === 1 ? '' : 's'}`}
            {rating > 0 && (
              <button type="button" onClick={() => setRating(0)} className="ml-3 font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer">
                Show all
              </button>
            )}
          </p>
          <label className="flex items-center gap-2 text-sm text-slate-500">
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !py-2 !w-auto cursor-pointer bg-white/80">
              {SORTS.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Masonry: CSS columns keep cards of different heights tightly packed */}
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {Array.from({ length: 6 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : state.reviews.length === 0 ? (
          <EmptyState variant="posts" title={rating ? 'No reviews with this rating' : 'No reviews yet'} text={rating ? 'Try a different rating.' : 'Be the first to share your experience.'} />
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {state.reviews.map((review, index) => (
              <ReviewCard key={review._id} review={review} index={index} />
            ))}
            {loadingMore && Array.from({ length: 3 }, (_, i) => <CardSkeleton key={`more-${i}`} />)}
          </div>
        )}

        {!loading && state.hasMore && (
          <div className="text-center">
            <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-secondary !px-6">
              {loadingMore ? 'Loading...' : 'Load more reviews'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};