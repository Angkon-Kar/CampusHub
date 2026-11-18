// client/src/components/guide/ExperienceAccordion.jsx
// The "20 small experiences": titles are always visible, details open on click (and are blurred for guests).
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Hash } from 'lucide-react';
import { EXPERIENCES } from '../../constants/cvGuide';
import { LockedContent } from './LockedContent';

const AccordionItem = ({ item, isOpen, onToggle, locked, checking }) => {
  const { no, title, why, role, dates, org, bullets, find } = item;
  const panelId = `experience-panel-${no}`;

  return (
    <div
      className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
        isOpen
          ? 'border-indigo-300/70 bg-gradient-to-br from-white/85 to-indigo-50/70 shadow-[0_14px_40px_-14px_rgba(79,70,229,0.35)]'
          : 'border-white/70 bg-white/60 shadow-sm hover:bg-white/80 hover:shadow-md'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center gap-3.5 text-left px-4 py-3.5 cursor-pointer"
      >
        <span
          className={`grid place-items-center w-10 h-10 shrink-0 rounded-xl text-xs font-extrabold transition ${
            isOpen ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-100'
          }`}
        >
          {no}
        </span>
        <span className="flex-1 text-sm font-semibold text-slate-900 leading-snug">{title}</span>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <LockedContent locked={locked} checking={checking}>
                <div className="space-y-4 pt-1">
                  <p className="text-sm text-slate-600 leading-relaxed">{why}</p>

                  <div className="rounded-2xl border border-white bg-white/90 shadow-sm p-4 space-y-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">{EXPERIENCES.howTo}</p>
                    <div>
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-0.5">
                        <p className="text-sm font-bold text-slate-900">{role}</p>
                        <p className="text-xs text-slate-500">{dates}</p>
                      </div>
                      <p className="text-xs text-slate-500">{org}</p>
                    </div>
                    <ul className="space-y-1.5 list-disc pl-5 marker:text-indigo-400 text-sm text-slate-700 leading-relaxed">
                      {bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed bg-gradient-to-r from-indigo-100/70 to-violet-100/60 border border-indigo-200/60 rounded-xl px-3.5 py-3">
                    <Hash size={15} className="mt-0.5 shrink-0 text-indigo-600" />
                    <span>
                      <span className="font-semibold text-slate-900">{EXPERIENCES.findLabel}:</span> {find}
                    </span>
                  </p>
                </div>
              </LockedContent>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ExperienceAccordion = ({ locked, checking }) => {
  const [openNo, setOpenNo] = useState(EXPERIENCES.items[0].no);

  const renderItem = (item) => (
    <AccordionItem
      key={item.no}
      item={item}
      isOpen={openNo === item.no}
      onToggle={() => setOpenNo((current) => (current === item.no ? null : item.no))}
      locked={locked}
      checking={checking}
    />
  );

  // Two independent columns (01 to 10, then 11 to 20). Opening an item only moves its own column, so no empty gap appears.
  // On phones the columns stack, which keeps the order 01 to 20.
  const half = Math.ceil(EXPERIENCES.items.length / 2);

  return (
    <div className="grid lg:grid-cols-2 gap-x-3.5 gap-y-3.5 items-start">
      <div className="space-y-3.5">{EXPERIENCES.items.slice(0, half).map(renderItem)}</div>
      <div className="space-y-3.5">{EXPERIENCES.items.slice(half).map(renderItem)}</div>
    </div>
  );
};