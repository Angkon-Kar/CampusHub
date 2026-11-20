// server/scripts/backfillLinkKeys.js
// Run ONCE after deploying duplicate detection, so older posts are also recognised:
//   node scripts/backfillLinkKeys.js
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Post } from '../models/Post.js';
import { normalizeLinkKey } from '../utils/linkKey.js';

await connectDB();

const posts = await Post.find({ $or: [{ linkKey: '' }, { linkKey: { $exists: false } }] })
  .select('unmaskedLink externalLink')
  .lean();

const operations = posts.map(({ _id, unmaskedLink, externalLink }) => ({
  updateOne: { filter: { _id }, update: { $set: { linkKey: normalizeLinkKey(unmaskedLink || externalLink) } } },
}));

if (operations.length > 0) await Post.bulkWrite(operations);
console.log(`Updated ${operations.length} post(s).`);

await mongoose.disconnect();
