// client/src/components/guide/BulletBuilder.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick, RefreshCcw, Sparkles } from 'lucide-react';

const FORMULA_STEPS = [
  { 
    id: 'verb', 
    name: 'Action Verb', 
    text: 'Developed', 
    style: 'bg-lime-300 text-slate-900 border-2 border-lime-300' 
  },
  { 
    id: 'task', 
    name: 'The Task', 
    text: 'a dynamic resource sharing platform', 
    style: 'bg-transparent border-2 border-slate-900 text-slate-900' 
  },
  { 
    id: 'number', 
    name: 'Numbers', 
    text: 'for 10,000+ students', 
    style: 'bg-slate-900 text-white border-2 border-slate-900' 
  },
  { 
    id: 'result', 
    name: 'The Result', 
    text: 'reducing material search time by 40%', 
    style: 'bg-transparent border-2 border-dashed border-slate-900 text-slate-900' 
  }
];

export const BulletBuilder = () => {
  const [activeStep, setActiveStep] = useState(0); // 0 means empty, 4 means complete

  const handleNext = () => {
    if (activeStep < FORMULA_STEPS.length) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const isComplete = activeStep === FORMULA_STEPS.length;

  return (
    <div className="rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl shadow-xl shadow-indigo-900/5 p-6 sm:p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600" /> Bullet Point Builder
          </h3>
          <p className="text-sm text-slate-500 mt-1">Click to build a strong CV bullet</p>
        </div>
        
        {activeStep > 0 && (
          <button 
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition"
            title="Reset"
          >
            <RefreshCcw size={16} />
          </button>
        )}
      </div>

      {/* Interactive Builder Area */}
      <div className="flex-1 bg-slate-50/50 border border-slate-200 rounded-2xl p-5 mb-6 min-h-[160px] flex flex-wrap content-start gap-2">
        <AnimatePresence>
          {FORMULA_STEPS.slice(0, activeStep).map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${step.style}`}
            >
              {step.text}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activeStep === 0 && (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-60">
            <MousePointerClick size={24} />
            <p className="text-sm">Start building your bullet</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-auto">
        {!isComplete ? (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            Add: {FORMULA_STEPS[activeStep].name}
          </button>
        ) : (
          <div className="w-full py-3 rounded-xl bg-emerald-100 text-emerald-800 text-sm font-semibold flex items-center justify-center gap-2 border border-emerald-200">
            <Sparkles size={16} /> Perfect Bullet Created!
          </div>
        )}
      </div>
    </div>
  );
};