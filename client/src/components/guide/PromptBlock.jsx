// client/src/components/guide/PromptBlock.jsx
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { copyText } from '../../utils/copyText';

// A dark code-style box with a "Copy to Clipboard" button (Claude prompt and small follow-up prompts)
export const PromptBlock = ({ label, text, compact = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(text);
    if (!ok) return toast.error('Could not copy. Select the text and copy it by hand.');
    setCopied(true);
    toast.success('Copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-2xl shadow-slate-900/20 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex gap-1.5 shrink-0" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg bg-lime-300 text-slate-900 text-xs font-bold hover:bg-lime-200 active:scale-95 transition cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy to Clipboard'}
        </button>
      </div>
      <pre className={`p-4 sm:p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap break-words font-mono ${compact ? '' : 'max-h-[28rem] overflow-y-auto'}`}>{text}</pre>
    </div>
  );
};