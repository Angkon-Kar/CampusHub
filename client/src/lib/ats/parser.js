// client/src/lib/ats/parser.js
// Reads PDF / DOCX / TXT in the browser and finds sections and bullet points.
// Heavy libraries (pdfjs, mammoth, tesseract) are loaded only when needed, so the main bundle stays small.
import ATSData from './data/index.js';
import { EMAIL_RE } from './validator.js';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MIN_TEXT_BEFORE_OCR = 120; // fewer characters than this means a scanned PDF
const MAX_OCR_PAGES = 3;

export const readResumeFile = async (file) => {
  if (!file) throw new Error('Please choose a file first.');
  if (file.size > MAX_FILE_SIZE) throw new Error('This file is larger than 5 MB. Please upload a smaller one.');

  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return readPdf(file);
  if (name.endsWith('.docx')) return readDocx(file);
  if (name.endsWith('.txt')) return readTxt(file);
  throw new Error('Unsupported file type. Upload a PDF, DOCX or TXT file.');
};

const readTxt = async (file) => {
  const text = await file.text();
  return { text, pageCount: Math.max(1, Math.round(text.length / 3000)), ocrUsed: false };
};

const loadPdfJs = async () => {
  const [pdfjs, { default: workerUrl }] = await Promise.all([
    import('pdfjs-dist'),
    // Updated line to fix Vite import error
    import('pdfjs-dist/build/pdf.worker.mjs?url'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  return pdfjs;
};

// Rebuilds real text lines from pdf.js items (so headings and bullets stay on their own lines)
const pageToText = (items) => {
  let out = '';
  let lastY = null;
  let lastEndX = null;

  items.forEach((item) => {
    if (!('str' in item)) return;
    const [, , , , x, y] = item.transform;

    if (lastY !== null && Math.abs(y - lastY) > 3) {
      out += '\n';
      lastEndX = null;
    } else if (lastEndX !== null) {
      const gap = x - lastEndX;
      if (gap > 12) out += '   '; // wide gap: probably a column
      else if (gap > 1 && !out.endsWith(' ') && !item.str.startsWith(' ')) out += ' ';
    }

    out += item.str;
    lastY = y;
    lastEndX = x + (item.width || 0);
    if (item.hasEOL) {
      out += '\n';
      lastY = null;
      lastEndX = null;
    }
  });

  return out.replace(/\n{2,}/g, '\n');
};

const readPdf = async (file) => {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(pageToText(content.items));
  }

  let text = pages.join('\n\n').replace(/\n{3,}/g, '\n\n');
  let ocrUsed = false;

  if (text.replace(/\s/g, '').length < MIN_TEXT_BEFORE_OCR) {
    text = await ocrPdf(pdf);
    ocrUsed = true;
  }

  return { text, pageCount: pdf.numPages, ocrUsed };
};

// Scanned PDFs: draw each page on a canvas and read it with Tesseract (first pages only)
const ocrPdf = async (pdf) => {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');
  const parts = [];

  try {
    const pageLimit = Math.min(pdf.numPages, MAX_OCR_PAGES);
    for (let i = 1; i <= pageLimit; i += 1) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport }).promise;
      const {
        data: { text },
      } = await worker.recognize(canvas);
      parts.push(text);
    }
  } finally {
    await worker.terminate();
  }
  return parts.join('\n\n');
};

const readDocx = async (file) => {
  const { default: mammoth } = await import('mammoth/mammoth.browser.js');
  const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return { text: value, pageCount: Math.max(1, Math.round(value.length / 3000)), ocrUsed: false };
};

// ---------- Text helpers (pure functions, no browser APIs) ----------

const normalizeHeading = (line) =>
  line
    .split(':')[0]
    .replace(/[^a-zA-Z& ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

// A line counts as a heading when it is (almost) just the heading word, e.g. "SKILLS" or "Skills:"
export const detectSections = (text) => {
  const headers = ATSData.keywords.section_headers;
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0 && line.trim().length <= 60);
  const found = {};

  Object.entries(headers).forEach(([section, aliases]) => {
    found[section] = lines.some((line) => {
      const heading = normalizeHeading(line);
      return aliases.some((alias) => heading === alias || heading === `${alias}s`);
    });
  });

  // Most resumes have no "Contact" heading: an email address is enough
  if (!found.contact) found.contact = EMAIL_RE.test(text);
  return found;
};

export const extractName = (text) => {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 8);
  const name = lines.find((line) => {
    if (/[@\d]/.test(line) || line.length > 45 || line.length < 3) return false;
    const parts = line.split(/\s+/);
    return parts.length >= 2 && parts.length <= 4 && parts.every((w) => /^[A-Z][a-zA-Z.'-]*$/.test(w));
  });
  return name || null;
};

const BULLET_RE = /^[•\-*▪◦‣●·]\s*/;

export const splitBullets = (text) => {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const marked = lines.filter((l) => BULLET_RE.test(l));
  // If the resume uses real bullet markers, trust them. Otherwise fall back to sentence-length lines.
  const chosen = marked.length >= 3 ? marked : lines.filter((l) => BULLET_RE.test(l) || (l.length > 20 && l.length < 220));
  return chosen.map((l) => l.replace(BULLET_RE, ''));
};