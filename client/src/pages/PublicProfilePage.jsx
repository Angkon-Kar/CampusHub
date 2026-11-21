// client/src/pages/PublicProfilePage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Share2,
  Award,
  BookOpen,
  Code2,
  FolderGit2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Heart,
  Shield,
  Lock,
  UserX,
  Pencil,
  Trash2,
  UserCog,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/apiClient';
import { getSiteUrl } from '../utils/siteUrl';
import { Seo } from '../components/Seo';
import { sanitizeHtml } from '../utils/sanitize';
import { useAuth } from '../hooks/useAuth';
import { ShareProfileModal } from '../components/ShareProfileModal';
import { ProfileSecurityTab } from '../components/ProfileSecurityTab';
import { Bone, ProfileSkeleton } from '../components/Skeletons';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { ProfileSettingsTab } from '../components/ProfileSettingsTab';
import { Avatar } from '../components/Avatar';

const STATUS_BADGES = {
  approved: { Icon: CheckCircle2, label: 'Approved and live', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { Icon: Clock, label: 'Pending review', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  declined: { Icon: XCircle, label: 'Declined', style: 'bg-rose-50 text-rose-700 border-rose-200' },
  reported: { Icon: AlertTriangle, label: 'Link reported', style: 'bg-orange-50 text-orange-700 border-orange-200' },
};

// Badge progress, e.g. "2 of 3 articles"
const BadgeProgress = ({ current, target, unit }) => (
  <div className="mt-2.5">
    <div className="h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
      <div
        className="h-full rounded-full bg-indigo-500 transition-all"
        style={{ width: `${Math.round((current / target) * 100)}%` }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={target}
      />
    </div>
    <p className="mt-1 text-xs text-slate-500">
      {current} of {target} {unit}
    </p>
  </div>
);

const PostCard = ({ _id, title, content, fontFamily, tags, views, likesCount, createdAt }) => (
  <article className="card card-hover p-5 flex flex-col justify-between gap-4">
    <div className="space-y-2.5">
      <h3 className="font-bold text-base text-slate-900 leading-snug">
        <Link to={`/post/${_id}`} className="hover:text-indigo-700 transition">
          {title}
        </Link>
      </h3>
      <div
        style={{ fontFamily: `'${fontFamily}', sans-serif` }}
        className="rich-content text-sm text-slate-600 line-clamp-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
      <div className="flex flex-wrap gap-1.5 pt-1">
        {tags?.map((t) => (
          <span key={t} className="text-xs text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md">
            #{t}
          </span>
        ))}
      </div>
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-sm text-slate-500">
      <span>{new Date(createdAt).toLocaleDateString()}</span>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <Eye size={15} /> {views}
        </span>
        <span className="flex items-center gap-1.5 text-rose-500">
          <Heart size={15} /> {likesCount}
        </span>
      </div>
    </div>
  </article>
);

export const PublicProfilePage = () => {
  const { username } = useParams();
  const location = useLocation();
  const { firebaseUser, dbUser } = useAuth();

  // The result remembers which username it belongs to, so we can show loading without a sync setState
  const [result, setResult] = useState({ forUsername: '', data: null });
  const [mySubmissions, setMySubmissions] = useState(null); // null = still loading
  // Opens on the tab passed by navigation (for example the status tab right after posting)
  const [selectedTab, setActiveTab] = useState(location.state?.tab || 'articles'); // articles | projects | resources | status | security
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isOwnProfile = dbUser?.username?.toLowerCase() === username?.toLowerCase();
  const loading = result.forUsername !== username;
  const profileData = result.data;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest(`/api/profile/${username}`);
        setResult({ forUsername: username, data });
      } catch (error) {
        setResult({ forUsername: username, data: null });
        if (error.status !== 404) toast.error(error.message);
      }
    };
    fetchProfile();
  }, [username]);

  // Owner only: load pending/declined posts and their review status
  useEffect(() => {
    if (!firebaseUser || !isOwnProfile) return;

    const fetchSubmissions = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const { submissions } = await apiRequest('/api/profile/me/submissions', { token });
        setMySubmissions(submissions);
      } catch (error) {
        setMySubmissions([]);
        toast.error(error.message);
      }
    };
    fetchSubmissions();
  }, [firebaseUser, isOwnProfile]);

  const handleDeletePost = async () => {
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(`/api/posts/${deleteTarget._id}`, { method: 'DELETE', token });
      toast.success(message);
      setMySubmissions((previous) => (previous || []).filter(({ _id }) => _id !== deleteTarget._id));
      setResult((previous) =>
        previous.data
          ? { ...previous, data: { ...previous.data, posts: previous.data.posts.filter(({ _id }) => _id !== deleteTarget._id) } }
          : previous
      );
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // After "Edit profile" is saved, show the new name, bio and colour without reloading
  const handleProfileSaved = (changes) =>
    setResult((previous) =>
      previous.data ? { ...previous, data: { ...previous.data, profile: { ...previous.data.profile, ...changes } } } : previous
    );

  if (loading) return <ProfileSkeleton />;

  if (!profileData) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="text-center">
          <Seo title="Profile not found" noIndex />
          <UserX size={36} className="mx-auto text-slate-300" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">We could not find @{username}</h1>
          <p className="mt-1 text-sm text-slate-500">Check the spelling, or go back to the hub.</p>
          <Link to="/" className="btn-primary mt-5">
            Back to the hub
          </Link>
        </div>
      </div>
    );
  }

  // Requirement: object destructuring
  const { profile, achievements, posts } = profileData;
  const { isAchievementUnlocked, stats, unlockedBadges, lockedBadges } = achievements;
  const submissions = mySubmissions || [];

  // Requirement: Array method (.filter) to split posts by tab
  const articlePosts = posts.filter(({ type }) => type === 'article');
  const projectPosts = posts.filter(({ type }) => type === 'project');
  const resourcePosts = posts.filter(({ type }) => type === 'resource' || type === 'course');

  const tabs = [
    { id: 'articles', label: `Articles (${articlePosts.length})`, Icon: Code2 },
    { id: 'projects', label: `Projects (${projectPosts.length})`, Icon: FolderGit2 },
    { id: 'resources', label: `Resources (${resourcePosts.length})`, Icon: BookOpen },
    ...(isOwnProfile
      ? [
          { id: 'status', label: `My post status (${submissions.length})`, Icon: Clock },
          { id: 'settings', label: 'Edit profile', Icon: UserCog },
          { id: 'security', label: 'Security and email', Icon: Shield },
        ]
      : []),
  ];

  // Fall back to Articles if the chosen tab is not available (for example someone else's security tab)
  const activeTab = tabs.some(({ id }) => id === selectedTab) ? selectedTab : 'articles';

  const visiblePosts = { articles: articlePosts, projects: projectPosts, resources: resourcePosts }[activeTab] || [];

  const statItems = [
    { label: 'Articles', value: stats.articlesCount },
    { label: 'Projects', value: stats.projectsCount },
    { label: 'Resources', value: stats.resourcesCount + stats.coursesCount },
    { label: 'Loves', value: stats.totalLoves },
  ];

  const profileUrl = `${getSiteUrl()}/${profile.username}`;
  const approvedTotal = articlePosts.length + projectPosts.length + resourcePosts.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">
      <Seo
        title={`${profile.fullName} (@${profile.username})`}
        description={`${profile.fullName} studies ${profile.department} at ${profile.college} (session ${profile.session}) and shared ${approvedTotal} approved article${approvedTotal === 1 ? '' : 's'}, project${approvedTotal === 1 ? '' : 's'} and resource${approvedTotal === 1 ? '' : 's'} on Campus Hub.`}
        path={`/${profile.username}`}
        type="profile"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: profile.fullName,
            alternateName: profile.username,
            url: profileUrl,
            affiliation: { '@type': 'EducationalOrganization', name: profile.college },
          },
        }}
      />
      {/* Profile card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 sm:p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <Avatar
            user={profile}
            alt={`${profile.fullName}'s profile photo`}
            className="w-16 h-16 sm:w-20 sm:h-20 shadow-lg"
            textClass="text-3xl font-extrabold"
            rounded="rounded-2xl"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 break-words">{profile.fullName}</h1>
            <p className="text-sm text-indigo-600 font-mono mt-0.5">/{profile.username}</p>
            <span className="chip mt-2">
              {profile.college} &middot; {profile.department} &middot; Session {profile.session}
            </span>
            {profile.bio && <p className="mt-3 text-sm text-slate-600 max-w-md break-words">{profile.bio}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4">
          <dl className="grid grid-cols-4 divide-x divide-slate-200 border border-slate-200 rounded-2xl bg-slate-50/60">
            {statItems.map(({ label, value }) => (
              <div key={label} className="px-2 sm:px-4 py-2.5 text-center">
                <dd className="text-lg font-bold text-slate-900">{value}</dd>
                <dt className="text-xs text-slate-500">{label}</dt>
              </div>
            ))}
          </dl>

          <button type="button" onClick={() => setIsShareOpen(true)} className="btn-primary !py-3 w-full sm:w-auto">
            <Share2 size={16} /> Share profile
          </button>
        </div>
      </motion.section>

      {/* Achievements */}
      <section className="card p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award size={20} className="text-amber-500" /> Achievements ({unlockedBadges.length})
          </h2>
          <span className="text-sm text-slate-500">More approved contributions unlock higher badges.</span>
        </div>

        {!isAchievementUnlocked ? (
          <div className="py-10 px-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 text-center">
            <Lock size={24} className="mx-auto text-slate-400" />
            <p className="mt-2 text-sm font-semibold text-slate-700">Achievements are locked</p>
            <p className="text-sm text-slate-500 mt-1">
              Get one article, project or resource approved to unlock your first badge.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unlockedBadges.map(({ id, title, description, current, target, unit }) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.03, y: -2 }}
                className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100"
              >
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="text-sm text-slate-600 mt-1">{description}</p>
                <BadgeProgress current={current} target={target} unit={unit} />
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 mt-2">
                  <CheckCircle2 size={13} /> Unlocked
                </span>
              </motion.div>
            ))}
            {lockedBadges.map(({ id, title, description, current, target, unit }) => (
              <div key={id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 opacity-70">
                <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                  <Lock size={13} /> {title}
                </p>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
                <BadgeProgress current={current} target={target} unit={unit} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tabs */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto sm:flex-wrap border-b border-slate-200 pb-3 [scrollbar-width:none]">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`shrink-0 whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              activeTab === id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'settings' && isOwnProfile ? (
        <ProfileSettingsTab profile={profile} onSaved={handleProfileSaved} />
      ) : activeTab === 'security' && isOwnProfile ? (
        <ProfileSecurityTab />
      ) : activeTab === 'status' && isOwnProfile ? (
        <section className="card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Your uploads and their review status</h3>
          {mySubmissions === null && (
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Bone key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          )}
          {mySubmissions?.length === 0 && (
            <EmptyState
              variant="posts"
              bare
              compact
              title="You have not shared anything yet"
              text="Upload your first post and follow its review status here."
            >
              <Link to="/create-post" className="btn-primary">
                Share a resource
              </Link>
            </EmptyState>
          )}
          <div className="space-y-3">
            {submissions.map(({ _id, title, type, status, adminComment, createdAt }) => {
              const { Icon, label, style } = STATUS_BADGES[status] || STATUS_BADGES.pending;
              return (
                <div
                  key={_id}
                  className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="chip capitalize">{type}</span>
                      <h4 className="font-semibold text-sm text-slate-900 truncate">{title}</h4>
                    </div>
                    <p className="text-xs text-slate-500">Submitted on {new Date(createdAt).toLocaleDateString()}</p>
                    {adminComment && (
                      <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg mt-2 break-words">
                        <span className="font-semibold">Moderator feedback:</span> {adminComment}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2.5 md:shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
                      <Icon size={14} /> {label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/post/${_id}`} className="btn-secondary !py-1.5 !text-xs">
                        View
                      </Link>
                      <Link to={`/post/${_id}/edit`} className="btn-secondary !py-1.5 !text-xs">
                        <Pencil size={13} /> {status === 'declined' ? 'Edit and resubmit' : 'Edit'}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ _id, title })}
                        className="btn-secondary !py-1.5 !text-xs !text-rose-600 hover:!bg-rose-50"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <>
          {visiblePosts.length === 0 ? (
            <EmptyState
              variant="posts"
              title="Nothing here yet"
              text={isOwnProfile ? 'Share something and it will show up here once it is approved.' : 'This student has not published anything in this section yet.'}
            >
              {isOwnProfile && (
                <Link to="/create-post" className="btn-primary">
                  Share a resource
                </Link>
              )}
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {visiblePosts.map((post) => (
                <PostCard key={post._id} {...post} />
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete this post?" size="sm">
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{deleteTarget?.title}</span> will be permanently removed. This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setDeleteTarget(null)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleDeletePost} className="btn-danger">
              <Trash2 size={15} /> Delete post
            </button>
          </div>
        </div>
      </Modal>

      <ShareProfileModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        username={profile.username}
        fullName={profile.fullName}
        totalBadges={unlockedBadges.length}
      />
    </div>
  );
};