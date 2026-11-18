// client/src/lib/templateFiles.js
// Finds the real PDF file of each template in /public/cv-guide/templates.
// It tries common names. After the first match it tries that style first for all other templates.
// You can also list exact names in TEMPLATE_FILES (constants/cvGuide.js).
import { TEMPLATE_PATH, TEMPLATE_FILES } from '../constants/cvGuide';

const pad = (number) => String(number).padStart(2, '0');

export const FILE_PATTERNS = [
  (id) => `${pad(id)}.pdf`,
  (id) => `template-${pad(id)}.pdf`,
  (id) => `template_${pad(id)}.pdf`,
  (id) => `template${pad(id)}.pdf`,
  (id) => `cv-template-${pad(id)}.pdf`,
  (id) => `CV-Template-${pad(id)}.pdf`,
  (id) => `cv-${pad(id)}.pdf`,
  (id) => `${id}.pdf`,
  (id) => `template-${id}.pdf`,
  (id) => `${pad(id)}-template.pdf`,
];

// Only a real PDF counts. Many hosts answer a wrong file name with the app's HTML page and status 200.
const isPdf = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && (response.headers.get('content-type') || '').toLowerCase().includes('pdf');
  } catch {
    return false;
  }
};

let learnedPattern = null;
let queue = Promise.resolve();
const cache = new Map();
let warned = false;

const findTemplateUrl = async (id) => {
  const explicit = TEMPLATE_FILES[id];
  if (explicit) {
    const url = encodeURI(`${TEMPLATE_PATH}/${explicit}`);
    return (await isPdf(url)) ? url : null;
  }

  const all = FILE_PATTERNS.map((_, index) => index);
  const order = learnedPattern === null ? all : [learnedPattern, ...all.filter((index) => index !== learnedPattern)];

  for (const index of order) {
    const url = `${TEMPLATE_PATH}/${FILE_PATTERNS[index](id)}`;
    if (await isPdf(url)) {
      learnedPattern = index;
      return url;
    }
  }

  if (!warned) {
    warned = true;
    console.warn(`Template PDF not found for template ${pad(id)} in ${TEMPLATE_PATH}. Add the exact file names to TEMPLATE_FILES in constants/cvGuide.js.`);
  }
  return null;
};

// Resolves to the PDF url, or null when the file does not exist. Checks run one by one and results are remembered.
export const resolveTemplateUrl = (id) => {
  if (!cache.has(id)) {
    const task = queue.then(() => findTemplateUrl(id));
    queue = task.catch(() => {});
    cache.set(id, task);
  }
  return cache.get(id);
};

export const templateDownloadName = ({ id, role }) => `CV-Template-${pad(id)}-${role.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.pdf`;