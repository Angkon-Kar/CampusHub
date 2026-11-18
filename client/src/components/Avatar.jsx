// client/src/components/Avatar.jsx
// Shows the Google/GitHub profile photo. If there is no photo (or it fails to load), shows the first letter.
import { useState } from 'react';
import { getAvatarGradient } from '../constants/campus';

export const Avatar = ({ user, className = 'w-8 h-8', textClass = 'text-xs', rounded = 'rounded-full', alt = '' }) => {
  const { fullName, username, avatarUrl, avatarColor } = user || {};
  const [failedUrl, setFailedUrl] = useState('');
  const initial = (fullName || username || '?').charAt(0).toUpperCase();

  if (avatarUrl && failedUrl !== avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailedUrl(avatarUrl)}
        className={`shrink-0 object-cover bg-slate-100 ${className} ${rounded}`}
      />
    );
  }

  return (
    <span
      aria-hidden={alt ? undefined : 'true'}
      className={`grid place-items-center shrink-0 bg-gradient-to-br ${getAvatarGradient(avatarColor)} text-white font-bold ${className} ${textClass} ${rounded}`}
    >
      {initial}
    </span>
  );
};