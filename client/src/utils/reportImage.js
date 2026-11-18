// client/src/utils/reportImage.js
// Draws report cards (CGPA report, syllabus progress) on a <canvas> and downloads them as PNG.
// No library needed, and nothing leaves the device.

const FONT = 'Inter, "Segoe UI", Arial, sans-serif';
const COLORS = {
  indigo: '#4f46e5',
  indigoDark: '#4338ca',
  ink: '#0f172a',
  muted: '#64748b',
  line: '#e2e8f0',
  soft: '#f8fafc',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#f43f5e',
};
const SCALE = 2; // sharper picture on phones and print

const progressColor = (percent) => (percent >= 70 ? COLORS.green : percent >= 40 ? COLORS.amber : COLORS.red);

const makeCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width * SCALE;
  canvas.height = height * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = 'alphabetic';
  return { canvas, ctx };
};

const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const text = (ctx, value, x, y, { size = 16, weight = 400, color = COLORS.ink, align = 'left' } = {}) => {
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(String(value), x, y);
};

// Cuts long text with "..." so it never runs outside its column
const fit = (ctx, value, maxWidth, { size = 16, weight = 400 } = {}) => {
  ctx.font = `${weight} ${size}px ${FONT}`;
  let result = String(value);
  if (ctx.measureText(result).width <= maxWidth) return result;
  while (result.length > 1 && ctx.measureText(`${result}...`).width > maxWidth) result = result.slice(0, -1);
  return `${result.trimEnd()}...`;
};

const header = (ctx, width, title, subtitle) => {
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, COLORS.indigo);
  gradient.addColorStop(1, '#7c3aed');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 130);

  text(ctx, 'Campus Hub', 40, 44, { size: 15, weight: 700, color: 'rgba(255,255,255,0.85)' });
  text(ctx, title, 40, 84, { size: 30, weight: 800, color: '#ffffff' });
  text(ctx, subtitle, 40, 112, { size: 15, color: 'rgba(255,255,255,0.85)' });
};

const footer = (ctx, width, height, note) => {
  ctx.fillStyle = COLORS.line;
  ctx.fillRect(40, height - 62, width - 80, 1);
  text(ctx, note, 40, height - 32, { size: 12, color: COLORS.muted });
  text(ctx, new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }), width - 40, height - 32, {
    size: 12,
    color: COLORS.muted,
    align: 'right',
  });
};

const prepareFonts = async () => {
  try {
    await Promise.all([document.fonts.load('400 16px Inter'), document.fonts.load('700 16px Inter'), document.fonts.load('800 16px Inter')]);
  } catch {
    // the fallback font is fine
  }
};

export const downloadCanvas = (canvas, filename) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Could not create the image.'));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      resolve();
    }, 'image/png');
  });

// ---------------------------------------------------------------- CGPA report
// semesters: [{ name, sgpa, credits, courses: [{ name, credit, marks, grade, point }] }]
export const renderCgpaReport = async ({ studentName, cgpa, credits, label, previous, semesters }) => {
  await prepareFonts();

  const width = 1080;
  const ROW = 36;
  const semesterHeight = (semester) => 74 + Math.max(1, semester.courses.length) * ROW + 24;
  const previousHeight = previous ? 56 : 0;
  const height = 130 + 190 + previousHeight + semesters.reduce((sum, s) => sum + semesterHeight(s), 0) + 90;

  const { canvas, ctx } = makeCanvas(width, height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  header(ctx, width, 'CGPA Report', studentName ? studentName : 'University of Dhaka grading system (4.00 scale)');

  // Summary
  let y = 130 + 30;
  ctx.fillStyle = COLORS.soft;
  roundRect(ctx, 40, y, width - 80, 130, 20);
  ctx.fill();
  text(ctx, 'CUMULATIVE GPA', 70, y + 40, { size: 13, weight: 700, color: COLORS.muted });
  text(ctx, cgpa === null ? '--' : cgpa.toFixed(2), 70, y + 100, { size: 64, weight: 800, color: COLORS.indigo });
  text(ctx, label || '', 300, y + 80, { size: 20, weight: 700 });
  text(ctx, `${credits} credits counted`, 300, y + 108, { size: 15, color: COLORS.muted });
  text(ctx, `${semesters.length} semester${semesters.length === 1 ? '' : 's'}`, width - 70, y + 80, { size: 20, weight: 700, align: 'right' });
  text(ctx, 'in this report', width - 70, y + 108, { size: 15, color: COLORS.muted, align: 'right' });
  y += 130 + 30;

  if (previous) {
    text(ctx, `Includes a previous record: CGPA ${previous.cgpa} over ${previous.credits} credits`, 40, y + 20, { size: 15, color: COLORS.muted });
    y += previousHeight;
  }

  // Semesters
  semesters.forEach((semester) => {
    text(ctx, fit(ctx, semester.name, 560, { size: 20, weight: 800 }), 40, y + 30, { size: 20, weight: 800 });
    text(ctx, `SGPA ${semester.sgpa === null ? '--' : semester.sgpa.toFixed(2)}  ·  ${semester.credits} credits`, width - 40, y + 30, {
      size: 15,
      weight: 700,
      color: COLORS.indigo,
      align: 'right',
    });
    y += 46;

    ctx.fillStyle = COLORS.soft;
    roundRect(ctx, 40, y, width - 80, 28, 8);
    ctx.fill();
    ['Course', 'Credit', 'Marks', 'Grade', 'Point'].forEach((title, index) => {
      const xs = [56, 620, 720, 830, 940];
      text(ctx, title, xs[index], y + 19, { size: 12, weight: 700, color: COLORS.muted });
    });
    y += 34;

    if (semester.courses.length === 0) {
      text(ctx, 'No graded courses', 56, y + 24, { size: 14, color: COLORS.muted });
      y += ROW;
    }
    semester.courses.forEach((course, index) => {
      if (index % 2 === 1) {
        ctx.fillStyle = '#fbfcfe';
        ctx.fillRect(40, y, width - 80, ROW);
      }
      text(ctx, fit(ctx, course.name || `Course ${index + 1}`, 540, { size: 15 }), 56, y + 23, { size: 15 });
      text(ctx, course.credit, 620, y + 23, { size: 15 });
      text(ctx, course.marks === '' ? '-' : course.marks, 720, y + 23, { size: 15, color: COLORS.muted });
      text(ctx, course.grade, 830, y + 23, { size: 15, weight: 800, color: course.grade === 'F' ? COLORS.red : COLORS.ink });
      text(ctx, course.point.toFixed(2), 940, y + 23, { size: 15 });
      y += ROW;
    });
    y += 24;
  });

  footer(ctx, width, height, 'Calculated on my device with the Dhaka University grading scale. Not an official result.');
  return canvas;
};

// ------------------------------------------------------------- syllabus report
// courses: [{ code, name, done, total, percent, inFocus }]
export const renderSyllabusReport = async ({ department, semesterLabel, overall, focus, courses }) => {
  await prepareFonts();

  const width = 1080;
  const ROW = 70;
  const focusHeight = focus ? 60 : 0;
  const height = 130 + 220 + focusHeight + courses.length * ROW + 100;

  const { canvas, ctx } = makeCanvas(width, height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  header(ctx, width, 'Syllabus Progress', `${department} · ${semesterLabel}`);

  // Overall ring
  let y = 130 + 40;
  const cx = 130;
  const cy = y + 70;
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.strokeStyle = COLORS.line;
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.stroke();
  if (overall.percent > 0) {
    ctx.strokeStyle = progressColor(overall.percent);
    ctx.beginPath();
    ctx.arc(cx, cy, 60, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * overall.percent) / 100);
    ctx.stroke();
  }
  text(ctx, `${overall.percent}%`, cx, cy + 12, { size: 34, weight: 800, align: 'center' });

  text(ctx, 'Whole semester covered', 260, y + 60, { size: 26, weight: 800 });
  text(ctx, `${overall.done} of ${overall.total} topics finished`, 260, y + 96, { size: 17, color: COLORS.muted });
  text(ctx, `${courses.length} courses`, 260, y + 124, { size: 17, color: COLORS.muted });
  y += 200;

  if (focus) {
    ctx.fillStyle = '#eef2ff';
    roundRect(ctx, 40, y - 10, width - 80, 44, 12);
    ctx.fill();
    text(ctx, `Exam focus (${focus.count} course${focus.count === 1 ? '' : 's'} selected): ${focus.percent}% covered`, 60, y + 18, {
      size: 16,
      weight: 700,
      color: COLORS.indigoDark,
    });
    y += focusHeight;
  }

  courses.forEach((course) => {
    text(ctx, fit(ctx, `${course.code}  ${course.name}`, 720, { size: 17, weight: 700 }), 40, y + 22, { size: 17, weight: 700 });
    text(ctx, `${course.done}/${course.total} topics`, width - 150, y + 22, { size: 14, color: COLORS.muted, align: 'right' });
    text(ctx, `${course.percent}%`, width - 40, y + 22, { size: 17, weight: 800, align: 'right', color: progressColor(course.percent) });

    ctx.fillStyle = COLORS.line;
    roundRect(ctx, 40, y + 34, width - 80, 12, 6);
    ctx.fill();
    if (course.percent > 0) {
      ctx.fillStyle = progressColor(course.percent);
      roundRect(ctx, 40, y + 34, Math.max(12, ((width - 80) * course.percent) / 100), 12, 6);
      ctx.fill();
    }
    y += ROW;
  });

  footer(ctx, width, height, 'Tracked on my device with Campus Hub. Check your official syllabus for the final topic list.');
  return canvas;
};