// server/scripts/seedAndMigrateTags.js
// Run ONCE after deploying the new tag system:   node scripts/seedAndMigrateTags.js
//  1. Adds a starter list of official tags with aliases (safe to run again: existing tags are not changed).
//  2. Rewrites the tags of every old post through the alias list, so "ds", "data-structures" and "dsa" become one tag.
// Edit STARTER_TAGS to match your campus, then use Admin panel > Tags for everything after that.
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Tag } from '../models/Tag.js';
import { Post } from '../models/Post.js';
import { resolveTags, normalizeTagSlug, invalidateTagCaches } from '../utils/tagService.js';

const STARTER_TAGS = [
  // Exam material
  { slug: 'midterm', label: 'Midterm', aliases: ['mid', 'mid-term', 'midterm-suggestion'] },
  { slug: 'final-suggestion', label: 'Final suggestion', aliases: ['final', 'finals', 'final-exam', 'suggestion', 'suggestions'] },
  { slug: 'previous-questions', label: 'Previous questions', aliases: ['question-bank', 'old-questions', 'past-papers', 'previous-year', 'pq'] },
  { slug: 'slides', label: 'Slides', aliases: ['slide', 'ppt', 'lecture-slides', 'lecture-slide'] },
  { slug: 'notes', label: 'Notes', aliases: ['note', 'class-notes', 'lecture-notes', 'handnote', 'handnotes'] },
  { slug: 'lab-report', label: 'Lab report', aliases: ['lab-reports', 'lab', 'sessional'] },
  { slug: 'assignment', label: 'Assignment', aliases: ['assignments', 'homework'] },
  // Programming and CSE topics
  { slug: 'dsa', label: 'Data structures & algorithms', aliases: ['data-structures', 'datastructure', 'datastructures', 'data-structure', 'ds'] },
  { slug: 'algorithms', label: 'Algorithms', aliases: ['algorithm', 'algo'] },
  { slug: 'cpp', label: 'C++', aliases: ['c++', 'cplusplus', 'c-plus-plus'] },
  { slug: 'c', label: 'C programming', aliases: ['c-programming', 'c-language'] },
  { slug: 'java', label: 'Java', aliases: ['java-programming'] },
  { slug: 'python', label: 'Python', aliases: ['py', 'python3'] },
  { slug: 'javascript', label: 'JavaScript', aliases: ['js', 'java-script'] },
  { slug: 'react', label: 'React', aliases: ['reactjs', 'react-js'] },
  { slug: 'nodejs', label: 'Node.js', aliases: ['node', 'node-js'] },
  { slug: 'mern', label: 'MERN stack', aliases: ['mern-stack'] },
  { slug: 'web-development', label: 'Web development', aliases: ['webdev', 'web-dev', 'web'] },
  { slug: 'dbms', label: 'Database (DBMS)', aliases: ['database', 'databases', 'db', 'sql'] },
  { slug: 'oop', label: 'Object oriented programming', aliases: ['object-oriented', 'oops'] },
  { slug: 'operating-system', label: 'Operating system', aliases: ['os', 'operating-systems'] },
  { slug: 'computer-networks', label: 'Computer networks', aliases: ['networking', 'networks', 'cn'] },
  { slug: 'machine-learning', label: 'Machine learning', aliases: ['ml'] },
  { slug: 'artificial-intelligence', label: 'Artificial intelligence', aliases: ['ai'] },
  { slug: 'competitive-programming', label: 'Competitive programming', aliases: ['cp', 'codeforces'] },
  { slug: 'leetcode', label: 'LeetCode', aliases: ['leet-code'] },
  { slug: 'interview', label: 'Interview preparation', aliases: ['interview-prep', 'job-interview'] },
  { slug: 'free-course', label: 'Free course', aliases: ['free-courses', 'course', 'free'] },
  { slug: 'project', label: 'Project idea', aliases: ['project-ideas', 'projects'] },
];

await connectDB();

// 1. Starter tags (setOnInsert: a tag an admin already edited is never overwritten)
const existing = new Set((await Tag.find().select('slug aliases').lean()).flatMap(({ slug, aliases }) => [slug, ...aliases]));
let created = 0;
for (const { slug, label, aliases } of STARTER_TAGS) {
  if (existing.has(slug)) continue;
  // An alias already used by another tag is skipped, so the same name never points to two tags
  const freeAliases = aliases.map(normalizeTagSlug).filter((alias) => alias && alias !== slug && !existing.has(alias));
  await Tag.create({ slug, label, aliases: freeAliases, official: true });
  [slug, ...freeAliases].forEach((name) => existing.add(name));
  created += 1;
}
invalidateTagCaches();
console.log(`Starter tags added: ${created}`);

// 2. Old posts: run their tags through the alias list (unknown tags are saved as unofficial tags for the admin to review)
const posts = await Post.find({ 'tags.0': { $exists: true } }).select('tags').lean();
const operations = [];
for (const { _id, tags } of posts) {
  const resolved = await resolveTags(tags);
  if (resolved.join() !== tags.join()) operations.push({ updateOne: { filter: { _id }, update: { $set: { tags: resolved } } } });
}
if (operations.length > 0) await Post.bulkWrite(operations);
console.log(`Posts with cleaned tags: ${operations.length} of ${posts.length}`);

await mongoose.disconnect();
