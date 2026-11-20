// client/src/pages/AdminDashboardPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  LayoutDashboard,
  ClipboardCheck,
  Trophy,
  Building2,
  Users,
  Search,
  Check,
  X,
  MessageSquare,
  Trash2,
  ExternalLink,
  AlertTriangle,
  Link2Off,
  RefreshCw,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../utils/apiClient';
import { Modal } from '../components/Modal';
import { Bone, DashboardSkeleton } from '../components/Skeletons';
import { scrollBehavior } from '../utils/scrollToTop';
import { EmptyState } from '../components/EmptyState';
import { ReviewQueue } from '../components/ReviewQueue';
import { COLLEGE_FILTER_OPTIONS } from '../constants/campus';

const SECTIONS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'moderation', label: 'Moderation queue', Icon: ClipboardCheck },
  { id: 'reviews', label: 'Reviews', Icon: Star },
  { id: 'contributors', label: 'Top contributors', Icon: Trophy },
  { id: 'colleges', label: 'Colleges', Icon: Building2 },
  { id: 'team', label: 'Team and roles', Icon: Users },
];

const TIMEFRAMES = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
];

const STATUS_COLORS = { approved: '#10b981', pending: '#f59e0b', declined: '#f43f5e', reported: '#f97316' };

const STATUS_BADGE_STYLES = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  declined: 'bg-rose-50 text-rose-700 border-rose-200',
  reported: 'bg-orange-50 text-orange-700 border-orange-200',
};

const QUEUE_TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'reported', label: 'Reported links' },
  { id: 'declined', label: 'Declined' },
  { id: 'all', label: 'All posts' },
];

const formatNumber = (value = 0) => Number(value).toLocaleString();

const pad = (value) => String(value).padStart(2, '0');

// The server sends only the days/months that have uploads. Fill the gaps so the chart has no holes.
const fillTimeline = (rows = [], timeframe) => {
  const now = new Date();
  const isYearly = timeframe === 'yearly';
  const bucketCount = isYearly ? 12 : timeframe === 'weekly' ? 7 : 30;
  const byKey = new Map(rows.map((row) => [row.key, row]));

  return Array.from({ length: bucketCount }, (_, index) => {
    const offset = bucketCount - 1 - index;
    const date = isYearly
      ? new Date(now.getFullYear(), now.getMonth() - offset, 1)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);

    // Same key format as the server: YYYY-MM (yearly) or YYYY-MM-DD
    const key = isYearly
      ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
      : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    const label = isYearly
      ? date.toLocaleString('en', { month: 'short' })
      : timeframe === 'weekly'
      ? date.toLocaleString('en', { weekday: 'short' })
      : `${date.getDate()}/${date.getMonth() + 1}`;

    const { uploads = 0, approved = 0, declined = 0 } = byKey.get(key) || {};
    return { key, label, uploads, approved, declined };
  });
};

const StatCard = ({ label, value, hint, accent = 'text-slate-900' }) => (
  <div className="card p-5">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-1.5 text-3xl font-extrabold tracking-tight ${accent}`}>{formatNumber(value)}</p>
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_BADGE_STYLES[status] || ''}`}>
    {status}
  </span>
);

// Approve, decline or comment on a post. Mounted only while open so it starts fresh each time.
const ReviewModal = ({ post, onClose, onReview }) => {
  const [comment, setComment] = useState(post.adminComment || '');
  const [updatedLink, setUpdatedLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isReported = post.status === 'reported';

  const submit = async (status) => {
    if (status === 'declined' && comment.trim().length < 3) {
      return toast.error('Please explain why this post is declined, so the author can fix it.');
    }
    if (updatedLink.trim() && !updatedLink.trim().startsWith('https://')) {
      return toast.error('The updated link must start with https://');
    }
    setSubmitting(true);
    await onReview(post, status, comment.trim(), updatedLink.trim());
    setSubmitting(false);
  };

  return (
    <Modal isOpen onClose={onClose} title="Review post" size="md">
      <div className="space-y-5">
        <div>
          <p className="font-semibold text-slate-900 break-words">{post.title}</p>
          <p className="text-sm text-slate-500 mt-0.5">
            by @{post.author?.username} &middot; {post.college} &middot; {post.department}
          </p>
          <a
            href={post.unmaskedLink || post.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <ExternalLink size={14} /> Open the shared link
          </a>
        </div>

        {isReported && post.reports?.length > 0 && (
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 space-y-1.5">
            <p className="text-sm font-semibold text-orange-800 flex items-center gap-1.5">
              <AlertTriangle size={15} /> {post.reports.length} report{post.reports.length > 1 ? 's' : ''}
            </p>
            {post.reports.map(({ reason, createdAt }, index) => (
              <p key={`${createdAt}-${index}`} className="text-sm text-orange-700">
                {reason} <span className="text-orange-500">({new Date(createdAt).toLocaleDateString()})</span>
              </p>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Comment for the author</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional for approvals. Required when declining."
            className="input resize-none"
          />
        </div>

        {isReported && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Replace the broken link (optional)</label>
            <input
              type="url"
              value={updatedLink}
              onChange={(e) => setUpdatedLink(e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3 pt-1">
          <button type="button" onClick={() => submit('pending')} disabled={submitting} className="btn-secondary">
            <MessageSquare size={15} /> Save as pending
          </button>
          <button type="button" onClick={() => submit('declined')} disabled={submitting} className="btn-danger">
            <X size={15} /> Decline
          </button>
          <button type="button" onClick={() => submit('approved')} disabled={submitting} className="btn-primary">
            <Check size={15} /> Approve
          </button>
        </div>
      </div>
    </Modal>
  );
};

const QueueMobileCard = ({ post, onApprove, onReview, onDelete }) => {
  const { title, type, status, author, college, department, createdAt, externalLink, unmaskedLink, reports = [] } = post;
  return (
    <div className="p-4 space-y-3">
      <div>
        <p className="font-medium text-slate-900 break-words">{title}</p>
        <p className="text-xs text-slate-500 mt-1">
          <span className="capitalize">{type}</span> &middot; {college} &middot; {department} &middot;{' '}
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <StatusBadge status={status} />
        <Link to={`/${author?.username}`} className="text-slate-600 hover:text-indigo-600">
          @{author?.username || 'deleted'}
        </Link>
        {reports.length > 0 && (
          <span className="text-xs text-orange-600 inline-flex items-center gap-1">
            <AlertTriangle size={12} /> {reports.length} report{reports.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <a
          href={unmaskedLink || externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <ExternalLink size={14} /> Open link
        </a>
        <div className="flex gap-1.5">
          {status !== 'approved' && (
            <button type="button" onClick={onApprove} className="p-2.5 rounded-lg text-emerald-600 bg-emerald-50 cursor-pointer" aria-label="Approve">
              <Check size={16} />
            </button>
          )}
          <button type="button" onClick={onReview} className="p-2.5 rounded-lg text-slate-600 bg-slate-100 cursor-pointer" aria-label="Review">
            <MessageSquare size={16} />
          </button>
          <button type="button" onClick={onDelete} className="p-2.5 rounded-lg text-rose-500 bg-rose-50 cursor-pointer" aria-label="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboardPage = () => {
  const { firebaseUser, dbUser } = useAuth();
  const isSuperAdmin = dbUser?.role === 'admin';

  const [activeSection, setActiveSection] = useState('overview');
  const [timeframe, setTimeframe] = useState('monthly');
  const [college, setCollege] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [queueTab, setQueueTab] = useState('pending');
  // The moderation queue is loaded one page at a time from the server
  const [queue, setQueue] = useState({ key: '', posts: [], total: 0, page: 1, hasMore: false });
  const [loadingMore, setLoadingMore] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [roleForm, setRoleForm] = useState({ username: '', newRole: 'moderator' });

  // Debounce the search box
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reload analytics after a review, delete or role change
  const fetchAnalytics = () => setRefreshKey((key) => key + 1);

  // Retry button after a failed first load
  const retryLoad = () => {
    setLoading(true);
    setError('');
    fetchAnalytics();
  };

  useEffect(() => {
    // Ignore answers from older requests (fast filter or search changes)
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const query = new URLSearchParams({
          timeframe,
          college,
          search,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }).toString();
        const result = await apiRequest(`/api/admin/analytics?${query}`, { token });
        if (cancelled) return;
        setData({ ...result, fetchedAt: Date.now() });
        setError('');
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        toast.error(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [firebaseUser, timeframe, college, search, refreshKey]);

  // The server groups uploads per day/month. Here we only fill the empty days for the chart.
  const timeline = useMemo(() => (data ? fillTimeline(data.timeline, timeframe) : []), [data, timeframe]);

  // Moderation queue: loaded only while that section is open, and again after every review/delete
  const queueKey = `${queueTab}|${college}|${search}|${refreshKey}`;

  useEffect(() => {
    if (activeSection !== 'moderation') return;
    let cancelled = false;

    const loadQueue = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const query = new URLSearchParams({ status: queueTab, college, search, page: '1' }).toString();
        const result = await apiRequest(`/api/admin/posts?${query}`, { token });
        if (!cancelled) setQueue({ key: queueKey, posts: result.posts, total: result.total, page: 1, hasMore: result.hasMore });
      } catch (err) {
        if (cancelled) return;
        setQueue({ key: queueKey, posts: [], total: 0, page: 1, hasMore: false });
        toast.error(err.message);
      }
    };
    loadQueue();

    return () => {
      cancelled = true;
    };
  }, [activeSection, queueKey, queueTab, college, search, firebaseUser]);

  const queueLoading = activeSection === 'moderation' && queue.key !== queueKey;

  const loadMoreQueue = async () => {
    setLoadingMore(true);
    try {
      const token = await firebaseUser.getIdToken();
      const nextPage = queue.page + 1;
      const query = new URLSearchParams({ status: queueTab, college, search, page: String(nextPage) }).toString();
      const result = await apiRequest(`/api/admin/posts?${query}`, { token });
      setQueue((previous) => {
        if (previous.key !== queueKey) return previous;
        const known = new Set(previous.posts.map(({ _id }) => _id));
        return {
          ...previous,
          posts: [...previous.posts, ...result.posts.filter(({ _id }) => !known.has(_id))],
          total: result.total,
          page: nextPage,
          hasMore: result.hasMore,
        };
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleReview = async (post, status, adminComment, updatedLink) => {
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(`/api/admin/posts/${post._id}/review`, {
        method: 'PATCH',
        token,
        body: { status, adminComment, updatedLink },
      });
      toast.success(message);
      setReviewTarget(null);
      fetchAnalytics();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(`/api/admin/posts/${deleteTarget._id}`, { method: 'DELETE', token });
      toast.success(message);
      setDeleteTarget(null);
      fetchAnalytics();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRoleChange = async (e) => {
    e.preventDefault();
    const { username, newRole } = roleForm;
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest('/api/admin/users/role', {
        method: 'PUT',
        token,
        body: { username, newRole },
      });
      toast.success(message);
      setRoleForm({ username: '', newRole: 'moderator' });
      fetchAnalytics();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!data) {
    if (loading) return <DashboardSkeleton />;
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertTriangle size={34} className="mx-auto text-amber-500" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">Could not load the dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">{error || 'Something went wrong. Please try again.'}</p>
        <button type="button" onClick={retryLoad} className="btn-primary mt-6">
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    );
  }

  const { summaryMetrics, activeMembersCount, collegeBreakdown, topContributors, staffMembers, queueCounts } = data;

  const statusData = [
    { name: 'Approved', value: summaryMetrics.approvedCount, color: STATUS_COLORS.approved },
    { name: 'Pending', value: summaryMetrics.pendingCount, color: STATUS_COLORS.pending },
    { name: 'Declined', value: summaryMetrics.declinedCount, color: STATUS_COLORS.declined },
    { name: 'Reported', value: summaryMetrics.reportedCount, color: STATUS_COLORS.reported },
  ].filter(({ value }) => value > 0);

  const typeEntries = Object.entries(summaryMetrics.byType);
  const typeTotal = typeEntries.reduce((sum, [, count]) => sum + count, 0);

  const queueCount = (tab) => queueCounts[tab] ?? 0;
  const queuePosts = queue.posts;

  const chartTooltipStyle = { borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[230px_minmax(0,1fr)] gap-4 lg:gap-8">
      {/* Sidebar */}
      <aside className="min-w-0 sticky top-[4.25rem] z-30 lg:top-24 lg:self-start">
        <div className="card p-1.5 lg:p-3 bg-white/95 backdrop-blur">
          <p className="hidden lg:block px-3 pt-2 pb-3 text-sm font-semibold text-slate-900">Admin panel</p>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto [scrollbar-width:none]" aria-label="Admin sections">
            {SECTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={(e) => {
                  setActiveSection(id);
                  // On phones, bring the chosen tab into view in the scrolling menu
                  e.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest', behavior: scrollBehavior() });
                }}
                className={`flex shrink-0 items-center gap-2 lg:gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                  activeSection === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={17} /> {label}
                {id === 'reviews' && (data.pendingReviews || 0) > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                    {data.pendingReviews}
                  </span>
                )}
                {id === 'moderation' && queueCount('pending') + queueCount('reported') > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                    {queueCount('pending') + queueCount('reported')}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <p className="hidden lg:block px-3 py-3 mt-2 border-t border-slate-100 text-xs text-slate-400">
            Signed in as {dbUser.role}
          </p>
        </div>
      </aside>

      {/* Content */}
      <div className="space-y-6 min-w-0">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex w-full md:w-auto p-1 rounded-xl bg-slate-100 md:self-start">
            {TIMEFRAMES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTimeframe(id)}
                className={`flex-1 md:flex-none px-4 py-2 md:py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  timeframe === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select value={college} onChange={(e) => setCollege(e.target.value)} className="input !py-2 sm:w-44 cursor-pointer" aria-label="College">
              {COLLEGE_FILTER_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All colleges' : c}
                </option>
              ))}
            </select>
            <div className="relative sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search title, department or college"
                className="input !py-2 !pl-10"
              />
            </div>
          </div>
        </div>

        <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Uploads" value={summaryMetrics.totalPosts} hint={`This ${timeframe.replace('ly', '')} period`} />
                <StatCard label="Approved" value={summaryMetrics.approvedCount} accent="text-emerald-600" />
                <StatCard label="Declined" value={summaryMetrics.declinedCount} accent="text-rose-600" />
                <StatCard label="Pending review" value={queueCount('pending')} accent="text-amber-600" hint="All time, needs action" />
                <StatCard label="Reported links" value={queueCount('reported')} accent="text-orange-600" hint="All time, needs action" />
                <StatCard label="Views" value={summaryMetrics.totalViews} />
                <StatCard label="Love reacts" value={summaryMetrics.totalLoves} accent="text-rose-500" />
                <StatCard label="Active members" value={activeMembersCount} hint={college === 'All' ? 'All colleges' : college} />
              </div>

              <section className="card p-6">
                <h2 className="text-base font-bold text-slate-900">Uploads over time</h2>
                <p className="text-sm text-slate-500 mb-4">Uploads, approvals and declines in the selected period.</p>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeline} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={18} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f1f5f9' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="uploads" name="Uploads" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="declined" name="Declined" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <div className="grid lg:grid-cols-2 gap-6">
                <section className="card p-6">
                  <h2 className="text-base font-bold text-slate-900">Review status</h2>
                  <p className="text-sm text-slate-500">Posts uploaded in the selected period.</p>
                  {statusData.length === 0 ? (
                    <p className="text-sm text-slate-500 mt-6">No posts in this period.</p>
                  ) : (
                    <div className="h-60 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                            {statusData.map(({ name, color }) => (
                              <Cell key={name} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={chartTooltipStyle} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </section>

                <section className="card p-6">
                  <h2 className="text-base font-bold text-slate-900">Content types</h2>
                  <div className="mt-5 space-y-4">
                    {typeEntries.map(([type, count]) => (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="capitalize text-slate-700">{type}</span>
                          <span className="font-semibold text-slate-900">{formatNumber(count)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-500 transition-all"
                            style={{ width: `${typeTotal ? (count / typeTotal) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {/* MODERATION QUEUE */}
          {activeSection === 'moderation' && (
            <section className="card overflow-hidden">
              <div className="p-6 pb-0">
                <h2 className="text-base font-bold text-slate-900">Moderation queue</h2>
                <p className="text-sm text-slate-500 mt-1">Approve, decline or comment on uploads and reported links.</p>
                <div className="flex flex-wrap gap-2 mt-4 pb-4 border-b border-slate-100">
                  {QUEUE_TABS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setQueueTab(id);
                      }}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                        queueTab === id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {label} ({queueCount(id)})
                    </button>
                  ))}
                </div>
              </div>

              {queueLoading ? (
                <div className="p-6 space-y-3" role="status" aria-busy="true">
                  <span className="sr-only">Loading the queue</span>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Bone key={i} className="h-16 rounded-xl" />
                  ))}
                </div>
              ) : queuePosts.length === 0 ? (
                <EmptyState variant="queue" bare compact title="Nothing in this queue" text="Nice work. New uploads and reports will appear here." />
              ) : (
                <>
                {/* Phones: one card per post */}
                <div className="md:hidden divide-y divide-slate-100">
                  {queuePosts.map((post) => (
                    <QueueMobileCard
                      key={post._id}
                      post={post}
                      onApprove={() => handleReview(post, 'approved', post.adminComment || '', '')}
                      onReview={() => setReviewTarget(post)}
                      onDelete={() => setDeleteTarget(post)}
                    />
                  ))}
                </div>
                {/* Tablets and desktops: table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                        <th className="px-6 py-3 font-medium">Post</th>
                        <th className="px-3 py-3 font-medium">Author</th>
                        <th className="px-3 py-3 font-medium">Status</th>
                        <th className="px-3 py-3 font-medium">Link</th>
                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {queuePosts.map((post) => {
                        const { _id, title, type, status, author, college: postCollege, department, createdAt, externalLink, unmaskedLink, reports = [] } = post;
                        const isMasked = unmaskedLink && externalLink !== unmaskedLink;
                        return (
                          <tr key={_id} className="hover:bg-slate-50/60 align-top">
                            <td className="px-6 py-4 max-w-xs">
                              <p className="font-medium text-slate-900 line-clamp-2">{title}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                <span className="capitalize">{type}</span> &middot; {postCollege} &middot; {department} &middot;{' '}
                                {new Date(createdAt).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <Link to={`/${author?.username}`} className="text-slate-700 hover:text-indigo-600">
                                @{author?.username || 'deleted'}
                              </Link>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap space-y-1">
                              <StatusBadge status={status} />
                              {reports.length > 0 && (
                                <p className="text-xs text-orange-600 flex items-center gap-1">
                                  <AlertTriangle size={12} /> {reports.length} report{reports.length > 1 ? 's' : ''}
                                </p>
                              )}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <a
                                href={unmaskedLink || externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700"
                              >
                                <ExternalLink size={14} /> Open
                              </a>
                              {isMasked && (
                                <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                  <Link2Off size={12} /> Was a short link
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                {status !== 'approved' && (
                                  <button
                                    type="button"
                                    onClick={() => handleReview(post, 'approved', post.adminComment || '', '')}
                                    className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                                    title="Approve"
                                  >
                                    <Check size={16} />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setReviewTarget(post)}
                                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                  title="Review, decline or comment"
                                >
                                  <MessageSquare size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(post)}
                                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                  title="Delete permanently"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                </>
              )}

              {!queueLoading && queue.hasMore && (
                <div className="p-4 text-center border-t border-slate-100">
                  <button type="button" onClick={loadMoreQueue} disabled={loadingMore} className="btn-secondary">
                    {loadingMore ? 'Loading...' : `Show more (${queue.total - queuePosts.length} left)`}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* REVIEWS */}
          {activeSection === 'reviews' && <ReviewQueue onChanged={fetchAnalytics} />}

          {/* TOP CONTRIBUTORS */}
          {activeSection === 'contributors' && (
            <section className="card overflow-hidden">
              <div className="p-6 pb-4">
                <h2 className="text-base font-bold text-slate-900">Top contributors</h2>
                <p className="text-sm text-slate-500 mt-1">Ranked by approved uploads, then love reacts.</p>
              </div>
              {topContributors.length === 0 ? (
                <div className="py-16 text-center text-sm text-slate-500">No contributors yet.</div>
              ) : (
                <>
                <ol className="md:hidden divide-y divide-slate-100 border-t border-slate-100">
                  {topContributors.map(({ _id, fullName, username, college: col, department, totalUploads, approvedUploads, totalViews, totalLoves }, index) => (
                    <li key={_id} className="px-4 py-3.5 flex gap-3">
                      <span className="w-6 shrink-0 text-center font-bold text-slate-400 pt-0.5">{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <Link to={`/${username}`} className="font-medium text-slate-900 hover:text-indigo-600 break-words">
                          {fullName}
                        </Link>
                        <p className="text-xs text-slate-500 break-all">
                          @{username} &middot; {col} &middot; {department}
                        </p>
                        <dl className="mt-2.5 grid grid-cols-4 gap-2 text-center">
                          {[
                            ['Uploads', totalUploads, 'text-slate-900'],
                            ['Approved', approvedUploads, 'text-emerald-600'],
                            ['Views', totalViews, 'text-slate-900'],
                            ['Loves', totalLoves, 'text-rose-500'],
                          ].map(([label, value, color]) => (
                            <div key={label} className="rounded-lg bg-slate-50 py-1.5">
                              <dd className={`text-sm font-bold ${color}`}>{formatNumber(value)}</dd>
                              <dt className="text-[10px] text-slate-400">{label}</dt>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="text-left text-xs text-slate-500 border-y border-slate-100">
                        <th className="px-6 py-3 font-medium w-12">#</th>
                        <th className="px-3 py-3 font-medium">Student</th>
                        <th className="px-3 py-3 font-medium">College</th>
                        <th className="px-3 py-3 font-medium text-right">Uploads</th>
                        <th className="px-3 py-3 font-medium text-right">Approved</th>
                        <th className="px-3 py-3 font-medium text-right">Views</th>
                        <th className="px-6 py-3 font-medium text-right">Loves</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topContributors.map(({ _id, fullName, username, college: col, department, totalUploads, approvedUploads, totalViews, totalLoves }, index) => (
                        <tr key={_id} className="hover:bg-slate-50/60">
                          <td className="px-6 py-3.5 font-semibold text-slate-400">{index + 1}</td>
                          <td className="px-3 py-3.5">
                            <Link to={`/${username}`} className="font-medium text-slate-900 hover:text-indigo-600">
                              {fullName}
                            </Link>
                            <p className="text-xs text-slate-500">@{username}</p>
                          </td>
                          <td className="px-3 py-3.5 text-slate-600">
                            {col} &middot; {department}
                          </td>
                          <td className="px-3 py-3.5 text-right">{formatNumber(totalUploads)}</td>
                          <td className="px-3 py-3.5 text-right font-semibold text-emerald-600">{formatNumber(approvedUploads)}</td>
                          <td className="px-3 py-3.5 text-right">{formatNumber(totalViews)}</td>
                          <td className="px-6 py-3.5 text-right text-rose-500">{formatNumber(totalLoves)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </>
              )}
            </section>
          )}

          {/* COLLEGES */}
          {activeSection === 'colleges' && (
            <>
              <section className="card p-6">
                <h2 className="text-base font-bold text-slate-900">Posts and loves by college</h2>
                <p className="text-sm text-slate-500 mb-4">All time. Use the college filter above to focus on one college.</p>
                {collegeBreakdown.length === 0 ? (
                  <p className="text-sm text-slate-500 py-10 text-center">No data yet.</p>
                ) : (
                  <div className="h-64 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={collegeBreakdown} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="college" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f1f5f9' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="posts" name="Posts" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="loves" name="Loves" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              <section className="card overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full min-w-0 text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                      <th className="px-3 sm:px-6 py-3 font-medium">College</th>
                      <th className="px-3 py-3 font-medium text-right">Posts</th>
                      <th className="px-3 py-3 font-medium text-right">Views</th>
                      <th className="px-3 sm:px-6 py-3 font-medium text-right">Loves</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {collegeBreakdown.map(({ college: col, posts: postCount, views, loves }) => (
                      <tr key={col} className="hover:bg-slate-50/60">
                        <td className="px-3 sm:px-6 py-3.5 font-medium text-slate-900">{col}</td>
                        <td className="px-3 py-3.5 text-right">{formatNumber(postCount)}</td>
                        <td className="px-3 py-3.5 text-right">{formatNumber(views)}</td>
                        <td className="px-3 sm:px-6 py-3.5 text-right text-rose-500">{formatNumber(loves)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </section>
            </>
          )}

          {/* TEAM AND ROLES */}
          {activeSection === 'team' && (
            <>
              <section className="card overflow-hidden">
                <div className="p-6 pb-4">
                  <h2 className="text-base font-bold text-slate-900">Admins and moderators</h2>
                </div>
                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {staffMembers.map(({ _id, fullName, username, email, college: col, role }) => (
                    <div key={_id} className="px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{fullName}</p>
                        <p className="text-sm text-slate-500 break-all">
                          @{username} &middot; {email} &middot; {col}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                          role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}
                      >
                        {role}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {isSuperAdmin ? (
                <form onSubmit={handleRoleChange} className="card p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Change a user's role</h2>
                    <p className="text-sm text-slate-500 mt-1">Only super admins can promote or demote moderators.</p>
                  </div>
                  <div className="grid sm:grid-cols-[1fr_180px_auto] gap-3">
                    <input
                      type="text"
                      placeholder="Username, e.g. angkonkar"
                      value={roleForm.username}
                      onChange={(e) => setRoleForm((prev) => ({ ...prev, username: e.target.value }))}
                      required
                      className="input"
                    />
                    <select
                      value={roleForm.newRole}
                      onChange={(e) => setRoleForm((prev) => ({ ...prev, newRole: e.target.value }))}
                      className="input cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="btn-primary">
                      Update role
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-slate-500">Role changes are available to super admins only.</p>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      {reviewTarget && <ReviewModal key={reviewTarget._id} post={reviewTarget} onClose={() => setReviewTarget(null)} onReview={handleReview} />}

      <Modal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete this post?" size="sm">
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{deleteTarget?.title}</span> will be permanently removed. This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setDeleteTarget(null)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleDelete} className="btn-danger">
              <Trash2 size={15} /> Delete post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};