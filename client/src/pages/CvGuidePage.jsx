// client/src/pages/CvGuidePage.jsx
// Campus Hub CV Guide (freemium).
// Everyone sees the headings. Logged-out users see the detailed text and examples blurred, with a login button.
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanSearch, X, Check, ArrowRight, ShieldCheck, Sparkles, Briefcase, FolderGit2, Trophy, Wrench, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { BulletBuilder } from '../components/guide/BulletBuilder';
import { ExperienceAccordion } from '../components/guide/ExperienceAccordion';
import { PromptBlock } from '../components/guide/PromptBlock';
import { TemplateGallery } from '../components/guide/TemplateGallery';
import { ChecklistCard } from '../components/guide/ChecklistCard';
import { LockedContent, LoginButton } from '../components/guide/LockedContent';
import {
  GUIDE,
  HERO_FEATURES,
  SECTION_LINKS,
  HOW_TO,
  RULE,
  PLACEMENT,
  BULLET,
  ACTION_VERBS,
  WEAK_STRONG,
  EXPERIENCES,
  PROMPT,
  NEVER_SKIP,
  PROMPT_STEPS,
  TEMPLATES_INTRO,
  CHECKLIST,
} from '../constants/cvGuide';

// One soft glass style for every card on the page, so the whole page feels like one design
const glass = 'rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_12px_40px_-14px_rgba(79,70,229,0.22)]';
const gradientText = 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent';

const PLACEMENT_ICONS = { 'Work Experience': Briefcase, 'Experience and Activities': Sparkles, Projects: FolderGit2, Achievements: Trophy, Skills: Wrench };

const TONE_STYLES = {
  warn: 'border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-white/60',
  main: 'border-indigo-300/80 bg-gradient-to-br from-indigo-50/90 via-white/70 to-violet-50/80 ring-4 ring-indigo-100/70',
  plain: 'border-white/70 bg-gradient-to-br from-white/80 to-indigo-50/50',
};

// Soft colored light behind the whole page: there is no plain white stretch anywhere
const BLOBS = [
  { top: '-6rem', left: '-8rem', size: 'w-[36rem] h-[36rem]', color: 'bg-indigo-400/30' },
  { top: '3%', right: '-10rem', size: 'w-[34rem] h-[34rem]', color: 'bg-lime-300/35' },
  { top: '15%', left: '-12rem', size: 'w-[32rem] h-[32rem]', color: 'bg-violet-400/25' },
  { top: '30%', right: '-8rem', size: 'w-[34rem] h-[34rem]', color: 'bg-sky-300/30' },
  { top: '46%', left: '-10rem', size: 'w-[34rem] h-[34rem]', color: 'bg-fuchsia-300/25' },
  { top: '60%', right: '-10rem', size: 'w-[36rem] h-[36rem]', color: 'bg-indigo-300/30' },
  { top: '75%', left: '-8rem', size: 'w-[34rem] h-[34rem]', color: 'bg-lime-300/30' },
  { top: '88%', right: '-6rem', size: 'w-[34rem] h-[34rem]', color: 'bg-violet-300/30' },
];

const Aurora = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    {BLOBS.map(({ size, color, ...position }) => (
      <div key={`${position.top}-${color}`} style={position} className={`absolute rounded-full blur-3xl ${size} ${color}`} />
    ))}
    <div className="absolute inset-0 opacity-[0.55] [background-image:radial-gradient(#c7cdea_1px,transparent_1px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_8%,transparent_92%,black)]" />
  </div>
);

const Reveal = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionHeading = ({ no, kicker, title, children }) => (
  <div className="max-w-2xl mb-9">
    <div className="flex items-center gap-3">
      {no && <span className={`text-5xl font-extrabold leading-none tracking-tight ${gradientText}`}>{no}</span>}
      <span className="px-3 py-1 rounded-full bg-lime-300 text-slate-900 text-[11px] font-extrabold uppercase tracking-widest shadow-sm">{kicker}</span>
    </div>
    <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">{title}</h2>
    {children && <p className="mt-3 text-slate-600 leading-relaxed">{children}</p>}
  </div>
);

// A small bar shown above blurred grids: one login button for the whole group
const UnlockBar = ({ message, show }) =>
  show ? (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/90 to-violet-50/90 backdrop-blur-xl px-5 py-4 shadow-sm">
      <p className="flex items-start gap-2.5 text-sm text-indigo-900">
        <Lock size={17} className="mt-0.5 shrink-0" /> {message}
      </p>
      <LoginButton className="btn-primary whitespace-nowrap" />
    </div>
  ) : null;

// Heading stays visible, the text under it is blurred for guests
const HeadedCard = ({ heading, badge, tone = 'plain', locked, checking, children }) => {
  const Icon = PLACEMENT_ICONS[heading] || Sparkles;
  return (
    <div className={`rounded-3xl border p-5 space-y-3 backdrop-blur-xl shadow-[0_12px_40px_-18px_rgba(79,70,229,0.25)] ${TONE_STYLES[tone]}`}>
      <div className="flex items-center gap-3">
        <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-900 leading-snug">{heading}</p>
          {badge && <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-white/80 border border-indigo-100 text-[11px] font-semibold text-indigo-700">{badge}</span>}
        </div>
      </div>
      <LockedContent locked={locked} checking={checking} showAction={false}>
        {children}
      </LockedContent>
    </div>
  );
};

const MiniCv = ({ heading, entries, tone }) => (
  <div className={`rounded-2xl bg-white/90 p-4 text-sm space-y-3 border shadow-sm ${tone === 'bad' ? 'border-rose-100' : 'border-emerald-100'}`}>
    <p className="text-xs font-bold tracking-widest text-slate-500">{heading}</p>
    {entries.map(({ role, dates, org }) => (
      <div key={`${role}-${dates}`}>
        <div className="flex flex-wrap justify-between gap-x-4">
          <p className="font-semibold text-slate-900">{role}</p>
          <p className="text-xs text-slate-500">{dates}</p>
        </div>
        <p className="text-xs text-slate-500">{org}</p>
      </div>
    ))}
  </div>
);

// Decorative CV card for the hero (made-up example, drawn with plain HTML)
const HeroCvCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 26, rotate: 0 }}
    animate={{ opacity: 1, y: 0, rotate: 2.5 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="relative mx-auto w-full max-w-sm"
  >
    <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-400/40 via-violet-400/30 to-lime-300/40 blur-2xl" aria-hidden="true" />
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative rounded-3xl border border-white/80 bg-white/85 backdrop-blur-xl p-6 shadow-2xl shadow-indigo-900/20">
      <p className="text-xl font-extrabold text-slate-900">Aisha Rahman</p>
      <p className="text-xs text-indigo-600 font-medium">Marketing Graduate</p>
      <div className="mt-4 h-px bg-gradient-to-r from-indigo-300 to-transparent" />
      <p className="mt-4 text-[11px] font-extrabold tracking-widest text-indigo-700">EXPERIENCE AND ACTIVITIES</p>
      <div className="mt-3 space-y-3 text-xs text-slate-600">
        <div>
          <div className="flex justify-between font-semibold text-slate-900">
            <span>Class Representative</span>
            <span className="font-normal text-slate-400">2023 – Present</span>
          </div>
          <p className="mt-1">
            <span className="text-indigo-500">&bull;</span> Represented <span className="px-1 rounded bg-lime-200 font-semibold text-slate-900">72 classmates</span> in faculty meetings
          </p>
        </div>
        <div>
          <div className="flex justify-between font-semibold text-slate-900">
            <span>Private Tutor</span>
            <span className="font-normal text-slate-400">2021 – Present</span>
          </div>
          <p className="mt-1">
            <span className="text-indigo-500">&bull;</span> Taught Physics to <span className="px-1 rounded bg-lime-200 font-semibold text-slate-900">5 students</span>; 4 moved up one grade
          </p>
        </div>
      </div>
      <span className="absolute -top-3 -right-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-lime-300 text-slate-900 text-[11px] font-extrabold shadow-lg">
        <Check size={12} /> ATS-friendly
      </span>
    </motion.div>
  </motion.div>
);

export const CvGuidePage = () => {
  const { firebaseUser, loading } = useAuth();
  const isLocked = !firebaseUser;
  const showLoginPrompts = isLocked && !loading;

  const [activeSection, setActiveSection] = useState(SECTION_LINKS[0].id);

  // Highlights the section you are reading in the sticky menu
  useEffect(() => {
    const sections = SECTION_LINKS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) setActiveSection(target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const lockProps = { locked: isLocked, checking: loading };
  const { example } = BULLET;

  return (
    <div className="relative isolate overflow-x-clip bg-gradient-to-b from-indigo-50 via-[#f7f8ff] to-violet-50">
      <Aurora />

      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-10 sm:pt-20 sm:pb-14 grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-lime-300 text-slate-900 text-[11px] font-extrabold uppercase tracking-widest shadow-sm">Free guide</span>
              <span className="px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-white text-xs font-semibold uppercase tracking-wider text-slate-500">{GUIDE.audience}</span>
            </div>

            <div>
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.04]">
                Campus Hub <span className={`inline-block whitespace-nowrap ${gradientText}`}>CV Guide</span>
              </h1>
              <p className="mt-4 text-xl sm:text-2xl font-semibold text-slate-700 leading-snug">{GUIDE.subtitle}</p>
              <p className="mt-2 text-base sm:text-lg text-slate-500 leading-relaxed">{GUIDE.tagline}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {loading ? (
                <span className="skeleton inline-block h-12 w-64 rounded-xl" aria-hidden="true" />
              ) : isLocked ? (
                <LoginButton className="btn-primary !py-3.5 !px-6 !text-base" />
              ) : (
                <>
                  <Link to="#start" className="btn-primary !py-3.5 !px-6 !text-base">
                    <Sparkles size={17} /> Start reading
                  </Link>
                  <Link to="/resume-checker" className="btn-secondary !py-3.5">
                    <ScanSearch size={16} /> Check my CV
                  </Link>
                </>
              )}
            </div>
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={15} /> {isLocked ? 'Free for every student. A free account unlocks the whole guide.' : 'You are logged in. The whole guide is unlocked.'}
            </p>
          </motion.div>

          <HeroCvCard />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20 grid md:grid-cols-3 gap-4">
          {HERO_FEATURES.map(({ value, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + index * 0.1 }}
              className={`${glass} flex items-center gap-5 p-5`}
            >
              <span className={`shrink-0 whitespace-nowrap text-5xl sm:text-6xl font-extrabold leading-none min-w-[3.5rem] text-center ${gradientText}`}>{value}</span>
              <div>
                <p className="font-bold text-slate-900 leading-snug">{title}</p>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sticky section menu */}
      <nav aria-label="Guide sections" className="sticky top-16 z-30 border-y border-white/70 bg-white/65 backdrop-blur-xl shadow-sm shadow-indigo-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {SECTION_LINKS.map(({ id, label }) => (
            <Link
              key={id}
              to={`#${id}`}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                activeSection === id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-28 sm:space-y-36">
        {/* 1. How to use */}
        <section id="start" className="scroll-mt-32">
          <Reveal>
            <SectionHeading no="01" kicker="How to use this guide" title={HOW_TO.title}>
              {HOW_TO.subtitle}
            </SectionHeading>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOW_TO.steps.map(({ no, title, text }) => (
                <li key={no} className={`${glass} p-6 space-y-3 hover:-translate-y-1 hover:shadow-2xl transition duration-300`}>
                  <p className={`text-5xl font-extrabold leading-none ${gradientText}`}>{no}</p>
                  <h3 className="font-bold text-slate-900 leading-snug">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex flex-wrap gap-x-2 text-sm text-slate-700 bg-gradient-to-r from-lime-200/80 to-lime-100/70 border border-lime-300 rounded-2xl px-5 py-4 leading-relaxed shadow-sm">
              <span className="font-bold text-slate-900">{HOW_TO.remember.title}:</span> {HOW_TO.remember.text}
            </p>
          </Reveal>
        </section>

        {/* 2. The rule */}
        <section id="rule" className="scroll-mt-32">
          <Reveal>
            <SectionHeading no="02" kicker={RULE.kicker} title={RULE.title}>
              {RULE.subtitle}
            </SectionHeading>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/90 via-white/60 to-white/50 backdrop-blur-xl p-6 space-y-4 shadow-[0_12px_40px_-18px_rgba(244,63,94,0.35)]">
                <p className="flex items-center gap-2 text-sm font-bold text-rose-700">
                  <span className="grid place-items-center w-6 h-6 rounded-full bg-rose-100"><X size={14} /></span> {RULE.wrong.label}
                </p>
                <MiniCv heading={RULE.wrong.heading} entries={RULE.wrong.entries} tone="bad" />
                {RULE.wrong.notes.map((note) => (
                  <p key={note} className="text-sm text-slate-600 leading-relaxed">
                    {note}
                  </p>
                ))}
              </div>
              <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 via-white/60 to-white/50 backdrop-blur-xl p-6 space-y-4 shadow-[0_12px_40px_-18px_rgba(16,185,129,0.4)]">
                <p className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                  <span className="grid place-items-center w-6 h-6 rounded-full bg-emerald-100"><Check size={14} /></span> {RULE.right.label}
                </p>
                <MiniCv heading={RULE.right.heading} entries={RULE.right.entries} tone="good" />
                {RULE.right.notes.map((note) => (
                  <p key={note} className="text-sm text-slate-600 leading-relaxed">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* 3. What goes where */}
        <section id="sections" className="scroll-mt-32">
          <Reveal>
            <SectionHeading no="03" kicker={PLACEMENT.kicker} title={PLACEMENT.title} />
            <UnlockBar show={showLoginPrompts} message="Login to read what goes in every section." />

            <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {PLACEMENT.items.map(({ heading, badge, tone, text }, index) => (
                <div key={heading} className={index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
                  <HeadedCard heading={heading} badge={badge} tone={tone} {...lockProps}>
                    <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
                  </HeadedCard>
                </div>
              ))}
            </div>

            <div className="mt-5 grid md:grid-cols-2 gap-5">
              {PLACEMENT.why.map(({ title, text }) => (
                <div key={title} className={`${glass} p-6 space-y-3`}>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <LockedContent {...lockProps} showAction={false}>
                    <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
                  </LockedContent>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-rose-200/80 bg-gradient-to-br from-white/80 to-rose-50/60 backdrop-blur-xl p-6 space-y-3 shadow-[0_12px_40px_-18px_rgba(244,63,94,0.3)]">
              <h3 className="font-bold text-rose-700">{PLACEMENT.never.title}</h3>
              <ul className="grid md:grid-cols-3 gap-3">
                {PLACEMENT.never.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 rounded-xl bg-white/70 border border-rose-100 px-3.5 py-3">
                    <span className="grid place-items-center w-5 h-5 mt-0.5 shrink-0 rounded-full bg-rose-100 text-rose-600">
                      <X size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* 4. The bullet formula */}
        <section id="bullets" className="scroll-mt-32">
          <Reveal>
            <SectionHeading no="04" kicker={BULLET.kicker} title={BULLET.title} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {BULLET.parts.map(({ no, title, text, style }) => (
                <div key={no} className={`rounded-2xl p-4 sm:p-5 space-y-1.5 shadow-lg shadow-slate-900/5 ${style}`}>
                  <p className="text-xs font-extrabold opacity-70">{no}</p>
                  <p className="font-bold leading-snug">{title}</p>
                  <p className="text-xs opacity-80">{text}</p>
                </div>
              ))}
            </div>

            <div className={`${glass} mt-5 p-5 sm:p-6 space-y-3`}>
              <p className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                <span className="px-2.5 py-1 rounded-lg bg-lime-300 font-bold text-slate-900">{example.verb}</span>
                <span className="px-2.5 py-1 rounded-lg border-2 border-slate-900 bg-white/70 font-medium text-slate-900">{example.work}</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 font-medium text-white">{example.number}</span>
                <span className="px-2.5 py-1 rounded-lg border-2 border-dashed border-slate-900 bg-white/70 font-medium text-slate-900">{example.result}</span>
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">{BULLET.note}</p>
            </div>

            <div className="mt-8 grid lg:grid-cols-2 gap-6 items-stretch">
              <BulletBuilder />

              <div className="space-y-5">
                <div className={`${glass} p-6 space-y-3`}>
                  <h3 className="font-bold text-slate-900">{BULLET.whereNumbers.title}</h3>
                  <ul className="space-y-2.5">
                    {BULLET.whereNumbers.items.map(({ label, text }) => (
                      <li key={label} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-indigo-500" />
                        <span>
                          <span className="font-semibold text-slate-900">{label}:</span> {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`${glass} p-6 space-y-3`}>
                  <h3 className="font-bold text-slate-900">{BULLET.verbsTitle}</h3>
                  <div className="flex flex-wrap gap-2">
                    {ACTION_VERBS.map((verb) => (
                      <span key={verb} className="px-3 py-1 rounded-lg bg-white/80 border border-white text-sm font-medium text-slate-700 shadow-sm">
                        {verb}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-rose-200/80 bg-gradient-to-br from-white/80 to-rose-50/60 backdrop-blur-xl p-6 space-y-4 shadow-[0_12px_40px_-18px_rgba(244,63,94,0.3)]">
              <h3 className="font-bold text-rose-700">{BULLET.badStarts.title}</h3>
              <ul className="grid md:grid-cols-3 gap-3">
                {BULLET.badStarts.items.map(({ phrase, why }) => (
                  <li key={phrase} className="rounded-2xl border border-rose-100 bg-white/70 p-4">
                    <p className="text-sm font-semibold text-rose-700">&ldquo;{phrase}&rdquo;</p>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{why}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weak vs strong: heading visible, examples locked */}
            <div className="mt-16">
              <SectionHeading kicker={WEAK_STRONG.kicker} title={WEAK_STRONG.title}>
                {WEAK_STRONG.subtitle}
              </SectionHeading>
              <LockedContent {...lockProps}>
                <ul className="space-y-3">
                  {WEAK_STRONG.pairs.map(({ weak, strong, note }) => (
                    <li key={weak} className="rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl overflow-hidden shadow-md shadow-indigo-900/5">
                      <p className="flex items-start gap-3 px-4 py-3 text-sm bg-gradient-to-r from-rose-50 to-rose-50/30 text-rose-700">
                        <span className="shrink-0 w-12 text-xs font-bold uppercase tracking-wider pt-0.5">দুর্বল</span> {weak}
                      </p>
                      <p className="flex items-start gap-3 px-4 py-3 text-sm bg-gradient-to-r from-emerald-50 to-emerald-50/30 text-emerald-800">
                        <span className="shrink-0 w-12 text-xs font-bold uppercase tracking-wider pt-0.5">শক্ত</span> {strong}
                      </p>
                      <p className="px-4 py-2.5 text-sm text-slate-500 border-t border-slate-100 leading-relaxed">{note}</p>
                    </li>
                  ))}
                </ul>
              </LockedContent>
            </div>
          </Reveal>
        </section>

        {/* 5. 20 small experiences */}
        <section id="ideas" className="scroll-mt-32">
          <Reveal>
            <SectionHeading no="05" kicker={EXPERIENCES.kicker} title={EXPERIENCES.title}>
              {EXPERIENCES.subtitle}
            </SectionHeading>

            <div className="mb-6 grid md:grid-cols-2 gap-4">
              <p className="text-sm text-amber-900 bg-gradient-to-br from-amber-100/80 to-amber-50/70 border border-amber-200 rounded-2xl px-5 py-4 leading-relaxed shadow-sm">
                <span className="font-bold">{EXPERIENCES.importantTitle}:</span> {EXPERIENCES.important}
              </p>
              <p className="text-sm text-slate-700 bg-white/65 backdrop-blur-xl border border-white/80 rounded-2xl px-5 py-4 leading-relaxed shadow-sm">{EXPERIENCES.dateTip}</p>
            </div>

            <UnlockBar show={showLoginPrompts} message="Login to open all 20 examples and see the numbers to find." />
            <ExperienceAccordion {...lockProps} />
          </Reveal>
        </section>

        {/* 6. Claude prompt */}
        <section id="prompt" className="scroll-mt-32">
          <Reveal>
            <SectionHeading no="06" kicker={PROMPT.kicker} title={PROMPT.title}>
              {PROMPT.subtitle}
            </SectionHeading>

            <LockedContent {...lockProps}>
              <div className="space-y-3">
                <PromptBlock label={PROMPT.boxLabel} text={PROMPT.text} />
                <p className="text-sm text-slate-600 leading-relaxed">{PROMPT.phoneTip}</p>
              </div>
            </LockedContent>

            {/* Never skip this line (free) */}
            <div className="mt-20">
              <SectionHeading kicker={NEVER_SKIP.kicker} title={NEVER_SKIP.title} />
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-9 shadow-2xl shadow-slate-900/25">
                <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-lime-300/20 blur-3xl" aria-hidden="true" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-indigo-500/30 blur-3xl" aria-hidden="true" />
                <p className="relative text-lg sm:text-2xl font-semibold leading-relaxed text-lime-200">{NEVER_SKIP.line}</p>
              </div>

              <ol className="mt-5 grid md:grid-cols-3 gap-4">
                {NEVER_SKIP.reasons.map(({ title, text }, index) => (
                  <li key={title} className={`${glass} p-6 space-y-2.5`}>
                    <p className="grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30">{index + 1}</p>
                    <h3 className="font-bold text-slate-900 leading-snug">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-5 grid md:grid-cols-2 gap-5 items-start">
                <div className={`${glass} p-6 space-y-3`}>
                  <h3 className="font-bold text-slate-900">{NEVER_SKIP.checkTitle}</h3>
                  <ul className="space-y-2">
                    {NEVER_SKIP.checkItems.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-rose-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 px-1">{NEVER_SKIP.followUpTitle}</h3>
                  <PromptBlock label="Follow-up prompt" text={NEVER_SKIP.followUp} compact />
                </div>
              </div>
            </div>

            {/* Step by step: heading visible, steps locked */}
            <div className="mt-20">
              <SectionHeading kicker={PROMPT_STEPS.kicker} title={PROMPT_STEPS.title} />
              <LockedContent {...lockProps}>
                <ol className="grid lg:grid-cols-2 gap-4 items-start">
                  {PROMPT_STEPS.steps.map(({ title, text, code }, index) => (
                    <li key={title} className={`${glass} p-5 flex gap-4`}>
                      <span className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30">{index + 1}</span>
                      <div className="min-w-0 flex-1 space-y-2.5">
                        <h3 className="font-bold text-slate-900 leading-snug">{title}</h3>
                        {code && <PromptBlock label="Prompt" text={code} compact />}
                        {text && <p className="text-sm text-slate-600 leading-relaxed">{text}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </LockedContent>
            </div>
          </Reveal>
        </section>

        {/* 7. Templates */}
        <section id="templates" className="scroll-mt-32">
          <Reveal>
            <SectionHeading no="07" kicker={TEMPLATES_INTRO.kicker} title={TEMPLATES_INTRO.title}>
              {TEMPLATES_INTRO.subtitle}
            </SectionHeading>
            <TemplateGallery {...lockProps} />
          </Reveal>
        </section>

        {/* 8. Checklist */}
        <section id="checklist" className="scroll-mt-32">
          <Reveal>
            <SectionHeading no="08" kicker={CHECKLIST.kicker} title={CHECKLIST.title} />
            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 items-start">
              <ChecklistCard />

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-7 sm:p-9 space-y-5 shadow-2xl shadow-slate-900/25">
                <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-lime-300/20 blur-3xl" aria-hidden="true" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-violet-500/30 blur-3xl" aria-hidden="true" />
                <h3 className="relative text-2xl sm:text-3xl font-extrabold tracking-tight">{CHECKLIST.closingTitle}</h3>
                <p className="relative text-slate-300 leading-relaxed">{CHECKLIST.closing}</p>
                <div className="relative flex flex-wrap gap-3">
                  {showLoginPrompts ? (
                    <LoginButton className="btn-primary !bg-lime-300 !text-slate-900 !shadow-none hover:!bg-lime-200" />
                  ) : (
                    <Link to="/resume-checker" className="btn-primary !bg-lime-300 !text-slate-900 !shadow-none hover:!bg-lime-200">
                      <ScanSearch size={16} /> Check my CV <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-12 text-xs text-slate-500 leading-relaxed max-w-3xl">
              Made for Campus Hub students. All names, numbers and results in the examples are made up. Never copy them into your own CV.
            </p>
          </Reveal>
        </section>
      </div>
    </div>
  );
};