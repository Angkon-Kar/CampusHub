// client/src/components/guide/ChecklistCard.jsx
import { useState } from 'react';
import { Check, PartyPopper } from 'lucide-react';
import { CHECKLIST } from '../../constants/cvGuide';

export const ChecklistCard = () => {
  const [done, setDone] = useState([]);

  const toggle = (index) => setDone((previous) => (previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index]));

  const total = CHECKLIST.items.length;
  const percent = Math.round((done.length / total) * 100);
  const isComplete = done.length === total;

  return (
    <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/60 to-emerald-50/60 backdrop-blur-xl shadow-[0_12px_40px_-14px_rgba(16,185,129,0.25)] p-5 sm:p-6 space-y-5">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold text-slate-900">
            {done.length} of {total} done
          </span>
          <span className="font-semibold text-emerald-600">{percent}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-200/70 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-400 transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ul className="space-y-1.5">
        {CHECKLIST.items.map(({ title, text }, index) => {
          const isDone = done.includes(index);
          return (
            <li key={title}>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-pressed={isDone}
                className={`w-full flex items-start gap-3 text-left px-3.5 py-3 rounded-2xl border transition cursor-pointer ${
                  isDone ? 'border-emerald-200 bg-emerald-50/60' : 'border-transparent hover:border-white hover:bg-white/70'
                }`}
              >
                <span
                  className={`grid place-items-center w-5 h-5 mt-0.5 shrink-0 rounded-md border transition ${
                    isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  <Check size={13} />
                </span>
                <span className="block">
                  <span className={`block text-sm font-semibold ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{title}</span>
                  <span className={`block mt-0.5 text-sm leading-relaxed ${isDone ? 'text-slate-400' : 'text-slate-600'}`}>{text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {isComplete && (
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <PartyPopper size={17} /> Ready to send. Good luck with your application.
        </p>
      )}
    </div>
  );
};