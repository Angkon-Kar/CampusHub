// client/src/components/ats/AtsReport.jsx
// Shows the result of one resume check (all data comes from lib/ats/checker.js).
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { CheckCircle2, AlertTriangle, Target, ListChecks, Copy, RotateCcw, Info, FileText, Lightbulb, BookOpen, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORY_LABELS } from '../../lib/ats/labels.js';

const SEVERITY_STYLES = {
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

const HEALTH_STYLES = {
  Green: { label: 'Looks healthy', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Yellow: { label: 'Needs a few fixes', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  Red: { label: 'Needs important fixes', style: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const SEVERITY_TABS = ['all', 'critical', 'high', 'medium', 'low'];
const ISSUES_PER_PAGE = 8;

const scoreColor = (score) => (score >= 80 ? '#10b981' : score >= 60 ? '#6366f1' : score >= 50 ? '#f59e0b' : '#f43f5e');

const ScoreGauge = ({ score, grade }) => {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(score);

  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90" role="img" aria-label={`ATS score ${score} out of 100`}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-4xl font-extrabold tracking-tight text-slate-900">{score}</p>
          <p className="text-xs font-semibold text-slate-500">Grade {grade}</p>
        </div>
      </div>
    </div>
  );
};

const IssueCard = ({ issue }) => {
  const { severity, title, why, where, suggestion, confidence } = issue;
  const hasBeforeAfter = suggestion && typeof suggestion === 'object';

  return (
    <article className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${SEVERITY_STYLES[severity]}`}>
          {severity}
        </span>
        <h4 className="font-semibold text-sm text-slate-900">{title}</h4>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{why}</p>
      {where && <p className="text-xs text-slate-400">Where: {where}</p>}

      {hasBeforeAfter ? (
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <p className="p-3 rounded-lg bg-rose-50/70 border border-rose-100 text-rose-800">
            <span className="block text-xs font-semibold uppercase tracking-wide text-rose-500 mb-0.5">Before</span>
            {suggestion.before}
          </p>
          <p className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-800">
            <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-0.5">After</span>
            {suggestion.after}
          </p>
        </div>
      ) : (
        suggestion && (
          <p className="flex items-start gap-2 text-sm text-indigo-700 bg-indigo-50/60 border border-indigo-100 rounded-lg px-3 py-2">
            <Lightbulb size={15} className="mt-0.5 shrink-0" /> {suggestion}
          </p>
        )
      )}
      <p className="text-xs text-slate-400">{confidence}</p>
    </article>
  );
};

const KeywordChips = ({ title, words, tone }) => {
  const style =
    tone === 'good' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200';
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-slate-900">
        {title} ({words.length})
      </h4>
      {words.length === 0 ? (
        <p className="text-sm text-slate-500">None.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {words.slice(0, 30).map((word) => (
            <span key={word} className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const AtsReport = ({ report, onReset }) => {
  const [severity, setSeverity] = useState('all');
  const [visible, setVisible] = useState(ISSUES_PER_PAGE);
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    fileName,
    role,
    seniority,
    atsProfile,
    atsProfileNote,
    overallScore,
    grade,
    gradeLabel,
    health,
    categoryScores,
    sectionWeights,
    keywordRes,
    issues,
    strengths,
    roadmap,
    wordCount,
    pageCount,
    ocrUsed,
  } = report;

  const counts = SEVERITY_TABS.map((id) => ({
    id,
    count: id === 'all' ? issues.length : issues.filter((issue) => issue.severity === id).length,
  }));
  const shownIssues = issues.filter((issue) => severity === 'all' || issue.severity === severity);

  const radarData = Object.entries(categoryScores).map(([key, value]) => ({
    category: CATEGORY_LABELS[key],
    score: value,
  }));

  const healthInfo = HEALTH_STYLES[health] || HEALTH_STYLES.Yellow;

  const copySummary = async () => {
    const lines = [
      `ATS check for ${role} (${seniority}): ${overallScore}/100, grade ${grade} (${gradeLabel})`,
      '',
      ...Object.entries(categoryScores).map(([key, value]) => `${CATEGORY_LABELS[key]}: ${value}/100`),
      '',
      'Top fixes:',
      ...issues.slice(0, 5).map(({ severity: level, title }) => `- [${level}] ${title}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast.success('Summary copied.');
    } catch {
      toast.error('Could not copy. Your browser blocked clipboard access.');
    }
  };

  // The PDF is created inside the browser. Nothing is sent to the server. jsPDF loads only when you click.
  const downloadReport = async () => {
    setIsDownloading(true);
    try {
      const { downloadAtsReportPdf } = await import('../../lib/ats/reportPdf.js');
      downloadAtsReportPdf(report);
      toast.success('Your ATS report is downloading.');
    } catch {
      toast.error('Could not create the PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Score */}
      <section className="card p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-6">
        <ScoreGauge score={overallScore} grade={grade} />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{gradeLabel}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${healthInfo.style}`}>{healthInfo.label}</span>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
            <FileText size={14} className="shrink-0" />
            <span className="truncate">{fileName}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="chip">{role}</span>
            <span className="chip">{seniority}</span>
            <span className="chip">{atsProfile}</span>
            <span className="chip">{wordCount} words</span>
            <span className="chip">
              {pageCount} page{pageCount > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-slate-400">{atsProfileNote}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button type="button" onClick={downloadReport} disabled={isDownloading} className="btn-primary">
              {isDownloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} Download ATS Report
            </button>
            <button type="button" onClick={onReset} className="btn-secondary">
              <RotateCcw size={15} /> Check another resume
            </button>
            <button type="button" onClick={copySummary} className="btn-secondary">
              <Copy size={15} /> Copy summary
            </button>
          </div>
        </div>
      </section>

      <p className="flex items-start gap-2 text-xs text-slate-500 px-1">
        <Info size={14} className="mt-0.5 shrink-0" />
        This is an estimate from common ATS rules. It is not the real software any company uses, so treat it as a checklist, not a guarantee.
      </p>

      {/* Next step: send the student to the matching part of the CV guide */}
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 flex flex-col md:flex-row md:items-center gap-4">
        <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-white border border-indigo-100 text-indigo-600">
          <BookOpen size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900">Want a higher score?</h3>
          <p className="text-sm text-slate-600 mt-0.5">The free CV guide shows how to write strong bullets and where tuition, CR and club work belong.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/cv-guide#bullets" className="btn-secondary !py-2 !text-xs">
            Bullet formula
          </Link>
          <Link to="/cv-guide#rules" className="btn-secondary !py-2 !text-xs">
            What goes where
          </Link>
          <Link to="/cv-guide#templates" className="btn-primary !py-2 !text-xs">
            Pick a template
          </Link>
        </div>
      </section>

      {ocrUsed && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          Your PDF had no selectable text, so we read it with OCR (first 3 pages only). Real ATS systems may not be able to read it at all. Export a text-based PDF instead.
        </div>
      )}

      {/* Breakdown */}
      <section className="card p-5 sm:p-6">
        <h3 className="text-base font-bold text-slate-900">Score breakdown</h3>
        <div className="mt-4 grid lg:grid-cols-2 gap-6 items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3.5">
            {sectionWeights.map(({ category, weight, score }) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">
                    {CATEGORY_LABELS[category]} <span className="text-xs text-slate-400">({weight}% of total)</span>
                  </span>
                  <span className="font-semibold text-slate-900">{score}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: scoreColor(score) }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap + strengths */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card p-5 sm:p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target size={18} className="text-indigo-600" /> Fix these first
          </h3>
          {roadmap.items.length === 0 ? (
            <p className="text-sm text-slate-500">No big gaps found. Nice work.</p>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                Improving these areas could add about <span className="font-semibold text-slate-900">{roadmap.potentialGain} points</span>.
              </p>
              <ol className="space-y-2">
                {roadmap.items.map(({ cat, score }, index) => (
                  <li key={cat} className="flex items-center gap-3 text-sm">
                    <span className="grid place-items-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">{index + 1}</span>
                    <span className="flex-1 text-slate-700">{CATEGORY_LABELS[cat]}</span>
                    <span className="text-slate-400">{score}/100</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>

        <section className="card p-5 sm:p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" /> What is already good
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5 marker:text-emerald-400">
            {strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Keywords */}
      <section className="card p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Keywords ({keywordRes.matchPct}% matched)</h3>
          <p className="text-sm text-slate-500 mt-1">
            {keywordRes.usedJD
              ? 'Compared with the job description you pasted.'
              : `No job description given, so we compared with common skills for ${role}. Paste a real job post for a sharper result.`}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <KeywordChips title="Found in your resume" words={keywordRes.matched} tone="good" />
          <KeywordChips title="Missing" words={keywordRes.missing} tone="bad" />
        </div>
      </section>

      {/* Issues */}
      <section className="card p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ListChecks size={18} className="text-indigo-600" /> All findings ({issues.length})
        </h3>

        <div className="flex flex-wrap gap-2">
          {counts.map(({ id, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSeverity(id);
                setVisible(ISSUES_PER_PAGE);
              }}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium capitalize transition cursor-pointer ${
                severity === id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {id} ({count})
            </button>
          ))}
        </div>

        {shownIssues.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
            <AlertTriangle size={16} className="text-slate-300" /> Nothing in this group.
          </p>
        ) : (
          <div className="space-y-3">
            {shownIssues.slice(0, visible).map((issue, index) => (
              <IssueCard key={`${issue.title}-${index}`} issue={issue} />
            ))}
          </div>
        )}

        {shownIssues.length > visible && (
          <div className="text-center">
            <button type="button" onClick={() => setVisible((count) => count + ISSUES_PER_PAGE)} className="btn-secondary">
              Show more ({shownIssues.length - visible} left)
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
};