// client/src/pages/CreatePostPage.jsx
// One form for sharing a new post AND for editing/resubmitting an existing one.
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, ShieldAlert, Loader2, Plus, X, BookOpen, FileText, GraduationCap, Rocket, MailWarning } from 'lucide-react';
import toast from 'react-hot-toast';
import { RestrictedTextEditor } from '../components/RestrictedTextEditor';
import { PageSkeleton } from '../components/Skeletons';
import { EmptyState } from '../components/EmptyState';
import { apiRequest } from '../utils/apiClient';
import { stripHtml } from '../utils/sanitize';
import { needsEmailVerification } from '../utils/emailVerification';
import { useEmailActions } from '../hooks/useEmailActions';
import { useAuth } from '../hooks/useAuth';
import { COLLEGES, DEPARTMENTS, SESSIONS, SUGGESTED_TAGS, HTTPS_LINK_REGEX } from '../constants/campus';

const TYPE_OPTIONS = [
  { id: 'resource', label: 'Notes & slides', hint: 'Suggestions, questions, slides', Icon: BookOpen },
  { id: 'article', label: 'Article', hint: 'Coding blog or guide', Icon: FileText },
  { id: 'course', label: 'Free course', hint: '100% free learning', Icon: GraduationCap },
  { id: 'project', label: 'Project', hint: 'Show what you built', Icon: Rocket },
];

const LINK_HELP = {
  resource: 'Public Google Drive link to your slides, notes or questions',
  article: 'Link to your article source, repository or a file with more detail (required, must be a safe HTTPS link)',
  course: 'Link to the 100% free course',
  project: 'Live demo or GitHub repository link',
};

const PostForm = ({ initialPost = null }) => {
  const { firebaseUser, dbUser } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(initialPost);

  const [formData, setFormData] = useState({
    type: initialPost?.type || 'resource',
    title: initialPost?.title || '',
    content: initialPost?.content || '',
    fontFamily: initialPost?.fontFamily || 'Inter',
    externalLink: initialPost?.externalLink || '',
    resourceCredit: initialPost?.resourceCredit || '',
    college: initialPost?.college || (COLLEGES.includes(dbUser.college) ? dbUser.college : COLLEGES[0]),
    department: initialPost?.department || (DEPARTMENTS.includes(dbUser.department) ? dbUser.department : DEPARTMENTS[0]),
    session: initialPost?.session || (SESSIONS.includes(dbUser.session) ? dbUser.session : SESSIONS[2]),
  });
  const [tags, setTags] = useState(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Server-side link check result, stored together with the link it belongs to
  const [remoteCheck, setRemoteCheck] = useState({ link: '', isValid: false, message: '' });

  const { type, title, content, fontFamily, externalLink, resourceCredit, college, department, session } = formData;
  const trimmedLink = externalLink.trim();
  const emailBlocked = needsEmailVerification(firebaseUser);
  const { sendVerification, checkVerified, sendingVerification, checking, verifyCooldown } = useEmailActions();

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  // Tier 1: instant regex check (derived while rendering)
  const formatError = !trimmedLink
    ? 'Paste a public HTTPS link to unlock the submit button.'
    : !HTTPS_LINK_REGEX.test(trimmedLink)
    ? 'Invalid format. The link must start with https://'
    : '';

  // Tier 2 + 3: server unmasking and safety scan (waits until typing stops)
  useEffect(() => {
    if (!trimmedLink || formatError) return;

    const timer = setTimeout(async () => {
      try {
        const token = await firebaseUser?.getIdToken();
        const { message, data } = await apiRequest('/api/links/verify', {
          method: 'POST',
          token,
          body: { externalLink: trimmedLink },
          retry: true,
        });
        setRemoteCheck({ link: trimmedLink, isValid: true, message: `${message} (${data.aiSafetyNote})` });
      } catch (error) {
        setRemoteCheck({ link: trimmedLink, isValid: false, message: error.message });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [trimmedLink, formatError, firebaseUser]);

  const linkStatus = formatError
    ? { state: 'error', message: formatError }
    : remoteCheck.link !== trimmedLink
    ? { state: 'checking', message: 'Scanning the link for masking and malware...' }
    : remoteCheck.isValid
    ? { state: 'valid', message: remoteCheck.message }
    : { state: 'error', message: remoteCheck.message };

  const isLinkVerified = linkStatus.state === 'valid';

  // Tags
  const handleAddTag = (rawTag) => {
    const clean = rawTag.toLowerCase().replace(/[^a-z0-9+#-]/g, '').trim();
    if (!clean || tags.includes(clean)) return;
    if (tags.length >= 6) return toast.error('You can add up to 6 tags.');
    setTags([...tags, clean]);
    setTagInput('');
  };

  const handleRemoveTag = (targetTag) => setTags(tags.filter((t) => t !== targetTag));

  // Autocomplete: suggestions that match the text and are not already added
  const tagSuggestions = SUGGESTED_TAGS.filter(
    (tag) => !tags.includes(tag) && tag.includes(tagInput.toLowerCase().trim())
  ).slice(0, 6);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // The person may have verified in another tab: refresh the status once before blocking
    if (emailBlocked && !(await checkVerified({ silent: true }))) {
      return toast.error('Please verify your email address first. Use the buttons at the top of this page.');
    }
    if (!title.trim()) return toast.error('Please add a title.');
    if (!isLinkVerified) return toast.error('Provide a verified safe link first.');
    if (!stripHtml(content)) return toast.error('Please write a short description or the article body.');

    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(isEdit ? `/api/posts/${initialPost._id}` : '/api/posts/create', {
        method: isEdit ? 'PATCH' : 'POST',
        token,
        body: { ...formData, title: title.trim(), externalLink: trimmedLink, tags },
      });

      toast.success(message);
      // Take the author to their review status page
      navigate(`/${dbUser.username}`, { state: { tab: 'status' } });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitLabel = submitting
    ? 'Submitting...'
    : !isLinkVerified
    ? 'Verify your link to submit'
    : isEdit
    ? 'Save and resubmit for review'
    : 'Submit for review';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Link
        to={isEdit ? `/post/${initialPost._id}` : '/'}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft size={15} /> {isEdit ? 'Back to the post' : 'Back to Campus Hub'}
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {isEdit ? 'Edit your post' : 'Share with Campus Hub'}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          {isEdit
            ? 'After you save, the post goes back to the moderators for a new review.'
            : 'A moderator reviews every post before it goes live. You can follow its status from your profile.'}
        </p>
        {isEdit && initialPost.adminComment && (
          <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
            <span className="font-semibold">Moderator feedback:</span> {initialPost.adminComment}
          </p>
        )}
      </motion.div>

      {emailBlocked && (
        <div role="alert" className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900 space-y-3">
          <p className="flex items-start gap-2.5">
            <MailWarning size={17} className="mt-0.5 shrink-0" />
            <span>
              Verify <span className="font-semibold">{firebaseUser.email}</span> before you submit. We will email you a link, and you
              only have to do this once.
            </span>
          </p>
          <div className="flex flex-wrap gap-2 pl-7">
            <button
              type="button"
              onClick={sendVerification}
              disabled={sendingVerification || verifyCooldown > 0}
              className="btn-secondary !py-1.5 !text-xs"
            >
              {verifyCooldown > 0 ? `Resend in ${verifyCooldown}s` : sendingVerification ? 'Sending...' : 'Send verification email'}
            </button>
            <button type="button" onClick={() => checkVerified()} disabled={checking} className="btn-secondary !py-1.5 !text-xs">
              {checking ? 'Checking...' : 'I have verified'}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 lg:gap-8 items-start">
        {/* Main column */}
        <div className="space-y-6 min-w-0">
          {/* Type */}
          <section className="card p-5 sm:p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">What are you sharing?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TYPE_OPTIONS.map(({ id, label, hint, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => updateField('type', id)}
                  aria-pressed={type === id}
                  className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${
                    type === id
                      ? 'border-indigo-500 bg-indigo-50/60 ring-4 ring-indigo-100'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className={type === id ? 'text-indigo-600' : 'text-slate-400'} />
                  <p className="mt-2 text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{hint}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Title and body */}
          <section className="card p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                maxLength={150}
                placeholder="e.g. CSE 5th semester Algorithms final suggestion"
                value={title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Description or article</span>
              <RestrictedTextEditor
                initialValue={initialPost?.content || ''}
                onChange={(html) => updateField('content', html)}
                selectedFont={fontFamily}
                onFontChange={(font) => updateField('fontFamily', font)}
              />
            </div>
          </section>

          {/* Link */}
          <section className="card p-5 sm:p-6 space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Link</h2>
              <p className="text-sm text-slate-500 mt-1">{LINK_HELP[type]}</p>
            </div>
            <input
              type="url"
              placeholder="https://drive.google.com/drive/folders/..."
              value={externalLink}
              onChange={(e) => updateField('externalLink', e.target.value)}
              required
              aria-label="Link"
              className="input"
            />
            <p
              role="status"
              aria-live="polite"
              className={`flex items-start gap-1.5 text-sm ${
                linkStatus.state === 'valid'
                  ? 'text-emerald-600'
                  : linkStatus.state === 'checking'
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {linkStatus.state === 'checking' && <Loader2 size={16} className="animate-spin mt-0.5 shrink-0" />}
              {linkStatus.state === 'valid' && <ShieldCheck size={16} className="mt-0.5 shrink-0" />}
              {linkStatus.state === 'error' && <ShieldAlert size={16} className="mt-0.5 shrink-0" />}
              <span className="break-words min-w-0">{linkStatus.message}</span>
            </p>
          </section>
        </div>

        {/* Side column */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          <section className="card p-5 sm:p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Where is it from?</h2>
            <div className="space-y-3">
              <select value={college} onChange={(e) => updateField('college', e.target.value)} className="input cursor-pointer" aria-label="College">
                {COLLEGES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={department} onChange={(e) => updateField('department', e.target.value)} className="input cursor-pointer" aria-label="Department">
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select value={session} onChange={(e) => updateField('session', e.target.value)} className="input cursor-pointer" aria-label="Session">
                  {SESSIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                maxLength={120}
                placeholder="Credit (optional), e.g. collected from a senior"
                value={resourceCredit}
                onChange={(e) => updateField('resourceCredit', e.target.value)}
                aria-label="Credit"
                className="input"
              />
            </div>
          </section>

          <section className="card p-5 sm:p-6 space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Tags</h2>
              <p className="text-sm text-slate-500 mt-1">Tags help others find it. Up to 6.</p>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-medium">
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)} aria-label={`Remove ${t}`} className="cursor-pointer hover:text-rose-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. midterm"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(tagInput))}
                aria-label="New tag"
                className="input"
              />
              <button type="button" onClick={() => handleAddTag(tagInput)} className="btn-secondary !px-3" aria-label="Add tag">
                <Plus size={16} />
              </button>
            </div>

            {tagSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tagSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleAddTag(suggestion)}
                    className="chip hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                  >
                    +{suggestion}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="card p-5 sm:p-6 space-y-4">
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5 marker:text-indigo-400">
              <li>You have your teacher's permission for slides and notes.</li>
              <li>The link is public, safe and 100% free to open.</li>
              <li>No images are allowed inside articles.</li>
            </ul>
            <p className="text-xs text-slate-400">
              Read the full{' '}
              <Link to="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-600">
                terms and conditions
              </Link>
              .
            </p>
            <button type="submit" disabled={!isLinkVerified || submitting} className="btn-primary w-full !py-3">
              {submitLabel}
            </button>
          </section>
        </aside>
      </form>
    </div>
  );
};

// The form mounts only after the profile has loaded, so the defaults (college, department, session) are ready
export const CreatePostPage = () => {
  const { dbUser, loading } = useAuth();

  if (loading) return <PageSkeleton />;
  if (!dbUser) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4 text-center text-sm text-slate-500">
        We could not load your profile. Please refresh the page and try again.
      </div>
    );
  }
  return <PostForm />;
};

// Loads the author's own post first (the server only sends the link to its author), then shows the same form
export const EditPostPage = () => {
  const { id } = useParams();
  const { firebaseUser, dbUser, loading } = useAuth();
  const [result, setResult] = useState({ id: '', post: null, error: '' });

  useEffect(() => {
    if (!firebaseUser) return;
    let cancelled = false;

    const loadPost = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const { post } = await apiRequest(`/api/posts/${id}`, { token });
        if (!cancelled) setResult({ id, post, error: '' });
      } catch (error) {
        if (!cancelled) setResult({ id, post: null, error: error.message });
      }
    };
    loadPost();

    return () => {
      cancelled = true;
    };
  }, [id, firebaseUser]);

  if (loading || !dbUser || result.id !== id) return <PageSkeleton />;

  if (!result.post?.isOwner) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <EmptyState variant="search" title="You cannot edit this post" text={result.error || 'Only the author can edit a post.'}>
          <Link to="/" className="btn-primary">
            Back to Campus Hub
          </Link>
        </EmptyState>
      </div>
    );
  }

  return <PostForm key={id} initialPost={result.post} />;
};