// client/src/pages/ResumeCheckerPage.jsx
// Free ATS resume checker. The resume is read and scored inside the browser: nothing is uploaded to our server.
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, X, ShieldCheck, Loader2, History, Trash2, ScanSearch, BookOpen, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { AtsReport } from '../components/ats/AtsReport';
import { LockedContent } from '../components/guide/LockedContent';
import { useAuth } from '../hooks/useAuth';
import ATSData from '../lib/ats/data/index.js';
import {
  analyzeResume,
  readResumeFile,
  loadHistory,
  saveReport,
  deleteReport,
  clearHistory,
  ROLE_CATEGORIES,
  MAX_FILE_SIZE,
} from '../lib/ats/index.js';

const { atsRules } = ATSData;
const SENIORITY_OPTIONS = Object.keys(atsRules.seniorityExpectedYears);
const COUNTRY_OPTIONS = Object.keys(atsRules.countryConventions);
const PROFILE_OPTIONS = Object.entries(atsRules.atsProfiles).map(([id, { label }]) => ({ id, label }));
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt'];
const MIN_RESUME_CHARACTERS = 80;

const formatSize = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const isAcceptedFile = ({ name = '' }) => ACCEPTED_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));

const ReportSkeleton = ({ message }) => (
  <div className="space-y-6" aria-busy="true">
    <p className="flex items-center gap-2 text-sm text-slate-500">
      <Loader2 size={16} className="animate-spin text-indigo-600" /> {message}
    </p>
    <div className="card p-6 flex gap-6 items-center">
      <div className="skeleton w-36 h-36 rounded-full shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="skeleton h-6 w-1/2 rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-10 w-2/3 rounded-xl" />
      </div>
    </div>
    <div className="card p-6 space-y-3">
      <div className="skeleton h-5 w-40 rounded-lg" />
      <div className="skeleton h-3 rounded" />
      <div className="skeleton h-3 w-5/6 rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  </div>
);

// Shown blurred behind the lock for guests, so the history card does not look empty
const SAMPLE_HISTORY = [
  { id: 'sample-1', role: 'Software Engineer', overallScore: 82, fileName: 'my-cv.pdf', createdAt: '2026-11-10T10:00:00Z' },
  { id: 'sample-2', role: 'Full Stack Developer', overallScore: 74, fileName: 'my-cv-v2.pdf', createdAt: '2026-11-06T10:00:00Z' },
  { id: 'sample-3', role: 'Data Analyst', overallScore: 68, fileName: 'my-cv-v1.pdf', createdAt: '2026-11-02T10:00:00Z' },
];

export const ResumeCheckerPage = () => {
  const fileInputRef = useRef(null);
  // Guests can open this page, but the checker and the history are locked until they log in
  const { firebaseUser, loading: authLoading } = useAuth();
  const isLocked = !firebaseUser;

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jdText, setJdText] = useState('');
  const [options, setOptions] = useState({
    categoryId: ROLE_CATEGORIES[0].id,
    roleName: ROLE_CATEGORIES[0].roles[0],
    seniority: 'Entry / Junior',
    country: 'Bangladesh',
    atsProfileKey: 'generic',
  });
  const [status, setStatus] = useState({ phase: 'idle', message: '' }); // idle | working
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  const { categoryId, roleName, seniority, country, atsProfileKey } = options;
  const category = ROLE_CATEGORIES.find(({ id }) => id === categoryId) || ROLE_CATEGORIES[0];
  const isWorking = status.phase === 'working';

  const setOption = (key, value) => setOptions((previous) => ({ ...previous, [key]: value }));

  const handleCategoryChange = (id) => {
    const next = ROLE_CATEGORIES.find((item) => item.id === id) || ROLE_CATEGORIES[0];
    setOptions((previous) => ({ ...previous, categoryId: next.id, roleName: next.roles[0] }));
  };

  const chooseFile = (selected) => {
    if (isLocked) return toast.error('Please login to use the resume checker.');
    if (!selected) return;
    if (!isAcceptedFile(selected)) return toast.error('Please upload a PDF, DOCX or TXT file.');
    if (selected.size > MAX_FILE_SIZE) return toast.error('That file is larger than 5 MB.');
    setFile(selected);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  };

  const handleAnalyze = async () => {
    if (isLocked) return toast.error('Please login to use the resume checker.');
    if (!file) return toast.error('Choose your resume first.');

    setStatus({ phase: 'working', message: 'Reading your file. Scanned PDFs can take up to a minute.' });
    try {
      const { text, pageCount, ocrUsed } = await readResumeFile(file);
      if (text.trim().length < MIN_RESUME_CHARACTERS) {
        throw new Error('We could not read enough text from this file. Try exporting it again as a PDF or DOCX.');
      }

      setStatus({ phase: 'working', message: 'Checking your resume...' });
      const result = analyzeResume({
        resumeText: text,
        jdText,
        roleCategory: categoryId,
        roleName,
        seniority,
        country,
        atsProfileKey,
        fileName: file.name,
        pageCount,
        ocrUsed,
      });

      setReport(result);
      setHistory(saveReport(result));
    } catch (error) {
      toast.error(error.message || 'Something went wrong while reading the file.');
    } finally {
      setStatus({ phase: 'idle', message: '' });
    }
  };

  const handleReset = () => {
    setReport(null);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id) => {
    setHistory(deleteReport(id));
    if (report?.id === id) setReport(null);
  };

  const handleClearHistory = () => {
    setHistory(clearHistory());
    toast.success('History cleared.');
  };

  const shownHistory = isLocked ? SAMPLE_HISTORY : history;

  const selectClass = 'input !py-2.5 cursor-pointer';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-3xl">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Free <span className="text-indigo-600">ATS resume checker</span>
        </h1>
        <p className="mt-3 text-slate-500 leading-relaxed">
          See how a resume scanner is likely to read your CV before you send it for an internship or job. Get a score, the missing keywords and clear fixes.
        </p>
      </motion.header>

      <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start">
        {/* Main column */}
        <div className="min-w-0">
          {isWorking ? (
            <ReportSkeleton message={status.message} />
          ) : report ? (
            <AtsReport report={report} onReset={handleReset} />
          ) : (
            <LockedContent locked={isLocked} checking={authLoading} label="Login to Use the Checker">
            <div className="space-y-6">
              {/* Upload */}
              <section className="card p-5 sm:p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">1. Upload your resume</h2>

                {file ? (
                  <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={20} className="text-indigo-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      aria-label="Remove file"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition cursor-pointer"
                    >
                      <X size={17} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition ${
                      isDragging ? 'border-indigo-500 bg-indigo-50/60' : 'border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <UploadCloud size={30} className="mx-auto text-slate-400" />
                    <p className="mt-3 text-sm font-medium text-slate-700">Drag your resume here, or</p>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-primary mt-3">
                      Choose a file
                    </button>
                    <p className="mt-3 text-xs text-slate-400">PDF, DOCX or TXT. Up to 5 MB.</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPTED_EXTENSIONS.join(',')}
                      className="hidden"
                      onChange={(event) => {
                        chooseFile(event.target.files?.[0]);
                        event.target.value = '';
                      }}
                    />
                  </div>
                )}
              </section>

              {/* Target */}
              <section className="card p-5 sm:p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">2. Choose the job you are applying for</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="ats-category" className="text-sm font-medium text-slate-700">
                      Field
                    </label>
                    <select id="ats-category" value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)} className={selectClass}>
                      {ROLE_CATEGORIES.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="ats-role" className="text-sm font-medium text-slate-700">
                      Role
                    </label>
                    <select id="ats-role" value={roleName} onChange={(e) => setOption('roleName', e.target.value)} className={selectClass}>
                      {category.roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="ats-seniority" className="text-sm font-medium text-slate-700">
                      Your level
                    </label>
                    <select id="ats-seniority" value={seniority} onChange={(e) => setOption('seniority', e.target.value)} className={selectClass}>
                      {SENIORITY_OPTIONS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="ats-country" className="text-sm font-medium text-slate-700">
                      Country
                    </label>
                    <select id="ats-country" value={country} onChange={(e) => setOption('country', e.target.value)} className={selectClass}>
                      {COUNTRY_OPTIONS.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="ats-profile" className="text-sm font-medium text-slate-700">
                      Type of ATS
                    </label>
                    <select id="ats-profile" value={atsProfileKey} onChange={(e) => setOption('atsProfileKey', e.target.value)} className={selectClass}>
                      {PROFILE_OPTIONS.map(({ id, label }) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Job description */}
              <section className="card p-5 sm:p-6 space-y-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">3. Paste the job description (optional)</h2>
                  <p className="text-sm text-slate-500 mt-1">With a real job post, the keyword check is much more accurate.</p>
                </div>
                <textarea
                  rows={6}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  maxLength={12000}
                  placeholder="Paste the job requirements here..."
                  className="input resize-y"
                />
              </section>

              <button type="button" onClick={handleAnalyze} disabled={!file} className="btn-primary w-full !py-3.5 text-base">
                <ScanSearch size={18} /> Check my resume
              </button>
            </div>
            </LockedContent>
          )}
        </div>

        {/* Side column */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          <Link
            to="/cv-guide"
            className="group block rounded-2xl p-5 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:shadow-xl transition"
          >
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-200">
              <BookOpen size={14} /> Free guide
            </p>
            <h2 className="mt-2 text-lg font-extrabold leading-snug">No experience? Learn to write a strong CV first.</h2>
            <p className="mt-1.5 text-sm text-indigo-100">22 templates, a bullet formula and an AI prompt. Free with your account.</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
              Open the CV guide <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>

          <section className="card p-5 space-y-2.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={17} className="text-emerald-600" /> Your resume stays private
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              The file is read and scored inside your browser. It is not sent to Campus Hub and your resume text is not saved. Only the score report is kept in this browser.
            </p>
            <p className="text-xs text-slate-400">Scanned PDFs use OCR, which downloads a language file from a public CDN the first time.</p>
          </section>

          <section className="card p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History size={17} className="text-indigo-600" /> Recent checks
              </h2>
              {!isLocked && history.length > 0 && (
                <button type="button" onClick={handleClearHistory} className="text-xs font-medium text-slate-400 hover:text-rose-600 cursor-pointer">
                  Clear all
                </button>
              )}
            </div>

            <LockedContent locked={isLocked} checking={authLoading} label="Login to See History">
            {shownHistory.length === 0 ? (
              <p className="text-sm text-slate-500">Your last checks will show up here.</p>
            ) : (
              <ul className="space-y-2">
                {shownHistory.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReport(item)}
                      className="flex-1 min-w-0 text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition cursor-pointer"
                    >
                      <p className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-900">
                        <span className="truncate">{item.role}</span>
                        <span className="text-indigo-600">{item.overallScore}</span>
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {item.fileName} &middot; {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteHistory(item.id)}
                      aria-label="Delete this check"
                      className="p-2 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            </LockedContent>
          </section>
        </aside>
      </div>
    </div>
  );
};