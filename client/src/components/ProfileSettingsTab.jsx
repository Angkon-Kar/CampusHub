// client/src/components/ProfileSettingsTab.jsx
// Owner-only tab: display name, short bio and avatar colour.
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../utils/apiClient';
import { AVATAR_COLORS } from '../constants/campus';
import { Avatar } from './Avatar';

const BIO_LIMIT = 160;

export const ProfileSettingsTab = ({ profile, onSaved }) => {
  const { firebaseUser, dbUser, dispatch } = useAuth();
  const [form, setForm] = useState({
    fullName: profile.fullName || '',
    bio: profile.bio || '',
    avatarColor: profile.avatarColor || 'indigo',
    showPhoto: dbUser?.showAvatarPhoto !== false,
  });
  const [saving, setSaving] = useState(false);

  const { fullName, bio, avatarColor, showPhoto } = form;
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error('Your name cannot be empty.');

    setSaving(true);
    try {
      const token = await firebaseUser.getIdToken();
      const { user } = await apiRequest('/api/auth/profile-security', {
        method: 'PUT',
        token,
        body: { fullName: fullName.trim(), bio: bio.trim(), avatarColor, showAvatarPhoto: showPhoto },
      });
      dispatch({ type: 'SET_DB_USER', payload: user });
      onSaved({ fullName: user.fullName, bio: user.bio, avatarColor: user.avatarColor, avatarUrl: user.avatarUrl });
      toast.success('Profile updated.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Edit your profile</h3>
        <p className="text-sm text-slate-500 mt-1">This is what people see on your public page.</p>
      </div>

      <div className="flex items-center gap-4">
        <Avatar
          user={{ fullName, avatarColor, avatarUrl: showPhoto ? dbUser?.avatarUrl : '' }}
          alt="Your avatar preview"
          className="w-16 h-16 shadow-lg"
          textClass="text-2xl"
          rounded="rounded-2xl"
        />
        <fieldset className="min-w-0">
          <legend className="text-sm font-medium text-slate-700 mb-2">Avatar colour</legend>
          <div className="flex flex-wrap gap-2">
            {AVATAR_COLORS.map(({ id, label, swatch }) => (
              <button
                key={id}
                type="button"
                onClick={() => update('avatarColor', id)}
                aria-label={label}
                aria-pressed={avatarColor === id}
                className={`grid place-items-center w-8 h-8 rounded-full ${swatch} text-white transition cursor-pointer ring-offset-2 ${
                  avatarColor === id ? 'ring-2 ring-slate-900' : 'hover:scale-110'
                }`}
              >
                {avatarColor === id && <Check size={15} />}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer">
        <input
          type="checkbox"
          checked={showPhoto}
          onChange={(e) => setForm((prev) => ({ ...prev, showPhoto: e.target.checked }))}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-indigo-600"
        />
        <span className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">Show my Google or GitHub photo</span>
          <br />
          If you signed in with Google or GitHub, that profile picture is shown on your public profile, posts and reviews. Turn this off to show
          your initial and colour instead.
        </span>
      </label>

      <div className="space-y-1.5">
        <label htmlFor="settings-name" className="text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="settings-name"
          type="text"
          value={fullName}
          maxLength={80}
          onChange={(e) => update('fullName', e.target.value)}
          className="input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="settings-bio" className="text-sm font-medium text-slate-700">
          Short bio
        </label>
        <textarea
          id="settings-bio"
          rows={3}
          value={bio}
          maxLength={BIO_LIMIT}
          onChange={(e) => update('bio', e.target.value)}
          placeholder="e.g. CSE student who loves algorithms and open source."
          className="input resize-none"
        />
        <p className="text-xs text-slate-400 text-right">
          {bio.length}/{BIO_LIMIT}
        </p>
      </div>

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
};