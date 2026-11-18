// client/src/components/guide/PdfThumb.jsx
// A live preview of a PDF's first page, drawn on a canvas (no image files). It starts drawing when it scrolls into view.
import { useState, useEffect, useRef } from 'react';
import { FileX2 } from 'lucide-react';
import { renderPdfFirstPage } from '../../lib/pdfpreview.js';

export const PdfThumb = ({ url, missing = false, label, blurred = false }) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);
  // The result remembers which url it belongs to, so "loading" is derived and no state is set inside the effect body
  const [result, setResult] = useState({ url: '', ok: null });

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !url || !canvasRef.current) return;
    let cancelled = false;

    const draw = async () => {
      try {
        await renderPdfFirstPage(url, canvasRef.current, wrapRef.current?.clientWidth || 300);
        if (!cancelled) setResult({ url, ok: true });
      } catch {
        if (!cancelled) setResult({ url, ok: false });
      }
    };
    draw();

    return () => {
      cancelled = true;
    };
  }, [visible, url]);

  const failed = missing || (result.url === url && result.ok === false);
  const ready = result.url === url && result.ok === true;

  return (
    <div ref={wrapRef} className="relative aspect-[210/297] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/80">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className={`absolute inset-0 w-full h-full object-contain transition duration-500 ${ready ? 'opacity-100' : 'opacity-0'} ${blurred ? 'blur-md scale-105' : ''}`}
      />
      {!ready && !failed && <div className="skeleton absolute inset-0" aria-hidden="true" />}
      {failed && (
        <div className="absolute inset-0 grid place-items-center p-4 text-center bg-slate-50">
          <div className="space-y-1.5 text-slate-400">
            <FileX2 size={26} className="mx-auto" />
            <p className="text-xs font-medium">{missing ? 'PDF file not found' : 'Preview not available'}</p>
          </div>
        </div>
      )}
    </div>
  );
};