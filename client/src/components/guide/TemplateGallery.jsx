// client/src/components/guide/TemplateGallery.jsx
// 22 CV templates in two tabs (ATS-Friendly 13, Two-Column 9). Each card shows a live preview of the PDF,
// views and love counts, and a "Download or open" button. Guests see blurred previews and "Sign in to download".
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { LoginButton } from './LockedContent';
import { TemplateCard, LayoutBadge } from './TemplateCard';
import { useTemplateStats } from '../../hooks/useTemplateStats';
import { resolveTemplateUrl } from '../../lib/templateFiles';
import { TEMPLATES, TEMPLATE_TABS, TEMPLATE_ADVICE, TEMPLATE_LAYOUTS } from '../../constants/cvGuide';

export const TemplateGallery = ({ locked, checking }) => {
  const [tab, setTab] = useState('ats');
  // undefined = still looking for the PDF file, null = file not found, string = the PDF url
  const [urls, setUrls] = useState({});
  const { stats, lovedIds, trackView, toggleLove } = useTemplateStats();

  useEffect(() => {
    let cancelled = false;
    TEMPLATES.forEach(({ id }) => {
      resolveTemplateUrl(id).then((url) => {
        if (!cancelled) setUrls((previous) => ({ ...previous, [id]: url }));
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () => ({ ats: TEMPLATES.filter(({ ats }) => ats).length, 'two-column': TEMPLATES.filter(({ ats }) => !ats).length }),
    []
  );
  const visible = TEMPLATES.filter(({ ats }) => (tab === 'ats' ? ats : !ats));
  const activeTab = TEMPLATE_TABS.find(({ id }) => id === tab);

  return (
    <div className="space-y-6">
      {/* Advice */}
      <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-indigo-50/60 to-violet-50/60 backdrop-blur-xl p-5 sm:p-6 shadow-[0_12px_40px_-14px_rgba(79,70,229,0.22)]">
        <h3 className="text-lg font-extrabold text-slate-900">{TEMPLATE_ADVICE.title}</h3>
        <ul className="mt-3 grid md:grid-cols-3 gap-4">
          {TEMPLATE_ADVICE.items.map((item, index) => (
            <li key={item} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
              <span className="grid place-items-center w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xs font-bold">{index + 1}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Login bar for guests */}
      {locked && !checking && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/90 to-violet-50/90 backdrop-blur-xl px-5 py-4"
        >
          <p className="flex items-start gap-2.5 text-sm text-indigo-900">
            <Lock size={17} className="mt-0.5 shrink-0" /> Login to see the clear previews and download every template.
          </p>
          <LoginButton className="btn-primary whitespace-nowrap" />
        </motion.div>
      )}

      {/* Tabs */}
      <div className="space-y-3">
        <div className="inline-flex p-1 rounded-2xl bg-white/60 backdrop-blur border border-white/80 shadow-sm" role="tablist">
          {TEMPLATE_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                tab === id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {label} ({counts[id]})
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-500">{activeTab.hint}</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {visible.map((template, index) => (
          <TemplateCard
            key={`${tab}-${template.id}`}
            template={template}
            index={index}
            url={urls[template.id]}
            isSignedIn={!locked && !checking}
            checking={checking}
            views={stats[template.id]?.views ?? 0}
            loves={stats[template.id]?.loves ?? 0}
            isLoved={lovedIds.includes(template.id)}
            onLove={toggleLove}
            onOpen={trackView}
          />
        ))}
      </div>

      {/* 7 layouts */}
      <div className="space-y-3 pt-6">
        <h3 className="text-lg font-extrabold text-slate-900">{TEMPLATE_LAYOUTS.title}</h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATE_LAYOUTS.items.map(({ name, ats, text, numbers }) => (
            <li key={name} className="rounded-2xl border border-white/70 bg-white/60 backdrop-blur-xl p-4 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-900">{name}</p>
                <LayoutBadge ats={ats} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
              <p className="text-xs font-semibold text-indigo-600">Templates: {numbers}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};