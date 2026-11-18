// client/src/components/reviews/ReviewForm.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest } from '../../utils/apiClient';
import { needsEmailVerification } from '../../utils/emailVerification';
import { StarInput, StarDisplay } from './StarRating';
import { Modal } from '../Modal';

const TEXT_LIMIT = 600;
const MIN_LENGTH = 10;

const STATUS_UI = {
  pending: { Icon: Clock, style: 'bg-amber-50 border-amber-200 text-amber-900', title: 'Waiting for a moderator', text: 'Your review will appear on this page once it is approved.' },
  approved: { Icon: CheckCircle2, style: 'bg-emerald-50 border-emerald-200 text-emerald-900', title: 'Your review is live', text: 'Everybody can see it on this page. Thank you!' },
  declined: { Icon: XCircle, style: 'bg-rose-50 border-rose-200 text-rose-900', title: 'Your review was not approved', text: 'You can edit it and send it again.' },
};

const glass =
  'rounded-3xl border border-white/70 bg-white/90 supports-[backdrop-filter]:bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(79,70,229,0.12)] p-5 sm:p-7';

export const ReviewForm = ({ myReview, onChange }) => {
  const { firebaseUser, dbUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(myReview?.rating || 0);
  const [text, setText] = useState(myReview?.text || '');
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!firebaseUser || !dbUser) {
    return (
      <section className={`${glass} text-center space-y-3`}>
        <h2 className="text-lg font-bold text-slate-900">Share your experience</h2>
        <p className="text-sm text-slate-500">Only signed-in students can write a review, so every review comes from a real person.</p>
        <div className="flex justify-center gap-3 pt-1">
          <Link to="/login" state={{ from: '/reviews' }} className="btn-primary">
            Sign in to review
          </Link>
          <Link to="/register" className="btn-secondary">
            Create an account
          </Link>
        </div>
      </section>
    );
  }

  if (needsEmailVerification(firebaseUser)) {
    return (
      <section className={`${glass} space-y-3`}>
        <h2 className="text-lg font-bold text-slate-900">Verify your email first</h2>
        <p className="text-sm text-slate-500">Reviews come from verified accounts. Verify your email address, then come back here.</p>
        <Link to={`/${dbUser.username}`} state={{ tab: 'security' }} className="btn-primary">
          Open security and email
        </Link>
      </section>
    );
  }

  const showForm = !myReview || editing;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please choose a star rating.');
    if (text.trim().length < MIN_LENGTH) return toast.error(`Please write at least ${MIN_LENGTH} characters.`);

    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const { message, myReview: saved } = await apiRequest('/api/reviews', { method: 'POST', token, body: { rating, text: text.trim() } });
      toast.success(message);
      setEditing(false);
      onChange(saved);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest('/api/reviews/mine', { method: 'DELETE', token });
      toast.success(message);
      setDeleteOpen(false);
      setRating(0);
      setText('');
      onChange(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!showForm) {
    const { Icon, style, title, text: note } = STATUS_UI[myReview.status] || STATUS_UI.pending;
    return (
      <section className={`${glass} space-y-4`}>
        <h2 className="text-lg font-bold text-slate-900">Your review</h2>
        <div role="status" className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${style}`}>
          <Icon size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">{title}</p>
            <p>{note}</p>
            {myReview.adminComment && (
              <p className="mt-1">
                <span className="font-semibold">Moderator note:</span> {myReview.adminComment}
              </p>
            )}
          </div>
        </div>
        <StarDisplay value={myReview.rating} size={18} />
        <p className="text-sm text-slate-700 whitespace-pre-line break-words">{myReview.text}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setRating(myReview.rating);
              setText(myReview.text);
              setEditing(true);
            }}
            className="btn-secondary"
          >
            <Pencil size={15} /> Edit
          </button>
          <button type="button" onClick={() => setDeleteOpen(true)} className="btn-secondary !text-rose-600 hover:!bg-rose-50">
            <Trash2 size={15} /> Delete
          </button>
        </div>

        <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete your review?" size="sm">
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Your review will be removed from this page. You can write a new one later.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="btn-danger">
                Delete review
              </button>
            </div>
          </div>
        </Modal>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${glass} space-y-5`}>
      <div>
        <h2 className="text-lg font-bold text-slate-900">{myReview ? 'Edit your review' : 'Share your experience'}</h2>
        <p className="text-sm text-slate-500 mt-1">
          Your name and profile link are added automatically. A moderator checks every review before it is shown.
          {myReview?.status === 'approved' && ' Editing sends it back for review.'}
        </p>
      </div>

      <StarInput value={rating} onChange={setRating} />

      <div className="space-y-1.5">
        <label htmlFor="review-text" className="text-sm font-medium text-slate-700">
          Your review
        </label>
        <textarea
          id="review-text"
          rows={4}
          value={text}
          maxLength={TEXT_LIMIT}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you like about Campus Hub? What could be better?"
          className="input resize-none"
        />
        <p className="text-xs text-slate-400 text-right">
          {text.length}/{TEXT_LIMIT}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Sending...' : myReview ? 'Save and resubmit' : 'Submit review'}
        </button>
        {editing && (
          <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};