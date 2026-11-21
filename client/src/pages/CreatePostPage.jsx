// client/src/pages/CreatePostPage.jsx
// One form for sharing a new post AND for editing/resubmitting an existing one.
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  BookOpen,
  FileText,
  GraduationCap,
  Rocket,
  MailWarning,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { RestrictedTextEditor } from '../components/RestrictedTextEditor';
import { Seo } from '../components/Seo';
import { TagInput } from '../components/TagInput';
import { PageSkeleton } from '../components/Skeletons';
import { EmptyState } from '../components/EmptyState';
import { apiRequest } from '../utils/apiClient';
import { stripHtml } from '../utils/sanitize';
import { needsEmailVerification } from '../utils/emailVerification';
import { useEmailActions } from '../hooks/useEmailActions';
import { useAuth } from '../hooks/useAuth';
import { COLLEGES, SESSIONS, HTTPS_LINK_REGEX } from '../constants/campus';
import { DEPARTMENTS_WITH_SYLLABUS, SEMESTER_COUNT, getSubjectOptions, groupSubjectOptions, semesterText } from '../utils/subjects';
import { MAX_TAGS_PER_POST } from '../utils/tags';

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
    session: initialPost?.session || (SESSIONS.includes(dbUser.session) ? dbUser.session : SESSIONS[2]),
    // Notes & slides: department > semester > subject
    department:
      initialPost?.department && DEPARTMENTS_WITH_SYLLABUS.includes(initialPost.department)
        ? initialPost.department
        : DEPARTMENTS_WITH_SYLLABUS.includes(dbUser.department)
        ? dbUser.department
        : DEPARTMENTS_WITH_SYLLABUS[0],
    semester: initialPost?.semester ? String(initialPost.semester) : '',
    subjectCode: initialPost?.subjectCode || '',
  });
  const [tags, setTags] = useState(initialPost?.tags || []);
  const [submitting, setSubmitting] = useState(false);

  // Daily upload allowance (new posts only): null while loading, { unlimited: true } for moderators
  const [usage, setUsage] = useState(null);

  // Server-side link check result, stored together with the link it belongs to
  const [remoteCheck, setRemoteCheck] = useState({ link: '', isValid: false, message: '', duplicate: null });

  useEffect(() => {
    if (isEdit || !firebaseUser) return;
    let cancelled = false;

    const loadUsage = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const data = await apiRequest('/api/posts/my-limit', { token });
        if (!cancelled) setUsage(data);
      } catch {
        // Non-blocking: the server enforces the limit again on submit
      }
    };
    loadUsage();

    return () => {
      cancelled = true;
    };
  }, [firebaseUser, isEdit]);

  const { type, title, content, fontFamily, externalLink, resourceCredit, college, session, department, semester, subjectCode } = formData;
  const trimmedLink = externalLink.trim();
  const emailBlocked = needsEmailVerification(firebaseUser);
  const { sendVerification, checkVerified, sendingVerification, checking, verifyCooldown } = useEmailActions();

  // Subjects of the chosen department + semester (electives are expanded to the real courses)
  const subjectGroups = useMemo(
    () => (department && semester ? groupSubjectOptions(getSubjectOptions(department, semester)) : []),
    [department, semester]
  );

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  // Tier 1: instant regex check (derived while rendering)
  const formatError = !trimmedLink
    ? 'Paste a public HTTPS link to unlock the submit button.'
    : !HTTPS_LINK_REGEX.test(trimmedLink)
    ? 'Invalid format. The link must start with https://'
    : '';

  // Tier 2 + 3: server unmasking, safety scan and duplicate check (waits until typing stops)
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
        // When editing, ignore duplicate warning if the link has not changed from the post's existing link
        const duplicate =
          isEdit && trimmedLink === initialPost?.externalLink ? null : data.duplicate || null;
        setRemoteCheck({
          link: trimmedLink,
          isValid: true,
          message: `${message} (${data.aiSafetyNote})`,
          duplicate,
        });
      } catch (error) {
        setRemoteCheck({ link: trimmedLink, isValid: false, message: error.message, duplicate: null });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [trimmedLink, formatError, firebaseUser, isEdit, initialPost?.externalLink]);

  const linkStatus = formatError
    ? { state: 'error', message: formatError }
    : remoteCheck.link !== trimmedLink
    ? { state: 'checking', message: 'Scanning the link for masking and malware...' }
    : remoteCheck.duplicate
    ? { state: 'duplicate', message: remoteCheck.duplicate.message }
    : remoteCheck.isValid
    ? { state: 'valid', message: remoteCheck.message }
    : { state: 'error', message: remoteCheck.message };

  const isLinkVerified = linkStatus.state === 'valid';
  const limitReached = !isEdit && Boolean(usage) && !usage.unlimited && usage.remaining <= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // The person may have verified in another tab: refresh the status once before blocking
    if (emailBlocked && !(await checkVerified({ silent: true }))) {
      return toast.error('Please verify your email address first. Use the buttons at the top of this page.');
    }
    if (!title.trim()) return toast.error('Please add a title.');
    if (limitReached) return toast.error('You reached the daily upload limit. Please try again later.');
    if (!isLinkVerified) return toast.error('Provide a verified safe link first.');
    if (!stripHtml(content)) return toast.error('Please write a short description or the article body.');
    if (type === 'resource' && (!department || !semester || !subjectCode)) {
      return toast.error('Choose the department, semester and subject for your notes or slides.');
    }

    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(isEdit ? `/api/posts/${initialPost._id}` : '/api/posts/create', {
        method: isEdit ? 'PATCH' : 'POST',
        token,
        body: {
          type,
          title: title.trim(),
          content,
          fontFamily,
          externalLink: trimmedLink,
          college,
          session,
          resourceCredit,
          tags,
          ...(type === 'resource' && { department, semester: Number(semester), subjectCode }),
        },
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
    : limitReached
    ? 'Daily limit reached'
    : !isLinkVerified
    ? 'Verify your link to submit'
    : isEdit
    ? 'Save and resubmit for review'
    : 'Submit for review';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Seo title={isEdit ? 'Edit your post' : 'Share a resource'} noIndex />
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

          {/* Notes & slides: department > semester > subject (the list follows the syllabus) */}
          {type === 'resource' && (
            <section className="card p-5 sm:p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Which subject is it for?</h2>
                <p className="text-sm text-slate-500 mt-1">Pick the department, then the semester, then the subject.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="department" className="text-sm font-medium text-slate-700">Department</label>
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value, semester: '', subjectCode: '' }))}
                    className="input cursor-pointer"
                  >
                    {DEPARTMENTS_WITH_SYLLABUS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="semester" className="text-sm font-medium text-slate-700">Semester</label>
                  <select
                    id="semester"
                    value={semester}
                    onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value, subjectCode: '' }))}
                    className="input cursor-pointer"
                  >
                    <option value="">Choose semester</option>
                    {Array.from({ length: SEMESTER_COUNT }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={String(n)}>{semesterText(n)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                  <select
                    id="subject"
                    value={subjectCode}
                    disabled={!semester}
                    onChange={(e) => updateField('subjectCode', e.target.value)}
                    className="input cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">{semester ? 'Choose subject' : 'Pick a semester first'}</option>
                    {subjectGroups.map(({ group, items }) => (
                      <optgroup key={group} label={group}>
                        {items.map(({ code, name }) => (
                          <option key={code} value={code}>{code} &middot; {name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          )}

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
                  : linkStatus.state === 'checking' || linkStatus.state === 'duplicate'
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {linkStatus.state === 'checking' && <Loader2 size={16} className="animate-spin mt-0.5 shrink-0" />}
              {linkStatus.state === 'valid' && <ShieldCheck size={16} className="mt-0.5 shrink-0" />}
              {linkStatus.state === 'error' && <ShieldAlert size={16} className="mt-0.5 shrink-0" />}
              {linkStatus.state === 'duplicate' && <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
              <span className="break-words min-w-0">{linkStatus.message}</span>
            </p>
          </section>
        </div>

        {/* Side column */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          <section className="card p-5 sm:p-6 space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Where is it from?</h2>
              <p className="text-sm text-slate-500 mt-1">Optional credit. Say who or where this came from.</p>
            </div>
            <input
              type="text"
              maxLength={120}
              placeholder="e.g. collected from a senior"
              value={resourceCredit}
              onChange={(e) => updateField('resourceCredit', e.target.value)}
              aria-label="Credit"
              className="input"
            />
          </section>

          <section className="card p-5 sm:p-6 space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Tags</h2>
              <p className="text-sm text-slate-500 mt-1">Pick existing tags so people can find it. Up to {MAX_TAGS_PER_POST}.</p>
            </div>
            <TagInput tags={tags} onChange={setTags} max={MAX_TAGS_PER_POST} />
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
            {!isEdit && usage && !usage.unlimited && (
              <p className={`flex items-start gap-1.5 text-xs ${limitReached ? 'text-rose-600' : 'text-slate-500'}`}>
                <Clock size={14} className="mt-0.5 shrink-0" />
                {limitReached
                  ? `Daily limit reached (${usage.limit} posts per 24 hours). You can post again around ${new Date(
                      usage.resetsAt
                    ).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`
                  : `${usage.remaining} of ${usage.limit} uploads left in the last 24 hours.`}
              </p>
            )}
            <button type="submit" disabled={!isLinkVerified || submitting || limitReached} className="btn-primary w-full !py-3">
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