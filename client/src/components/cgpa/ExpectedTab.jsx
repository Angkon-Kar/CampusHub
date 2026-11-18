// client/src/components/cgpa/ExpectedTab.jsx
// "What do I need?" planner: required GPA for a target CGPA, and a what-if table for the next semester.
import { Target, TrendingUp, Sparkles } from 'lucide-react';
import { GRADE_SCALE, requiredGpa, projectCgpa, minGradeFor, gradeInfo } from '../../constants/duGrading';

const Field = ({ id, label, value, onChange, placeholder, step = '0.01', max }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-xs font-medium text-slate-500">
      {label}
    </label>
    <input
      id={id}
      type="number"
      inputMode="decimal"
      min="0"
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input"
    />
  </div>
);

export const ExpectedTab = ({ data, setData, result }) => {
  const { expected } = data;
  const setExpected = (changes) => setData((prev) => ({ ...prev, expected: { ...prev.expected, ...changes } }));

  const canUseCalculator = result.cgpa !== null && result.credits > 0;
  const useCalculatorValues = () => setExpected({ currentCgpa: result.cgpa.toFixed(2), doneCredits: String(result.credits) });

  const needed = requiredGpa({
    currentCgpa: expected.currentCgpa,
    doneCredits: expected.doneCredits,
    targetCgpa: expected.targetCgpa,
    remainingCredits: expected.remainingCredits,
  });
  const ready = expected.currentCgpa !== '' && expected.doneCredits !== '' && expected.targetCgpa !== '' && expected.remainingCredits !== '';

  const minGrade = needed && needed.status === 'possible' ? minGradeFor(needed.needed) : null;
  const minMarks = minGrade ? gradeInfo(minGrade)?.min : null;

  return (
    <div className="space-y-5">
      <section className="card p-4 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-indigo-50 text-indigo-600">
              <Target size={19} />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Expected CGPA planner</h3>
              <p className="text-sm text-slate-500 mt-0.5">Set a target and see which GPA you need in the credits that are left.</p>
            </div>
          </div>
          {canUseCalculator && (
            <button type="button" onClick={useCalculatorValues} className="btn-secondary !py-2 !text-xs">
              <Sparkles size={14} /> Use my calculator values
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Field id="exp-current" label="Current CGPA" value={expected.currentCgpa} onChange={(v) => setExpected({ currentCgpa: v })} placeholder="e.g. 3.20" max="4" />
          <Field id="exp-done" label="Credits completed" value={expected.doneCredits} onChange={(v) => setExpected({ doneCredits: v })} placeholder="e.g. 60" step="0.5" />
          <Field id="exp-target" label="Target CGPA" value={expected.targetCgpa} onChange={(v) => setExpected({ targetCgpa: v })} placeholder="e.g. 3.50" max="4" />
          <Field id="exp-remaining" label="Credits still to take" value={expected.remainingCredits} onChange={(v) => setExpected({ remainingCredits: v })} placeholder="e.g. 30" step="0.5" />
        </div>

        {ready && needed && (
          <div
            role="status"
            className={`rounded-2xl p-5 border ${
              needed.status === 'impossible'
                ? 'bg-rose-50 border-rose-200'
                : needed.status === 'secured'
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-indigo-50/60 border-indigo-100'
            }`}
          >
            {needed.status === 'possible' && (
              <>
                <p className="text-sm text-slate-600">You need an average GPA of at least</p>
                <p className="text-4xl font-extrabold text-indigo-600 mt-1">{needed.needed.toFixed(2)}</p>
                <p className="text-sm text-slate-600 mt-2">
                  in the remaining credits. That is about a <span className="font-bold">{minGrade}</span> in every course (roughly {minMarks}% marks or more).
                </p>
              </>
            )}
            {needed.status === 'secured' && (
              <>
                <p className="text-lg font-bold text-emerald-700">Your target is already safe</p>
                <p className="text-sm text-slate-600 mt-1">Even a very low GPA in the remaining credits would not take you below {Number(expected.targetCgpa).toFixed(2)}.</p>
              </>
            )}
            {needed.status === 'impossible' && (
              <>
                <p className="text-lg font-bold text-rose-700">This target is out of reach</p>
                <p className="text-sm text-slate-600 mt-1">
                  Even a perfect 4.00 in all remaining credits gives a CGPA of {needed.bestPossible.toFixed(2)}. Try a lower target or more credits.
                </p>
              </>
            )}
            <p className="text-xs text-slate-500 mt-3">
              Best possible CGPA with straight A+ from now: <span className="font-semibold">{needed.bestPossible.toFixed(2)}</span>
            </p>
          </div>
        )}
        {!ready && <p className="text-sm text-slate-400">Fill in the four boxes to see the result.</p>}
      </section>

      <section className="card p-4 sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-indigo-50 text-indigo-600">
            <TrendingUp size={19} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">What if my next semester GPA is...?</h3>
            <p className="text-sm text-slate-500 mt-0.5">Uses the current CGPA and credits from the boxes above.</p>
          </div>
        </div>

        <div className="max-w-xs">
          <Field id="exp-next" label="Next semester credits" value={expected.nextCredits} onChange={(v) => setExpected({ nextCredits: v })} placeholder="e.g. 18" step="0.5" />
        </div>

        {ready && Number(expected.nextCredits) > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-2 font-medium">Next GPA</th>
                  <th className="py-2 font-medium">Grade</th>
                  <th className="py-2 font-medium text-right">New CGPA</th>
                  <th className="py-2 font-medium text-right">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GRADE_SCALE.filter(({ point }) => point >= 2).map(({ grade, point }) => {
                  const next = projectCgpa({ currentCgpa: expected.currentCgpa, doneCredits: expected.doneCredits, nextCredits: expected.nextCredits, nextGpa: point });
                  const change = next - Number(expected.currentCgpa);
                  return (
                    <tr key={grade}>
                      <td className="py-2 font-medium text-slate-900">{point.toFixed(2)}</td>
                      <td className="py-2 text-slate-500">{grade}</td>
                      <td className="py-2 text-right font-bold text-indigo-600">{next.toFixed(2)}</td>
                      <td className={`py-2 text-right font-medium ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {change >= 0 ? '+' : ''}
                        {change.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Enter your CGPA, credits and next semester credits to see the table.</p>
        )}
      </section>
    </div>
  );
};