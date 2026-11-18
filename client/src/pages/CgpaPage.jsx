// client/src/pages/CgpaPage.jsx
// CGPA calculator for the University of Dhaka grading system. Everything is saved in this browser only.
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Target, ArrowRightLeft, ImageDown, ShieldCheck, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calcCgpa, performanceLabel } from '../constants/duGrading';
import { Modal } from '../components/Modal';
import { CalculatorTab } from '../components/cgpa/CalculatorTab';
import { newSemester } from '../components/cgpa/cgpaDefaults';
import { ExpectedTab } from '../components/cgpa/ExpectedTab';
import { ConverterTab } from '../components/cgpa/ConverterTab';
import { ReportTab } from '../components/cgpa/ReportTab';

const STORAGE_KEY = 'campushub:cgpa:v1';

const TABS = [
  { id: 'calculator', label: 'Calculator', Icon: Calculator },
  { id: 'expected', label: 'Expected CGPA', Icon: Target },
  { id: 'converter', label: 'Converter', Icon: ArrowRightLeft },
  { id: 'report', label: 'Report image', Icon: ImageDown },
];

const makeInitialData = () => ({
  name: '',
  semesters: [newSemester(1)],
  previous: { cgpa: '', credits: '' },
  expected: { currentCgpa: '', doneCredits: '', targetCgpa: '3.50', remainingCredits: '', nextCredits: '18' },
});

export const CgpaPage = () => {
  const [data, setData] = useLocalStorage(STORAGE_KEY, makeInitialData);
  const [tab, setTab] = useState('calculator');
  const [resetOpen, setResetOpen] = useState(false);

  const result = useMemo(() => calcCgpa(data.semesters, data.previous), [data.semesters, data.previous]);

  const handleReset = () => {
    setData(makeInitialData());
    setResetOpen(false);
  };

  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-white via-white to-indigo-50/40">
        <div className="bg-dots absolute inset-0" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">CGPA Calculator</h1>
            <p className="mt-3 text-slate-500 max-w-2xl leading-relaxed">
              Works with the University of Dhaka grading system (4.00 scale). Calculate GPA and CGPA, plan your expected CGPA,
              convert marks and download a report image.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
              <ShieldCheck size={14} /> Saved only in this browser. Nothing is sent to any server.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Result bar, always visible */}
        <div className="card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 sticky top-[4.5rem] z-20 bg-white/90 backdrop-blur">
          <div className="flex items-center gap-5 sm:gap-8">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">CGPA</p>
              <p className="text-3xl font-extrabold text-indigo-600 leading-none mt-1">{result.cgpa === null ? '--' : result.cgpa.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Credits</p>
              <p className="text-xl font-bold text-slate-900 leading-none mt-1.5">{result.credits || '--'}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Result</p>
              <p className="text-base font-semibold text-slate-700 leading-none mt-2">{performanceLabel(result.cgpa) || '--'}</p>
            </div>
          </div>
          <button type="button" onClick={() => setResetOpen(true)} className="btn-secondary !py-2 !text-xs">
            <RotateCcw size={14} /> Start over
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="CGPA tools" className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer ${
                tab === id ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'calculator' && <CalculatorTab data={data} setData={setData} />}
          {tab === 'expected' && <ExpectedTab data={data} setData={setData} result={result} />}
          {tab === 'converter' && <ConverterTab />}
          {tab === 'report' && <ReportTab data={data} setData={setData} result={result} />}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          This tool follows the published University of Dhaka grading scale, but it is only a helper. Your official result is the one
          published by the university. Percentages are estimates.
        </p>
      </div>

      <Modal isOpen={resetOpen} onClose={() => setResetOpen(false)} title="Start over?" size="sm">
        <div className="space-y-5">
          <p className="text-sm text-slate-600">All semesters, courses and saved values on this device will be cleared. This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setResetOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleReset} className="btn-danger">
              Clear everything
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};