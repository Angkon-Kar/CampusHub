// server/models/Tag.js
import mongoose from 'mongoose';

// One document per OFFICIAL tag. Posts store only the slug.
// "dsa" can have aliases ["data-structures", "datastructure", "ds"]: typing any of them gives "dsa".
const tagSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 30 },
    label: { type: String, required: true, trim: true, maxlength: 60 },
    aliases: [{ type: String, lowercase: true, trim: true, maxlength: 30 }],
    // Hidden = removed from suggestions, filters and new posts (use it for bad or useless tags)
    hidden: { type: Boolean, default: false },
    // Official = curated by an admin or the seed list. Student-created tags start as unofficial.
    official: { type: Boolean, default: false },
  },
  { timestamps: true }
);

tagSchema.index({ aliases: 1 });

export const Tag = mongoose.model('Tag', tagSchema);
