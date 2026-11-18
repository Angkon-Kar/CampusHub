// client/src/components/ShareProfileModal.jsx
import { Copy, ExternalLink, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';

// Clipboard access can fail (permissions, insecure context), so never let it throw
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const ShareProfileModal = ({ isOpen, onClose, username, fullName, totalBadges }) => {
  const profileUrl = `${window.location.origin}/${username}`;
  const shareText = `Check out ${fullName}'s articles, projects and ${totalBadges} achievements on Campus Hub.`;

  const copyLink = async () => {
    if (await copyText(profileUrl)) toast.success('Profile link copied. Paste it into your CV or portfolio.');
    else toast.error('Could not copy the link. Select it in the box and copy it manually.');
  };

  const SHARE_TARGETS = [
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${profileUrl}`)}`,
    },
    {
      // Messenger has no public web share URL, so we copy the link and open Messenger
      name: 'Messenger',
      url: 'https://www.messenger.com/',
      copyFirst: true,
    },
  ];

  const handleShare = async ({ name, url, copyFirst }) => {
    if (copyFirst) {
      if (await copyText(profileUrl)) toast.success('Link copied. Paste it into a Messenger chat.');
      else toast.error('Could not copy the link. Copy it from your profile page instead.');
    } else {
      toast.success(`Opening ${name}...`);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share your profile" size="sm">
      <div className="space-y-5">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
          <Award size={22} className="text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 leading-relaxed">
            Add <span className="font-mono font-semibold text-slate-900">/{username}</span> to your CV, resume or
            portfolio to show your articles, projects and badges.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SHARE_TARGETS.map((target) => (
            <button key={target.name} type="button" onClick={() => handleShare(target)} className="btn-secondary">
              {target.name} <ExternalLink size={14} className="text-slate-400" />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500">Direct profile link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={profileUrl}
              onFocus={(e) => e.target.select()}
              className="input font-mono !text-xs text-indigo-700"
            />
            <button type="button" onClick={copyLink} className="btn-primary">
              <Copy size={15} /> Copy
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};