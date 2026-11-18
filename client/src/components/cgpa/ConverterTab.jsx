// client/src/components/cgpa/ConverterTab.jsx
import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { GRADE_SCALE, GRADES, gradeFromMarks, gradeInfo, approxPercentage } from '../../constants/duGrading';

const Tool = ({ title, hint, children }) => (
  <section className="card p-4 sm:p-6 space-y-4">
    <div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-0.5">{hint}</p>
    </div>
    {children}
  </section>
);

const Answer = ({ children }) => (
  <div role="status" className="rounded-xl bg-indigo-50/60 border border-indigo-100 px-4 py-3 text-sm text-slate-700 min-h-12">
    {children}
  </div>
);

export const ConverterTab = () => {
  const [marks, setMarks] = useState('');
  const [grade, setGrade] = useState('A+');
  const [cgpa, setCgpa] = useState('');

  const fromMarks = gradeInfo(gradeFromMarks(marks));
  const fromGrade = gradeInfo(grade);
  const percent = cgpa === '' ? null : approxPercentage(cgpa);

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <Tool title="Marks to grade and GPA" hint="Type your marks out of 100 (percentage).">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            step="0.5"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="e.g. 72.5"
            aria-label="Marks out of 100"
            className="input"
          />
          <Answer>
            {fromMarks ? (
              <>
                Grade <span className="font-extrabold text-indigo-600 text-lg">{fromMarks.grade}</span> &middot; Grade point{' '}
                <span className="font-extrabold text-indigo-600 text-lg">{fromMarks.point.toFixed(2)}</span>
                <span className="text-slate-500"> &middot; {fromMarks.remark}</span>
              </>
            ) : (
              <span className="text-slate-400">Enter a number from 0 to 100.</span>
            )}
          </Answer>
        </Tool>

        <Tool title="Grade to marks and GPA" hint="Pick a letter grade to see its marks range.">
          <select value={grade} onChange={(e) => setGrade(e.target.value)} aria-label="Letter grade" className="input cursor-pointer">
            {GRADES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Answer>
            Grade point <span className="font-extrabold text-indigo-600 text-lg">{fromGrade.point.toFixed(2)}</span> &middot; Marks{' '}
            <span className="font-bold">{fromGrade.label.toLowerCase()}</span>
          </Answer>
        </Tool>
      </div>

      <Tool
        title="CGPA to percentage (approximate)"
        hint="The university has no official formula for this. This is a fair estimate based on the marks range of each grade."
      >
        <div className="flex items-center gap-3 max-w-md">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            max="4"
            step="0.01"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            placeholder="e.g. 3.45"
            aria-label="CGPA"
            className="input"
          />
          <ArrowRightLeft size={18} className="text-slate-300 shrink-0" aria-hidden="true" />
          <div className="min-w-24 text-xl font-extrabold text-indigo-600">{percent ? `~${percent.estimate}%` : '--'}</div>
        </div>
        <Answer>
          {percent ? (
            <>
              A CGPA of <span className="font-bold">{Number(cgpa).toFixed(2)}</span> usually means marks between{' '}
              <span className="font-bold">
                {percent.low}% and {percent.high}%
              </span>
              , about <span className="font-bold">{percent.estimate}%</span> on average. Use this only as a guide for forms that ask for a percentage.
            </>
          ) : (
            <span className="text-slate-400">Enter a CGPA from 0.00 to 4.00.</span>
          )}
        </Answer>
      </Tool>

      <Tool title="Grading scale" hint="University of Dhaka undergraduate scale (4.00).">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[360px] text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="py-2 font-medium">Marks</th>
                <th className="py-2 font-medium">Grade</th>
                <th className="py-2 font-medium">Point</th>
                <th className="py-2 font-medium">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GRADE_SCALE.map(({ grade: g, point, label, remark }) => (
                <tr key={g}>
                  <td className="py-2 text-slate-600">{label}</td>
                  <td className="py-2 font-bold text-slate-900">{g}</td>
                  <td className="py-2 font-semibold text-indigo-600">{point.toFixed(2)}</td>
                  <td className="py-2 text-slate-500">{remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400">GPA = sum of (grade point x credits) divided by total credits.</p>
      </Tool>
    </div>
  );
};