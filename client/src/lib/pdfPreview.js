// client/src/lib/pdfPreview.js
// Draws the first page of a PDF onto a <canvas> with pdf.js. No image files are needed.
// pdf.js is downloaded only when the first preview is drawn.
let pdfjsPromise = null;

const loadPdfJs = () => {
  if (!pdfjsPromise) {
    pdfjsPromise = Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(([pdfjs, { default: workerUrl }]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    });
  }
  return pdfjsPromise;
};

// Previews are drawn one after another, so 22 PDFs never load at the same moment
let queue = Promise.resolve();
const enqueue = (task) => {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
};

export const renderPdfFirstPage = (url, canvas, cssWidth) =>
  enqueue(async () => {
    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument({ url });
    try {
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const base = page.getViewport({ scale: 1 });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: (Math.max(cssWidth, 120) * pixelRatio) / base.width });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport }).promise;
    } finally {
      loadingTask.destroy();
    }
  });