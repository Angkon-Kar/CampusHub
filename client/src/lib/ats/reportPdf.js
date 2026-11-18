// client/src/lib/ats/reportPdf.js
// Builds the "Download ATS Report" PDF fully inside the browser with jsPDF.
// No data is sent to any server. jsPDF is loaded only when the button is clicked (dynamic import in AtsReport.jsx).
import { jsPDF } from 'jspdf';
import { CATEGORY_LABELS } from './labels.js';

const PAGE = { width: 595.28, height: 841.89, margin: 40, footer: 36 };
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;

const COLORS = {
  ink: [15, 23, 42],
  muted: [100, 116, 139],
  faint: [148, 163, 184],
  line: [226, 232, 240],
  soft: [248, 250, 252],
  indigo: [79, 70, 229],
  indigoSoft: [238, 242, 255],
  green: [16, 185, 129],
  greenDark: [4, 120, 87],
  greenSoft: [236, 253, 245],
  amber: [245, 158, 11],
  rose: [244, 63, 94],
  roseDark: [190, 18, 60],
  roseSoft: [255, 241, 242],
  orange: [249, 115, 22],
};

const SEVERITY_COLORS = {
  critical: COLORS.rose,
  high: COLORS.orange,
  medium: COLORS.amber,
  low: COLORS.faint,
};

const HEALTH = {
  Green: { label: 'Looks healthy', color: COLORS.green },
  Yellow: { label: 'Needs a few fixes', color: COLORS.amber },
  Red: { label: 'Needs important fixes', color: COLORS.rose },
};

// The built-in PDF fonts only know basic Latin characters, so other characters are replaced safely
const clean = (value) =>
  String(value ?? '')
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[\u2022\u25CF\u25AA]/g, '-')
    .replace(/\u2192/g, '->')
    .replace(/\u00A0/g, ' ')
    .replace(/[^\n\x20-\x7E\u00A1-\u00FF]/g, '?');

const scoreColor = (score) => (score >= 80 ? COLORS.green : score >= 60 ? COLORS.indigo : score >= 50 ? COLORS.amber : COLORS.rose);

const slugify = (text) =>
  clean(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'resume';

const formatDate = (value) =>
  new Date(value || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export const buildAtsReportPdf = (report) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = PAGE.margin;

  const setText = ({ size = 10, style = 'normal', color = COLORS.ink }) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const ensureSpace = (height) => {
    if (y + height > PAGE.height - PAGE.footer - 12) {
      doc.addPage();
      y = PAGE.margin;
    }
  };

  // Draws wrapped text and moves the cursor down. Returns the height used.
  const paragraph = (text, { x = PAGE.margin, width = CONTENT_WIDTH, size = 10, style = 'normal', color = COLORS.ink, lineHeight, gapAfter = 0 } = {}) => {
    const step = lineHeight || size * 1.4;
    setText({ size, style, color });
    const lines = doc.splitTextToSize(clean(text), width);
    lines.forEach((line) => {
      ensureSpace(step);
      doc.text(line, x, y + size);
      y += step;
    });
    y += gapAfter;
    return lines.length * step;
  };

  const sectionTitle = (title) => {
    ensureSpace(46);
    y += 8;
    setText({ size: 13, style: 'bold', color: COLORS.ink });
    doc.text(clean(title), PAGE.margin, y + 13);
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.8);
    doc.line(PAGE.margin, y + 21, PAGE.width - PAGE.margin, y + 21);
    y += 32;
  };

  const chip = (text, x, yy, fill, textColor = [255, 255, 255], size = 8) => {
    setText({ size, style: 'bold', color: textColor });
    const label = clean(text);
    const width = doc.getTextWidth(label) + 14;
    doc.setFillColor(...fill);
    doc.roundedRect(x, yy, width, size + 9, (size + 9) / 2, (size + 9) / 2, 'F');
    doc.text(label, x + 7, yy + size + 2.5);
    return width;
  };

  const drawArc = (cx, cy, radius, fraction, color, thickness) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(thickness);
    doc.setLineCap('round');
    const steps = Math.max(2, Math.round(80 * fraction));
    const start = -Math.PI / 2;
    for (let i = 0; i < steps; i += 1) {
      const a1 = start + (2 * Math.PI * fraction * i) / steps;
      const a2 = start + (2 * Math.PI * fraction * (i + 1)) / steps;
      doc.line(cx + radius * Math.cos(a1), cy + radius * Math.sin(a1), cx + radius * Math.cos(a2), cy + radius * Math.sin(a2));
    }
  };

  const {
    fileName,
    role,
    seniority,
    atsProfile,
    atsProfileNote,
    overallScore,
    grade,
    gradeLabel,
    health,
    sectionWeights = [],
    keywordRes = { matched: [], missing: [], matchPct: 0, usedJD: false },
    issues = [],
    strengths = [],
    roadmap = { items: [], potentialGain: 0 },
    wordCount,
    pageCount,
    ocrUsed,
    createdAt,
  } = report;

  // ---------- Header band ----------
  doc.setFillColor(...COLORS.indigo);
  doc.rect(0, 0, PAGE.width, 92, 'F');
  setText({ size: 22, style: 'bold', color: [255, 255, 255] });
  doc.text('ATS Resume Report', PAGE.margin, 50);
  setText({ size: 10, color: [199, 210, 254] });
  doc.text(`Campus Hub  |  Generated ${formatDate(createdAt)}`, PAGE.margin, 70);
  setText({ size: 10, style: 'bold', color: [255, 255, 255] });
  doc.text('campushub', PAGE.width - PAGE.margin, 50, { align: 'right' });
  y = 92 + 24;

  // ---------- Score card ----------
  const cardHeight = 150;
  doc.setFillColor(...COLORS.soft);
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.8);
  doc.roundedRect(PAGE.margin, y, CONTENT_WIDTH, cardHeight, 10, 10, 'FD');

  const gaugeX = PAGE.margin + 78;
  const gaugeY = y + cardHeight / 2;
  drawArc(gaugeX, gaugeY, 46, 1, COLORS.line, 10);
  if (overallScore > 0) drawArc(gaugeX, gaugeY, 46, Math.min(1, overallScore / 100), scoreColor(overallScore), 10);
  setText({ size: 32, style: 'bold', color: COLORS.ink });
  doc.text(String(overallScore), gaugeX, gaugeY + 6, { align: 'center' });
  setText({ size: 9, color: COLORS.muted });
  doc.text('out of 100', gaugeX, gaugeY + 20, { align: 'center' });

  const infoX = PAGE.margin + 160;
  const infoWidth = CONTENT_WIDTH - 160 - 16;
  let infoY = y + 22;
  setText({ size: 18, style: 'bold' });
  doc.text(`Grade ${clean(grade)}  -  ${clean(gradeLabel)}`, infoX, infoY + 14);
  infoY += 28;

  const healthInfo = HEALTH[health] || HEALTH.Yellow;
  chip(healthInfo.label, infoX, infoY, healthInfo.color);
  infoY += 26;

  const metaLines = [
    `File: ${fileName}`,
    `Applying for: ${role} (${seniority})`,
    `ATS type: ${atsProfile}`,
    `${wordCount} words, ${pageCount} page${pageCount > 1 ? 's' : ''}`,
  ];
  setText({ size: 9.5, color: COLORS.muted });
  metaLines.forEach((line) => {
    const [short] = doc.splitTextToSize(clean(line), infoWidth);
    doc.text(short, infoX, infoY + 9);
    infoY += 14;
  });
  y += cardHeight + 12;

  paragraph(
    'This is an estimate based on common ATS rules. It is not the real software any company uses, so treat it as a checklist, not a guarantee.',
    { size: 8.5, color: COLORS.faint, gapAfter: 4 }
  );
  if (atsProfileNote) paragraph(atsProfileNote, { size: 8.5, color: COLORS.faint, gapAfter: 4 });
  if (ocrUsed) {
    paragraph('Note: your file had no selectable text, so it was read with OCR (first 3 pages only). Real ATS systems may not read it at all. Export a text-based PDF instead.', {
      size: 8.5,
      color: COLORS.roseDark,
      gapAfter: 4,
    });
  }

  // ---------- Score breakdown ----------
  sectionTitle('Score breakdown');
  const barX = PAGE.margin + 150;
  const barWidth = CONTENT_WIDTH - 150 - 46;
  sectionWeights.forEach(({ category, weight, score }) => {
    ensureSpace(24);
    setText({ size: 10, color: COLORS.ink });
    doc.text(clean(CATEGORY_LABELS[category] || category), PAGE.margin, y + 10);
    setText({ size: 7.5, color: COLORS.faint });
    doc.text(`${weight}% of total`, PAGE.margin + 98, y + 10);
    doc.setFillColor(...COLORS.line);
    doc.roundedRect(barX, y + 2, barWidth, 9, 4.5, 4.5, 'F');
    if (score > 0) {
      doc.setFillColor(...scoreColor(score));
      doc.roundedRect(barX, y + 2, Math.max(9, (barWidth * score) / 100), 9, 4.5, 4.5, 'F');
    }
    setText({ size: 10, style: 'bold' });
    doc.text(String(score), PAGE.width - PAGE.margin, y + 10, { align: 'right' });
    y += 24;
  });

  // ---------- Roadmap ----------
  sectionTitle('Fix these first');
  if (roadmap.items.length === 0) {
    paragraph('No big gaps found. Nice work.', { color: COLORS.muted, gapAfter: 4 });
  } else {
    paragraph(`Improving these areas could add about ${roadmap.potentialGain} points.`, { color: COLORS.muted, gapAfter: 6 });
    roadmap.items.forEach(({ cat, score }, index) => {
      ensureSpace(22);
      doc.setFillColor(...COLORS.indigoSoft);
      doc.circle(PAGE.margin + 9, y + 9, 9, 'F');
      setText({ size: 9, style: 'bold', color: COLORS.indigo });
      doc.text(String(index + 1), PAGE.margin + 9, y + 12, { align: 'center' });
      setText({ size: 10.5 });
      doc.text(clean(CATEGORY_LABELS[cat] || cat), PAGE.margin + 28, y + 12);
      setText({ size: 10, color: COLORS.muted });
      doc.text(`${score}/100`, PAGE.width - PAGE.margin, y + 12, { align: 'right' });
      y += 22;
    });
  }

  // ---------- Strengths ----------
  sectionTitle('What is already good');
  strengths.forEach((item) => {
    ensureSpace(18);
    doc.setFillColor(...COLORS.green);
    doc.circle(PAGE.margin + 4, y + 7, 2.5, 'F');
    paragraph(item, { x: PAGE.margin + 16, width: CONTENT_WIDTH - 16, size: 10, gapAfter: 3 });
  });

  // ---------- Keywords ----------
  sectionTitle(`Keywords (${keywordRes.matchPct}% matched)`);
  paragraph(
    keywordRes.usedJD ? 'Compared with the job description you pasted.' : `No job description was given, so the check used common skills for ${role}.`,
    { size: 9, color: COLORS.muted, gapAfter: 6 }
  );
  const keywordBlock = (title, words, color) => {
    ensureSpace(36);
    setText({ size: 10, style: 'bold', color });
    doc.text(`${title} (${words.length})`, PAGE.margin, y + 10);
    y += 18;
    paragraph(words.length ? words.slice(0, 30).join(',  ') : 'None.', { size: 9.5, color: COLORS.ink, gapAfter: 8 });
  };
  keywordBlock('Found in your resume', keywordRes.matched, COLORS.greenDark);
  keywordBlock('Missing', keywordRes.missing, COLORS.roseDark);

  // ---------- Findings ----------
  sectionTitle(`All findings (${issues.length})`);
  const textWidth = CONTENT_WIDTH - 20;

  const measure = (text, size) => {
    setText({ size });
    return doc.splitTextToSize(clean(text), textWidth).length * size * 1.4;
  };

  issues.forEach((issue) => {
    const { severity, title, why, where, suggestion, confidence } = issue;
    const hasPair = suggestion && typeof suggestion === 'object';

    let height = 14 + measure(title, 10.5) + 6 + measure(why, 9.5) + 4;
    if (where) height += measure(`Where: ${where}`, 8.5) + 2;
    if (hasPair) height += measure(`Before: ${suggestion.before}`, 9) + measure(`After: ${suggestion.after}`, 9) + 12;
    else if (suggestion) height += measure(`Tip: ${suggestion}`, 9.5) + 4;
    if (confidence) height += measure(confidence, 8);
    height += 12;

    ensureSpace(Math.min(height, 200));

    const top = y;
    const accent = SEVERITY_COLORS[severity] || COLORS.faint;
    doc.setFillColor(...accent);
    doc.roundedRect(PAGE.margin, top, 3.5, 24, 1.75, 1.75, 'F');

    const chipWidth = chip(severity.toUpperCase(), PAGE.margin + 14, top + 2, accent, [255, 255, 255], 7);
    setText({ size: 10.5, style: 'bold' });
    const titleLines = doc.splitTextToSize(clean(title), textWidth - chipWidth - 8);
    titleLines.forEach((line, index) => {
      doc.text(line, PAGE.margin + 14 + chipWidth + 8, top + 12 + index * 14.5);
    });
    y = top + 12 + Math.max(0, titleLines.length - 1) * 14.5 + 10;

    const body = { x: PAGE.margin + 14, width: textWidth };
    paragraph(why, { ...body, size: 9.5, color: COLORS.muted, gapAfter: 2 });
    if (where) paragraph(`Where: ${where}`, { ...body, size: 8.5, color: COLORS.faint, gapAfter: 2 });

    if (hasPair) {
      y += 2;
      paragraph(`Before: ${suggestion.before}`, { ...body, size: 9, color: COLORS.roseDark });
      paragraph(`After: ${suggestion.after}`, { ...body, size: 9, color: COLORS.greenDark, gapAfter: 2 });
    } else if (suggestion) {
      paragraph(`Tip: ${suggestion}`, { ...body, size: 9.5, color: COLORS.indigo, gapAfter: 2 });
    }
    if (confidence) paragraph(confidence, { ...body, size: 8, color: COLORS.faint });

    y += 6;
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.5);
    doc.line(PAGE.margin, y, PAGE.width - PAGE.margin, y);
    y += 10;
  });

  // ---------- Footer on every page ----------
  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.6);
    doc.line(PAGE.margin, PAGE.height - PAGE.footer, PAGE.width - PAGE.margin, PAGE.height - PAGE.footer);
    setText({ size: 8, color: COLORS.faint });
    doc.text('Campus Hub ATS check. An estimate only, not a real company ATS.', PAGE.margin, PAGE.height - PAGE.footer + 14);
    doc.text(`Page ${page} of ${totalPages}`, PAGE.width - PAGE.margin, PAGE.height - PAGE.footer + 14, { align: 'right' });
  }

  return doc;
};

export const downloadAtsReportPdf = (report) => {
  const doc = buildAtsReportPdf(report);
  const date = new Date(report.createdAt || Date.now()).toISOString().slice(0, 10);
  doc.save(`ATS-Report-${slugify(report.role)}-${date}.pdf`);
};