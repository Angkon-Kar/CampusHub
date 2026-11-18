// server/models/TemplateStat.js
// One small document per CV template (1 to 22): how many times it was opened and who loved it.
// The template PDF files themselves live in client/public/cv-guide/templates (the server does not store them).
import mongoose from 'mongoose';

const templateStatSchema = new mongoose.Schema(
  {
    templateId: { type: Number, required: true, unique: true, min: 1, max: 22 },
    views: { type: Number, default: 0, min: 0 },
    lovedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const TemplateStat = mongoose.model('TemplateStat', templateStatSchema);