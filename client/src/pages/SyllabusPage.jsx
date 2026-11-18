// client/src/pages/SyllabusPage.jsx
// Syllabus tracker: pick a department and semester, tick topics as you finish them.
// Everything (selection, ticks, your own topics) is saved in this browser only.
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Plus, X, ImageDown, RotateCcw, ShieldCheck, ListChecks, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { renderSyllabusReport, downloadCanvas } from '../utils/reportImage';
import { DEPARTMENTS_WITH_SYLLABUS, SEMESTER_COUNT, getSemesterCourses, semesterLabel } from '../constants/syllabusData';

const STORAGE_KEY = 'campushub:syllabus:v1';

const makeInitialData = () => ({
  selection: { department: '', semester: 0 },
  checked: {}, // { "CSE-2": { "CSE-1201": ["Topic", ...] } }
  custom: {}, // your own topics, same shape
  focus: {}, // { "CSE-2": ["CSE-1201", ...] } courses you picked for the next exam
});

const percentOf = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0);
const barColor = (percent) => (percent >= 70 ? 'bg-emerald-500' : percent >= 40 ? 'bg-amber-500' : 'bg-rose-500');
const textColor = (percent) => (percent >= 70 ? 'text-emerald-600' : percent >= 40 ? 'text-amber-600' : 'text-rose-600');

const ProgressBar = ({ percent, label }) => (
  <div
    className="h-2 rounded-full bg-slate-100 overflow-hidden"
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label}
  >
    <div className={`h-full rounded-full transition-all duration-500 ${barColor(percent)}`} style={{ width: `${percent}%` }} />
  </div>
);

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer ${
      active ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
    }`}
  >
    {children}
  </button>
);

const CourseCard = ({ course, topics, doneTopics, isOpen, inFocus, onToggleOpen, onToggleTopic, onSetAll, onToggleFocus, onAddCustom, onRemoveCustom }) => {
  const [draft, setDraft] = useState('');
  const total = topics.length;
  const done = topics.filter(({ text }) => doneTopics.includes(text)).length;
  const percent = percentOf(done, total);

  const submitCustom = (e) => {
    e.preventDefault();
    if (onAddCustom(draft)) setDraft('');
  };

  return (
    <section className="card overflow-hidden">
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={isOpen}
        className="w-full text-left p-4 sm:p-5 flex items-start gap-3 cursor-pointer hover:bg-slate-50/60 transition"
      >
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="chip font-mono">{course.code}</span>
            <h3 className="font-bold text-slate-900 leading-snug">{course.name}</h3>
            <span className="text-xs text-slate-400">{course.credit} cr</span>
          </div>
          <ProgressBar percent={percent} label={`${course.name} progress`} />
          <p className="text-xs text-slate-500">
            {done} of {total} topics done
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-lg font-extrabold ${textColor(percent)}`}>{percent}%</span>
          <ChevronDown size={18} className={`text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 border-t border-slate-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={inFocus} onChange={onToggleFocus} className="w-4 h-4 rounded border-slate-300 accent-indigo-600" />
              Include in my exam focus
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => onSetAll(true)} className="btn-secondary !py-1.5 !text-xs">
                Mark all done
              </button>
              <button type="button" onClick={() => onSetAll(false)} className="btn-secondary !py-1.5 !text-xs">
                Clear
              </button>
            </div>
          </div>

          <ul className="space-y-1.5">
            {topics.map(({ text, isCustom }) => {
              const checked = doneTopics.includes(text);
              return (
                <li key={text} className="flex items-center gap-2">
                  <label
                    className={`flex-1 min-w-0 flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition ${
                      checked ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleTopic(text)}
                      className="mt-0.5 w-4 h-4 shrink-0 rounded border-slate-300 accent-emerald-600"
                    />
                    <span className={`text-sm leading-snug break-words ${checked ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {text}
                      {isCustom && <span className="ml-2 chip !py-0 !text-[10px] align-middle">yours</span>}
                    </span>
                  </label>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => onRemoveCustom(text)}
                      aria-label={`Remove your topic ${text}`}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <form onSubmit={submitCustom} className="flex gap-2">
            <input
              type="text"
              value={draft}
              maxLength={80}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add your own topic (your teacher may differ from this list)"
              aria-label={`Add a topic to ${course.name}`}
              className="input !py-2"
            />
            <button type="submit" className="btn-secondary !px-3" aria-label="Add topic">
              <Plus size={16} />
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export const SyllabusPage = () => {
  const [data, setData] = useLocalStorage(STORAGE_KEY, makeInitialData);
  const [openCodes, setOpenCodes] = useState([]);
  const [resetOpen, setResetOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const { department, semester } = data.selection;
  const hasSelection = Boolean(department) && semester > 0;
  const semKey = `${department}-${semester}`;

  const select = (changes) => {
    setOpenCodes([]);
    setData((prev) => ({ ...prev, selection: { ...prev.selection, ...changes } }));
  };

  // Course topics + the topics you added, with progress for each course
  const courses = useMemo(() => {
    if (!hasSelection) return [];
    return getSemesterCourses(department, semester).map((course) => {
      const own = data.custom[semKey]?.[course.code] ?? [];
      const topics = [...course.topics.map((text) => ({ text, isCustom: false })), ...own.map((text) => ({ text, isCustom: true }))];
      const doneTopics = data.checked[semKey]?.[course.code] ?? [];
      const done = topics.filter(({ text }) => doneTopics.includes(text)).length;
      return { course, topics, doneTopics, done, total: topics.length, percent: percentOf(done, topics.length) };
    });
  }, [hasSelection, department, semester, semKey, data.custom, data.checked]);

  const overall = useMemo(() => {
    const done = courses.reduce((sum, c) => sum + c.done, 0);
    const total = courses.reduce((sum, c) => sum + c.total, 0);
    return { done, total, percent: percentOf(done, total) };
  }, [courses]);

  const focusCodes = useMemo(() => data.focus[semKey] ?? [], [data.focus, semKey]);
  const focusStats = useMemo(() => {
    const picked = courses.filter(({ course }) => focusCodes.includes(course.code));
    const done = picked.reduce((sum, c) => sum + c.done, 0);
    const total = picked.reduce((sum, c) => sum + c.total, 0);
    return { count: picked.length, done, total, percent: percentOf(done, total) };
  }, [courses, focusCodes]);

  // ---- updates (immutable, so React and localStorage both see the change)
  const updateNested = (field, code, updater) =>
    setData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [semKey]: { ...prev[field][semKey], [code]: updater(prev[field][semKey]?.[code] ?? []) } },
    }));

  const toggleTopic = (code, topic) =>
    updateNested('checked', code, (list) => (list.includes(topic) ? list.filter((item) => item !== topic) : [...list, topic]));

  const setAll = (code, topics, value) => updateNested('checked', code, () => (value ? topics.map(({ text }) => text) : []));

  const addCustom = (code, rawText, existingTopics) => {
    const text = rawText.trim().slice(0, 80);
    if (!text) return false;
    if (existingTopics.some((item) => item.text.toLowerCase() === text.toLowerCase())) {
      toast.error('This topic is already in the list.');
      return false;
    }
    updateNested('custom', code, (list) => [...list, text]);
    return true;
  };

  const removeCustom = (code, topic) => {
    updateNested('custom', code, (list) => list.filter((item) => item !== topic));
    updateNested('checked', code, (list) => list.filter((item) => item !== topic));
  };

  const toggleFocus = (code) =>
    setData((prev) => {
      const current = prev.focus[semKey] ?? [];
      return { ...prev, focus: { ...prev.focus, [semKey]: current.includes(code) ? current.filter((c) => c !== code) : [...current, code] } };
    });

  const toggleOpen = (code) => setOpenCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));

  const resetProgress = () => {
    setData((prev) => ({ ...prev, checked: { ...prev.checked, [semKey]: {} } }));
    setResetOpen(false);
    toast.success('Progress for this semester was cleared.');
  };

  const saveImage = async () => {
    setBusy(true);
    try {
      const canvas = await renderSyllabusReport({
        department,
        semesterLabel: semesterLabel(semester),
        overall,
        focus: focusStats.count > 0 ? focusStats : null,
        courses: courses.map(({ course, done, total, percent }) => ({ code: course.code, name: course.name, done, total, percent })),
      });
      await downloadCanvas(canvas, `syllabus-${department}-semester-${semester}.png`);
      toast.success('Progress image saved.');
    } catch (error) {
      toast.error(error.message || 'Could not create the image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-white via-white to-indigo-50/40">
        <div className="bg-dots absolute inset-0" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Syllabus Tracker</h1>
            <p className="mt-3 text-slate-500 max-w-2xl leading-relaxed">
              Choose your department and semester, then tick each topic when you finish it. See how much of every course, and of the whole
              semester, is covered before the exam.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
              <ShieldCheck size={14} /> Saved only in this browser. Nothing is sent to any server.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Pickers */}
        <div className="card p-4 sm:p-5 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">1. Department</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Department">
              {DEPARTMENTS_WITH_SYLLABUS.map((item) => (
                <Chip key={item} active={department === item} onClick={() => select({ department: item })}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">2. Semester</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Semester">
              {Array.from({ length: SEMESTER_COUNT }, (_, i) => i + 1).map((item) => (
                <Chip key={item} active={semester === item} onClick={() => select({ semester: item })}>
                  Semester {item}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {!hasSelection && (
          <EmptyState variant="search" title="Pick a department and a semester" text="The syllabus for your choice appears here. Your choice and your ticks are remembered on this device." />
        )}

        {hasSelection && (
          <>
            <div role="note" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
              <Info size={17} className="mt-0.5 shrink-0" />
              <p>
                This is a starter list of typical topics. Your teacher or college may use a different one, so check the official syllabus and
                use &quot;Add your own topic&quot; inside any course.
              </p>
            </div>

            {/* Overall progress */}
            <section className="card p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">
                    {department} &middot; {semesterLabel(semester)}
                  </p>
                  <p className="mt-1 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                    <span className={textColor(overall.percent)}>{overall.percent}%</span>
                    <span className="text-base sm:text-lg font-semibold text-slate-400 ml-2">of the semester covered</span>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {overall.done} of {overall.total} topics in {courses.length} courses
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={saveImage} disabled={busy} className="btn-primary">
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <ImageDown size={16} />} Save as image
                  </button>
                  <button type="button" onClick={() => setResetOpen(true)} className="btn-secondary">
                    <RotateCcw size={15} /> Reset ticks
                  </button>
                </div>
              </div>
              <ProgressBar percent={overall.percent} label="Whole semester progress" />

              {focusStats.count > 0 && (
                <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-indigo-900 inline-flex items-center gap-2">
                    <ListChecks size={16} /> Exam focus: {focusStats.count} course{focusStats.count === 1 ? '' : 's'} selected
                  </p>
                  <p className="text-sm font-bold text-indigo-700">
                    {focusStats.percent}% covered ({focusStats.done}/{focusStats.total} topics)
                  </p>
                </div>
              )}
            </section>

            {/* Courses */}
            <div className="space-y-4">
              {courses.map(({ course, topics, doneTopics }) => (
                <CourseCard
                  key={course.code}
                  course={course}
                  topics={topics}
                  doneTopics={doneTopics}
                  isOpen={openCodes.includes(course.code)}
                  inFocus={focusCodes.includes(course.code)}
                  onToggleOpen={() => toggleOpen(course.code)}
                  onToggleTopic={(topic) => toggleTopic(course.code, topic)}
                  onSetAll={(value) => setAll(course.code, topics, value)}
                  onToggleFocus={() => toggleFocus(course.code)}
                  onAddCustom={(text) => addCustom(course.code, text, topics)}
                  onRemoveCustom={(topic) => removeCustom(course.code, topic)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Modal isOpen={resetOpen} onClose={() => setResetOpen(false)} title="Reset this semester?" size="sm">
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            All ticks for {department} semester {semester} will be cleared. Your own topics and exam focus choices stay.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setResetOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={resetProgress} className="btn-danger">
              Clear ticks
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};