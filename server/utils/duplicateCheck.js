// server/utils/duplicateCheck.js
import { Post } from '../models/Post.js';
import { normalizeLinkKey } from './linkKey.js';

// Declined posts do not count: the author may fix and resubmit the same link.
const ACTIVE_STATUSES = ['approved', 'pending', 'reported'];

// Looks for a live or waiting post that already uses this (unmasked) link.
export const findDuplicatePost = async ({ originalLink, unmaskedLink }) => {
  const keys = [...new Set([normalizeLinkKey(originalLink), normalizeLinkKey(unmaskedLink)])];
  const links = [...new Set([originalLink, unmaskedLink])];

  const existing = await Post.findOne({
    status: { $in: ACTIVE_STATUSES },
    $or: [{ linkKey: { $in: keys } }, { unmaskedLink: { $in: links } }, { externalLink: { $in: links } }],
  })
    .select('title status author')
    .populate('author', 'username')
    .lean();

  if (!existing) return null;

  const { title, status, author } = existing;
  const isLive = status === 'approved' || status === 'reported';

  // Titles and authors of posts that are still waiting for review stay private
  return {
    status: isLive ? 'approved' : 'pending',
    ...(isLive && { title, author: author?.username }),
    message: isLive
      ? `This link is already shared on Campus Hub: "${title}"${author?.username ? ` by @${author.username}` : ''}.`
      : 'This link was already submitted by someone and is waiting for review.',
  };
};
