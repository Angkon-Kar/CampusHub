// client/src/components/AdminTagsPanel.jsx
// "Tags" section of the admin panel: see every tag with its usage, edit names and aliases, merge duplicates, hide bad tags.
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Merge, Eye, EyeOff, BadgeCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { apiRequest } from '../utils/apiClient';
import { Modal } from './Modal';

const FILTERS = [
  { id: '', label: 'All tags' },
  { id: 'unofficial', label: 'Student-created' },
  { id: 'hidden', label: 'Hidden' },
];

const splitList = (text) => text.split(',').map((item) => item.trim()).filter(Boolean);

// ----- Merge: move every post from one tag to another, the old name becomes an alias -----
const MergeModal = ({ tag, allTags, onClose, onDone }) => {
  const { firebaseUser } = useAuth();
  const [target, setTarget] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest('/api/admin/tags/merge', {
        method: 'POST',
        token,
        body: { from: tag.slug, into: target },
      });
      toast.success(message);
      onDone();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={`Merge #${tag.slug}`} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-slate-600">
          All <span className="font-semibold text-slate-900">{tag.totalCount}</span> post{tag.totalCount === 1 ? '' : 's'} with{' '}
          <span className="font-mono text-indigo-600">#{tag.slug}</span> will move to the tag you choose, and{' '}
          <span className="font-mono">{tag.slug}</span> becomes one of its aliases. This cannot be undone.
        </p>
        <div className="space-y-1.5">
          <label htmlFor="merge-target" className="text-sm font-medium text-slate-700">Merge into</label>
          <input
            id="merge-target"
            list="merge-targets"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Type the tag to keep, e.g. dsa"
            required
            className="input"
          />
          <datalist id="merge-targets">
            {allTags
              .filter(({ slug, hidden }) => slug !== tag.slug && !hidden)
              .map(({ slug, label }) => (
                <option key={slug} value={slug}>{label}</option>
              ))}
          </datalist>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting || !target.trim()} className="btn-primary">
            <Merge size={15} /> {submitting ? 'Merging...' : 'Merge tags'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ----- Edit: label, aliases, official -----
const EditModal = ({ tag, onClose, onDone }) => {
  const { firebaseUser } = useAuth();
  const [label, setLabel] = useState(tag.label);
  const [official, setOfficial] = useState(tag.official);
  const [aliases, setAliases] = useState(tag.aliases);
  const [aliasInput, setAliasInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addAliases = () => {
    const added = splitList(aliasInput).map((item) => item.toLowerCase());
    setAliases((previous) => [...new Set([...previous, ...added])]);
    setAliasInput('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      // Anything typed in the alias box but not yet added still counts
      const pending = splitList(aliasInput).map((item) => item.toLowerCase());
      const finalAliases = [...new Set([...aliases, ...pending])];
      const { message } = await apiRequest(`/api/admin/tags/${encodeURIComponent(tag.slug)}`, {
        method: 'PATCH',
        token,
        body: {
          label,
          official,
          addAliases: finalAliases.filter((alias) => !tag.aliases.includes(alias)),
          removeAliases: tag.aliases.filter((alias) => !finalAliases.includes(alias)),
        },
      });
      toast.success(message);
      onDone();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={`Edit #${tag.slug}`} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="tag-label" className="text-sm font-medium text-slate-700">Display name</label>
          <input id="tag-label" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={60} required className="input" />
        </div>

        <div className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Aliases</span>
          <p className="text-xs text-slate-500">Other names students type. They are converted to #{tag.slug} automatically.</p>
          <div className="flex flex-wrap gap-1.5">
            {aliases.map((alias) => (
              <span key={alias} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                {alias}
                <button type="button" onClick={() => setAliases(aliases.filter((a) => a !== alias))} aria-label={`Remove ${alias}`} className="cursor-pointer hover:text-rose-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={aliasInput}
              onChange={(e) => setAliasInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAliases())}
              placeholder="ds, datastructure"
              className="input"
            />
            <button type="button" onClick={addAliases} className="btn-secondary !px-3" aria-label="Add aliases">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer">
          <input type="checkbox" checked={official} onChange={(e) => setOfficial(e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-indigo-600" />
          Official tag (shown first in suggestions)
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
};

// ----- Create an official tag -----
const CreateModal = ({ onClose, onDone }) => {
  const { firebaseUser } = useAuth();
  const [form, setForm] = useState({ label: '', slug: '', aliases: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest('/api/admin/tags', {
        method: 'POST',
        token,
        body: { label: form.label, slug: form.slug || form.label, aliases: splitList(form.aliases) },
      });
      toast.success(message);
      onDone();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key) => (e) => setForm((previous) => ({ ...previous, [key]: e.target.value }));

  return (
    <Modal isOpen onClose={onClose} title="New official tag" size="sm">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="new-label" className="text-sm font-medium text-slate-700">Display name</label>
          <input id="new-label" value={form.label} onChange={update('label')} placeholder="Data structures & algorithms" required maxLength={60} className="input" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="new-slug" className="text-sm font-medium text-slate-700">Tag (short, lowercase)</label>
          <input id="new-slug" value={form.slug} onChange={update('slug')} placeholder="dsa" maxLength={30} className="input" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="new-aliases" className="text-sm font-medium text-slate-700">Aliases (comma separated)</label>
          <input id="new-aliases" value={form.aliases} onChange={update('aliases')} placeholder="ds, data-structures, datastructure" className="input" />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Creating...' : 'Create tag'}</button>
        </div>
      </form>
    </Modal>
  );
};

export const AdminTagsPanel = () => {
  const { firebaseUser } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [mergeTarget, setMergeTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const search = useDebounce(searchInput.trim(), 350);

  // The list remembers which request it answers, so "loading" is derived (no extra state)
  const requestKey = `${search}|${filter}|${refreshKey}`;
  const [list, setList] = useState({ key: '', tags: [] });
  const loading = list.key !== requestKey;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const query = new URLSearchParams({ search, filter }).toString();
        const { tags = [] } = await apiRequest(`/api/admin/tags?${query}`, { token });
        if (!cancelled) setList({ key: requestKey, tags });
      } catch (error) {
        if (cancelled) return;
        setList({ key: requestKey, tags: [] });
        toast.error(error.message);
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [firebaseUser, search, filter, requestKey]);

  const refresh = () => {
    setMergeTarget(null);
    setEditTarget(null);
    setIsCreateOpen(false);
    setRefreshKey((key) => key + 1);
  };

  const toggleHidden = async (tag) => {
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(`/api/admin/tags/${encodeURIComponent(tag.slug)}`, {
        method: 'PATCH',
        token,
        body: { hidden: !tag.hidden },
      });
      toast.success(message);
      refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="card overflow-hidden">
      <div className="p-6 pb-4 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tags</h2>
            <p className="text-sm text-slate-500 mt-1">
              Merge duplicates, add aliases and hide bad tags. Students are guided to the official names.
            </p>
          </div>
          <button type="button" onClick={() => setIsCreateOpen(true)} className="btn-primary !py-2">
            <Plus size={15} /> New official tag
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tag, alias or name"
              className="input !py-2 !pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ id, label }) => (
              <button
                key={id || 'all'}
                type="button"
                onClick={() => setFilter(id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${
                  filter === id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-400">Loading tags...</div>
      ) : list.tags.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500">No tags found.</div>
      ) : (
        <ul className="divide-y divide-slate-100 border-t border-slate-100">
          {list.tags.map((tag) => (
            <li key={tag.slug} className={`px-6 py-4 flex flex-wrap items-center justify-between gap-3 ${tag.hidden ? 'bg-slate-50/70' : ''}`}>
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">#{tag.slug}</span>
                  {tag.label !== tag.slug && <span className="text-sm text-slate-500">{tag.label}</span>}
                  {tag.official && <BadgeCheck size={15} className="text-indigo-500" aria-label="Official" />}
                  {tag.hidden && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">Hidden</span>}
                </div>
                {tag.aliases.length > 0 && (
                  <p className="text-xs text-slate-500">
                    Aliases: {tag.aliases.map((alias) => (
                      <span key={alias} className="mr-1.5 rounded bg-slate-100 px-1.5 py-0.5">{alias}</span>
                    ))}
                  </p>
                )}
                <p className="text-xs text-slate-400">
                  {tag.liveCount} live &middot; {tag.totalCount} total post{tag.totalCount === 1 ? '' : 's'}
                </p>
              </div>

              <div className="flex gap-1.5">
                <button type="button" onClick={() => setEditTarget(tag)} title="Edit name and aliases" className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer">
                  <Pencil size={16} />
                </button>
                <button type="button" onClick={() => setMergeTarget(tag)} title="Merge into another tag" className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition cursor-pointer">
                  <Merge size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleHidden(tag)}
                  title={tag.hidden ? 'Show this tag again' : 'Hide this tag'}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                >
                  {tag.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {mergeTarget && <MergeModal key={mergeTarget.slug} tag={mergeTarget} allTags={list.tags} onClose={() => setMergeTarget(null)} onDone={refresh} />}
      {editTarget && <EditModal key={editTarget.slug} tag={editTarget} onClose={() => setEditTarget(null)} onDone={refresh} />}
      {isCreateOpen && <CreateModal onClose={() => setIsCreateOpen(false)} onDone={refresh} />}
    </section>
  );
};
