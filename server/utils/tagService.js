// server/utils/tagService.js
// Everything about tags in one place: normalising, alias lookup, suggestions, counts and merging.
import { Tag } from '../models/Tag.js';
import { Post } from '../models/Post.js';

export const MAX_TAGS_PER_POST = 5;

const CATALOG_TTL_MS = 30 * 1000;
const COUNTS_TTL_MS = 60 * 1000;

// "Data Structures" -> "data-structures", "C++" -> "c++", "  JS " -> "js"
export const normalizeTagSlug = (raw) =>
  String(raw ?? '')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9+#-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);

// ---------- Catalog (small, so it is cached in memory for 30 seconds) ----------
let catalogCache = null;
let catalogLoadedAt = 0;
let countsCache = null;
let countsLoadedAt = 0;

export const invalidateTagCaches = () => {
  catalogCache = null;
  countsCache = null;
};

export const loadCatalog = async () => {
  if (catalogCache && Date.now() - catalogLoadedAt < CATALOG_TTL_MS) return catalogCache;

  const tags = await Tag.find().lean();
  const bySlug = new Map(tags.map((tag) => [tag.slug, tag]));
  // Every name a student might type (the slug itself and all aliases) -> the official slug
  const byName = new Map();
  tags.forEach(({ slug, aliases = [] }) => {
    byName.set(slug, slug);
    aliases.forEach((alias) => byName.set(alias, slug));
  });
  const hidden = new Set(tags.filter((tag) => tag.hidden).map(({ slug }) => slug));

  catalogCache = { tags, bySlug, byName, hidden };
  catalogLoadedAt = Date.now();
  return catalogCache;
};

// Live (approved) post count per tag. One aggregation, cached for a minute.
export const getTagCounts = async () => {
  if (countsCache && Date.now() - countsLoadedAt < COUNTS_TTL_MS) return countsCache;

  const rows = await Post.aggregate([
    { $match: { status: 'approved' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
  ]);
  countsCache = new Map(rows.map(({ _id, count }) => [_id, count]));
  countsLoadedAt = Date.now();
  return countsCache;
};

// ---------- Resolving what the student typed ----------
// Turns typed tags into official slugs: aliases are converted, duplicates and hidden tags dropped,
// the list is cut to 5, and brand-new tags are saved so admins can see (and merge) them later.
export const resolveTags = async (rawList = [], { createMissing = true } = {}) => {
  const catalog = await loadCatalog();
  const result = [];
  const missing = [];

  for (const raw of rawList) {
    const slug = normalizeTagSlug(raw);
    if (slug.length < 2) continue;

    const canonical = catalog.byName.get(slug) ?? slug;
    if (catalog.hidden.has(canonical) || result.includes(canonical)) continue;

    result.push(canonical);
    if (!catalog.bySlug.has(canonical)) missing.push(canonical);
    if (result.length >= MAX_TAGS_PER_POST) break;
  }

  if (createMissing && missing.length > 0) {
    await Tag.bulkWrite(
      missing.map((slug) => ({
        updateOne: {
          filter: { slug },
          update: { $setOnInsert: { slug, label: slug, aliases: [], hidden: false, official: false } },
          upsert: true,
        },
      }))
    );
    invalidateTagCaches();
  }

  return result;
};

// ---------- Autocomplete ----------
const editDistance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = temp;
    }
  }
  return row[b.length];
};

const toSuggestion = ({ slug, label, official }, counts, matchedAlias = null) => ({
  slug,
  label,
  official: Boolean(official),
  count: counts.get(slug) || 0,
  ...(matchedAlias && matchedAlias !== slug && { matchedAlias }),
});

export const suggestTags = async (rawQuery = '', limit = 8) => {
  const [catalog, counts] = await Promise.all([loadCatalog(), getTagCounts()]);
  const visible = catalog.tags.filter(({ hidden }) => !hidden);
  const q = normalizeTagSlug(rawQuery);

  // Nothing typed yet: show the most used tags
  if (!q) {
    const popular = visible
      .map((tag) => toSuggestion(tag, counts))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    return { suggestions: popular, exact: null, didYouMean: null, canCreate: false };
  }

  const exactSlug = catalog.byName.get(q);
  const exactTag = exactSlug && !catalog.hidden.has(exactSlug) ? catalog.bySlug.get(exactSlug) : null;

  const scored = [];
  for (const tag of visible) {
    const names = [tag.slug, ...(tag.aliases || [])];
    const labelSlug = normalizeTagSlug(tag.label);
    let best = 0;
    let matchedAlias = null;

    for (const name of [...names, labelSlug]) {
      const score = name === q ? 100 : name.startsWith(q) ? 70 : name.includes(q) ? 40 : 0;
      if (score > best) {
        best = score;
        matchedAlias = name;
      }
    }
    if (best > 0) {
      // Curated tags and popular tags come first when the match quality is equal
      scored.push({ tag, score: best + (tag.official ? 5 : 0), matchedAlias });
    }
  }

  const suggestions = scored
    .sort((a, b) => b.score - a.score || (counts.get(b.tag.slug) || 0) - (counts.get(a.tag.slug) || 0))
    .slice(0, limit)
    .map(({ tag, matchedAlias }) => toSuggestion(tag, counts, matchedAlias));

  // "Did you mean": no exact match, but something very close ("datastructurs" -> "dsa" alias "datastructure")
  let didYouMean = null;
  if (!exactTag && q.length >= 3) {
    const maxDistance = q.length <= 5 ? 1 : 2;
    let bestDistance = Infinity;
    for (const tag of visible) {
      for (const name of [tag.slug, ...(tag.aliases || [])]) {
        const distance = editDistance(q, name);
        if (distance <= maxDistance && distance < bestDistance) {
          bestDistance = distance;
          didYouMean = toSuggestion(tag, counts);
        }
      }
    }
  }

  return {
    suggestions,
    exact: exactTag ? toSuggestion(exactTag, counts, q) : null,
    didYouMean,
    canCreate: !exactTag && q.length >= 2,
  };
};

// ---------- Search and filters ----------
// Slugs of every tag whose slug, label or alias contains the text (so searching "ds" finds "dsa" posts)
export const findTagSlugsMatching = async (text) => {
  const needle = normalizeTagSlug(text);
  if (!needle) return [];

  const { tags } = await loadCatalog();
  return tags
    .filter(({ hidden }) => !hidden)
    .filter(({ slug, label, aliases = [] }) =>
      [slug, normalizeTagSlug(label), ...aliases].some((name) => name.includes(needle))
    )
    .map(({ slug }) => slug);
};

// ---------- Admin actions ----------
export class TagError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// An alias may not already belong to another tag
export const assertNameFree = async (name, ownerSlug) => {
  const { byName } = await loadCatalog();
  const owner = byName.get(name);
  if (owner && owner !== ownerSlug) {
    throw new TagError(`"${name}" already belongs to the tag "${owner}".`, 409);
  }
};

// Merge "from" into "into": posts are moved, and the old name (plus its aliases) becomes an alias of the target.
export const mergeTags = async (fromRaw, intoRaw) => {
  const fromSlug = normalizeTagSlug(fromRaw);
  const intoSlug = normalizeTagSlug(intoRaw);
  if (!fromSlug || !intoSlug || fromSlug === intoSlug) throw new TagError('Choose two different tags.');

  const [from, into] = await Promise.all([Tag.findOne({ slug: fromSlug }), Tag.findOne({ slug: intoSlug })]);
  if (!from || !into) throw new TagError('Tag not found.', 404);

  // Two steps, because MongoDB cannot add and remove on the same array in one update
  await Post.updateMany({ tags: from.slug }, { $addToSet: { tags: into.slug } });
  await Post.updateMany({ tags: from.slug }, { $pull: { tags: from.slug } });

  into.aliases = [...new Set([...into.aliases, from.slug, ...from.aliases])].filter((name) => name !== into.slug);
  await into.save();
  await Tag.deleteOne({ _id: from._id });

  invalidateTagCaches();
  return into;
};
