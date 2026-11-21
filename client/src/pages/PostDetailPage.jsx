// client/src/pages/PostDetailPage.jsx
// The full post: article/project text, file preview, subject info, tags, author, and actions (open, love, report, edit, delete).
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Eye, ExternalLink, Lock, Flag, Pencil, Trash2, Clock, Link2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/apiClient';
import { sanitizeHtml, stripHtml } from '../utils/sanitize';
import { useAuth } from '../hooks/useAuth';
import { Modal } from '../components/Modal';
import { Avatar } from '../components/Avatar';
import { PostPreview } from '../components/PostPreview';
import { ReportModal } from '../components/ReportModal';
import { EmptyState } from '../components/EmptyState';
import { PostDetailSkeleton } from '../components/Skeletons';
import { POST_TYPES } from '../constants/campus';

const STATUS_NOTES = {
  pending: 'This post is waiting for review. Only you and the moderators can see it.',
  declined: 'This post was declined. Only you and the moderators can see it. Edit it and resubmit.',
  reported: 'Readers reported the link in this post. A moderator is reviewing it.',
};

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { firebaseUser, dbUser, loading: authLoading } = useAuth();

  // The result remembers which post and viewer it belongs to, so "loading" needs no extra state
  const [result, setResult] = useState({ key: '', post: null, error: '' });
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const key = `${firebaseUser?.uid || 'guest'}|${id}`;
  const loading = authLoading || result.key !== key;
  const { post } = result;

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    const loadPost = async () => {
      try {
        const token = await firebaseUser?.getIdToken().catch(() => undefined);
        const { post: data } = await apiRequest(`/api/posts/${id}`, { token });
        if (!cancelled) setResult({ key, post: data, error: '' });
      } catch (error) {
        if (!cancelled) setResult({ key, post: null, error: error.message });
      }
    };
    loadPost();

    return () => {
      cancelled = true;
    };
  }, [id, key, authLoading, firebaseUser]);

  // Opening the post page counts as one view (the server ignores repeats from the same person within 30 minutes)
  const postId = post?._id;
  const isApproved = post?.status === 'approved';

  useEffect(() => {
    if (!postId || !isApproved) return;
    let cancelled = false;

    const registerView = async () => {
      try {
        const token = await firebaseUser?.getIdToken().catch(() => undefined);
        const { views } = await apiRequest(`/api/posts/${postId}/view`, { method: 'POST', token, retry: true });
        if (cancelled || typeof views !== 'number') return;
        setResult((previous) =>
          previous.post?._id === postId ? { ...previous, post: { ...previous.post, views } } : previous
        );
      } catch {
        // a view that could not be counted is not worth an error message
      }
    };
    registerView();

    return () => {
      cancelled = true;
    };
  }, [postId, isApproved, firebaseUser]);

  // The browser tab shows the post title while reading
  useEffect(() => {
    if (!post) return;
    const previousTitle = document.title;
    document.title = `${post.title} | Campus Hub`;
    return () => {
      document.title = previousTitle;
    };
  }, [post]);

  const updatePost = (changes) => setResult((previous) => ({ ...previous, post: { ...previous.post, ...changes } }));

  const handleOpen = async () => {
    if (!firebaseUser) {
      toast.error('Please sign in to download files or open drive links.');
      return navigate('/login', { state: { from: `/post/${id}` } });
    }
    try {
      const token = await firebaseUser.getIdToken();
      const { downloadUrl, views } = await apiRequest(`/api/posts/${id}/access-link`, { method: 'POST', token });
      updatePost({ views });
      toast.success('Opening verified link...');
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLove = async () => {
    if (!firebaseUser || !dbUser) return toast.error('Please sign in to react.');
    try {
      const token = await firebaseUser.getIdToken();
      const { likesCount, loved } = await apiRequest(`/api/posts/${id}/love`, { method: 'POST', token });
      updatePost({ likesCount, lovedByMe: loved });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReport = () => {
    if (!firebaseUser) {
      toast.error('Please sign in to report a link.');
      return navigate('/login', { state: { from: `/post/${id}` } });
    }
    setReportOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link to this post copied.');
    } catch {
      toast.error('Could not copy the link. Copy it from the address bar instead.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(`/api/posts/${id}`, { method: 'DELETE', token });
      toast.success(message);
      navigate(`/${dbUser.username}`, { state: { tab: 'status' } });
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <PostDetailSkeleton />;

  if (!post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <EmptyState variant="search" title="We could not find this post" text={result.error || 'It may have been removed or is still under review.'}>
          <Link to="/" className="btn-primary">
            Back to Campus Hub
          </Link>
        </EmptyState>
      </div>
    );
  }

  const {
    title,
    content,
    fontFamily,
    type,
    college,
    department,
    session,
    semester,
    subjectCode,
    subjectName,
    hasPreview,
    previewUrl,
    tags = [],
    views,
    likesCount,
    lovedByMe,
    author,
    createdAt,
    resourceCredit,
    status,
    adminComment,
    isOwner,
  } = post;
  const typeLabel = POST_TYPES.find(({ id: typeId }) => typeId === type)?.label || type;
  const readMinutes = Math.max(1, Math.round(stripHtml(content).split(/\s+/).filter(Boolean).length / 200));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition">
        <ArrowLeft size={15} /> Back to Campus Hub
      </Link>

      <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-5 space-y-6">
        {status !== 'approved' && (
          <div role="status" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            <div>
              <p>{STATUS_NOTES[status] || 'This post is not public yet.'}</p>
              {adminComment && (
                <p className="mt-1">
                  <span className="font-semibold">Moderator feedback:</span> {adminComment}
                </p>
              )}
            </div>
          </div>
        )}

        <header className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">{typeLabel}</span>
            <span className="chip">
              {college} &middot; {department}
              {semester ? <> &middot; Sem {semester}</> : session && session !== 'General' ? <> &middot; {session}</> : null}
            </span>
            <span className="chip">
              <Clock size={11} /> {readMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight break-words">{title}</h1>

          {subjectCode && (
            <p className="text-sm font-medium text-slate-500">
              {subjectCode} &middot; {subjectName}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <Link to={`/${author?.username}`} className="inline-flex items-center gap-2.5 font-medium hover:text-indigo-600 transition">
              <Avatar user={author} className="w-8 h-8" />
              <span>
                {author?.fullName} <span className="font-normal text-slate-400">@{author?.username}</span>
              </span>
            </Link>
            <span>{new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
        </header>

        <div className="card p-5 sm:p-8">
          <div
            style={{ fontFamily: `'${fontFamily}', sans-serif` }}
            className="rich-content text-base text-slate-700 leading-relaxed break-words"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        </div>

        {/* File preview on the detail page (opening this page already counts a view) */}
        {hasPreview && (
          <PostPreview
            title={title}
            previewUrl={previewUrl}
            isSignedIn={Boolean(firebaseUser)}
            onSignIn={() => navigate('/login', { state: { from: `/post/${id}` } })}
          />
        )}

        {(tags.length > 0 || resourceCredit) && (
          <div className="space-y-3">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Link key={tag} to={`/?tag=${encodeURIComponent(tag)}`} className="text-xs text-indigo-600 bg-indigo-50/70 px-2.5 py-1 rounded-md hover:bg-indigo-100 transition">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            {resourceCredit && <p className="text-sm text-slate-500">Credit: {resourceCredit}</p>}
          </div>
        )}

        <div className="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-1.5" title="Views">
              <Eye size={16} /> {views}
            </span>
            <button
              type="button"
              onClick={handleLove}
              aria-pressed={Boolean(lovedByMe)}
              aria-label={lovedByMe ? 'Remove your love react' : 'Love this post'}
              className={`flex items-center gap-1.5 transition cursor-pointer ${lovedByMe ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
            >
              <Heart size={16} className={lovedByMe ? 'fill-rose-500' : ''} /> {likesCount}
            </button>
            <button type="button" onClick={handleCopyLink} className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition cursor-pointer">
              <Link2 size={16} /> Copy link
            </button>
            {status === 'approved' && (
              <button type="button" onClick={handleReport} className="flex items-center gap-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer">
                <Flag size={15} /> Report
              </button>
            )}
          </div>

          {status === 'approved' && (
            <button
              type="button"
              onClick={handleOpen}
              className={firebaseUser ? 'btn-primary' : 'btn-secondary !text-amber-700 !border-amber-200 !bg-amber-50 hover:!bg-amber-100'}
            >
              {firebaseUser ? (
                <>
                  <ExternalLink size={15} /> Download or open
                </>
              ) : (
                <>
                  <Lock size={15} /> Sign in to download
                </>
              )}
            </button>
          )}
        </div>

        {isOwner && (
          <div className="flex flex-wrap gap-3">
            <Link to={`/post/${id}/edit`} className="btn-secondary">
              <Pencil size={15} /> {status === 'declined' ? 'Edit and resubmit' : 'Edit post'}
            </Link>
            <button type="button" onClick={() => setDeleteOpen(true)} className="btn-secondary !text-rose-600 hover:!bg-rose-50">
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </motion.article>

      {reportOpen && <ReportModal post={{ _id: id, title }} onClose={() => setReportOpen(false)} />}

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete this post?" size="sm">
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{title}</span> will be permanently removed. This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setDeleteOpen(false)} className="btn-secondary">
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
