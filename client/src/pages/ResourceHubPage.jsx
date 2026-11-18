// client/src/pages/ResourceHubPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, PlusCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/apiClient';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { PostCard } from '../components/PostCard';
import { ReportModal } from '../components/ReportModal';
import { EmptyState } from '../components/EmptyState';
import { PostCardSkeleton } from '../components/Skeletons';
import {
  COLLEGE_FILTER_OPTIONS,
  DEPARTMENT_FILTER_OPTIONS,
  SESSION_FILTER_OPTIONS,
  POST_TYPES,
  SORT_OPTIONS,
} from '../constants/campus';

const TYPE_TABS = [{ id: 'All', label: 'All' }, ...POST_TYPES];

// Filters live in the page URL (?type=article&college=SIMT), so footer links, refresh and sharing all work
const FILTER_DEFAULTS = { college: 'All', department: 'All', session: 'All', type: 'All', tag: '', search: '', sort: 'newest' };

export const ResourceHubPage = () => {
  const { firebaseUser, dbUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Requirement: Array methods (.map, Object.fromEntries) + destructuring
  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(FILTER_DEFAULTS).map(([key, fallback]) => [key, searchParams.get(key) || fallback])
      ),
    [searchParams]
  );

  const setFilter = (key, value) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (!value || value === FILTER_DEFAULTS[key]) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );

  const clearFilters = () => setSearchParams({}, { replace: true });

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => value !== FILTER_DEFAULTS[key]);

  // Search waits until typing stops, so the API is not called on every key
  const debouncedSearch = useDebounce(filters.search, 400);
  const query = useMemo(
    () => new URLSearchParams({ ...filters, search: debouncedSearch }).toString(),
    [filters, debouncedSearch]
  );

  // The feed remembers which query it belongs to, so "loading" is derived (no extra state)
  const [feed, setFeed] = useState({ query: '', posts: [], popularTags: [], page: 1, hasMore: false, total: 0 });
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  // The feed belongs to one query AND one viewer, so hearts refresh after login/logout
  const feedKey = `${firebaseUser?.uid || 'guest'}|${query}`;
  const loading = authLoading || feed.query !== feedKey;

  const [reportTarget, setReportTarget] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    const loadFeed = async () => {
      try {
        // The token is optional: signed-in users get their own "loved" hearts back
        const token = await firebaseUser?.getIdToken().catch(() => undefined);
        const { posts = [], popularTags = [], hasMore = false, totalPosts = 0 } = await apiRequest(`/api/posts/feed?${query}`, { token });
        if (!cancelled) setFeed({ query: feedKey, posts, popularTags, page: 1, hasMore, total: totalPosts });
      } catch (error) {
        if (cancelled) return;
        setFeed({ query: feedKey, posts: [], popularTags: [], page: 1, hasMore: false, total: 0 });
        toast.error(error.message);
      }
    };
    loadFeed();

    return () => {
      cancelled = true;
    };
  }, [query, feedKey, refreshKey, authLoading, firebaseUser]);

  // "Load more": fetch the next page and add it below the posts we already have
  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const token = await firebaseUser?.getIdToken().catch(() => undefined);
      const nextPage = feed.page + 1;
      const data = await apiRequest(`/api/posts/feed?${query}&page=${nextPage}`, { token });
      setFeed((previous) => {
        if (previous.query !== feedKey) return previous; // filters changed while loading
        const known = new Set(previous.posts.map(({ _id }) => _id));
        return {
          ...previous,
          posts: [...previous.posts, ...data.posts.filter(({ _id }) => !known.has(_id))],
          page: nextPage,
          hasMore: data.hasMore,
          total: data.totalPosts,
        };
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const updatePost = (postId, updater) =>
    setFeed((previous) => ({
      ...previous,
      posts: previous.posts.map((post) => (post._id === postId ? updater(post) : post)),
    }));

  const goToCreatePost = () => navigate('/create-post');

  // Guests cannot download or open drive links
  const handleDownloadOrOpen = async (postId) => {
    if (!firebaseUser) {
      toast.error('Please sign in to download files or open drive links.');
      return navigate('/login');
    }

    try {
      const token = await firebaseUser.getIdToken();
      const { downloadUrl, views } = await apiRequest(`/api/posts/${postId}/access-link`, {
        method: 'POST',
        token,
      });
      updatePost(postId, (post) => ({ ...post, views }));
      toast.success('Opening verified link...');
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLoveReact = async (postId) => {
    if (!firebaseUser || !dbUser) return toast.error('Please sign in to react.');

    try {
      const token = await firebaseUser.getIdToken();
      const { likesCount, loved } = await apiRequest(`/api/posts/${postId}/love`, { method: 'POST', token });

      updatePost(postId, (post) => ({ ...post, likesCount, lovedByMe: loved }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openReport = (post) => {
    if (!firebaseUser) {
      toast.error('Please sign in to report a link.');
      return navigate('/login');
    }
    setReportTarget(post);
  };

  const selectClass = 'input !py-2.5 cursor-pointer';

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-white via-white to-indigo-50/40">
        <div className="bg-dots absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[18rem] rounded-full bg-indigo-200/30 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-10 sm:pt-20 sm:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Every suggestion, slide and question paper, in <span className="text-indigo-600">one free place</span>.
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-500 leading-relaxed">
              Search what students from six engineering colleges have shared, read articles, find free courses
              and explore projects.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search by topic or #tag, e.g. algorithms"
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                className="input !pl-11 !py-3.5 !rounded-2xl shadow-sm shadow-slate-900/5"
              />
            </div>
            <button type="button" onClick={goToCreatePost} className="btn-primary !py-3.5 !rounded-2xl whitespace-nowrap">
              <PlusCircle size={18} /> Share a resource
            </button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Category tabs: scroll sideways on small screens */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto sm:flex-wrap pb-1 [scrollbar-width:none]">
          {TYPE_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter('type', id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer ${
                filters.type === id
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select value={filters.college} onChange={(e) => setFilter('college', e.target.value)} className={selectClass} aria-label="College">
            {COLLEGE_FILTER_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All 6 colleges' : c}
              </option>
            ))}
          </select>
          <select value={filters.department} onChange={(e) => setFilter('department', e.target.value)} className={selectClass} aria-label="Department">
            {DEPARTMENT_FILTER_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All departments' : d}
              </option>
            ))}
          </select>
          <select value={filters.session} onChange={(e) => setFilter('session', e.target.value)} className={selectClass} aria-label="Session">
            {SESSION_FILTER_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All sessions' : `Session ${s}`}
              </option>
            ))}
          </select>
        </div>

        {/* Sort + quick college filter */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-500">
            Sort by
            <select
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="input !py-2 !w-auto cursor-pointer"
            >
              {SORT_OPTIONS.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {dbUser && (
            <button
              type="button"
              aria-pressed={filters.college === dbUser.college}
              onClick={() => setFilter('college', filters.college === dbUser.college ? 'All' : dbUser.college)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition cursor-pointer ${
                filters.college === dbUser.college
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
              }`}
            >
              My college ({dbUser.college})
            </button>
          )}
        </div>

        {/* Tags + clear */}
        <div className="flex items-center gap-2 flex-wrap">
          {feed.popularTags.length > 0 && <span className="text-sm text-slate-500">Popular tags:</span>}
          {feed.popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter('tag', filters.tag === tag ? '' : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                filters.tag === tag
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
              }`}
            >
              #{tag}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="sm:ml-auto inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              <X size={14} /> Clear all filters
            </button>
          )}
        </div>

        {!loading && feed.posts.length > 0 && (
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{feed.posts.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{feed.total}</span> resource{feed.total === 1 ? '' : 's'}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading && Array.from({ length: 6 }, (_, i) => <PostCardSkeleton key={i} />)}

          {!loading &&
            feed.posts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                index={index}
                isSignedIn={Boolean(firebaseUser)}
                isLoved={Boolean(post.lovedByMe)}
                onOpen={handleDownloadOrOpen}
                onLove={handleLoveReact}
                onReport={openReport}
                onTagClick={(tag) => setFilter('tag', tag)}
              />
            ))}

          {loadingMore && Array.from({ length: 3 }, (_, i) => <PostCardSkeleton key={`more-${i}`} />)}
        </div>

        {!loading && feed.hasMore && (
          <div className="text-center">
            <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-secondary !px-6">
              {loadingMore ? 'Loading...' : `Load more (${feed.total - feed.posts.length} left)`}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && feed.posts.length === 0 && (
          <EmptyState
            variant={hasActiveFilters ? 'search' : 'posts'}
            title={hasActiveFilters ? 'Nothing matches these filters' : 'No resources yet'}
            text={hasActiveFilters ? 'Try a different college or session, or share the first resource.' : 'Be the first to share something useful with other students.'}
          >
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="btn-secondary">
                Clear filters
              </button>
            )}
            <button type="button" onClick={goToCreatePost} className="btn-primary">
              Share a resource
            </button>
          </EmptyState>
        )}
      </div>

      {/* Report dialog */}
      {reportTarget && (
        <ReportModal
          key={reportTarget._id}
          post={reportTarget}
          onClose={() => setReportTarget(null)}
          onSubmitted={() => setRefreshKey((key) => key + 1)}
        />
      )}
    </div>
  );
};