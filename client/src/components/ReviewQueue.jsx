// client/src/components/ReviewQueue.jsx
// Admin/moderator: approve, decline or delete reviews. Used inside the admin dashboard.
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../utils/apiClient';
import { Modal } from './Modal';
import { EmptyState } from './EmptyState';
import { Bone } from './Skeletons';
import { StarDisplay } from './reviews/StarRating';

const TABS = ['pending', 'approved', 'declined'];

export const ReviewQueue = ({ onChanged }) => {
  const { firebaseUser } = useAuth();
  const [tab, setTab] = useState('pending');
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState({ key: '', reviews: [], total: 0, hasMore: false, counts: { pending: 0, approved: 0, declined: 0 }, page: 1 });
  const [loadingMore, setLoadingMore] = useState(false);
  const [declineTarget, setDeclineTarget] = useState(null);
  const [comment, setComment] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const key = `${tab}|${refreshKey}`;
  const loading = state.key !== key;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const data = await apiRequest(`/api/admin/reviews?status=${tab}&page=1`, { token });
        if (!cancelled) setState({ key, page: 1, ...data });
      } catch (error) {
        if (cancelled) return;
        setState((previous) => ({ ...previous, key, reviews: [], total: 0, hasMore: false }));
        toast.error(error.message);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [key, tab, firebaseUser]);

  const refresh = () => {
    setRefreshKey((value) => value + 1);
    onChanged?.();
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const token = await firebaseUser.getIdToken();
      const nextPage = state.page + 1;
      const data = await apiRequest(`/api/admin/reviews?status=${tab}&page=${nextPage}`, { token });
      setState((previous) => ({ ...previous, reviews: [...previous.reviews, ...data.reviews], hasMore: data.hasMore, page: nextPage }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const review = async (item, status, adminComment = '') => {
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(`/api/admin/reviews/${item._id}/review`, { method: 'PATCH', token, body: { status, adminComment } });
      toast.success(message);
      setDeclineTarget(null);
      setComment('');
      refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const remove = async () => {
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(`/api/admin/reviews/${deleteTarget._id}`, { method: 'DELETE', token });
      toast.success(message);
      setDeleteTarget(null);
      refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="card overflow-hidden">
      <div className="p-6 pb-0">
        <h2 className="text-base font-bold text-slate-900">Reviews</h2>
        <p className="text-sm text-slate-500 mt-1">Only approved reviews appear on the public Reviews page.</p>
        <div className="flex flex-wrap gap-2 mt-4 pb-4 border-b border-slate-100">
          {TABS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-3.5 py-2 rounded-full text-sm font-medium capitalize transition cursor-pointer ${tab === id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {id} ({state.counts[id] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-6 space-y-3" role="status" aria-busy="true">
          <span className="sr-only">Loading reviews</span>
          {Array.from({ length: 4 }, (_, i) => (
            <Bone key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : state.reviews.length === 0 ? (
        <EmptyState variant="queue" bare compact title={`No ${tab} reviews`} text="Nothing to do here right now." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {state.reviews.map((item) => (
            <li key={item._id} className="p-5 sm:px-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <Link to={`/${item.user?.username}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                    {item.user?.fullName || 'Deleted user'}
                  </Link>
                  <p className="text-xs text-slate-500">
                    @{item.user?.username} &middot; {item.user?.college} &middot; {item.user?.department} &middot; {new Date(item.createdAt).toLocaleDateString()}
                    {item.verified ? ' · verified email' : ''}
                  </p>
                </div>
                <StarDisplay value={item.rating} size={16} />
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-line break-words">{item.text}</p>
              {item.adminComment && <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Note: {item.adminComment}</p>}
              <div className="flex flex-wrap gap-2">
                {item.status !== 'approved' && (
                  <button type="button" onClick={() => review(item, 'approved')} className="btn-primary !py-1.5 !text-xs">
                    <Check size={14} /> Approve
                  </button>
                )}
                {item.status !== 'declined' && (
                  <button
                    type="button"
                    onClick={() => {
                      setComment('');
                      setDeclineTarget(item);
                    }}
                    className="btn-secondary !py-1.5 !text-xs"
                  >
                    <X size={14} /> Decline
                  </button>
                )}
                <button type="button" onClick={() => setDeleteTarget(item)} className="btn-secondary !py-1.5 !text-xs !text-rose-600 hover:!bg-rose-50">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && state.hasMore && (
        <div className="p-4 text-center border-t border-slate-100">
          <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-secondary">
            {loadingMore ? 'Loading...' : 'Show more'}
          </button>
        </div>
      )}

      <Modal isOpen={Boolean(declineTarget)} onClose={() => setDeclineTarget(null)} title="Decline this review" size="sm">
        <div className="space-y-4">
          <label htmlFor="decline-note" className="text-sm font-medium text-slate-700">
            Note for the author (optional)
          </label>
          <textarea id="decline-note" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={300} className="input resize-none" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setDeclineTarget(null)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={() => review(declineTarget, 'declined', comment)} className="btn-danger">
              Decline
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete this review?" size="sm">
        <div className="space-y-5">
          <p className="text-sm text-slate-600">It will be removed permanently.</p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setDeleteTarget(null)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={remove} className="btn-danger">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};